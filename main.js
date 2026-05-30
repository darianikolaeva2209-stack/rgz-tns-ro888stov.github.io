// Тоггл меню
function toggleMenu() {
    const panel = document.getElementById('menu-panel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

// Закрытие меню при клике вне его 
document.addEventListener('click', function (event) {
    const panel = document.getElementById('menu-panel');
    const menuIcon = document.getElementById('menu-icon');

    if (panel && panel.classList.contains('open')) {
        if (!panel.contains(event.target) && event.target !== menuIcon) {
            panel.classList.remove('open');
        }
    }
});

// Плавная прокрутка наверх
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Подсветка текущей страницы в меню
function setActiveMenu() {
    let path = window.location.pathname;
    let parts = path.split('/');
    let currentPage = parts[parts.length - 1];

    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }

    let links = document.querySelectorAll('.menu-panel ul li a');
    for (let i = 0; i < links.length; i++) {
        let href = links[i].getAttribute('href');
        let cleanHref = href.split('#')[0].split('?')[0];
        let hrefParts = cleanHref.split('/');
        let hrefFile = hrefParts[hrefParts.length - 1];

        if (hrefFile === '' || hrefFile === '/') {
            hrefFile = 'index.html';
        }

        if (hrefFile === currentPage) {
            links[i].classList.add('active');
            break;
        }
    }
}

// Обработчик для кнопки наверх
const upButton = document.getElementById('up-button');
if (upButton) {
    upButton.addEventListener('click', scrollToTop);
}

// Обработчик для иконки меню
const menuIcon = document.getElementById('menu-icon');
if (menuIcon) {
    menuIcon.addEventListener('click', toggleMenu);
}

// Закрытие меню по клавише Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const panel = document.getElementById('menu-panel');
        if (panel && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    }
});

// Поддержка доступности: Enter на иконке меню
if (menuIcon) {
    menuIcon.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            toggleMenu();
        }
    });
}

// Запускаем подсветку меню при загрузке
window.addEventListener('load', function () {
    setActiveMenu();
});