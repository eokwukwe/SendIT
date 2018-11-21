import { check } from 'express-validator/check';

const validateUser = {
  validSignup: [
    check('fname')
      .isAlpha()
      .withMessage('Must be only alphabetical chars')
      .isLength({ min: 3 })
      .withMessage('name must be at least 3 chars long')
      .trim(),

    check('lname')
      .isAlpha()
      .withMessage('Must be only alphabetical chars')
      .isLength({ min: 3 })
      .withMessage('name must be at least 3 chars long')
      .trim(),

    check('email')
      .isEmail()
      .withMessage('invalid email')
      .trim(),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters in length.')
      .matches(/^[0-9a-zA-Z"#$&()%;,_@+|?!£^.*-]+$/)
      .withMessage('Password must contain at least one Uppercase, one number and one symbol')
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          return false;
        }
        return value;
      })
      .withMessage('Passwords does not match.')
      .trim()
  ],

  validLogin: [
    check('email')
      .isEmail()
      .withMessage('invalid email')
      .trim(),

    check('password')
      .isLength({ min: 1 })
      .withMessage('please enter your password')
  ]
};

export default validateUser;
