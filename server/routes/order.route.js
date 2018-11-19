import { Router } from 'express';
import Orders from '../controllers/order.controller';
import { validateOrder } from '../middleware/orderValidation';
import Auth from '../middleware/auth';

const router = Router();

router.get('/parcels', Orders.getAllOrders);
router.get('/parcels/:parcelId', Orders.getOneOrder);
router.get(
	'/users/:userId/parcels',
	Auth.verifyUserToken,
	Orders.getOrdersbyUser
);
router.post('/parcels', validateOrder.validOrder, Orders.createOrder);
router.put('/parcels/:parcelId/cancel', Orders.cancelOrder);

export default router;
