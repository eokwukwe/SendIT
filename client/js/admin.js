/* eslint-disable */
const logout = document.querySelectorAll('.logout');
const orderList = document.querySelector('#order-list');
const snackbar = document.querySelector('#snackbar');
const spinner = document.querySelector('.page-loader');
const pendings = document.querySelector('#pending');
const intransits = document.querySelector('#intransit');
const delivereds = document.querySelector('#delivered');
const cancelleds = document.querySelector('#cancelled');
const totalOrdereds = document.querySelector('#total-orders');
const totalRegisteredUsers = document.querySelector('#total-users');
const totalRevenues = document.querySelector('#total-revenues');
const deliveredRevenues = document.querySelector('#delivered-revenues');

(function hideNavItems() {
  const orderBtns = document.querySelectorAll('.order-btn');
  const loginBtns = document.querySelectorAll('.login');
  const signUpBtns = document.querySelectorAll('.signup');
  signUpBtns.forEach(signUpBtn => (signUpBtn.style.display = 'none'));
  orderBtns.forEach(orderBtn => (orderBtn.style.display = 'none'));
  loginBtns.forEach(loginBtn => (loginBtn.style.display = 'none'));
})();

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

const updateLocationModal = (updateLocationBtns, updateLocationModals) => {
  updateLocationBtns.forEach((updateLocationBtn, i) => {
    updateLocationBtn.addEventListener('click', e => {
      Util.showElement(updateLocationModals[i]);
      const inputField = updateLocationModals[i].querySelector("input[type='text']");
      // Util.placesAutocomplete(inputField);
    });
  });
};

const updateStatusModal = (updateStatusBtns, updateStatusModals) => {
  updateStatusBtns.forEach((updateStatusBtn, i) => {
    updateStatusBtn.addEventListener('click', e => {
      Util.showElement(updateStatusModals[i]);
    });
  });
};

const updateLocation = async (parcelId, address) => {
  const token = localStorage.getItem('user');
  const url = `https://fcode-send-it.herokuapp.com/api/v1/parcels/${parcelId}/presentLocation`;
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
  Util.showSnackbar(snackbar, '#4CAF50', data.message);
  location.reload();
};

const updateStatus = async (parcelId, status) => {
  const token = localStorage.getItem('user');
  const url = `https://fcode-send-it.herokuapp.com/api/v1/parcels/${parcelId}/status`;
  const results = await Util.doFetchWithToken(url, token, {
    method: 'PUT',
    body: JSON.stringify(status)
  });
  const data = await results.json();
  if (results.status === 404) {
    Util.hideSpinner(spinner);
    Util.showSnackbar(snackbar, '#ff6666', data.message);
    return;
  }
  if (results.status === 500) {
    Util.hideSpinner(spinner);
    Util.showSnackbar(snackbar, '#ff6666', data.error);
    return;
  }
  Util.hideSpinner(spinner);
  location.reload();
  Util.showSnackbar(snackbar, '#4CAF50', data.message);
};

const submitLocationUpdate = (updateLocationForms, updateLocationModals) => {
  updateLocationForms.forEach((updateLocationForm, i) => {
    updateLocationForm.addEventListener('submit', e => {
      e.preventDefault();
      const parcelId = updateLocationForm[0].id.split('-')[2];
      const location = updateLocationForm[0].value;
      updateLocation(parcelId, { location });
      Util.hideElement(updateLocationModals[i]);
      Util.showSpinner(spinner);
      updateLocationForm.reset();
    });
  });
};

const submitStatusUpdate = (updateStatusForms, updateStatusModals) => {
  updateStatusForms.forEach((updateStatusForm, i) => {
    updateStatusForm.addEventListener('submit', e => {
      e.preventDefault();
      const statusMessage = e.target.querySelector('.status-message');
      const selectedStatus = e.target.querySelector('input[type="radio"]:checked');
      if (!selectedStatus) {
        Util.showElement(statusMessage);
        return;
      }
      const status = selectedStatus.value;
      const parcelId = selectedStatus.id.split('-')[2];
      updateStatus(parcelId, { status });
      Util.hideElement(updateStatusModals[i]);
      Util.hideElement(statusMessage);
      Util.showSpinner(spinner);
      updateStatusForm.reset();
    });
  });
};

const loadAllUsers = async token => {
  const allUsersUrl = 'https://fcode-send-it.herokuapp.com/api/v1/users';
  const allUsersResult = await Util.doFetchWithToken(allUsersUrl, token);
  const allUsers = await allUsersResult.json();
  const { users, totalUsers } = allUsers;
  Util.updateElement(totalRegisteredUsers, totalUsers);
};

const loadAllOrders = async () => {
  const token = localStorage.getItem('user');
  const url = 'https://fcode-send-it.herokuapp.com/api/v1/parcels';
  const allOrdersResult = await Util.doFetchWithToken(url, token);
  const allOrders = await allOrdersResult.json();
  Util.showSpinner(spinner);
  loadAllUsers(token);
  if (allOrdersResult.status === 404) {
    Util.showSnackbar(snackbar, '#ff6666', 'You have no orders yet');
    Util.hideSpinner(spinner);
    return;
  }
  if (allOrdersResult.status === 500) {
    Util.showSnackbar(snackbar, '#ff6666', ordersByUser.error);
    Util.hideSpinner(spinner);
    return;
  }
  Util.hideSpinner(spinner);
  const { orders, totalOrders } = allOrders;
  const totalPending = orders.filter(order => order.status === 'pending');
  const totalIntransit = orders.filter(order => order.status === 'intransit');
  const totalDelivered = orders.filter(order => order.status === 'delivered');
  const totalCancelled = orders.filter(order => order.status === 'cancelled');
  let deliveredRevenue = totalDelivered.reduce((total, order) => {
    return (total += order.price);
  }, 0);
  let totalRevenue = orders.reduce((total, order) => {
    return (total += order.price);
  }, 0);
  deliveredRevenue = deliveredRevenue.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN'
  });
  totalRevenue = totalRevenue.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN'
  });

  Util.updateElement(deliveredRevenues, deliveredRevenue);
  Util.updateElement(totalRevenues, totalRevenue);
  Util.updateElement(totalOrdereds, totalOrders);
  Util.updateElement(pendings, totalPending.length);
  Util.updateElement(intransits, totalIntransit.length);
  Util.updateElement(delivereds, totalDelivered.length);
  Util.updateElement(cancelleds, totalCancelled.length);

  for (const order of orders) {
    const price = order.price.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN'
    });
    const orderNode = document.createElement('li');
    const disabled = order.status === 'cancelled' || order.status === 'delivered' ? 'disabled' : '';
    orderNode.innerHTML = `
			<div class="accordion accordion-header ${order.status}">
				<h5 class="order-description">${order.description}</h5>
				<span> <i class="fas fa-chevron-down open"></i> </span>
			</div>

			<div class="accordion-content admin-accordion-content">
				<div class="info-card admin-info-card">
					<h4 class="heading ${order.status}-heading">Sender</h4>
					<p class="order-section-detail admin-section-detail">
						Sender ID <span class="price">#${order.userid}</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Pickup Location <span class="price">${order.location}</span>
					</p>
					<br />
					<h4 class="heading ${order.status}-heading">Receiver</h4>
					<p class="order-section-detail admin-section-detail">
						Name <span class="price">${order.receiver_name}</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Destination
						<span class="price">
							${order.destination}
						</span>
          </p>
          <p class="order-section-detail admin-section-detail">
            Present Location 
            <span class="price">
              ${order.location}
            </span>
          </p>
					<br />
					<h4 class="heading ${order.status}-heading">Order Info</h4>
					<p class="order-section-detail admin-section-detail">
						Order ID
						<span class="price">
							#${order.id}
						</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Order Date 
						<span class="price date">
							${moment(order.created_on).format('llll')}
						</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Parcel Weight 
						<span class="price">
							${order.weight}kg
						</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Delivery Distance 
						<span class="price">
							${order.distance}km
						</span>
          </p>
					<p class="order-section-detail admin-section-detail">
						Delivery Price 
						<span class="price">
							${price}
						</span>
					</p>
					<p class="order-section-detail admin-section-detail">
						Status
						<span class="status status-${order.status}">
							${order.status}
						</span>
					</p>
					<p class="order-section-detail action-btn">
						<button
							id="location-${order.id}"
							class="btn success action-footer-btn action-btn-location"
							${disabled}
						>
							Update Location
						</button>
						<button
							id="status-${order.id}"
							class="btn info action-footer-btn action-btn-status"
							${disabled}
						>
							Update Status
						</button>
					</p>
				</div>
			</div>

			<div class="modal action-modal change-address-modal">
				<div class="modal-content action-modal-content">
					<div class="modal-header action-modal-header change-address-header">
						<h4>Change Present Location</h4>
					</div>
					<div class="modal-body action-modal-body">
						<form class="change-address-form update-location-form">
							<input
								type="text"
								id="change-location-${order.id}"
								placeholder="Enter the new location"
								required
								autofocus
							/>
							<div class="btn-group">
								<button
									type="button"
									class="btn danger action-footer-btn close-change-location"
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

			<div class="modal action-modal update-status-modal">
				<div class="modal-content action-modal-content">
					<div class="modal-header action-modal-header update-status-header">
						<h4>Update Order Status</h4>
					</div>
					<div class="modal-body action-modal-body">
						<form class="update-status-form">
							<span class="status-message">
								Please make a selection
							</span>
							<div class="status-input">
								<div class="status-input-item">
									<input
										type="radio"
										id="status-pending-${order.id}"
										name="status"
										value="pending"
									/>
									<label for="status-pending-${order.id}">Pending</label>
								</div>
								<div class="status-input-item">
									<input
										type="radio"
										id="status-intransit-${order.id}"
										name="status"
										value="intransit"
									/>
									<label for="status-intransit-${order.id}">Intransit</label>
								</div>
								<div class="status-input-item">
									<input
										type="radio"
										id="status-delivered-${order.id}"
										name="status"
										value="delivered"
									/>
									<label for="status-delivered-${order.id}">Delivered</label>
								</div>
							</div>
							<div class="btn-group">
								<button
									type="button"
									class="btn danger action-footer-btn close-update-status"
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
		`;
    orderList.appendChild(orderNode);
  }
  adminInit();
};

const adminInit = () => {
  const accordion = document.querySelectorAll('.accordion');
  const updateLocationBtns = document.querySelectorAll('.action-btn-location');
  const updateStatusForms = document.querySelectorAll('.update-status-form');
  const updateStatusBtns = document.querySelectorAll('.action-btn-status');
  const updateStatusModals = document.querySelectorAll('.update-status-modal');
  const updateLocationForms = document.querySelectorAll('.update-location-form');
  const updateLocationModals = document.querySelectorAll('.change-address-modal');
  const closeUpdateLocationBtns = document.querySelectorAll('.close-change-location');
  const closeUpdateStatusBtns = document.querySelectorAll('.close-update-status');
  openAccordion(accordion);
  updateLocationModal(updateLocationBtns, updateLocationModals);
  Util.hideActionModals(closeUpdateLocationBtns, updateLocationModals);
  Util.showActionModals(updateStatusBtns, updateStatusModals);
  Util.hideActionModals(closeUpdateStatusBtns, updateStatusModals);
  submitLocationUpdate(updateLocationForms, updateLocationModals);
  submitStatusUpdate(updateStatusForms, updateStatusModals);
};
Util.verifyAdmin();
Util.showSpinner(spinner);
Util.logoutUser(logout);
loadAllOrders();
