import { Router } from 'express';
import Orders from '../controllers/order.controller';
import validateOrder from '../middleware/orderValidation';
import Auth from '../middleware/auth';

const router = Router();

router.get('/parcels', Auth.verifyAdminToken, Orders.getAllOrders);
router.get('/parcels/:parcelId', Auth.verifyUserToken, Orders.getOneOrder);
router.get('/users/:userId/parcels', Auth.verifyUserToken, Orders.getOrdersbyUser);
router.post('/parcels', Auth.verifyUserToken, validateOrder.validOrder, Orders.createOrder);
router.put('/parcels/:parcelId/cancel', Auth.verifyUserToken, Orders.cancelOrder);
router.put('/parcels/:parcelId/destination', Auth.verifyUserToken, Orders.changeOrderDestination);
router.put('/parcels/:parcelId/status', Auth.verifyAdminToken, Orders.changeOrderStatus);
router.put(
  '/parcels/:parcelId/presentLocation',
  Auth.verifyAdminToken,
  Orders.changeOrderPresentLocation
);

export default router;
