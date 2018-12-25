/* eslint-disable */

class Util {
  static showSpinner(element) {
    element.style.visibility = 'visible';
  }

  static hideSpinner(element) {
    element.style.visibility = 'hidden';
  }

  static isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  static validatePwd(pwd) {
    const validPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{6,}$/;
    return pwd.match(validPwd);
  }

  static validPassword(pword, passwordMsg) {
    pword.addEventListener('keyup', e =>
      !Util.validatePwd(e.target.value)
        ? (pword.style.border = '2px solid red')
        : ((pword.style.border = '2px solid green'), (passwordMsg.style.display = 'none'))
    );
  }

  static showElement(element) {
    element.style.display = 'block';
  }

  static hideElement(element) {
    element.style.display = 'none';
  }

  static updateElement(element, content) {
    element.textContent = content;
  }

  static createAlert(element, color, textContent) {
    element.classList.add('alert');
    element.style.backgroundColor = color;
    element.textContent = textContent;
  }

  static showSnackbar(element, color, textContent) {
    element.className = 'show';
    element.style.backgroundColor = color;
    element.textContent = textContent;
    setTimeout(function() {
      element.className = element.className.replace('show', '');
    }, 5500);
  }

  static logoutUser(elements) {
    elements.forEach(element =>
      element.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      })
    );
  }

  static async doFetch(input, settings = {}) {
    const response = await fetch(input, {
      headers: {
        Accept: 'application/json, text/plain, */**',
        'Content-Type': 'application/json'
      },
      ...settings
    });
    return response;
  }

  static async doFetchWithToken(input, token, settings = {}) {
    const response = await fetch(input, {
      headers: {
        Accept: 'application/json, text/plain, */**',
        'Content-Type': 'application/json',
        Authorization: token
      },
      ...settings
    });
    return response;
  }

  static addMaker(props) {
    const marker = new google.maps.Marker({
      position: props.coords,
      map: props.map,
      icon: props.icon
    });
  }

  static getGeocode(geocodeData) {
    const geocoder = new google.maps.Geocoder();
    const { address, icon, map } = geocodeData;
    geocoder.geocode({ address }, function(results, status) {
      if (status === 'OK') {
        const coords = results[0].geometry.location;
        Util.addMaker({ coords, map, icon });
      }
    });
  }

  static loadMap(mapData) {
    const { pickup, destination, pickupIcon, destinationIcon, element } = mapData;
    const options = {
      zoom: 5,
      center: { lat: 9.081999, lng: 8.675277 }
    };
    const map = new google.maps.Map(element, options);
    const pickupGeocode = { address: pickup, icon: pickupIcon, map };
    const destinationGeocode = {
      address: destination,
      icon: destinationIcon,
      map
    };
    Util.getGeocode(pickupGeocode);
    Util.getGeocode(destinationGeocode);
  }

  static verifyUser(element) {
    try {
      const token = localStorage.getItem('user');
      const decoded = jwt_decode(token);
      if (!decoded || decoded.usertype !== 'user') {
        window.location.href = 'login.html';
      }
      if (element !== null) {
        Util.updateElement(element, decoded.firstname);
      }
    } catch (error) {
      window.location.href = 'login.html';
    }
  }

  static verifyAdmin() {
    try {
      const token = localStorage.getItem('user');
      const decoded = jwt_decode(token);
      if (!decoded) {
        window.location.href = 'login.html';
      }
      if (decoded.usertype !== 'admin') {
        window.location.href = 'user.html';
      }
    } catch (error) {
      window.location.href = 'user.html';
    }
  }

  static redirectLoggedInUser() {
    const token = localStorage.getItem('user');
    if (!token) {
      return;
    }
    const decoded = jwt_decode(token);
    if (decoded.usertype === 'admin') {
      window.location.href = 'admin.html';
      return;
    } else {
      window.location.href = 'user.html';
      return;
    }
  }

  static placesAutocomplete(element) {
    const addressText = new google.maps.places.Autocomplete(element);
    google.maps.event.addListener(addressText, 'place_changed', function() {
      const address = addressText.getPlace();
      element.value = address.formatted_address;
    });
  }

  static showActionModals(elementBtns, elementModals) {
    elementBtns.forEach((elementBtn, i) => {
      elementBtn.addEventListener('click', e => {
        Util.showElement(elementModals[i]);
      });
    });
  }

  static hideActionModals(elementBtns, elementModals) {
    elementBtns.forEach((elementBtn, i) => {
      elementBtn.addEventListener('click', e => {
        Util.hideElement(elementModals[i]);
      });
    });
  }

  static callDistanceMatrix(service, data) {
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(data, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
}
