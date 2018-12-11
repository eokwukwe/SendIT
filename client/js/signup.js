/* eslint-disable */
const orderBtn = document.querySelectorAll('.order-btn');
const logout = document.querySelectorAll('.logout');
const formValues = document.forms['signup-form'];
// const submit = document.querySelector('#signup-submit');
const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const email = document.querySelector('#email');
const pwd = document.querySelector('#pwd');
const pwdLabel = document.querySelector('.checkPasswords');
const signupMessage = document.querySelector('.signup-message');
const conPwd = document.querySelector('#confirmpwd');

const checkPasswordEquality = () => {
  conPwd.addEventListener('keyup', e =>
    e.target.value !== pwd.value
      ? (conPwd.style.border = '2px solid red')
      : (conPwd.style.border = '2px solid green')
  );
};

const validatePwd = pwd => {
  const validPwd = /^[0-9a-zA-Z\s#$&()%;,_@+|?!.-]+$/;
  if (pwd.length >= 6 && !!pwd.match(validPwd)) {
    return true;
  }
  return false;
};

const validateString = string => {
  if (typeof string !== 'string') return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z-']+$/;
  return string.trim().match(validString);
};

const checkValidEmail = email => {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = reg.test(String(email).toLowerCase());
  if (!isValid) return false;
  return true;
};

const validateFormData = (fname, lname, email, pwd) => {
  if (fname === '' || !validateString(fname)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'firstname too short';
    return false;
  }

  if (lname === '' || !validateString(lname)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'lastname too short';
    return false;
  }

  if (email === '' || !checkValidEmail(email)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'invalid email';
    return false;
  }
  if (pwd === '' || !validatePwd(pwd)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'password must be aleast 6 characters';
    return false;
  }

  signupMessage.style.display = 'none';
  return true;
};

// const validateInput = () => {
//   conPwd.addEventListener("keyup", e => {
//     return e.target.value !== pwd.value
//       ? (conPwd.style.border = "2px solid red")
//       : (conPwd.style.border = "2px solid green");
//   });

//   pwd.addEventListener("keyup", e => {
//     return !validatePwd(e.target.value)
//       ? (pwd.style.border = "2px solid red")
//       : (pwd.style.border = "2px solid green");
//   });

//   firstname.addEventListener("keyup", e => {
//     return !validateString(e.target.value)
//       ? (firstname.style.border = "2px solid red")
//       : (firstname.style.border = "2px solid green");
//   });

//   lastname.addEventListener("keyup", e => {
//     return !validateString(e.target.value)
//       ? (lastname.style.border = "2px solid red")
//       : (lastname.style.border = "2px solid green");
//   });

//   email.addEventListener("keyup", e => {
//     return !checkValidEmail(e.target.value)
//       ? (email.style.border = "2px solid red")
//       : (email.style.border = "2px solid grren");
//   });
// };

const signUpSubmit = e => {
  e.preventDefault();

  const firstName = firstname.value;
  const lastName = lastname.value;
  const userEmail = email.value;
  const password = pwd.value;
  const confirmPassword = conPwd.value;

  if (!validateFormData(firstName, lastName, userEmail, password)) {
    return;
  }

  if (password.length != confirmPassword.length) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'passwords do not match';
    return;
  }

  const signupData = {
    firstName,
    lastName,
    userEmail,
    password,
    confirmPassword
  };

  console.log(signupData);
  // window.location.href = "user.html";

  formValues.reset();
};

const signupInit = () => {
  logout.forEach(das => (das.style.display = 'none'));
  orderBtn.forEach(das => (das.style.display = 'none'));
  // checkPasswordEquality();
  formValues.addEventListener('submit', signUpSubmit);
};

signupInit();
