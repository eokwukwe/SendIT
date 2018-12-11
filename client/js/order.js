/* eslint-disable */
const signUpBtn = document.querySelectorAll('.signup');
const login = document.querySelectorAll('.login');
const logout = document.querySelectorAll('.logout');
const orderBtn = document.querySelectorAll('.order-btn');
const orderSubmitBtn = document.querySelector('#order-submit');
const viewOrderBtn = document.querySelector('#view-order');
const previewOrderModal = document.querySelector('#preview-order');
const reject = document.querySelector('#reject');
const accept = document.querySelector('#accept');
const orderForm = document.forms['order-form'];

const hideNavBtns = () => {
  signUpBtn.forEach(item => (item.style.display = 'none'));
  login.forEach(item => (item.style.display = 'none'));
  orderBtn.forEach(das => (das.style.display = 'none'));
};

const showModal = () => {
  previewOrderModal.style.display = 'block';
};

const hideModal = () => {
  previewOrderModal.style.display = 'none';
};

const logoutUser = () => {
  logout.forEach(item =>
    item.addEventListener('click', () => {
      window.location.href = 'index.html';
    })
  );
};

const rejectOrder = () => {
  reject.addEventListener('click', () => {
    hideModal();
    orderSubmitBtn.style.display = '';
    viewOrderBtn.style.display = 'block';
  });
};

const acceptOrder = orderData => {
  accept.addEventListener('click', () => {
    hideModal();
    orderSubmitBtn.style.display = 'none';
    viewOrderBtn.style.display = 'block';
    console.log('accepted order', orderData);
  });
};

function loadAutocomplete() {
  const fromPlaces = new google.maps.places.Autocomplete(document.querySelector('#pickup'));
  const toPlaces = new google.maps.places.Autocomplete(document.querySelector('#destination'));

  google.maps.event.addListener(fromPlaces, 'place_changed', function() {
    const fromPlace = fromPlaces.getPlace();
    document.querySelector('#pickup').value = fromPlace.formatted_address;
  });

  google.maps.event.addListener(toPlaces, 'place_changed', function() {
    const toPlace = toPlaces.getPlace();
    document.querySelector('#destination').value = toPlace.formatted_address;
  });
}

const callback = (response, status) => {
  if (status == 'OK') {
    const origin = response.originAddresses[0];
    const destination = response.destinationAddresses[0];
    console.log(response);
    const distance = response.rows[0].elements[0].distance.value;
    document.querySelector('#distance').value = distance / 1000;
    console.log(
      'callback origin, destination',
      origin,
      destination,
      document.querySelector('#distance').value
    );
  } else {
    console.log(status);
  }
};

const calculateDistance = () => {
  const origin = document.querySelector('#pickup').value;
  const destination = document.querySelector('#destination').value;
  const service = new google.maps.DistanceMatrixService();
  console.log('origin and destination ', origin, destination);
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    },
    callback
  );
};

const createOrderPreview = orderData => {
  let previewData = document.querySelector('.preview-table');
  const { description, weight, pickup, destination, receiver, distance, price, phone } = orderData;

  const data = `
    <p class="preview-data">
      Customer <span class="price">${receiver}</span>
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

  return orderData;
};

viewOrderBtn.addEventListener('click', () => {
  calculateDistance();
  viewOrderBtn.style.display = 'none';
  orderSubmitBtn.style.display = 'block';
});

const submitOrder = e => {
  e.preventDefault();

  const description = document.querySelector('#description').value;
  const weight = document.querySelector('#weight').value;
  const pickup = document.querySelector('#pickup').value;
  const destination = document.querySelector('#destination').value;
  const receiver = document.querySelector('#receiver').value;
  const phone = document.querySelector('#phone').value;
  const distance = document.querySelector('#distance').value;
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

  createOrderPreview(orderData);
  showModal();
  acceptOrder(orderData);
  rejectOrder();
  orderForm.reset();
};

const orderInit = () => {
  viewOrderBtn.style.display = 'block';
  orderSubmitBtn.style.display = 'none';
  hideNavBtns();
  loadAutocomplete();
  logoutUser();
  orderSubmitBtn.addEventListener('click', submitOrder);
};

window.addEventListener('load', () => {
  orderInit();
});
