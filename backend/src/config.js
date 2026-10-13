import 'dotenv/config'

export const PORT = process.env.PORT || 4000
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/velluto"
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "Some secret key"
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

// Costo fijo del domicilio (COP)
export const COSTO_ENVIO = 5000
