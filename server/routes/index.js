import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.status(201).json({
		msg: 'Welcome to SendIT api'
	});
});

export default router;
