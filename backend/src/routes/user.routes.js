import { Router } from "express";
import { updateProfile, changePassword, addAddress, updateAddress, deleteAddress } from "../controllers/user.controller.js";
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.put('/profile', authRequired, updateProfile)
router.put('/profile/password', authRequired, changePassword)
router.post('/profile/direcciones', authRequired, addAddress)
router.put('/profile/direcciones/:id', authRequired, updateAddress)
router.delete('/profile/direcciones/:id', authRequired, deleteAddress)

export default router
