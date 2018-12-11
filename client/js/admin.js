const login = document.querySelectorAll('.login');
const signUpAdm = document.querySelectorAll('.signup');
const logout = document.querySelectorAll('.logout');
const orderBtn = document.querySelectorAll('.order-btn');

const accordion = document.querySelectorAll('.accordion');

for (let i = 0; i < accordion.length; i++) {
	accordion[i].addEventListener('click', function() {
		this.classList.toggle('active');
		this.querySelector('.icon').classList.toggle('rotate');

		const panel = this.nextElementSibling;
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		} else {
			panel.style.maxHeight = panel.scrollHeight + 'px';
		}
	});
}

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
