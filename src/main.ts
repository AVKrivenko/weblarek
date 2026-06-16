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
import { CDN_URL, API_URL } from './utils/constants';

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

const events = new EventEmitter();
const api = new AppApi(API_URL, events);

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
// СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ 
// ============================================

const header = new Header(headerContainer, () => {
    events.emit('ui:basketClick');
});

const catalog = new Catalog(catalogContainer);

const modal = new Modal(modalContainer, () => {
    events.emit('ui:modalClose');
});


const basketContainer = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const basket = new Basket(basketContainer, () => {
    events.emit('ui:checkout');
});

const orderContainer = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(
    orderContainer,
    (field, value) => {
        // В колбэках только эмиты
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


const contactsContainer = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(
    contactsContainer,
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


const successContainer = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
const success = new Success(successContainer, () => {
    modal.close();
});

// ============================================
// ФУНКЦИИ СОЗДАНИЯ HTML-ЭЛЕМЕНТОВ КАРТОЧЕК
// ============================================

function createCatalogCardElement(product: IProduct): HTMLElement {
    const container = catalogCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    
    const card = new CatalogCard(container, () => {
        events.emit('ui:productSelect', { id: product.id });
    });
    
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image ? `${CDN_URL}/${product.image}` : '';
    
    return card.render({});
}

function createBasketCardElement(product: IProduct, index: number): HTMLElement {
    const container = basketCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    
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


events.on('product:selected', (data: { product: IProduct | null }) => {
    const product = data.product;
    if (!product) return;
    
    const container = previewCardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const isInCart = cart.hasItem(product.id);
    
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
    card.image = product.image ? `${CDN_URL}/${product.image}` : '';
    card.description = product.description;
    card.setButtonText(isInCart ? 'Удалить из корзины' : 'Купить');
    
    modal.content = card.render({});
    modal.open();
});



events.on('cart:changed', () => {
    header.counter = cart.getTotalCount();
    
    const items = cart.getItems().map((item, index) => 
        createBasketCardElement(item.product, index + 1)
    );
    basket.items = items;
    basket.total = cart.getTotalPrice();
    basket.valid = items.length > 0;
});

events.on('buyer:changed', () => {
    const errors = buyer.validate();
    const data = buyer.getAllData();
    
    if (orderForm) {
        orderForm.address = data.address;
        orderForm.payment = data.payment;
        orderForm.valid = !errors.payment && !errors.address;
        orderForm.errors = errors.payment || errors.address || '';
    }
    
    if (contactsForm) {
        contactsForm.email = data.email;
        contactsForm.phone = data.phone;
        contactsForm.valid = !errors.email && !errors.phone;
        contactsForm.errors = errors.email || errors.phone || '';
    }
});

events.on('api:error', (data: { action: string; error: unknown }) => {
    console.error('API Error:', data.action, data.error);
});

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ VIEW (UI)
// ============================================

events.on('ui:productSelect', (data: { id: string }) => {
    const product = productsCatalog.getProductById(data.id);
    if (product) {
        productsCatalog.setSelectedProduct(product);
    }
});

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



events.on('ui:basketClick', () => {
    modal.content = basketContainer;
    modal.open();
});

events.on('ui:checkout', () => {
    const data = buyer.getAllData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    
    modal.content = orderContainer;
    modal.open();
});

events.on('ui:nextStep', () => {
    const data = buyer.getAllData();
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    
    modal.content = contactsContainer;
});

events.on('ui:submitOrder', async () => {
    const data = buyer.getAllData();
    
    if (!data.payment) {
        console.error('Способ оплаты не выбран');
        return;
    }
    
    const orderData = {
        payment: data.payment,
        address: data.address,
        email: data.email,
        phone: data.phone,
        items: cart.getItemIds(),
        total: cart.getTotalPrice()
    };
    
    try {
        const response = await api.postOrder(orderData);
        
        success.total = response.total;
        modal.content = successContainer;
        
        cart.clear();
        buyer.clear();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

// Обработчики эмитов от форм
events.on('buyer:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    const currentData = buyer.getAllData();
    buyer.setData({ ...currentData, payment: data.payment });
});

events.on('buyer:addressChange', (data: { address: string }) => {
    const currentData = buyer.getAllData();
    buyer.setData({ ...currentData, address: data.address });
});

events.on('buyer:emailChange', (data: { email: string }) => {
    const currentData = buyer.getAllData();
    buyer.setData({ ...currentData, email: data.email });
});

events.on('buyer:phoneChange', (data: { phone: string }) => {
    const currentData = buyer.getAllData();
    buyer.setData({ ...currentData, phone: data.phone });
});

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