import { Router } from "express";
import { getAvailableDeliveries, getMyDeliveries, takeDelivery, completeDelivery } from "../controllers/delivery.controller.js";
import { authRequired } from '../middlewares/validateToken.js'
import { domiciliarioRequired } from '../middlewares/isDomiciliario.js'

const router = Router()

router.get('/entregas/disponibles', authRequired, domiciliarioRequired, getAvailableDeliveries)
router.get('/entregas/mias', authRequired, domiciliarioRequired, getMyDeliveries)
router.put('/entregas/:id/tomar', authRequired, domiciliarioRequired, takeDelivery)
router.put('/entregas/:id/entregar', authRequired, domiciliarioRequired, completeDelivery)

export default router
