import Category from '../models/category.model.js'
import Product from '../models/product.model.js'

// Busca una categoría por nombre sin importar mayúsculas
const findByName = (name) => Category.findOne({ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } })

// Público: lista de categorías con cuántos sabores tiene cada una
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 })
        const conteo = await Product.aggregate([
            { $match: { tipo: 'sabor' } },
            { $group: { _id: '$category', total: { $sum: 1 } } }
        ])
        return res.json(categories.map(c => ({
            _id: c._id,
            name: c.name,
            sabores: conteo.find(x => x._id === c.name)?.total || 0
        })))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createCategory = async (req, res) => {
    const name = req.body.name?.trim()

    try {
        if (!name) return res.status(400).json({ message: "El nombre es obligatorio" })
        if (await findByName(name)) return res.status(400).json({ message: "Ya existe una categoría con ese nombre" })

        const category = await Category.create({ name })
        return res.status(201).json(category)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Renombrar: también actualiza los sabores que tenían el nombre viejo
export const updateCategory = async (req, res) => {
    const name = req.body.name?.trim()

    try {
        if (!name) return res.status(400).json({ message: "El nombre es obligatorio" })

        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" })

        const existe = await findByName(name)
        if (existe && existe._id.toString() !== category._id.toString()) return res.status(400).json({ message: "Ya existe una categoría con ese nombre" })

        await Product.updateMany({ tipo: 'sabor', category: category.name }, { category: name })
        category.name = name
        await category.save()

        return res.json(category)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Solo se puede borrar si ningún sabor la usa
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" })

        const enUso = await Product.countDocuments({ tipo: 'sabor', category: category.name })
        if (enUso > 0) return res.status(400).json({ message: `No se puede eliminar: ${enUso} ${enUso === 1 ? 'sabor usa' : 'sabores usan'} esta categoría` })

        await category.deleteOne()
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Al arrancar: si no hay categorías, las crea con las que ya usan los sabores
export const ensureCategories = async () => {
    try {
        if (await Category.countDocuments() > 0) return
        const usadas = await Product.distinct('category', { tipo: 'sabor', category: { $ne: '' } })
        if (usadas.length > 0) await Category.insertMany(usadas.map(name => ({ name })))
    } catch (error) {
        console.log("ERROR CREANDO CATEGORÍAS:", error.message)
    }
}
