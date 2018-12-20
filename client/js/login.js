/* eslint-disable */
const logout = document.querySelectorAll('.logout');
const orderBtn = document.querySelectorAll('.order-btn');
const loginEmail = document.querySelector('#loginemail');
const loginPassword = document.querySelector('#loginpassword');
const loginSubmit = document.forms['login-form'];
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');
const signupMessage = document.querySelector('.signup-message');

(function hideNavBtn() {
  logout.forEach(das => (das.style.display = 'none'));
  orderBtn.forEach(item => (item.style.display = 'none'));
})();

const loginUser = async userData => {
  try {
    const url = 'https://fcode-send-it.herokuapp.com/api/v1/auth/login';
    const result = await Util.doFetch(url, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    const data = await result.json();
    if (result.status === 400) {
      Util.showSnackbar(snackbar, '#ff6666', data.message);
      Util.hideSpinner(spinner);
      return;
    }
    if (result.status === 200) {
      Util.showSnackbar(snackbar, '#4CAF50', data.message);
      Util.hideSpinner(spinner);
      localStorage.setItem('user', data.token);
      const decoded = jwt_decode(data.token);
      decoded.usertype === 'admin'
        ? (window.location.href = 'admin.html')
        : (window.location.href = 'user.html');
    }
  } catch (error) {
    Util.showSnackbar(snackbar, 'red', data.message);
    Util.hideSpinner(spinner);
  }
};

const login = e => {
  e.preventDefault();

  const userEmail = loginEmail.value;
  const password = loginPassword.value;
  if (!Util.isValidEmail(userEmail)) {
    Util.showElement(signupMessage);
    Util.updateElement(signupMessage, 'Invalid email');
    return;
  }
  const loginData = {
    userEmail,
    password
  };
  Util.showSpinner(spinner);
  loginUser(loginData);
  loginSubmit.reset();
  Util.hideElement(signupMessage);
};

if (document.readyState === 'loading' || document.readyState === 'complete') {
  loginSubmit.addEventListener('submit', login);
}
