const formValues = document.forms["signup-form"],
  submit = document.querySelector("#signup-submit"),
  firstname = document.querySelector("#firstname"),
  lastname = document.querySelector("#lastname"),
  email = document.querySelector("#email"),
  pwd = document.querySelector("#pwd"),
  phoneNo = document.querySelector("#phone"),
  pwdLabel = document.querySelector(".checkPasswords"),
  signupMessage = document.querySelector(".signup-message"),
  conPwd = document.querySelector("#confirmpwd");

const checkPasswordEquality = () => {
  conPwd.addEventListener("keyup", e => {
    if (e.target.value !== pwd.value) {
      return (pwdLabel.style.display = "block");
    }
    return (pwdLabel.style.display = "none");
  });
};

const validatePwd = pwd => {
  const validPwd = /^[0-9a-zA-Z\s #$&()%;,_@+|?!\.\-]+$/;
  if (pwd.length >= 6 && !!pwd.match(validPwd)) {
    return true;
  }
  return false;
};

const validatePhoneNo = phone => {
  const validPhoneChar = /^[0][7-9]{1}[0-1]{1}[\s]?[0-9][-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/;
  return phone.trim().match(validPhoneChar);
};

const validateString = string => {
  if (typeof string !== "string") return false;
  if (string.length < 2 || string.length > 25) return false;
  const validString = /^[a-zA-Z-']+$/;
  return string.trim().match(validString);
};

const checkValidEmail = email => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = reg.test(String(email).toLowerCase());
  if (!isValid) return false;
  return true;
};

const validateFormData = (fname, lname, email, phone, pwd) => {
  if (fname === "" || !validateString(fname)) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent = "no name or invalid firstname entered";
    return false;
  }

  if (lname === "" || !validateString(lname)) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent = "no name or invalid lastname entered";
    return false;
  }

  if (email === "" || !checkValidEmail(email)) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent = "invalid email";
    return false;
  }
  if (phone === "" || !validatePhoneNo(phone)) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent = "invalid phone number";
    return false;
  }
  if (pwd === "" || !validatePwd(pwd)) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent =
      "invalid password. Password must be aleast 6 characters";
    return false;
  }

  signupMessage.style.display = "none";
  return true;
};

const signUpSubmit = e => {
  e.preventDefault();

  const fname = firstname.value,
    lname = lastname.value,
    emailAdd = email.value,
    phone = phoneNo.value,
    passwd = pwd.value,
    cpwd = conPwd.value;

  if (!validateFormData(fname, lname, emailAdd, phone, passwd)) {
    return;
  }

  if (passwd.length != cpwd.length) {
    signupMessage.style.display = "block";
    signupMessage.style.backgroundColor = "red";
    signupMessage.textContent = "passwords do not match";
    return;
  }
  console.log(fname, lname, emailAdd, phone, passwd);
  window.location.href = "user.html";
};

const signupInit = () => {
  logout.forEach(das => (das.style.display = "none"));
  orderBtnModal.forEach(das => (das.style.display = "none"));
  checkPasswordEquality();
  formValues.addEventListener("submit", signUpSubmit);
};

signupInit();
