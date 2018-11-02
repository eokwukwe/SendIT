const adminInit = () => {
  signUp.forEach(das => (das.style.display = "none"));
  orderBtnModal.forEach(das => (das.style.display = "none"));
  login.forEach(das => (das.style.display = "none"));
};

adminInit();
