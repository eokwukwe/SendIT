import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import config from './config/config';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
import indexRoute from './routes/index';
import orderRoutes from './routes/order.route';
import userRoutes from './routes/user.route';
app.use('/api/v1', indexRoute);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', userRoutes);

// Handle 404 error
app.use((req, res, next) => {
	next(
		res.status(404).json({
			message: 'Page not found'
		})
	);
});

// Error handler for all other types of errors
app.use((error, req, res) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

app.listen(config.port, () => {
	console.log(`SendIT Server is listening on port ${config.port}`);
});

export default app;
