
import { Api } from './base/Api';
import { IProduct, IOrderData, IOrderResponse } from '../types';
import { EventEmitter } from './base/Events';

export class AppApi extends Api {
    private events: EventEmitter;

    constructor(baseUrl: string, events: EventEmitter, options?: RequestInit) {
        super(baseUrl, options);
        this.events = events;
    }

    // Получить список товаров
    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await this.get<{ items: IProduct[] }>('/product');
            this.events.emit('api:productsLoaded', response.items);
            return response.items;
        } catch (error) {
            this.events.emit('api:error', { action: 'getProducts', error });
            throw error;
        }
    }

    // Получить один товар по ID
    async getProductById(id: string): Promise<IProduct> {
        try {
            const product = await this.get<IProduct>(`/product/${id}`);
            this.events.emit('api:productLoaded', product);
            return product;
        } catch (error) {
            this.events.emit('api:error', { action: 'getProductById', error, id });
            throw error;
        }
    }

    // Отправить заказ
    async postOrder(order: IOrderData): Promise<IOrderResponse> {
        try {
            const response = await this.post<IOrderResponse>('/order', order);
            this.events.emit('api:orderSubmitted', response);
            return response;
        } catch (error) {
            this.events.emit('api:error', { action: 'postOrder', error, order });
            throw error;
        }
    }
}