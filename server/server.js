import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import config from './config/config';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Handle 404 error
app.use((req, res, next) => {
	const error = new Error(
		'Not Found',
	);

	error.status = 404;
	next(
		error,
	);
});

// Error handler for all other types of errors
app.use((error, req, res, next) => {
	res.status(
		error.status ||
			500,
	);
	res.json(
		{
			error: {
				message:
					error.message,
			},
		},
	);
});

app.listen(config.port, () => {
	console.log(
		`SendIT Server is listening on port ${
			config.port
		}`,
	);
});

export default app;
