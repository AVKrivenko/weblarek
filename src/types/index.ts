export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;

}

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'cash' | 'card' | 'online';

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

/**
 * Ответ сервера при GET-запросе /product/
 * Сервер возвращает объект с общим количеством товаров и массивом товаров
 */
export interface IProductsResponse {
  total: number;      // общее количество товаров на сервере
  items: IProduct[];  // массив товаров (переиспользуем существующий интерфейс)
}

/**
 * Данные для отправки заказа на сервер (POST /order/)
 * Объединяет данные покупателя и выбранные товары
 */
export interface IOrderData {
  payment: TPayment;           // способ оплаты (из IBuyer)
  email: string;               // email (из IBuyer)
  phone: string;               // телефон (из IBuyer)
  address: string;             // адрес (из IBuyer)
  items: string[];             // массив ID выбранных товаров
  total: number;               // общая стоимость заказа
}

/**
 * Ответ сервера при POST-запросе /order/
 * Сервер возвращает подтверждение с ID заказа и суммой
 */
export interface IOrderResponse {
  id: string;      // уникальный идентификатор заказа
  total: number;   // сумма заказа (подтверждение)
}
