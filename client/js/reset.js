/* eslint-disable */
const resetForm = document.forms['reset-form'];
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');
const signupMessage = document.querySelector('.signup-message');
const passwordMsg = document.querySelector('.password-message');
const newPassword = document.querySelector('#new-password');
const alert = document.querySelector('#alert');

const submitReset = async userData => {
  const { resetToken, password } = userData;
  const url = `https://fcode-send-it.herokuapp.com/api/v1/auth/resetPassword/${resetToken}`;
  const result = await Util.doFetch(url, {
    method: 'POST',
    body: JSON.stringify({ password })
  });
  const data = await result.json();
  if (result.status === 400) {
    for (let props in data) {
      Util.createAlert(alert, '#ff6666', data[props]);
      Util.showElement(alert);
      Util.hideSpinner(spinner);
    }
    return;
  }
  if (result.status === 401) {
    Util.createAlert(alert, '#ff6666', data.message);
    Util.showElement(alert);
    Util.hideSpinner(spinner);
    return;
  }
  if (result.status === 404) {
    Util.createAlert(alert, '#ff6666', data.message);
    Util.showElement(alert);
    Util.hideSpinner(spinner);
    return;
  }
  if (result.status === 500) {
    Util.createAlert(alert, '#ff6666', data.error);
    Util.showElement(alert);
    Util.hideSpinner(spinner);
    return;
  }
  Util.createAlert(alert, '#4CAF50', data.message);
  Util.showElement(alert);
  Util.hideSpinner(spinner);
  resetForm.reset();
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 6000);
};

resetForm.addEventListener('submit', e => {
  e.preventDefault();
  const resetToken = document.querySelector('#reset-token').value;
  const password = newPassword.value;
  const confirmPassword = document.querySelector('#confirm-password').value;
  if (password !== confirmPassword) {
    Util.showElement(signupMessage);
    Util.updateElement(signupMessage, 'Passwords does not match');
    return;
  }
  const userData = { resetToken, password };
  submitReset(userData);
  Util.hideElement(signupMessage);
  Util.showElement(passwordMsg);
  Util.showSpinner(spinner);
  newPassword.style.border = 'none';
});

Util.validPassword(newPassword, passwordMsg);
