// // Импортируем интерфейс товара из файла types
// import { IProduct } from '../../types';

// export class ProductsCatalog {
//   // Поля класса (protected - доступны внутри класса и в классах-наследниках)
//   protected products: IProduct[];           // массив всех товаров
//   protected selectedProduct: IProduct | null; // выбранный товар (или null)

//   // Конструктор - вызывается при создании экземпляра класса
//   // Параметр initialProducts - необязательный, по умолчанию пустой массив
//   constructor() {
//     // Сохраняем копию массива (через spread-оператор [...]), 
//     // чтобы не изменять исходный массив
//     this.products =[];
//     this.selectedProduct = null;  // изначально ничего не выбрано
//   }

//   // Сохраняет массив товаров (полностью заменяет текущий)
//   setProducts(products: IProduct[]): void {
//     this.products = products;  // сохраняем копию
//   }

//   // Возвращает массив всех товаров
//   getProducts(): IProduct[] {
//     return this.products;
//   }

//   // Ищет товар по id с помощью метода find()
//   // Если не найден - возвращает undefined
//   getProductById(id: string): IProduct | undefined {
//     return this.products.find(product => product.id === id);
//   }

//   // Сохраняет товар для подробного просмотра
//   // Можно передать null, чтобы сбросить выбор
//   setSelectedProduct(product: IProduct | null): void {
//     this.selectedProduct = product;
//   }

//   // Возвращает выбранный товар (или null)
//   getSelectedProduct(): IProduct | null {
//     return this.selectedProduct;
//   }
// }

import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductsCatalog {
    private products: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    // Установить список товаров (после загрузки с сервера)
    setProducts(products: IProduct[]): void {
        this.products = products;
        // Генерируем событие, что товары загружены
        this.events.emit('products:loaded', this.products);
    }

    // Получить все товары
    getProducts(): IProduct[] {
        return this.products;
    }

    // Получить товар по ID
    getProductById(id: string): IProduct | undefined {
        return this.products.find(p => p.id === id);
    }

    // Обновить товар
    updateProduct(id: string, updates: Partial<IProduct>): void {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updates };
            // Генерируем событие, что товар изменился
            this.events.emit('product:changed', this.products[index]);
        }
    }
}