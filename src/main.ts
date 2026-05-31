import './scss/styles.scss';

// Импортируем классы моделей
import { ProductsCatalog } from './components/base/Models/ProductsCatalog' ;
import { Cart } from './components/base/Models/Cart';
import { BuyerModel } from './components/base/Models/BuyerModel';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';

// ========== 1. СОЗДАНИЕ МОДЕЛЕЙ ДАННЫХ ==========
console.log('========== ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ==========');

// Создаём экземпляры моделей
const catalog = new ProductsCatalog();
const cart = new Cart();
const buyer = new BuyerModel();

console.log('Модели данных созданы:');
console.log('- Каталог (пустой):', catalog.getProducts());
console.log('- Корзина (пустая):', cart.getItems());
console.log('- Покупатель (пустой):', buyer.getAllData());

// ========== 2. НАСТРОЙКА РАБОТЫ С СЕРВЕРОМ ==========
console.log('\n========== НАСТРОЙКА РАБОТЫ С СЕРВЕРОМ ==========');

// Создаём экземпляр базового API с указанием базового URL сервера
// URL сервера обычно указан в задании (например, http://localhost:3000)
const baseApi = new Api(API_URL); // Замените на реальный URL

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