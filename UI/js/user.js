const accordion = document.querySelectorAll('.accordion');
const orderBtn = document.querySelectorAll('.order-btn');
const signUpBtn = document.querySelectorAll('.signup');
const login = document.querySelectorAll('.login');

for (let i = 0; i < accordion.length; i++) {
	accordion[i].addEventListener('click', function() {
		this.classList.toggle('active');
		var panel = this.nextElementSibling;
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
	orderBtn.forEach(order =>
		order.addEventListener('click', () => {
			console.log('Order button');
		})
	);
};

userInit();
