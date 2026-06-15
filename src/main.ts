import './scss/styles.scss';

// ============================================
// ИМПОРТЫ
// ============================================

import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/AppApi';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Cart } from './components/Models/Cart';
import { BuyerModel } from './components/Models/BuyerModel';
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
import { IProduct } from './types';
import { CDN_URL } from './utils/constants';
import { API_URL } from './utils/constants'; 
// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================


const events = new EventEmitter();
const api = new AppApi(API_URL, events);  // ← используем API_URL

const productsCatalog = new ProductsCatalog(events);
const cart = new Cart(events);
const buyer = new BuyerModel(events);
// ============================================
// ПОИСК КОНТЕЙНЕРОВ И ШАБЛОНОВ
// ============================================

const headerContainer = document.querySelector('.header') as HTMLElement;
const catalogContainer = document.querySelector('.page__wrapper') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;

const catalogCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// ============================================
// СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ (ОДНОКРАТНО)
// ✅ ЗАМЕЧАНИЕ 2 ИСПРАВЛЕНО: все представления кроме карточек создаются один раз
// ============================================

const header = new Header(headerContainer, () => {
    events.emit('ui:basketClick');
});

const catalog = new Catalog(catalogContainer);

const modal = new Modal(modalContainer, () => {
    events.emit('ui:modalClose');
});

// Создаём формы и корзину один раз (будут перерисовываться через сеттеры)
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;
let basketContainer: HTMLElement | null = null;
let basket: Basket | null = null;

// ============================================
// ФУНКЦИИ СОЗДАНИЯ HTML-ЭЛЕМЕНТОВ КАРТОЧЕК
// ============================================

function createCatalogCardElement(product: IProduct): HTMLElement {
    const container = catalogCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    
    // ✅ ЗАМЕЧАНИЕ 3 (косвенно): колбэк без параметра, ID зашит
    const card = new CatalogCard(container, () => {
        events.emit('ui:productSelect', { id: product.id });
    });
    
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image ? `${CDN_URL}${product.image}` : '';
    
    return card.render({});
}

function createBasketCardElement(product: IProduct, index: number): HTMLElement {
    const container = basketCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    
    // ✅ ЗАМЕЧАНИЕ 1 (косвенно): колбэк без параметра, ID зашит
    const card = new BasketCard(container, () => {
        events.emit('ui:removeFromCart', { id: product.id });
    });
    
    card.title = product.title;
    card.price = product.price ?? 0;
    card.index = index;
    
    return card.render({});
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ МОДЕЛЕЙ
// ============================================

// Товары загружены → отрисовать каталог
events.on('products:loaded', (data: { products: IProduct[] }) => {
    const items = data.products.map(product => createCatalogCardElement(product));
    catalog.items = items;
});

// ✅ ЗАМЕЧАНИЕ 3 ИСПРАВЛЕНО: обработка выбранного товара происходит здесь,
//    а в ui:productSelect только работа с моделью
events.on('product:selected', (data: { product: IProduct | null }) => {
    const product = data.product;
    if (!product) return;
    
    const container = previewCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const isInCart = cart.hasItem(product.id);
    
    // ✅ ЗАМЕЧАНИЕ 1 ИСПРАВЛЕНО: единый колбэк для кнопки
    const card = new PreviewCard(container, () => {
        if (cart.hasItem(product.id)) {
            events.emit('ui:removeFromCart', { id: product.id });
            card.setButtonText('Купить');
        } else {
            events.emit('ui:addToCart', { id: product.id });
            card.setButtonText('Удалить из корзины');
        }
        modal.close();
    });
    
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image ? `${CDN_URL}${product.image}` : '';
    card.description = product.description;
    card.setButtonText(isInCart ? 'Удалить из корзины' : 'Купить');
    
    modal.content = card.render({});
    modal.open();
});

// ✅ ЗАМЕЧАНИЕ 4 ИСПРАВЛЕНО: корзина обновляется в событии изменения модели,
//    а не при открытии
events.on('cart:changed', () => {
    // Обновляем счётчик в шапке
    header.counter = cart.getTotalCount();
    
    // Обновляем корзину, если она создана и открыта
    if (basket && modal.isOpen()) {
        const items = cart.getItems().map((item, index) => 
            createBasketCardElement(item.product, index + 1)
        );
        basket.items = items;
        basket.total = cart.getTotalPrice();
        basket.valid = items.length > 0;
    }
});

// ✅ ЗАМЕЧАНИЕ 6 ИСПРАВЛЕНО: формы перерисовываются в событии изменения модели
events.on('buyer:changed', () => {
    const isFirstStepValid = buyer.isFirstStepValid();
    const isSecondStepValid = buyer.isSecondStepValid();
    
    // Обновляем форму заказа (шаг 1)
    if (orderForm) {
        orderForm.address = buyer.address;
        orderForm.payment = buyer.payment;
        orderForm.valid = isFirstStepValid;
        
        if (!isFirstStepValid) {
            if (!buyer.payment) orderForm.errors = 'Выберите способ оплаты';
            else if (!buyer.address?.trim()) orderForm.errors = 'Введите адрес доставки';
            else orderForm.errors = '';
        } else {
            orderForm.errors = '';
        }
    }
    
    // Обновляем форму контактов (шаг 2)
    if (contactsForm) {
        contactsForm.email = buyer.email;
        contactsForm.phone = buyer.phone;
        contactsForm.valid = isSecondStepValid;
        
        if (!isSecondStepValid) {
            if (!buyer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
                contactsForm.errors = 'Введите корректный email';
            } else if (!buyer.phone || buyer.phone.trim().length < 6) {
                contactsForm.errors = 'Введите номер телефона';
            } else {
                contactsForm.errors = '';
            }
        } else {
            contactsForm.errors = '';
        }
    }
});

// Ошибка API
events.on('api:error', (data: { action: string; error: unknown }) => {
    console.error('API Error:', data.action, data.error);
});

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ VIEW (UI)
// ============================================

// ✅ ЗАМЕЧАНИЕ 3 ИСПРАВЛЕНО: здесь только работа с моделью, без отображения
events.on('ui:productSelect', (data: { id: string }) => {
    const product = productsCatalog.getProductById(data.id);
    if (product) {
        productsCatalog.setSelectedProduct(product);
    }
});

// ✅ ЗАМЕЧАНИЕ 1 ИСПРАВЛЕНО: события добавляют/удаляют товар
events.on('ui:addToCart', (data: { id: string }) => {
    const product = productsCatalog.getProductById(data.id);
    if (product && product.price !== null) {
        cart.addItem(product);
        modal.close();
    }
});

events.on('ui:removeFromCart', (data: { id: string }) => {
    cart.removeItem(data.id);
});

// ✅ ЗАМЕЧАНИЕ 4 ИСПРАВЛЕНО: при открытии корзины только берём актуальный контейнер
events.on('ui:basketClick', () => {
    if (!basketContainer) {
        basketContainer = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        basket = new Basket(basketContainer, () => {
            events.emit('ui:checkout');
        });
    }
    
    // Берём актуальное состояние (данные уже обновлены в cart:changed)
    const items = cart.getItems().map((item, index) => 
        createBasketCardElement(item.product, index + 1)
    );
    if (basket) {
        basket.items = items;
        basket.total = cart.getTotalPrice();
        basket.valid = items.length > 0;
    }
    
    modal.content = basketContainer;
    modal.open();
});

// Оформление заказа
events.on('ui:checkout', () => {
    if (!orderForm) {
        const container = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        // ✅ ЗАМЕЧАНИЕ 5 ИСПРАВЛЕНО: в колбэках только эмиты
        orderForm = new OrderForm(
            container,
            (field, value) => {
                if (field === 'payment') {
                    events.emit('buyer:paymentChange', { payment: value as 'card' | 'cash' });
                } else if (field === 'address') {
                    events.emit('buyer:addressChange', { address: value });
                }
            },
            () => {
                events.emit('ui:nextStep');
            }
        );
    }
    
    // Берём пустой рендер и добавляем в модалку
    modal.content = orderForm.render({});
    modal.open();
});

// Переход ко второму шагу
events.on('ui:nextStep', () => {
    if (!contactsForm) {
        const container = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        // ✅ ЗАМЕЧАНИЕ 5 ИСПРАВЛЕНО: в колбэках только эмиты
        contactsForm = new ContactsForm(
            container,
            (field, value) => {
                if (field === 'email') {
                    events.emit('buyer:emailChange', { email: value });
                } else if (field === 'phone') {
                    events.emit('buyer:phoneChange', { phone: value });
                }
            },
            () => {
                events.emit('ui:submitOrder');
            }
        );
    }
    
    // Берём пустой рендер и добавляем в модалку
    modal.content = contactsForm.render({});
});

// Отправка заказа
events.on('ui:submitOrder', async () => {
    if (!buyer.payment) {
        console.error('Способ оплаты не выбран');
        return;
    }
    
    const orderData = {
        payment: buyer.payment,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: cart.getItemIds(),
        total: cart.getTotalPrice()
    };
    
    try {
        const response = await api.postOrder(orderData);
        
        const container = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const success = new Success(container, () => {
            modal.close();
        });
        
        success.total = response.total;
        modal.content = success.render({});
        
        cart.clear();
        buyer.clear();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// ✅ ЗАМЕЧАНИЕ 5 ИСПРАВЛЕНО: обработчики эмитов от форм
events.on('buyer:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyer.setPayment(data.payment);
});

events.on('buyer:addressChange', (data: { address: string }) => {
    buyer.setAddress(data.address);
});

events.on('buyer:emailChange', (data: { email: string }) => {
    buyer.setEmail(data.email);
});

events.on('buyer:phoneChange', (data: { phone: string }) => {
    buyer.setPhone(data.phone);
});

// Закрытие модального окна
events.on('ui:modalClose', () => {
    // Ничего не делаем
});

// ============================================
// ЗАГРУЗКА ТОВАРОВ ПРИ СТАРТЕ
// ============================================

api.getProducts().then(products => {
    productsCatalog.setProducts(products);
}).catch(error => {
    console.error('Ошибка загрузки товаров:', error);
});