// src/components/Models/Cart.ts

import { IProduct } from '../../../types';

export class Cart {
  // Поле - массив товаров в корзине
  protected _items: IProduct[];

  // Конструктор - создаёт пустую корзину
  constructor() {
    this._items = [];
  }

  // Возвращает все товары в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавляет товар в конец массива
  addItem(product: IProduct): void {
    this._items.push(product);
  }

  // Удаляет товар из корзины
  removeItem(product: IProduct): void {
    // Ищем индекс товара с таким же id
    const index = this._items.findIndex(item => item.id === product.id);
    // Если нашли (индекс не -1) - удаляем один элемент по этому индексу
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  // Очищает корзину - присваивает пустой массив
  clear(): void {
    this._items = [];
  }

  // Вычисляет общую стоимость всех товаров
  getTotalPrice(): number {
    // reduce - проходит по массиву и накапливает сумму
    return this._items.reduce((total, item) => {
      // Если цена null, считаем как 0
      const price = item.price !== null ? item.price : 0;
      return total + price;
    }, 0); // 0 - начальное значение суммы
  }

  // Возвращает количество товаров
  getTotalCount(): number {
    return this._items.length;
  }

  // Проверяет, есть ли товар с указанным id
  hasProductId(id: string): boolean {
    // some() - возвращает true, если хотя бы один элемент подходит под условие
    return this._items.some(item => item.id === id);
  }
}