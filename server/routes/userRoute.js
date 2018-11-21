import { Router } from 'express';
import validateUser from '../middleware/userValidation';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/auth/signup', validateUser.validSignup, UserController.create);
router.post('/auth/login', validateUser.validLogin, UserController.login);

export default router;
