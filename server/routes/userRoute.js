import { Router } from 'express';
import validateUser from '../middleware/userValidation';
import UserController from '../controllers/UserController';
import verifyToken from '../middleware/verifyToken';
import Authentications from '../middleware/authentications';

const router = Router();

router.post('/auth/signup', validateUser.validSignup, UserController.create);
router.post('/auth/login', validateUser.validLogin, UserController.login);
router.get('/users', verifyToken, Authentications.authAdmin, UserController.getAllUsers);
router.get('/users/:userId', verifyToken, Authentications.authAdmin, UserController.getOneUser);
router.post('/auth/forgotPassword', validateUser.validEmail, UserController.forgotPassword);
router.post(
  '/auth/resetPassword/:resetToken',
  validateUser.validPassword,
  UserController.resetPassword
);

export default router;
