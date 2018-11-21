import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import validateOrder from '../middleware/orderValidation';
import verifyToken from '../middleware/verifyToken';
import verifyAdminToken from '../middleware/verifyAdminToken';
import verifyUserToken from '../middleware/verifyUserToken';

const router = Router();

router.get('/parcels', verifyToken, verifyAdminToken, OrderController.getAllOrders);
router.get('/parcels/:parcelId', verifyToken, verifyUserToken, OrderController.getOneOrder);
router.get('/users/:userId/parcels', verifyToken, verifyUserToken, OrderController.getOrdersbyUser);
router.post(
  '/parcels',
  verifyToken,
  verifyUserToken,
  validateOrder.validOrder,
  OrderController.createOrder
);
router.put('/parcels/:parcelId/cancel', verifyToken, verifyUserToken, OrderController.cancelOrder);
router.put(
  '/parcels/:parcelId/destination',
  verifyToken,
  verifyUserToken,
  OrderController.changeOrderDestination
);
router.put(
  '/parcels/:parcelId/status',
  verifyToken,
  verifyAdminToken,
  OrderController.changeOrderStatus
);
router.put(
  '/parcels/:parcelId/presentLocation',
  verifyToken,
  verifyAdminToken,
  OrderController.changeOrderPresentLocation
);

export default router;
