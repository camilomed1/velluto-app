import Product from '../models/product.model.js'

const TIPOS = ['sabor', 'base', 'topping']

// Público: lista de productos disponibles. Filtro opcional ?tipo=sabor|base|topping
// Con ?todos=true también trae los no disponibles (lo usa el panel de admin)
export const getProducts = async (req, res) => {
    try {
        const filtro = {}
        if (req.query.tipo) filtro.tipo = req.query.tipo
        if (req.query.todos !== "true") filtro.disponible = true

        const products = await Product.find(filtro).sort({ createdAt: 1 })
        return res.json(products)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: "Producto no encontrado" })
        return res.json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createProduct = async (req, res) => {
    const { tipo, name, description, price, category, image, color, disponible } = req.body

    try {
        if (!TIPOS.includes(tipo)) return res.status(400).json({ message: "El tipo debe ser sabor, base o topping" })
        if (!name || price === undefined) return res.status(400).json({ message: "Nombre y precio son obligatorios" })

        const newProduct = new Product({ tipo, name, description, price, category, image, color, disponible })
        const productSaved = await newProduct.save()
        return res.status(201).json(productSaved)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!product) return res.status(404).json({ message: "Producto no encontrado" })
        return res.json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: "Producto no encontrado" })
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
