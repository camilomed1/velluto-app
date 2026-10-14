import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { userResponse } from './auth.controller.js'

// ---------- Datos personales ----------

export const updateProfile = async (req, res) => {
    const { username, telefono } = req.body

    try {
        if (!username?.trim()) return res.status(400).json({ message: "El nombre es obligatorio" })

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { username: username.trim(), telefono: telefono?.trim() || '' },
            { new: true }
        )
        if (!user) return res.status(404).json({ message: "Usuario No Encontrado" })

        return res.json(userResponse(user))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const changePassword = async (req, res) => {
    const { passwordActual, passwordNueva } = req.body

    try {
        if (!passwordActual || !passwordNueva) return res.status(400).json({ message: "Escribe la contraseña actual y la nueva" })
        if (passwordNueva.length < 6) return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })

        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "Usuario No Encontrado" })

        const isMatch = await bcrypt.compare(passwordActual, user.password)
        if (!isMatch) return res.status(400).json({ message: "La contraseña actual no es correcta" })

        user.password = await bcrypt.hash(passwordNueva, 10)
        await user.save()

        return res.json({ message: "Contraseña actualizada" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ---------- Direcciones ----------

// Deja una sola dirección como principal
const marcarPrincipal = (user, id) => {
    user.direcciones.forEach(d => { d.principal = d._id.toString() === id })
}

export const addAddress = async (req, res) => {
    const { alias, direccion, comentario, principal } = req.body

    try {
        if (!alias?.trim() || !direccion?.trim()) return res.status(400).json({ message: "El nombre y la dirección son obligatorios" })

        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "Usuario No Encontrado" })
        if (user.direcciones.length >= 10) return res.status(400).json({ message: "Máximo 10 direcciones" })

        user.direcciones.push({ alias, direccion, comentario })
        const nueva = user.direcciones[user.direcciones.length - 1]

        // La primera dirección siempre queda como principal
        if (principal || user.direcciones.length === 1) marcarPrincipal(user, nueva._id.toString())

        await user.save()
        return res.status(201).json(userResponse(user))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateAddress = async (req, res) => {
    const { alias, direccion, comentario, principal } = req.body

    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "Usuario No Encontrado" })

        const dir = user.direcciones.id(req.params.id)
        if (!dir) return res.status(404).json({ message: "Dirección no encontrada" })

        if (alias !== undefined) {
            if (!alias.trim()) return res.status(400).json({ message: "El nombre es obligatorio" })
            dir.alias = alias
        }
        if (direccion !== undefined) {
            if (!direccion.trim()) return res.status(400).json({ message: "La dirección es obligatoria" })
            dir.direccion = direccion
        }
        if (comentario !== undefined) dir.comentario = comentario
        if (principal) marcarPrincipal(user, req.params.id)

        await user.save()
        return res.json(userResponse(user))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "Usuario No Encontrado" })

        const dir = user.direcciones.id(req.params.id)
        if (!dir) return res.status(404).json({ message: "Dirección no encontrada" })

        const eraPrincipal = dir.principal
        dir.deleteOne()

        // Si borramos la principal, la primera que quede pasa a ser principal
        if (eraPrincipal && user.direcciones.length > 0) user.direcciones[0].principal = true

        await user.save()
        return res.json(userResponse(user))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
