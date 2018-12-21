/* eslint-disable */
const logout = document.querySelectorAll('.logout');
const previewOrderModal = document.querySelector('#preview-order');
const reject = document.querySelector('#reject');
const accept = document.querySelector('#accept');
const orderForm = document.forms['order-form'];
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');

(function hideNavBtns() {
  const signUpBtn = document.querySelectorAll('.signup');
  const login = document.querySelectorAll('.login');
  const orderBtn = document.querySelectorAll('.order-btn');
  signUpBtn.forEach(item => (item.style.display = 'none'));
  login.forEach(item => (item.style.display = 'none'));
  orderBtn.forEach(das => (das.style.display = 'none'));
})();

const postOrder = async orderData => {
  try {
    const token = localStorage.getItem('user');
    const url = 'https://fcode-send-it.herokuapp.com/api/v1/parcels';
    const results = await Util.doFetchWithToken(url, token, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    const data = await results.json();
    if (results.status === 400) {
      Util.hideSpinner(spinner)
      for (const props in data) {
        Util.showSnackbar(snackbar, '#ff6666', data[props]);
      }
      return;
    }
    if (results.status === 500) {
      Util.hideSpinner(spinner)
      Util.showSnackbar(snackbar, '#ff6666', data.error);
      return;
    }
    orderForm.reset();
    Util.hideSpinner(spinner)
    Util.showSnackbar(snackbar, '#4CAF50', data.message);
    window.location.href = 'user.html';
  } catch (error) {
    Util.showSnackbar(snackbar, '#ff6666', error);
  }
};

const rejectOrder = () => {
  reject.addEventListener('click', () => {
    Util.hideElement(previewOrderModal);
  });
};

const acceptOrder = orderData => {
  accept.addEventListener('click', () => {
    Util.hideElement(previewOrderModal);
    postOrder(orderData);
  });
};

const loadAutocomplete = () => {
  const pickup = document.querySelector('#pickup');
  const destination = document.querySelector('#destination');
  Util.placesAutocomplete(pickup);
  Util.placesAutocomplete(destination);
};

const calculateDistance = async () => {
  const origin = document.querySelector('#pickup').value;
  const destination = document.querySelector('#destination').value;
  const service = new google.maps.DistanceMatrixService();
  const result = await Util.callDistanceMatrix(service, {
    origins: [origin],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false
  });
  const distance = await result.rows[0].elements[0].distance.value;
  return distance / 1000;
};

const createOrderPreview = orderData => {
  const previewData = document.querySelector('.preview-table');
  const { description, weight, pickup, destination, receiver, distance, price, phone } = orderData;
  const data = `
    <p class="preview-data">
      Customer <span>${receiver}</span>
    </p>
    <p class="preview-data">
      Receiver <span class="price">${receiver}</span>
    </p>
    <p class="preview-data">
      Receiver Phone <span class="price">${phone}</span>
    </p>
    <p class="preview-data">
      Description <span class="price">${description}</span>
    </p>
    <p class="preview-data">
      Pickup <span class="price">${pickup}</span>
    </p>
    <p class="preview-data">
      Destination
      <span class="price"
        >${destination}</span
      >
    </p>
    <p class="preview-data">
      Date <span class="price date">${moment(Date.now()).format('llll')}</span>
    </p>
    <p class="preview-data">
      Weight <span class="price">${weight}</span>
    </p>
    <p class="preview-data">
      Distance <span class="price">${distance}</span>
    </p>
    <hr class="divider" />
    <p class=" preview-data preview-price">
      Price <span>${price.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN'
      })}</span>
    </p>
  `;
  previewData.innerHTML = data;
};

const getFormValues = distance => {
  const description = document.querySelector('#description').value;
  const weight = document.querySelector('#weight').value;
  const pickup = document.querySelector('#pickup').value;
  const destination = document.querySelector('#destination').value;
  const receiver = document.querySelector('#receiver').value;
  const phone = document.querySelector('#phone').value;
  const price = weight * 200 + distance * 100;

  const orderData = {
    description,
    weight,
    pickup,
    destination,
    receiver,
    distance,
    price,
    phone
  };
  return orderData;
};

const submitOrder = async e => {
  e.preventDefault();
  const distance = await calculateDistance();
  const orderData = getFormValues(distance);
  createOrderPreview(orderData);
  Util.showElement(previewOrderModal);
  acceptOrder(orderData);
  Util.showSpinner(spinner);
  rejectOrder();
};

window.addEventListener('load', () => {
  Util.verifyUser(null);
  Util.logoutUser(logout);
  loadAutocomplete();
  orderForm.addEventListener('submit', submitOrder);
});
