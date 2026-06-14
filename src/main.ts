import './scss/styles.scss';

// Базовые классы
import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/AppApi';

// Модели
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Cart } from './components/Models/Cart';
import { BuyerModel } from './components/Models/BuyerModel';

// View-компоненты
import { Header } from './components/Views/Header';
import { Catalog } from './components/Views/Catalog';
import { CatalogCard } from './components/Views/CatalogCard';
import { PreviewCard } from './components/Views/PreviewCard';
import { Basket } from './components/Views/Basket';
import { BasketCard } from './components/Views/BasketCard';
import { OrderForm } from './components/Views/OrderForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { Modal } from './components/Views/Modal';
import { Success } from './components/Views/Success';
import { API_URL } from './utils/constants';
// Типы
import { IProduct } from './types';

// Константы (категории для стилей)

// ИНИЦИАЛИЗАЦИЯ


// Брокер событий
const events = new EventEmitter();

// API (замените URL на ваш)
const api = new AppApi(API_URL, events);

// Модели
const productsCatalog = new ProductsCatalog(events);
const cart = new Cart(events);
const buyer = new BuyerModel(events);


// ПОИСК КОНТЕЙНЕРОВ В РАЗМЕТК


// Шапка
const headerContainer = document.querySelector('.header') as HTMLElement;
// Каталог (контейнер для галереи)
const catalogContainer = document.querySelector('.page__wrapper') as HTMLElement;
// Модальное окно
const modalContainer = document.getElementById('modal-container') as HTMLElement;

// Шаблоны
const catalogCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// СОЗДАНИЕ КОМПОНЕНТОВ VIEW


// Шапка (клик по корзине → событие)
const header = new Header(headerContainer, () => {
    events.emit('ui:basketClick');
});

// Каталог (контейнер для карточек)
const catalog = new Catalog(catalogContainer);

// Модальное окно
const modal = new Modal(modalContainer, () => {
    events.emit('ui:modalClose');
});


// Создать карточку для каталога
function createCatalogCard(product: IProduct): CatalogCard {
    const container = catalogCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const card = new CatalogCard(container, (id) => {
        // Событие: клик по карточке → открыть подробный просмотр
        events.emit('ui:productSelect', { id });
    });
    
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image ? `${API_URL}${product.image}` : '';
    
    return card;
}

// Создать подробную карточку для модалки
function createPreviewCard(product: IProduct): PreviewCard {
    const container = previewCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const card = new PreviewCard(container, (id) => {
        // Событие: добавление в корзину
        events.emit('ui:addToCart', { id });
    });
    
    // Проверяем, есть ли товар в корзине
    const isInCart = cart.hasItem(product.id);
    
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image ? `${API_URL}${product.image}` : '';
    card.description = product.description;
    
    if (isInCart) {
    card.setButtonText('Удалить из корзины');
}
    return card;
}

// Создать карточку для корзины
function createBasketCard(product: IProduct, index: number, onDelete: (id: string) => void): BasketCard {
    const container = basketCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const card = new BasketCard(container, onDelete);
    
    card.id = product.id;
    card.title = product.title;
    card.price = product.price || 0;
    card.index = index;
    
    return card;
}

// Обновить отображение корзины
function renderBasket() {
    const container = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const items = cart.getItems();
    const total = cart.getTotalPrice();
    
    const basket = new Basket(container, () => {
        events.emit('ui:checkout');
    });
    
    // Создаём карточки для корзины
    const basketCards = items.map((item, index) => {
        return createBasketCard(item.product, index + 1, (id) => {
            events.emit('ui:removeFromCart', { id });
        });
    });
    
    basket.items = basketCards;
    basket.total = total;
    basket.valid = items.length > 0;
    
    return basket.render({});
}

// Обновить счётчик в шапке
function updateHeaderCounter() {
    header.counter = cart.getTotalCount();
}


// ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ


// Товары загружены → отрисовать каталог
events.on('products:loaded', (products: IProduct[]) => {
    const cards = products.map(product => createCatalogCard(product));
    catalog.cards = cards;
});

// Корзина изменилась → обновить счётчик в шапке
events.on('cart:changed', () => {
    updateHeaderCounter();
});

// Данные покупателя изменились 
events.on('buyer:changed', () => {
   
});


// ОБРАБОТЧИКИ СОБЫТИЙ ОТ VIEW (UI)

// Клик по карточке → открыть подробный просмотр
events.on('ui:productSelect', (data: { id: string }) => {
    const product = productsCatalog.getProductById(data.id);
    if (product) {
        const previewCard = createPreviewCard(product);
        modal.content = previewCard.render({});
        modal.open();
    }
});

// Добавление товара в корзину
events.on('ui:addToCart', (data: { id: string }) => {
    const product = productsCatalog.getProductById(data.id);
    if (product && product.price !== null) {
        cart.addItem(product);
        // Закрываем модалку после добавления
        modal.close();
    }
});

// Удаление товара из корзины
events.on('ui:removeFromCart', (data: { id: string }) => {
    cart.removeItem(data.id);
    // Обновляем корзину, если она открыта
   if (modal.isOpen()) {
    const basketContent = renderBasket();
    modal.content = basketContent;
}
});

// Открытие корзины
events.on('ui:basketClick', () => {
    const basketContent = renderBasket();
    modal.content = basketContent;
    modal.open();
});

// Оформление заказа (из корзины)
events.on('ui:checkout', () => {
    // Открываем форму заказа (шаг 1)
    const container = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(
    container,
    (data) => {
        if (data.payment !== undefined && data.payment !== null) {
            buyer.setPayment(data.payment);
        }
        if (data.address !== undefined) {
            buyer.setAddress(data.address);
        }
    },
    () => {
        if (buyer.isFirstStepValid()) {
            openContactsForm();
        }
    }
);
    
    // Устанавливаем текущие данные
    orderForm.render({
        payment: buyer.payment,
        address: buyer.address
    });
    
    modal.content = orderForm.render({});
    modal.open();
});

// Открыть форму контактов 
function openContactsForm() {
    const container = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    
    const contactsForm = new ContactsForm(
        container,
        (data) => {
            if (data.email !== undefined) buyer.setEmail(data.email);
            if (data.phone !== undefined) buyer.setPhone(data.phone);
        },
        () => {
            if (buyer.isSecondStepValid()) {
                submitOrder();
            }
        }
    );
    
    contactsForm.render({
        email: buyer.email,
        phone: buyer.phone
    });
    
    modal.content = contactsForm.render({});
}

// Отправка заказа на сервер
async function submitOrder() {
    const orderData = {
        payment: buyer.payment!,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: cart.getItemIds(),
        total: cart.getTotalPrice()
    };
    
    try {
        const response = await api.postOrder(orderData);
        
        // Показываем сообщение об успехе
        const container = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const success = new Success(container, () => {
            modal.close();
        });
        
        success.total = response.total;
        modal.content = success.render({});
        
        // Очищаем корзину и данные покупателя
        cart.clear();
        buyer.clear();
        
        updateHeaderCounter();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        // TODO: показать ошибку пользователю
    }
}

// Закрытие модального окна
events.on('ui:modalClose', () => {
    // Ничего особенного не делаем, просто закрываем
});



// Загружаем товары с сервера
console.log('Начинаю загрузку товаров...');
api.getProducts().then(products => {
    console.log('Товары получены от API:', products);
    productsCatalog.setProducts(products);
}).catch(error => {
    console.error('Ошибка загрузки товаров:', error);
});
