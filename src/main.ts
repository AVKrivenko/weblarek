import './scss/styles.scss';

// Импортируем классы моделей
import { ProductsCatalog } from './components/Models/ProductsCatalog' ;
import { Cart } from './components/Models/Cart';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';


const catalog = new ProductsCatalog();
const cart = new Cart();
const buyer = new BuyerModel();

// ProductsCatalog
catalog.setProducts(apiProducts.items);
console.log('ProductsCatalog - товаров:', catalog.getProducts().length);
console.log('getProductById:', catalog.getProductById(apiProducts.items[0].id)?.title);

// Cart
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]);
console.log('Cart - стоимость:', cart.getTotalPrice());
console.log('Cart - количество:', cart.getTotalCount());
cart.removeItem(apiProducts.items[1]);
console.log('Cart - после удаления:', cart.getTotalCount());

// BuyerModel
buyer.setData({ email: 'test@mail.ru', phone: '+79991234567', address: 'Москва', payment: 'card' });
console.log('BuyerModel - валидация:', buyer.validate());

console.log('✅ Тестирование завершено\n');

// ========== 2. НАСТРОЙКА РАБОТЫ С СЕРВЕРОМ ==========
console.log('\n========== НАСТРОЙКА РАБОТЫ С СЕРВЕРОМ ==========');

const baseApi = new Api(API_URL); // 

// Создаём экземпляр AppApi, передавая ему базовый API
const appApi = new AppApi(baseApi);

console.log('API настроен, готов к запросам');

// ========== 3. ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ==========
console.log('\n========== ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ==========');
console.log('Выполняется запрос GET /product ...');

// Выполняем GET-запрос на сервер
appApi.getProducts()
  .then(response => {
    // response содержит { total: 10, items: [...] }
    console.log('Ответ от сервера получен:');
    console.log('- Общее количество товаров:', response.total);
    console.log('- Массив товаров:', response.items);
    
    // Сохраняем массив товаров в модель каталога
    catalog.setProducts(response.items);
    
    console.log('\nТовары сохранены в модель каталога');
    console.log('Каталог после сохранения:', catalog.getProducts());
    console.log('Количество товаров в каталоге:', catalog.getProducts().length);
    
    // Проверяем работу метода getProductById
    if (response.items.length > 0) {
      const firstProductId = response.items[0].id;
      const foundProduct = catalog.getProductById(firstProductId);
      console.log(`\nПроверка getProductById("${firstProductId}"):`, foundProduct);
    }
  })
  .catch(error => {
    // Обрабатываем ошибку, если запрос не удался
    console.error('Ошибка при получении товаров с сервера:', error);
  });

// ========== 4. ПРИМЕР ОТПРАВКИ ЗАКАЗА (БУДЕТ ВО 2-Й ЧАСТИ) ==========
console.log('\n========== ПРИМЕР ОТПРАВКИ ЗАКАЗА (для понимания) ==========');
console.log('Этот код будет использоваться во второй части проектной работы:');

// Пример данных заказа (как это будет выглядеть)
const exampleOrderData = {
  payment: 'card' as const,
  email: 'customer@example.com',
  phone: '+79991234567',
  address: 'Москва, ул. Примерная, д.1',
  items: ['product-id-1', 'product-id-2'],
  total: 5000
};

console.log('Пример данных для отправки:', exampleOrderData);
console.log('Для отправки заказа нужно будет вызвать:');
console.log('appApi.postOrder(exampleOrderData).then(...)');