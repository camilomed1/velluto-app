import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './db.js'
import { PORT, FRONTEND_URL } from './config.js'
import { UPLOADS_DIR } from './middlewares/upload.js'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import productsRoutes from './routes/products.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import deliveryRoutes from './routes/delivery.routes.js'

const app = express()

// credentials: true permite que el navegador envíe la cookie del token
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Fotos de productos subidas desde el panel de admin
app.use('/uploads', express.static(UPLOADS_DIR))

connectDB()

app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", productsRoutes)
app.use("/api", ordersRoutes)
app.use("/api", deliveryRoutes)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})
