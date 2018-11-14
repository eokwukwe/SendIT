const signUpBtn = document.querySelectorAll('.signup');
const login = document.querySelectorAll('.login');
const logout = document.querySelectorAll('.logout');

signUpBtn.forEach(item => (item.style.display = 'none'));
login.forEach(item => (item.style.display = 'none'));

logout.forEach(item =>
	item.addEventListener('click', () => {
		window.location.href = 'index.html';
	})
);

let currentTab = 0;
showTab(currentTab);

function showTab(n) {
	const x = document.querySelectorAll('.tab');
	x[n].style.display = 'block';

	if (n == 0) {
		document.querySelector('#prevBtn').style.display = 'none';
	} else {
		document.querySelector('#prevBtn').style.display = 'inline';
	}
	if (n == x.length - 1) {
		document.querySelector('#nextBtn').innerHTML = 'Submit';
	} else {
		document.querySelector('#nextBtn').innerHTML = 'Next';
	}
	fixStepIndicator(n);
}

function nextPrev(n) {
	const x = document.querySelectorAll('.tab');
	if (n == 1 && !validateForm()) return false;
	x[currentTab].style.display = 'none';
	currentTab = currentTab + n;
	if (currentTab >= x.length) {
		document.querySelector('#orderForm').submit();
		window.location.href = 'user.html';
		return false;
	}
	showTab(currentTab);
}

function validateForm() {
	let x,
		y,
		i,
		valid = true;
	x = document.querySelectorAll('.tab');
	y = x[currentTab].querySelectorAll('input');

	for (i = 0; i < y.length; i++) {
		if (y[i].value == '') {
			y[i].className += ' invalid';
			valid = false;
		}
	}

	if (valid) {
		document.querySelectorAll('.step')[currentTab].className += ' finish';
	}
	return valid;
}

function fixStepIndicator(n) {
	let i,
		x = document.querySelectorAll('.step');
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(' focused', '');
	}
	x[n].className += ' focused';
}
