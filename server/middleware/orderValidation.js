import { check } from 'express-validator/check';

export const validateOrder = {
	validOrder: [
		check('parcelDescription')
			.isLength({ min: 10 })
			.withMessage('The description is too short')
			.isString()
			.trim(),

		check('parcelWeight')
			.isDecimal()
			.withMessage('weight must be decimal value')
			.trim(),

		check('fromAddress')
			.isLength({ min: 10 })
			.withMessage('address is too short')
			.matches(/^[a-zA-Z\d]+?(\s+[a-zA-Z,\d]+)+[a-zA-Z]+\s{1}/)
			.withMessage('invalid input, please enter a valid address')
			.trim(),

		check('fromCity')
			.isLength({ min: 3 })
			.withMessage('City name is too short')
			.isAlpha()
			.withMessage('city name cannot be number')
			.trim(),

		check('fromCountry')
			.isLength({ min: 3 })
			.withMessage('country name is too short')
			.isAlpha()
			.withMessage('country name cannot be number')
			.trim(),

		check('toAddress')
			.isLength({ min: 10 })
			.withMessage('address is too short')
			.matches(/^[a-zA-Z\d]+?(\s+[a-zA-Z,\d]+)+[a-zA-Z]+\s{1}/)
			.withMessage('invalid input, please enter a valid address')
			.trim(),

		check('toCity')
			.isLength({ min: 3 })
			.withMessage('City name is too short')
			.isAlpha()
			.withMessage('city name cannot be number')
			.trim(),

		check('toCountry')
			.isLength({ min: 3 })
			.withMessage('City name is too short')
			.isAlpha()
			.withMessage('country name cannot be number')
			.trim(),

		check('receiver')
			.isLength({ min: 2 })
			.withMessage('name too short')
			.isAlpha()
			.withMessage('receiver name cannot be number')
			.trim(),

		check('receiverPhone')
			.matches(/^[0][7-9]{1}[0-1]{1}[\s]?[0-9][-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/)
			.withMessage('invalid phone number')
			.trim()
	]

	// errorFormatter: ({ location, msg, param, value, nestedErrors }) => {
	// 	return {
	// 		type: 'Error',
	// 		name: 'Order Failure',
	// 		location: location,
	// 		message: msg,
	// 		param: param,
	// 		value: value,
	// 		nestedErrors: nestedErrors
	// 	};
	// }
};
