import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import { COSTO_ENVIO } from '../config.js'

const ESTADOS = ['pendiente', 'preparando', 'en camino', 'entregado', 'cancelado']

// Genera un número tipo VE-48213 que no exista todavía
const generarNumeroOrden = async () => {
    let numero
    do {
        numero = `VE-${Math.floor(10000 + Math.random() * 90000)}`
    } while (await Order.exists({ orderNumber: numero }))
    return numero
}

// El frontend manda los IDs de los productos; el precio lo calcula el backend
// para que nadie pueda cambiar los precios desde el navegador.
// items: [{ base: id, flavors: [id, id], toppings: [id] }]
export const createOrder = async (req, res) => {
    const { items, delivery } = req.body

    try {
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "El carrito está vacío" })
        if (items.length > 20) return res.status(400).json({ message: "Máximo 20 helados por pedido" })
        if (!delivery?.direccion?.trim() || !delivery?.telefono?.trim()) return res.status(400).json({ message: "La dirección y el teléfono son obligatorios" })

        const productos = await Product.find({ disponible: true })
        const buscar = (id, tipo) => productos.find(p => p._id.toString() === id && p.tipo === tipo)

        const itemsOrden = []
        for (const item of items) {
            const base = buscar(item.base, 'base')
            if (!base) return res.status(400).json({ message: "Base no válida o no disponible" })

            const flavorIds = item.flavors || []
            if (flavorIds.length < 1 || flavorIds.length > 3) return res.status(400).json({ message: "Cada helado debe tener entre 1 y 3 sabores" })
            const sabores = flavorIds.map(id => buscar(id, 'sabor'))
            if (sabores.includes(undefined)) return res.status(400).json({ message: "Sabor no válido o no disponible" })

            const toppingIds = [...new Set(item.toppings || [])]
            const toppings = toppingIds.map(id => buscar(id, 'topping'))
            if (toppings.includes(undefined)) return res.status(400).json({ message: "Topping no válido o no disponible" })

            const price = base.price
                + sabores.reduce((acc, s) => acc + s.price, 0)
                + toppings.reduce((acc, t) => acc + t.price, 0)

            itemsOrden.push({
                base: base.name,
                flavors: sabores.map(s => s.name),
                toppings: toppings.map(t => ({ name: t.name, price: t.price })),
                price
            })
        }

        const subtotal = itemsOrden.reduce((acc, item) => acc + item.price, 0)

        const newOrder = new Order({
            orderNumber: await generarNumeroOrden(),
            user: req.user.id,
            items: itemsOrden,
            delivery: {
                direccion: delivery.direccion.trim(),
                telefono: delivery.telefono.trim(),
                notas: delivery.notas?.trim() || ''
            },
            subtotal,
            shippingFee: COSTO_ENVIO,
            total: subtotal + COSTO_ENVIO
        })

        const orderSaved = await newOrder.save()
        return res.status(201).json(orderSaved)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Pedidos del usuario logueado
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Admin: todos los pedidos
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'username email').sort({ createdAt: -1 })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Admin: cambiar el estado de un pedido
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body

    try {
        if (!ESTADOS.includes(status)) return res.status(400).json({ message: "Estado no válido" })

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'username email')
        if (!order) return res.status(404).json({ message: "Pedido no encontrado" })
        return res.json(order)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
