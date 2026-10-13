import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { adminRequired } from '../middlewares/isAdmin.js'

const router = Router()

router.get('/productos', getProducts)
router.get('/productos/:id', getProduct)
router.post('/productos', authRequired, adminRequired, createProduct)
router.put('/productos/:id', authRequired, adminRequired, updateProduct)
router.delete('/productos/:id', authRequired, adminRequired, deleteProduct)

export default router
