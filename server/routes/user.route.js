import { Router } from 'express';
import validateUser from '../middleware/userValidation';
import User from '../controllers/user.controller';

const router = Router();

router.post('/auth/signup', validateUser.validSignup, User.create);
router.post('/auth/login', validateUser.validLogin, User.login);

export default router;
