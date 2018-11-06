import { Router } from 'express';
import ParcelOrders from '../../controllers/order.controller';
import { validateOrder } from '../../middleware/ordersValidation';

const router = Router();
const orders = new ParcelOrders();

router.post('/orders', validateOrder, orders.createOrder);

export default router;
