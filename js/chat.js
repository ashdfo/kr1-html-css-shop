
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chat-toggle');
    const close = document.getElementById('chat-close');
    const windowChat = document.getElementById('chat-window');
    const messages = document.getElementById('chat-messages');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const quickQuestions = document.getElementById('chat-quick-questions');

    if (!toggle || !close || !windowChat || !messages || !form || !input) {
        return;
    }

    // Открытие и закрытие чата
    toggle.addEventListener('click', () => {
        windowChat.classList.toggle('is-open');
    });

    close.addEventListener('click', () => {
        windowChat.classList.remove('is-open');
    });

    // Добавление сообщения
    function addMessage(text, type) {
        const message = document.createElement('div');
        message.className = `chat-message chat-message--${type}`;
        message.textContent = text;

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    // База ответов консультанта
    function getBotResponse(question) {
        const q = question.toLowerCase().replaceAll('ё', 'е');

        if (
            q.includes('привет') ||
            q.includes('здравств') ||
            q.includes('добрый день')
        ) {
            return 'Здравствуйте! Рады видеть вас в «Пуговице». Чем могу помочь?';
        }

        if (
            q.includes('заказ') ||
            q.includes('купить') ||
            q.includes('оформ')
        ) {
            return 'Чтобы оформить заказ, добавьте понравившиеся находки в корзину и нажмите «Оформить заказ». Заполните форму, и магазин сможет связаться с вами. Сейчас это демонстрационная функция сайта.';
        }

        if (
            q.includes('достав') ||
            q.includes('почт') ||
            q.includes('получить')
        ) {
            return 'Информацию о способах и условиях доставки вы найдёте на странице «Доставка и оплата». Там собраны основные сведения для покупателей.';
        }

        if (
            q.includes('оплат') ||
            q.includes('платеж') ||
            q.includes('деньг')
        ) {
            return 'Подробности об оплате собраны в разделе «Доставка и оплата». Обратите внимание: оформление заказа на демонстрационной версии сайта пока не связано с реальной оплатой.';
        }

        if (
            q.includes('возврат') ||
            q.includes('вернуть') ||
            q.includes('обмен')
        ) {
            return 'Условия возврата и обмена можно посмотреть на странице «Доставка и оплата». Если остались вопросы, свяжитесь с магазином по контактам на соответствующей странице.';
        }

        if (
            q.includes('каталог') ||
            q.includes('товар') ||
            q.includes('находк') ||
            q.includes('вещ')
        ) {
            return 'В нашем каталоге есть три раздела: одежда, предметы для дома и аксессуары. Загляните в каталог — возможно, там уже ждёт ваша новая находка!';
        }

        if (
            q.includes('избран') ||
            q.includes('сердеч') ||
            q.includes('понрав')
        ) {
            return 'Понравившиеся товары можно сохранять в избранное с помощью сердечка на карточке товара. Найти сохранённые находки можно в личном кабинете.';
        }

        if (
            q.includes('контакт') ||
            q.includes('телефон') ||
            q.includes('связаться') ||
            q.includes('адрес') ||
            q.includes('почт')
        ) {
            return 'Связаться с магазином можно по телефону +7 (903) 314-16-50 или по почте hello@pugovitsa.ru. Адрес и часы работы указаны на странице «Контакты».';
        }

        if (
            q.includes('спасибо') ||
            q.includes('благодар')
        ) {
            return 'Всегда пожалуйста! Будем рады видеть вас среди наших покупателей.';
        }

        return 'Пока я не знаю ответа на этот вопрос. Попробуйте спросить о каталоге, заказе, доставке, оплате или возврате. Также вы можете связаться с магазином через страницу «Контакты».';
    }

    // Обработка сообщения
    function sendMessage(text) {
        const question = text.trim();

        if (!question) return;

        addMessage(question, 'user');

        input.value = '';

        // Небольшая задержка для имитации ответа консультанта
        setTimeout(() => {
            const answer = getBotResponse(question);
            addMessage(answer, 'bot');
        }, 500);
    }

    // Отправка через форму
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        sendMessage(input.value);
    });

    // Быстрые вопросы
    if (quickQuestions) {
        quickQuestions.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-question]');

            if (!button) return;

            sendMessage(button.dataset.question);
        });
    }
});
