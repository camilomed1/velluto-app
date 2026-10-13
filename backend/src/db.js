import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("LA BASE DE DATOS ESTA CONECTADA")
    } catch (error) {
        console.log("ERROR DE CONEXIÓN:", error)
    }
}
