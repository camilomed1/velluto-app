import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "No hay token, autorización denegada" })

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" })

        // user = { id, rol } (lo que guardamos al crear el token)
        req.user = user
        next()
    })
}
