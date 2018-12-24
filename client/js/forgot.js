/* eslint-disable */
const forgotForm = document.forms['forgot-form'];
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');
const signupMessage = document.querySelector('.signup-message');
const alert = document.querySelector('#alert');

const submitReset = async userEmail => {
  const url = 'https://fcode-send-it.herokuapp.com/api/v1/auth/forgotPassword';
  const result = await Util.doFetch(url, {
    method: 'POST',
    body: JSON.stringify(userEmail)
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
  forgotForm.reset();
};

forgotForm.addEventListener('submit', e => {
  e.preventDefault();
  const userEmail = document.querySelector('#useremail').value;

  if (!Util.isValidEmail(userEmail)) {
    Util.showElement(signupMessage);
    Util.updateElement(signupMessage, 'Invalid email');
    return;
  }

  submitReset({ userEmail });
  Util.showSpinner(spinner);
  Util.hideElement(signupMessage);
});
