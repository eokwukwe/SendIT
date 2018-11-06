import { Router } from 'express';
import ParcelOrders from '../../controllers/order.controller';
import { validateOrder } from '../../middleware/ordersValidation';

const router = Router();
const orders = new ParcelOrders();

router.get('/parcels', orders.getAllOrders);
router.get('/parcels/:parcelId', orders.getOneOrder);
router.get('/users/:userId/parcels', orders.getOrdersbyUser);
router.post('/parcels', validateOrder, orders.createOrder);
router.put('/parcels/:parcelId/cancel', orders.cancelOrder);

export default router;
