/* eslint-disable */
const orderBtn = document.querySelectorAll('.order-btn');
const logout = document.querySelectorAll('.logout');
const submitForm = document.forms['signup-form'];
const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const email = document.querySelector('#email');
const pwd = document.querySelector('#pwd');
const passwordMsg = document.querySelector('.password-message');
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');

const validatePwd = pwd => {
  const validPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/;
  return pwd.match(validPwd);
};

const validateString = string => {
  if (typeof string !== 'string' || string.length < 2) return false;
  const validString = /^[a-zA-Z-']+$/;
  return string.trim().match(validString);
};

const isValidEmail = email => /\S+@\S+\.\S+/.test(email);

const hideNavItems = () => {
  logout.forEach(das => (das.style.display = 'none'));
  orderBtn.forEach(das => (das.style.display = 'none'));
};

const validPassword = () => {
  pwd.addEventListener('keyup', e =>
    !validatePwd(e.target.value)
      ? (pwd.style.border = '2px solid red')
      : ((pwd.style.border = '2px solid green'), (passwordMsg.style.display = 'none'))
  );
};

const validateFormData = (fname, lname, email, pwd) => {
  if (fname === '' || !validateString(fname)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'Firstname too short';
    return false;
  }

  if (lname === '' || !validateString(lname)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'Lastname too short';
    return false;
  }

  if (email === '' || !isValidEmail(email)) {
    signupMessage.style.display = 'block';
    signupMessage.textContent = 'Invalid email';
    return false;
  }
  return true;
};

const registerUser = async userData => {
  try {
    const url = 'https://fcode-send-it.herokuapp.com/api/v1/auth/signup';
    const result = await Util.doFetch(url, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    const data = await result.json();
    if (result.status === 400) {
      Util.showSnackbar(snackbar, '#ff6666', data.message);
      spinner.style.visibility = '';
      return;
    }
    if (result.status === 201) {
      Util.showSnackbar(snackbar, '#4CAF50', data.message);
      Util.hideSpinner(spinner);
      window.location.href = 'login.html';
    }
  } catch (error) {
    Util.showSnackbar(snackbar, 'red', result.message);
    Util.hideSpinner(spinner);
  }
};

const signUpSubmit = e => {
  e.preventDefault();

  const firstName = firstname.value;
  const lastName = lastname.value;
  const userEmail = email.value;
  const password = pwd.value;
  const signupData = {
    firstName,
    lastName,
    userEmail,
    password
  };
  if (!validateFormData(firstName, lastName, userEmail, password)) {
    return;
  }
  Util.showSpinner(spinner);
  registerUser(signupData);

  submitForm.reset();
  pwd.style.border = '';
  passwordMsg.style.display = '';
};

const signupInit = () => {
  hideNavItems();
  validPassword();
  submitForm.addEventListener('submit', signUpSubmit);
};

signupInit();
