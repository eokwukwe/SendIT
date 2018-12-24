/* eslint-disable */
const signUpBtn = document.querySelectorAll('.signup');
const login = document.querySelectorAll('.login');
const logout = document.querySelectorAll('.logout');
const orderList = document.querySelector('#order-list');
const userName = document.querySelector('#user-name');
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');
const pendings = document.querySelector('#pending');
const intransits = document.querySelector('#intransit');
const delivereds = document.querySelector('#delivered');
const cancelleds = document.querySelector('#cancelled');
const totalOrdereds = document.querySelector('#total-users-orders');

(function hideNavItems() {
  signUpBtn.forEach(item => (item.style.display = 'none'));
  login.forEach(item => (item.style.display = 'none'));
})(signUpBtn, login);

(function filterFunction() {
  const searchFilter = document.querySelector('#search-filter');
  const filterOrders = () => {
    const selectedOptionText = searchFilter.options[searchFilter.selectedIndex].text;
    const selectedOptionValue = searchFilter.options[
      searchFilter.selectedIndex
    ].value.toLowerCase();
    const orderList = document.querySelector('#order-list');
    const order = orderList.getElementsByTagName('li');
    const numberOfOrders = order.length;

    for (let i = 0; i < numberOfOrders; i++) {
      const status = order[i].querySelectorAll('.status')[0];
      const date = order[i].querySelectorAll('.date')[0];
      const statusText = status.textContent.toLowerCase();
      const dateText = date.textContent.toLowerCase();

      statusText.indexOf(selectedOptionValue) > -1 || dateText.indexOf(selectedOptionValue) > -1
        ? (order[i].style.display = '')
        : (order[i].style.display = 'none');
    }
  };
  searchFilter.addEventListener('change', filterOrders);
})();

const openAccordion = accordion => {
  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function() {
      const panel = document.querySelectorAll('.accordion-content');
      this.querySelector('.open').classList.toggle('rotate');

      panel[i].style.maxHeight
        ? ((panel[i].style.maxHeight = null), (this.style.backgroundColor = ''))
        : ((panel[i].style.maxHeight = panel[i].scrollHeight + 'px'),
          (this.style.backgroundColor = 'rgba(153, 153, 153, 0.2)'));
    });
  }
};

const changeAddressModals = (elementBtns, elementModals) => {
  elementBtns.forEach((elementBtn, i) => {
    elementBtn.addEventListener('click', e => {
      Util.showElement(elementModals[i]);
      const inputField = elementModals[i].querySelector("input[type='text']");
      Util.placesAutocomplete(inputField);
    });
  });
};

const cancelOrder = async parcelId => {
  const token = localStorage.getItem('user');
  const url = `https://fcode-send-it.herokuapp.com/api/v1/parcels/${parcelId}/cancel`;
  const results = await Util.doFetchWithToken(url, token, {
    method: 'PUT'
  });
  const data = await results.json();
  if (results.status === 404) {
    Util.showSnackbar(snackbar, '#ff6666', data.message);
    return;
  }
  if (results.status === 500) {
    Util.showSnackbar(snackbar, '#ff6666', data.error);
    return;
  }
  location.reload();
};

const changeDestination = async (parcelId, address) => {
  const token = localStorage.getItem('user');
  const url = `https://fcode-send-it.herokuapp.com/api/v1/parcels/${parcelId}/destination`;
  const results = await Util.doFetchWithToken(url, token, {
    method: 'PUT',
    body: JSON.stringify(address)
  });
  const data = await results.json();
  if (results.status === 400) {
    for (let props in data) {
      Util.showSnackbar(snackbar, '#ff6666', data[props]);
    }
    return;
  }
  if (results.status === 404) {
    Util.showSnackbar(snackbar, '#ff6666', data.message);
    return;
  }
  if (results.status === 500) {
    Util.showSnackbar(snackbar, '#ff6666', data.error);
    return;
  }
  location.reload();
};

const acceptCancel = (elementBtns, elementModals) => {
  elementBtns.forEach((elementBtn, i) => {
    elementBtn.addEventListener('click', e => {
      const parcelId = e.target.id.split('-')[1];
      cancelOrder(parcelId);
      Util.hideElement(elementModals[i]);
      Util.showSpinner(spinner);
    });
  });
};

const submitForm = (changeAddressForms, changeDestinationModals) => {
  changeAddressForms.forEach((addressForm, i) => {
    addressForm.addEventListener('submit', e => {
      e.preventDefault();
      const destination = addressForm[0].value.trim();
      const parcelId = addressForm[0].id.split('-')[2];
      changeDestination(parcelId, { destination });
      Util.hideElement(changeDestinationModals[i]);
      Util.showSpinner(spinner);
    });
  });
};

const loadUserOrders = async () => {
  try {
    const token = localStorage.getItem('user');
    const decoded = jwt_decode(token);
    const url = `https://fcode-send-it.herokuapp.com/api/v1/users/${decoded.userId}/parcels`;
    const results = await Util.doFetchWithToken(url, token);
    const ordersByUser = await results.json();
    if (results.status === 404) {
      Util.showSnackbar(snackbar, '#ff6666', 'You have no orders yet');
      Util.hideSpinner(spinner);
      return;
    }

    if (results.status === 500) {
      Util.showSnackbar(snackbar, '#ff6666', ordersByUser.error);
      Util.hideSpinner(spinner);
      return;
    }

    Util.hideSpinner(spinner);
    const { userOrders, total } = ordersByUser;
    const totalPending = userOrders.filter(order => order.status === 'pending' && !order.cancelled);
    const totalIntransit = userOrders.filter(
      order => order.status === 'intransit' && !order.cancelled
    );
    const totalDelivered = userOrders.filter(
      order => order.status === 'delivered' && !order.cancelled
    );
    const totalCancelled = userOrders.filter(order => order.cancelled);

    Util.updateElement(totalOrdereds, total);
    Util.updateElement(pendings, totalPending.length);
    Util.updateElement(intransits, totalIntransit.length);
    Util.updateElement(delivereds, totalDelivered.length);
    Util.updateElement(cancelleds, totalCancelled.length);

    for (const order of userOrders) {
      const price = order.price.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN'
      });

      const orderNode = document.createElement('li');
      const classname = order.cancelled ? 'cancelled' : order.status;
      const disabled = order.cancelled ? 'disabled' : '';
      const status = order.cancelled ? 'cancelled' : order.status;
      orderNode.innerHTML = `
      <div class="accordion accordion-header ${classname}">
        <h5 class="order-description">${order.description}</h5>
        <span> <i class="fas fa-chevron-down open"></i> </span>
      </div>
      <div class="accordion-content user-accordion-content">
        <div class="order-details">

          <div class="info-card">
            <h4 class="heading ${classname}-heading">Sender</h4>
            <p class="order-section-detail">
              Name <span class="price">${decoded.firstname}</span>
            </p>
            <p class="order-section-detail">
              Pickup Location
              <span class="price">${order.location}</span>
            </p>
          </div>
          <div class="info-card">
            <h4 class="heading ${classname}-heading">Receiver</h4>
            <p class="order-section-detail">
              Name <span class="price">${order.receiver_name}</span>
            </p>
            <p class="order-section-detail">
              Destination
              <span class="price">${order.destination}</span>
            </p>
            <p class="order-section-detail">
              Present Location 
              <span class="price">${order.location}</span>
            </p>
          </div>
          <div class="info-card">
            <h4 class="heading ${classname}-heading">Order Info</h4>
            <p class="order-section-detail">
              Order Date
              <span class="price date">
                ${moment(order.created_on).format('llll')}
              </span>
            </p>
            <p class="order-section-detail">
              Parcel Weight <span class="price">${order.weight}kg</span>
            </p>
            <p class="order-section-detail">
              Delivery Price 
              <span class="price">
              ${price}
              </span>
            </p>
            <p class="order-section-detail">
              Status
              <span class="status status-${classname}">${status}</span>
            </p>
            <p class="order-section-detail action-btn">
              <button
                id="destination-${order.id}"
                class="btn success action-footer-btn action-btn-destination"
                ${disabled}
              >
                Change Destination
              </button>
              <button
                id="cancel-${order.id}"
                class="btn danger action-footer-btn action-btn-cancel"
                ${disabled}
              >
                Cancel
              </button>
            </p>
          </div>
        </div>
        <div id="map-${order.id}" class="map">Map is not available</div>

        <div class="modal action-modal cancel-order-modal">
          <div class="modal-content action-modal-content">
            <div class="modal-body action-modal-body">
              <p>ARE YOU SURE? <br> You cannot undo it after cancelling.</p>
              <div class="btn-group btn-group-cancel-order">
                <button
                  id="dismiss"
                  class="btn danger action-footer-btn dismiss"
                >
                  dismiss
                </button>
                <button
                  id="accept-${order.id}"
                  class="btn info action-footer-btn accept"
                >
                  accept
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal action-modal change-address-modal">
          <div class="modal-content action-modal-content">
            <div class="modal-header action-modal-header change-address-header">
              <h4>Change the Destination</h4>
            </div>
            <div class="modal-body action-modal-body">
              <form class="change-address-form">
                <input
                  type="text"
                  id="change-destination-${order.id}"
                  placeholder="Enter the new destination"
                  required
                  autofocus
                />
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn danger action-footer-btn close-change-destination"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    class="btn success action-footer-btn"
                  >
                    Submit
                  </button>
                </div>
              </form>
              </div>
            <div class="modal-footer action-modal-footer"></div>
            </div>
          </div>
        </div> 

      </div>
      `;
      orderList.appendChild(orderNode);
      const mapDiv = document.querySelector(`#map-${order.id}`);
      const mapData = {
        pickup: order.pickup,
        destination: order.destination,
        pickupIcon:
          'https://chart.googleapis.com/chart?' + 'chst=d_map_pin_letter&chld=P|FFFF00|000000',
        destinationIcon:
          'https://chart.googleapis.com/chart?' + 'chst=d_map_pin_letter&chld=D|FF0000|000000',
        element: mapDiv
      };
      // Util.loadMap(mapData);
    }
    userInit();
    return;
  } catch (error) {
    Util.showSnackbar(snackbar, '#ff6666', 'could not get orders. Please reload the page');
    Util.hideSpinner(spinner);
  }
};

const userInit = () => {
  const accordion = document.querySelectorAll('.accordion');
  const destination = document.querySelectorAll('.btn-destination');
  const cancelOrderModals = document.querySelectorAll('.cancel-order-modal');
  const cancelBtns = document.querySelectorAll('.action-btn-cancel');
  const dismissBtns = document.querySelectorAll('.dismiss');
  const acceptBtns = document.querySelectorAll('.accept');
  const closeChangeDestinationBtns = document.querySelectorAll('.close-change-destination');
  const changeDestinationBtns = document.querySelectorAll('.action-btn-destination');
  const changeDestinationModals = document.querySelectorAll('.change-address-modal');
  const changeAddressForms = document.querySelectorAll('.change-address-form');
  changeAddressModals(changeDestinationBtns, changeDestinationModals);
  openAccordion(accordion);
  submitForm(changeAddressForms, changeDestinationModals);
  acceptCancel(acceptBtns, cancelOrderModals);
  Util.hideActionModals(closeChangeDestinationBtns, changeDestinationModals);
  Util.showActionModals(cancelBtns, cancelOrderModals);
  Util.hideActionModals(dismissBtns, cancelOrderModals);
};

Util.verifyUser(userName);
Util.showSpinner(spinner);
loadUserOrders();
Util.logoutUser(logout);
