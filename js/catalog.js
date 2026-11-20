
document.addEventListener('DOMContentLoaded', () => {
    // Элементы страницы
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');

    const categoryInputs = document.querySelectorAll(
        'input[name="category"]'
    );

    const priceFrom = document.getElementById('price-from');
    const priceTo = document.getElementById('price-to');

    const newInput = document.querySelector('input[name="new"]');
    const uniqueInput = document.querySelector('input[name="unique"]');

    const sortSelect = document.getElementById('sort-products');
    const resetButton = document.querySelector('.filters-reset');

    // Проверяем наличие товаров
    if (!productsGrid || !window.products) {
        console.error('Не удалось загрузить товары');
        return;
    }

    // Читаем категорию из адресной строки
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get('category');

    if (selectedCategory) {
        const categoryInput = document.querySelector(
            `input[name="category"][value="${selectedCategory}"]`
        );

        if (categoryInput) {
            categoryInput.checked = true;
        }
    }

    // =====================================
    // ИЗБРАННОЕ
    // =====================================

    function getFavoriteIds() {
        if (typeof getFavorites === 'function') {
            return getFavorites().map(Number);
        }

        return [];
    }

    function isFavorite(productId) {
        return getFavoriteIds().includes(Number(productId));
    }

    function toggleFavorite(productId) {
        if (
            typeof getFavorites !== 'function' ||
            typeof saveFavorites !== 'function'
        ) {
            console.error('Функции избранного не найдены в main.js');
            return;
        }

        let favorites = getFavorites().map(Number);

        if (favorites.includes(Number(productId))) {
            favorites = favorites.filter(
                id => id !== Number(productId)
            );
        } else {
            favorites.push(Number(productId));
        }

        saveFavorites(favorites);

        // Обновляем внешний вид кнопки
        const button = productsGrid.querySelector(
            `.favorite-toggle[data-product-id="${productId}"]`
        );

        if (button) {
            const active = favorites.includes(Number(productId));

            button.classList.toggle('is-favorite', active);
            button.setAttribute('aria-pressed', String(active));

            button.setAttribute(
                'aria-label',
                active ? 'Убрать из избранного' : 'Добавить в избранное'
            );
        }
    }

    // Форматирование цены
    function formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    // Получаем название состояния
    function getCondition(condition) {
        const conditions = {
            excellent: 'Отличное состояние',
            good: 'Хорошее состояние',
            has_issues: 'Есть особенности'
        };

        return conditions[condition] || '';
    }

    // =====================================
    // СОЗДАНИЕ КАРТОЧКИ ТОВАРА
    // =====================================

    function createProductCard(product) {
        const favorite = isFavorite(product.id);

        return `
            <article class="product-card">

                <a href="product.html?id=${product.id}" class="product-card__link">

                    <div class="product-card__image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                        >

                        ${product.isNew
                            ? '<span class="product-card__badge">Новинка</span>'
                            : ''
                        }

                    </div>

                    <div class="product-card__info">
                        <h3 class="product-card__name">${product.name}</h3>
                        <p class="product-card__price">${formatPrice(product.price)}</p>
                    </div>

                </a>

                <button
                    type="button"
                    class="favorite-toggle ${favorite ? 'is-favorite' : ''}"
                    data-product-id="${product.id}"
                    aria-label="${favorite ? 'Убрать из избранного' : 'Добавить в избранное'}"
                    aria-pressed="${favorite}"
                    title="${favorite ? 'Убрать из избранного' : 'В избранное'}"
                >
                    <svg class="favorite-toggle__icon" viewBox="0 0 24 24">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>
</svg>
                </button>

            </article>
        `;
    }

    // =====================================
    // ФИЛЬТРАЦИЯ И СОРТИРОВКА
    // =====================================

    function getFilteredProducts() {
        let filteredProducts = [...window.products];

        // Категория
        const activeCategory = document.querySelector(
            'input[name="category"]:checked'
        )?.value || 'all';

        if (activeCategory !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category === activeCategory
            );
        }

        // Минимальная цена
        if (priceFrom.value !== '') {
            filteredProducts = filteredProducts.filter(
                product => product.price >= Number(priceFrom.value)
            );
        }

        // Максимальная цена
        if (priceTo.value !== '') {
            filteredProducts = filteredProducts.filter(
                product => product.price <= Number(priceTo.value)
            );
        }

        // Новинки
        if (newInput.checked) {
            filteredProducts = filteredProducts.filter(
                product => product.isNew
            );
        }

        // Единственные экземпляры
        if (uniqueInput.checked) {
            filteredProducts = filteredProducts.filter(
                product => product.isUnique
            );
        }

        // Сортировка
        switch (sortSelect.value) {
            case 'price-asc':
                filteredProducts.sort(
                    (a, b) => a.price - b.price
                );
                break;

            case 'price-desc':
                filteredProducts.sort(
                    (a, b) => b.price - a.price
                );
                break;

            case 'newest':
                filteredProducts.sort(
                    (a, b) => b.id - a.id
                );
                break;
        }

        return filteredProducts;
    }

    // =====================================
    // ОТРИСОВКА КАТАЛОГА
    // =====================================

    function renderProducts() {
        const filteredProducts = getFilteredProducts();

        productsCount.textContent = filteredProducts.length;

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="catalog-empty">
                    <h2>Пока ничего не нашлось.</h2>
                    <p>Попробуй изменить параметры поиска.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filteredProducts
            .map(createProductCard)
            .join('');
    }

    // =====================================
    // ОБРАБОТКА КНОПОК ИЗБРАННОГО
    // =====================================

    productsGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.favorite-toggle');

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const productId = Number(button.dataset.productId);

        toggleFavorite(productId);
    });

    // Обновление каталога при изменении фильтров
    categoryInputs.forEach(input => {
        input.addEventListener('change', renderProducts);
    });

    priceFrom.addEventListener('input', renderProducts);
    priceTo.addEventListener('input', renderProducts);

    newInput.addEventListener('change', renderProducts);
    uniqueInput.addEventListener('change', renderProducts);

    sortSelect.addEventListener('change', renderProducts);

    // Сброс фильтров
    resetButton.addEventListener('click', () => {
        document.querySelector(
            'input[name="category"][value="all"]'
        ).checked = true;

        priceFrom.value = '';
        priceTo.value = '';

        newInput.checked = false;
        uniqueInput.checked = false;

        sortSelect.value = 'newest';

        renderProducts();
    });

    // Первый вывод товаров
    renderProducts();
});


// =====================================
// ПОДСВЕТКА НАВИГАЦИИ
// =====================================

document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category');

    const navLinks = document.querySelectorAll('.navigation a');

    const allLink = Array.from(navLinks).find(link =>
        link.getAttribute('href') === 'catalog.html'
    );

    const resetHighlight = () => {
        navLinks.forEach(link => {
            link.style.color = '';
            link.style.borderBottom = 'none';
        });
    };

    const highlightLink = (link) => {
        if (link) {
            link.style.color = 'var(--brick)';
            link.style.borderBottom = '2px solid var(--brick)';
        }
    };

    if (currentCategory) {

        const activeLink = Array.from(navLinks).find(link =>
            link.href.includes(`category=${currentCategory}`)
        );

        resetHighlight();
        highlightLink(activeLink);

        const h1 = document.querySelector('.catalog-heading h1');

        const categoryNames = {
            clothing: 'Одежда',
            interior: 'Для дома',
            accessories: 'Аксессуары'
        };

        if (h1 && categoryNames[currentCategory]) {
            h1.innerHTML = `${categoryNames[currentCategory]}<span>.</span>`;
        }

    } else {

        resetHighlight();
        highlightLink(allLink);

    }

});
