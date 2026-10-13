// Llena la base de datos con el menú inicial y crea el usuario administrador.
// Uso: npm run seed   (borra y vuelve a crear los productos)
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from './db.js'
import Product from './models/product.model.js'
import User from './models/user.model.js'
import { SABORES, BASES, TOPPINGS } from './data/productos.js'

const seed = async () => {
    await connectDB()

    await Product.deleteMany({})

    const sabores = SABORES.map(s => ({
        tipo: 'sabor',
        name: s.name,
        description: s.description,
        price: s.price,
        category: s.category,
        image: s.image,
        color: s.color
    }))
    const bases = BASES.map(b => ({
        tipo: 'base',
        name: b.name,
        description: b.description,
        price: b.price
    }))
    const toppings = TOPPINGS.map(t => ({
        tipo: 'topping',
        name: t.name,
        price: t.price
    }))

    await Product.insertMany([...sabores, ...bases, ...toppings])
    console.log(`Productos creados: ${sabores.length} sabores, ${bases.length} bases, ${toppings.length} toppings`)

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (email && password) {
        const adminFound = await User.findOne({ email })
        if (!adminFound) {
            await User.create({
                username: 'Administrador',
                email,
                password: await bcrypt.hash(password, 10),
                rol: 'admin'
            })
            console.log(`Usuario admin creado: ${email}`)
        } else {
            console.log(`El usuario admin ya existe: ${email}`)
        }
    }

    await mongoose.disconnect()
}

seed()
