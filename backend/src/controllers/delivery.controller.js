import Order from '../models/order.model.js'

// Pedidos listos para salir que nadie ha tomado
export const getAvailableDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'preparando', domiciliario: null }).sort({ createdAt: 1 })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Pedidos del domiciliario logueado (en camino y entregados)
export const getMyDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({ domiciliario: req.user.id }).sort({ updatedAt: -1 })
        return res.json(orders)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Tomar un pedido: solo funciona si sigue disponible (evita que dos lo tomen a la vez)
export const takeDelivery = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, status: 'preparando', domiciliario: null },
            { domiciliario: req.user.id, status: 'en camino' },
            { new: true }
        )
        if (!order) return res.status(400).json({ message: "Este pedido ya no está disponible" })
        return res.json(order)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Marcar como entregado un pedido propio que va en camino
export const completeDelivery = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, domiciliario: req.user.id, status: 'en camino' },
            { status: 'entregado' },
            { new: true }
        )
        if (!order) return res.status(400).json({ message: "No puedes marcar este pedido como entregado" })
        return res.json(order)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
