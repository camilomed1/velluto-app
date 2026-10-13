import Contact from '../models/contact.model.js'

// Público: formulario de la página Contacto
export const createContact = async (req, res) => {
    const { nombre, email, motivo, mensaje } = req.body

    try {
        if (!nombre || !email || !mensaje) return res.status(400).json({ message: "Nombre, email y mensaje son obligatorios" })

        const newContact = new Contact({ nombre, email, motivo, mensaje })
        await newContact.save()
        return res.status(201).json({ message: "¡Gracias! Recibimos tu mensaje" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Admin: ver mensajes
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 })
        return res.json(contacts)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Admin: marcar como leído / no leído
export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { leido: req.body.leido }, { new: true })
        if (!contact) return res.status(404).json({ message: "Mensaje no encontrado" })
        return res.json(contact)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
