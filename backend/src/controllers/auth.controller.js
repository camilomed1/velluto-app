import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
}

// Lo que le devolvemos al frontend (nunca la contraseña)
const userResponse = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    rol: user.rol,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
})

export const register = async (req, res) => {
    const { email, password, username } = req.body

    try {
        if (!email || !password || !username) return res.status(400).json({ message: "Todos los campos son obligatorios" })
        if (password.length < 6) return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })

        const userFound = await User.findOne({ email: email.toLowerCase() })
        if (userFound) return res.status(400).json({ message: "El email ya está en uso" })

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: passwordHash
        })

        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id, rol: userSaved.rol })

        res.cookie("token", token, cookieOptions)

        return res.json(userResponse(userSaved))

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) return res.status(400).json({ message: "Email y contraseña son obligatorios" })

        const userFound = await User.findOne({ email: email.toLowerCase() })
        if (!userFound) return res.status(400).json({ message: "Usuario No Encontrado" })

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(400).json({ message: "Contraseña Incorrecta" })

        const token = await createAccessToken({ id: userFound._id, rol: userFound.rol })

        res.cookie("token", token, cookieOptions)

        return res.json(userResponse(userFound))

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    res.cookie("token", "", {
        ...cookieOptions,
        expires: new Date(0),
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id)
        if (!userFound) return res.status(400).json({ message: "Usuario No Encontrado" })

        return res.json(userResponse(userFound))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
