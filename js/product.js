// Получаем элементы страницы
const productImage = document.getElementById('product-image');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productSpecs = document.getElementById('product-specs');
const productDescription = document.getElementById('product-description');
const categoryBreadcrumb = document.getElementById('product-category-breadcrumb');

// Получаем ID товара из адресной строки
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));

// Ищем товар в массиве
const product = window.products.find(item => item.id === productId);

// Словари для красивого вывода
const categoryNames = { clothing: 'Одежда', interior: 'Для дома', accessories: 'Аксессуары' };
const conditionNames = { excellent: 'отличное', good: 'хорошее', satisfactory: 'удовлетворительное' };

// Если товар найден
if (product) {
    document.title = `${product.name} — Пуговица.`;

    // Заполняем основную информацию
    productImage.src = product.image;
    productImage.alt = product.name;
    productTitle.textContent = product.name;
    productPrice.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    categoryBreadcrumb.textContent = categoryNames[product.category] || 'Каталог';

    // Заполняем характеристики
    const specs = [
        ['Категория', categoryNames[product.category]],
        ['Состояние', conditionNames[product.condition] || product.condition],
        ['Период', product.period],
        ['Материал', product.material],
        ['Цвет', product.color],
        ['Размер', product.size !== '-' ? product.size : null]
    ];

    productSpecs.innerHTML = '';
    specs.forEach(([name, value]) => {
        if (value) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${name}</span><span>${value}</span>`;
            productSpecs.appendChild(li);
        }
    });

    // Описание
    productDescription.textContent = product.description || 'У каждой находки своя история. Подробности о товаре можно уточнить у нас.';

    // Кнопка "Назад в каталог" с учетом категории
    const backLink = document.getElementById('back-to-catalog');
    if (backLink && product.category) {
        backLink.href = `catalog.html?category=${product.category}`;
    }

    // Добавление в корзину (вызываем функцию из main.js)
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
        });
    }

} else {
    // Если товар не найден
    productTitle.textContent = 'Кажется, этой находки нет';
    productPrice.textContent = '';
    productDescription.textContent = 'Возможно, товар больше не доступен или ссылка устарела. Загляните в каталог — там есть другие интересные вещи.';
    productImage.style.display = 'none';
    productSpecs.style.display = 'none';
    categoryBreadcrumb.textContent = 'Товар не найден';

    // Скрываем кнопку добавления, если товара нет
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) addToCartBtn.style.display = 'none';
}