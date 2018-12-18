import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import validateOrder from '../middleware/orderValidation';
import verifyToken from '../middleware/verifyToken';
import Authentications from '../middleware/authentications';

const router = Router();

router.get('/parcels', verifyToken, Authentications.authAdmin, OrderController.getAllOrders);
router.get(
  '/parcels/:parcelId',
  verifyToken,
  Authentications.authUser,
  OrderController.getOneOrder
);
router.get(
  '/users/:userId/parcels',
  verifyToken,
  OrderController.getOrdersbyUser
);
router.post(
  '/parcels',
  verifyToken,
  Authentications.authUser,
  validateOrder.validOrder,
  OrderController.createOrder
);
router.put(
  '/parcels/:parcelId/cancel',
  verifyToken,
  Authentications.authUser,
  OrderController.cancelOrder
);
router.put(
  '/parcels/:parcelId/destination',
  verifyToken,
  Authentications.authUser,
  validateOrder.validDestination,
  OrderController.changeOrderDestination
);
router.put(
  '/parcels/:parcelId/status',
  verifyToken,
  Authentications.authAdmin,
  OrderController.changeOrderStatus
);
router.put(
  '/parcels/:parcelId/presentLocation',
  verifyToken,
  Authentications.authAdmin,
  validateOrder.validLocation,
  OrderController.changeOrderPresentLocation
);

export default router;
