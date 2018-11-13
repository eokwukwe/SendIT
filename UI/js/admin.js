const login = document.querySelectorAll('.login');
const signUpAdm = document.querySelectorAll('.signup');
const logout = document.querySelectorAll('.logout');
const orderBtn = document.querySelectorAll('.order-btn');

const adminInit = () => {
	signUpAdm.forEach(das => (das.style.display = 'none'));
	orderBtn.forEach(das => (das.style.display = 'none'));
	login.forEach(das => (das.style.display = 'none'));

	logout.forEach(item =>
		item.addEventListener('click', () => {
			window.location.href = 'index.html';
		})
	);
};

adminInit();
