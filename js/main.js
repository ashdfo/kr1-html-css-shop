// =========================================
// 1. КОРЗИНА (localStorage)
// =========================================

// Получить корзину
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Сохранить корзину и обновить счетчик
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Обновить цифру на иконке корзины
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const cart = getCart();
        countEl.textContent = cart.length;
        countEl.dataset.count = cart.length;
    }
}

// Добавить товар в корзину
function addToCart(productId) {
    const cart = getCart();
    if (!cart.includes(productId)) {
        cart.push(productId);
        saveCart(cart);
        alert('Товар добавлен в корзину!');
    } else {
        alert('Этот товар уже в корзине.');
    }
}

// Удалить товар из корзины (пригодится на странице cart.html)
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(id => id !== productId);
    saveCart(cart);
}


// =========================================
// 2. КНОПКА «НАВЕРХ» (ВСЕГДА ВИДИМА)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.getElementById('scroll-top');

    if (!scrollTopBtn) return;

    // Плавное возвращение наверх
    scrollTopBtn.addEventListener('click', (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// =========================================
// 3. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });
});


// =========================================
// 4. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Получаем текущий путь (например, /delivery.html)
    const currentPath = window.location.pathname;

    // Получаем все ссылки в навигации (и в шапке, и в выпадающем меню)
    const navLinks = document.querySelectorAll('.navigation a, .nav-dropdown__menu a');

    navLinks.forEach(link => {
        // Получаем путь из ссылки
        const linkPath = link.getAttribute('href');

        // Если ссылка ведет на текущую страницу (и это не пустая ссылка #)
        if (linkPath && linkPath !== '#' && currentPath.includes(linkPath)) {

            // Добавляем класс для подсветки
            link.classList.add('nav-link--active');

            // Если это ссылка внутри выпадающего меню, подсвечиваем и родителя "Каталог"
            if (link.closest('.nav-dropdown__menu')) {
                const dropdownToggle = document.querySelector('.nav-dropdown__toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('nav-link--active');
                }
            }
        }
    });
});


// =========================================
// 5. СЧЕТЧИК КОРЗИНЫ ПРИ ЗАГРУЗКЕ
// =========================================

document.addEventListener('DOMContentLoaded', updateCartCount);

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function addToFavorites(productId) {
    const favs = getFavorites();
    if (!favs.includes(productId)) {
        favs.push(productId);
        saveFavorites(favs);
        alert('Товар добавлен в избранное!');
    } else {
        alert('Этот товар уже в избранном.');
    }
}