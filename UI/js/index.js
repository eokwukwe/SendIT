const logout = document.querySelectorAll('.logout');
if (document.readyState === 'loading' || document.readyState === 'complete') {
	logout.forEach(das => (das.style.display = 'none'));
}
