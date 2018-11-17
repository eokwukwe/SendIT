import { Router } from 'express';
import ParcelOrders from '../controllers/order.controller';
import { validateOrder } from '../middleware/orderValidation';

const router = Router();

router.get('/parcels', ParcelOrders.getAllOrders);
router.get('/parcels/:parcelId', ParcelOrders.getOneOrder);
router.get('/users/:userId/parcels', ParcelOrders.getOrdersbyUser);
router.post('/parcels', validateOrder.validOrder, ParcelOrders.createOrder);
router.put('/parcels/:parcelId/cancel', ParcelOrders.cancelOrder);

export default router;
