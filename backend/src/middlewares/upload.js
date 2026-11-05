import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Carpeta donde se guardan las fotos que sube el admin (backend/uploads)
export const UPLOADS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp']

const storage = multer.diskStorage({
    destination: UPLOADS_DIR,
    // Nombre único para que dos fotos con el mismo nombre no se pisen
    filename: (req, file, cb) => {
        const ext = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' }[file.mimetype]
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`)
    }
})

const multerUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (TIPOS_PERMITIDOS.includes(file.mimetype)) return cb(null, true)
        cb(new Error("Solo se permiten imágenes PNG, JPG o WEBP"))
    }
}).single('imagen')

// Envuelve multer para responder los errores en JSON y en español
export const uploadImage = (req, res, next) => {
    multerUpload(req, res, (err) => {
        if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: "La imagen no puede pesar más de 5 MB" })
        if (err) return res.status(400).json({ message: err.message })
        if (!req.file) return res.status(400).json({ message: "No se recibió ninguna imagen" })
        next()
    })
}

// Borra una foto subida (solo las de /uploads, nunca las del frontend)
export const deleteUploadedImage = (image) => {
    if (!image?.startsWith('/uploads/')) return
    fs.unlink(path.join(UPLOADS_DIR, path.basename(image)), () => {})
}
