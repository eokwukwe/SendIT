export const isNumber = number => {
	return !isNaN(number);
};

export const validateString = string => {
	if (typeof string !== 'string') return false;
	if (string.length < 2 || string.length > 250) return false;
	const validString = /^[a-zA-Z-'\s\d]+$/;
	return string.trim().match(validString);
};

export const checkValidEmail = email => {
	const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const isValid = reg.test(String(email).toLowerCase());
	if (!isValid) return false;
	return true;
};

export const validatePhoneNo = phone => {
	const validPhoneChar = /^[0][7-9]{1}[0-1]{1}[\s]?[0-9][-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/;
	return phone.trim().match(validPhoneChar);
};

export const validateOrder = (req, res, next) => {
	const {
		receiverName,
		receiverEmail,
		receiverPhone,
		parcelName,
		parcelWeight,
		orderPrice,
		address,
		city,
		country
	} = req.body;

	if (!validateString(receiverName)) {
		return res.status(400).json({
			error: 'name cannot be empty'
		});
	}
	if (!checkValidEmail(receiverEmail)) {
		return res.status(400).json({
			error: 'email is invalid'
		});
	}
	if (!validatePhoneNo(receiverPhone)) {
		return res.status(400).json({
			error: 'invalid phone number'
		});
	}
	if (!validateString(parcelName)) {
		return res.status(400).json({
			error: 'parcel name cannot be empty'
		});
	}

	if (parcelWeight <= 0 || !isNumber(parcelWeight)) {
		return res.status(400).json({
			error:
				'invalid input. The weight cannot be empty and must be greater than zero'
		});
	}
	if (orderPrice <= 1 || !isNumber(orderPrice)) {
		return res.status(400).json({
			error:
				'invalid input. The price cannot be empty and must be greater than one'
		});
	}
	if (!validateString(address)) {
		return res.status(400).json({
			error: 'address cannot be empty'
		});
	}

	if (!validateString(city)) {
		return res.status(400).json({
			error: 'city cannot be empty'
		});
	}

	if (!validateString(country)) {
		return res.status(400).json({
			error: 'country cannot be empty'
		});
	}

	return next();
};
