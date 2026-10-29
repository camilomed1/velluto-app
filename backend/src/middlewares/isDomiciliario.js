// Se usa siempre después de authRequired
export const domiciliarioRequired = (req, res, next) => {
    if (req.user.rol !== "domiciliario") return res.status(403).json({ message: "Acceso solo para domiciliarios" })
    next()
}
