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
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters in length.')
      .matches('[0-9]')
      .withMessage('password must contain at least 1 number.')
      .matches('[A-Z]')
      .withMessage('password must contain at least 1 uppercase letter.')
      .matches('["#$&()%;,_@+|?!£^.*-]')
      .withMessage('password must contain at least 1 symbol.')
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return value;
      })
      .withMessage('passwords does not match.')
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
  ]
};

export default validateUser;
