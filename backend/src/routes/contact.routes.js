import { Router } from "express";
import { createContact, getContacts, updateContact } from "../controllers/contact.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { adminRequired } from '../middlewares/isAdmin.js'

const router = Router()

router.post('/contacto', createContact)
router.get('/contacto', authRequired, adminRequired, getContacts)
router.put('/contacto/:id', authRequired, adminRequired, updateContact)

export default router
