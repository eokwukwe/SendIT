import { check } from 'express-validator/check';

const validateOrder = {
  validOrder: [
    check('description')
      .isLength({ min: 3 })
      .withMessage('parcel description is too short')
      .isString()
      .trim(),
    check('weight')
      .isDecimal()
      .withMessage('weight must be decimal value')
      .trim(),
    check('destination')
      .isLength({ min: 5 })
      .withMessage('address is too short')
      .matches(/^[a-zA-Z-\d,-\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),
    check('pickup')
      .isLength({ min: 5 })
      .withMessage('destination address is too short')
      .matches(/^[a-zA-Z-\d,-\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),
    check('receiver')
      .isLength({ min: 2 })
      .withMessage('receiver name too short')
      .trim(),
    check('phone')
      .matches(/^[0][7-9]{1}[0-1]{1}[\s]?[0-9][-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/)
      .withMessage('invalid receiver phone number')
      .trim()
  ],

  validDestination: [
    check('destination')
      .isLength({ min: 5 })
      .withMessage('address is too short')
      .matches(/^[a-zA-Z-\d,-\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim()
  ],

  validLocation: [
    check('location')
      .isLength({ min: 5 })
      .withMessage('address is too short')
      .matches(/^[a-zA-Z-\d,-\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim()
  ]
};

export default validateOrder;
