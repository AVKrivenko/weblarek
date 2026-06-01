// src/components/AppApi.ts

import { IApi, IProductsResponse, IOrderData, IOrderResponse } from '../types';

/**
 * Класс для работы с API сервера «веб-ларёк»
 * Отвечает за получение товаров и отправку заказов
 */
export class AppApi {
  // Поле хранит объект API с методами get и post
  protected api: IApi;

  /**
   * Конструктор класса
   * @param api - объект, реализующий интерфейс IApi (умеет делать get и post запросы)
   */
  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получение списка товаров с сервера
   * @returns Promise с объектом, содержащим массив товаров и общее количество
   */
  getProducts(): Promise<IProductsResponse> {
    // GET-запрос на эндпоинт /product/
    // Метод get принимает строку с URL и возвращает Promise с данными
    return this.api.get<IProductsResponse>('/product');
  }

  /**
   * Отправка заказа на сервер
   * @param orderData - данные заказа (покупатель + выбранные товары + сумма)
   * @returns Promise с подтверждением заказа (id и total)
   */
  postOrder(orderData: IOrderData): Promise<IOrderResponse> {
    // POST-запрос на эндпоинт /order/
    // Передаём данные заказа в теле запроса
    return this.api.post<IOrderResponse>('/order', orderData);
  }
}