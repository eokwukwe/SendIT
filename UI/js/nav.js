const sideBarIcon = document.querySelector('.sidebar-icon');
const closeBtn = document.querySelector('.btn-close-sidenav');
const signUp = document.querySelectorAll('.signup');
const sideNavItem = document.querySelectorAll('.side-nav-item');

sideBarIcon.addEventListener('click', openSlideMenu);
closeBtn.addEventListener('click', closeSlideMenu);

function openSlideMenu() {
	var x = document.querySelector('#side-menu');
	if (x.style.width == '250px') {
		x.style.width = '0';
	} else {
		x.style.width = '250px';
	}
}

function closeSlideMenu() {
	document.querySelector('#side-menu').style.width = '0';
}

sideNavItem.forEach(item =>
	item.addEventListener('click', () => {
		closeSlideMenu();
	})
);

signUp.forEach(item =>
	item.addEventListener('click', () => {
		closeSlideMenu();
	})
);
