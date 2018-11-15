import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import config from './config/config';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

import indexRoute from './routes/index';
import orderRoutes from './routes/order.route';
app.use('/api/v1', indexRoute);
app.use('/api/v1', orderRoutes);

// Handle 404 error
app.use((req, res, next) => {
	const error = new Error('Not Found');

	error.status = 404;
	next(error);
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
