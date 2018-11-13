const logout = document.querySelectorAll('.logout');
const orderBtn = document.querySelectorAll('.order-btn');

if (document.readyState === 'loading' || document.readyState === 'complete') {
	logout.forEach(das => (das.style.display = 'none'));
	orderBtn.forEach(item => (item.style.display = 'none'));
}
