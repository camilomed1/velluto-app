// Se usa siempre después de authOptional
// Pueden pedir los invitados (sin sesión) y los clientes; administradores y domiciliarios no
export const canOrder = (req, res, next) => {
    if (req.user && req.user.rol !== "cliente") return res.status(403).json({ message: "Los administradores y domiciliarios no pueden hacer pedidos" })
    next()
}
