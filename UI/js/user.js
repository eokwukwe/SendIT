const accordion = document.querySelectorAll('.accordion');
const signUpBtn = document.querySelectorAll('.signup');
const login = document.querySelectorAll('.login');
const logout = document.querySelectorAll('.logout');

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

const userInit = () => {
	signUpBtn.forEach(item => (item.style.display = 'none'));
	login.forEach(item => (item.style.display = 'none'));

	logout.forEach(item =>
		item.addEventListener('click', () => {
			window.location.href = 'index.html';
		})
	);
};

userInit();
