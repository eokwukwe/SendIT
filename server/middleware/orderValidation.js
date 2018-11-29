import { check } from 'express-validator/check';

const validateOrder = {
  validOrder: [
    check('parcelDescription')
      .isLength({ min: 10 })
      .withMessage('parcel description is too short')
      .isString()
      .trim(),

    check('parcelWeight')
      .isDecimal()
      .withMessage('weight must be decimal value')
      .trim(),

    check('fromAddress')
      .isLength({ min: 5 })
      .withMessage('address is too short')
      .matches(/^[a-zA-Z-\d,\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),

    check('fromCity')
      .isLength({ min: 3 })
      .withMessage('city name is too short')
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
      .isLength({ min: 5 })
      .withMessage('destination address is too short')
      .matches(/^[a-zA-Z-\d,\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),

    check('toCity')
      .isLength({ min: 3 })
      .withMessage('destination city name is too short')
      .isAlpha()
      .withMessage('destination city name cannot be number')
      .trim(),

    check('toCountry')
      .isLength({ min: 3 })
      .withMessage('destination country name is too short')
      .isAlpha()
      .withMessage('destination country name cannot be number')
      .trim(),

    check('receiver')
      .isLength({ min: 2 })
      .withMessage('receiver name too short')
      .isAlpha()
      .withMessage('receiver name cannot be number')
      .trim(),

    check('receiverPhone')
      .matches(/^[0][7-9]{1}[0-1]{1}[\s]?[0-9][-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/)
      .withMessage('invalid receiver phone number')
      .trim()
  ],

  validDestination: [
    check('toAddress')
      .isLength({ min: 5 })
      .withMessage('destination address is too short')
      .matches(/^[a-zA-Z-\d,\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),

    check('toCity')
      .isLength({ min: 3 })
      .withMessage('destination city name is too short')
      .isAlpha()
      .withMessage('destination city name cannot be number')
      .trim(),

    check('toCountry')
      .isLength({ min: 3 })
      .withMessage('destination country name is too short')
      .isAlpha()
      .withMessage('destination country name cannot be number')
      .trim()
  ],

  validLocation: [
    check('fromAddress')
      .isLength({ min: 5 })
      .withMessage('address is too short')
      .matches(/^[a-zA-Z-\d,\s]+$/)
      .withMessage('invalid input, please enter a valid address')
      .trim(),

    check('fromCity')
      .isLength({ min: 3 })
      .withMessage('city name is too short')
      .isAlpha()
      .withMessage('city name cannot be number')
      .trim(),

    check('fromCountry')
      .isLength({ min: 3 })
      .withMessage('country name is too short')
      .isAlpha()
      .withMessage('country name cannot be number')
      .trim()
  ]
};

export default validateOrder;
