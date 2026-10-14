import { Router } from "express";
import { createOrder, getMyOrders, getOrders, updateOrderStatus } from "../controllers/orders.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { adminRequired } from '../middlewares/isAdmin.js'

const router = Router()

router.post('/ordenes', authRequired, createOrder)
router.get('/ordenes/mias', authRequired, getMyOrders)
router.get('/ordenes', authRequired, adminRequired, getOrders)
router.put('/ordenes/:id/estado', authRequired, adminRequired, updateOrderStatus)

export default router
