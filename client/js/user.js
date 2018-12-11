const accordion = document.querySelectorAll(".accordion");
const signUpBtn = document.querySelectorAll(".signup");
const login = document.querySelectorAll(".login");
const logout = document.querySelectorAll(".logout");
const destination = document.querySelectorAll(".btn-destination");
const cancel = document.querySelectorAll(".btn-cancel");
const cancelModal = document.querySelector("#cancel-modal");
const modalBtn = document.querySelector("#btn-cancel");
const dismiss = document.querySelector("#dismiss");

const showModal = () => {
  cancelModal.style.display = "block";
};

const hideModal = e => {
  cancelModal.style.display = "none";
};

(function filterFunction() {
  const searchFilter = document.querySelector("#search-filter");
  function filterOrders() {
    const selectedOptionText =
      searchFilter.options[searchFilter.selectedIndex].text;
    const selectedOptionValue = searchFilter.options[
      searchFilter.selectedIndex
    ].value.toLowerCase();
    const orderList = document.querySelector("#order-list");
    const order = orderList.getElementsByTagName("li");
    const numberOfOrders = order.length;

    for (let i = 0; i < numberOfOrders; i++) {
      const status = order[i].querySelectorAll(".status")[0];
      const date = order[i].querySelectorAll(".date")[0];
      const statusText = status.textContent.toLowerCase();
      const dateText = date.textContent.toLowerCase();

      statusText.indexOf(selectedOptionValue) > -1 ||
      dateText.indexOf(selectedOptionValue) > -1
        ? (order[i].style.display = "")
        : (order[i].style.display = "none");
    }
  }

  searchFilter.addEventListener("change", filterOrders);
})();

(function openAccordion() {
  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function() {
      const panel = document.querySelectorAll(".accordion-content");
      const header = document.querySelectorAll(".accordion-header");
      this.querySelector(".open").classList.toggle("rotate");

      panel[i].style.maxHeight
        ? ((panel[i].style.maxHeight = null),
          (header[i].style.backgroundColor = ""))
        : ((panel[i].style.maxHeight = panel[i].scrollHeight + "px"),
          (header[i].style.backgroundColor = "rgba(153, 153, 153, 0.2)"));
    });
  }
})();

function initMap() {
  const bounds = new google.maps.LatLngBounds();
  let markersArray = [];

  const origin2 = "Lagos, Nigeria";
  const destinationB = "Enugu, Nigeria";

  const destinationIcon =
    "https://chart.googleapis.com/chart?" +
    "chst=d_map_pin_letter&chld=D|FF0000|000000";
  const originIcon =
    "https://chart.googleapis.com/chart?" +
    "chst=d_map_pin_letter&chld=P|FFFF00|000000";
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.53, lng: 9.4 },
    zoom: 10
  });
  const geocoder = new google.maps.Geocoder();

  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin2],
      destinations: [destinationB],
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    },
    function(response, status) {
      if (status !== "OK") {
        alert("Error was: " + status);
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        console.log(response.rows[0].elements[0].distance.value);
        console.log(response.rows[0].elements[0].duration.value);
        // deleteMarkers(markersArray);

        const showGeocodedAddressOnMap = function(asDestination) {
          let icon = asDestination ? destinationIcon : originIcon;
          return function(results, status) {
            if (status === "OK") {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(
                new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  icon: icon
                })
              );
            } else {
              alert("Geocode was not successful due to: " + status);
            }
          };
        };

        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode(
            { address: originList[i] },
            showGeocodedAddressOnMap(false)
          );
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode(
              { address: destinationList[j] },
              showGeocodedAddressOnMap(true)
            );
          }
        }
      }
    }
  );
}

modalBtn.addEventListener("click", showModal);
dismiss.addEventListener("click", hideModal);

const userInit = () => {
  signUpBtn.forEach(item => (item.style.display = "none"));
  login.forEach(item => (item.style.display = "none"));

  logout.forEach(item =>
    item.addEventListener("click", () => {
      window.location.href = "index.html";
    })
  );
};

userInit();
