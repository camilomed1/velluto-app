import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categories.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { adminRequired } from '../middlewares/isAdmin.js'

const router = Router()

router.get('/categorias', getCategories)
router.post('/categorias', authRequired, adminRequired, createCategory)
router.put('/categorias/:id', authRequired, adminRequired, updateCategory)
router.delete('/categorias/:id', authRequired, adminRequired, deleteCategory)

export default router
