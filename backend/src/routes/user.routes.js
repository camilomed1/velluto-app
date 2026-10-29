import { Router } from "express";
import {
    updateProfile, changePassword, addAddress, updateAddress, deleteAddress,
    getDomiciliarios, createDomiciliario, deleteDomiciliario
} from "../controllers/user.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { adminRequired } from '../middlewares/isAdmin.js'

const router = Router()

router.put('/profile', authRequired, updateProfile)
router.put('/profile/password', authRequired, changePassword)
router.post('/profile/direcciones', authRequired, addAddress)
router.put('/profile/direcciones/:id', authRequired, updateAddress)
router.delete('/profile/direcciones/:id', authRequired, deleteAddress)

// Admin: cuentas de domiciliarios
router.get('/usuarios/domiciliarios', authRequired, adminRequired, getDomiciliarios)
router.post('/usuarios/domiciliarios', authRequired, adminRequired, createDomiciliario)
router.delete('/usuarios/domiciliarios/:id', authRequired, adminRequired, deleteDomiciliario)

export default router
