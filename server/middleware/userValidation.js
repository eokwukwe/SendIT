import { check } from 'express-validator/check';

const validateUser = {
  validSignup: [
    check('firstName')
      .isAlpha()
      .withMessage('firstname must be only alphabetical chars')
      .isLength({ min: 2 })
      .withMessage('firstname is too short')
      .trim(),

    check('lastName')
      .isAlpha()
      .withMessage('lastname must be only alphabetical chars')
      .isLength({ min: 2 })
      .withMessage('lastname is too short')
      .trim(),

    check('userEmail')
      .isEmail()
      .withMessage('invalid email')
      .trim(),

    check('password')
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/)
      .withMessage(
        'password must be at least 6 characters with at least 1 uppercase, 1 lowercase & 1 special character'
      )
      .trim()
  ],

  validLogin: [
    check('userEmail')
      .isEmail()
      .withMessage('invalid email')
      .trim(),

    check('password')
      .isLength({ min: 1 })
      .withMessage('please enter your password')
  ],

  validEmail: [
    check('userEmail')
      .isEmail()
      .withMessage('invalid email')
      .trim()
  ],

  validPassword: [
    check('password')
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/)
      .withMessage(
        'password must be at least 6 characters with at least 1 uppercase, 1 lowercase & 1 special character'
      )
      .trim()
  ]
};

export default validateUser;
