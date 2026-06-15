
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export class Cart {
    private items: Map<string, ICartItem> = new Map();
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    // Добавить товар
    addItem(product: IProduct): void {
        if (product.price === null) {
            console.warn('Товар без цены нельзя добавить в корзину');
            return;
        }

        if (this.items.has(product.id)) {
            const item = this.items.get(product.id)!;
            item.quantity += 1;
        } else {
            this.items.set(product.id, { product, quantity: 1 });
        }

        // Генерируем события
        this.events.emit('cart:itemAdded', { id: product.id });
        this.events.emit('cart:changed', this.getCartData());
    }

    // Удалить товар
    removeItem(productId: string): void {
        if (this.items.has(productId)) {
            this.items.delete(productId);
            
            // Генерируем события
            this.events.emit('cart:itemRemoved', { id: productId });
            this.events.emit('cart:changed', this.getCartData());
        }
    }

    // Очистить корзину
    clear(): void {
        this.items.clear();
        this.events.emit('cart:changed', this.getCartData());
    }

    // Получить количество товаров в корзине
    getTotalCount(): number {
        let count = 0;
        this.items.forEach(item => {
            count += item.quantity;
        });
        return count;
    }

    // Получить общую сумму
    getTotalPrice(): number {
        let total = 0;
        this.items.forEach(item => {
            total += (item.product.price || 0) * item.quantity;
        });
        return total;
    }

    // Получить список товаров для отображения в корзине
    getItems(): ICartItem[] {
        return Array.from(this.items.values());
    }

    // Получить ID всех товаров (для отправки заказа)
    getItemIds(): string[] {
        const ids: string[] = [];
        this.items.forEach((item, id) => {
            for (let i = 0; i < item.quantity; i++) {
                ids.push(id);
            }
        });
        return ids;
    }

    // Проверить, есть ли товар в корзине
    hasItem(productId: string): boolean {
        return this.items.has(productId);
    }

    // Получить данные корзины для события
    private getCartData() {
        return {
            items: this.getItems(),
            totalCount: this.getTotalCount(),
            totalPrice: this.getTotalPrice()
        };
    }
}