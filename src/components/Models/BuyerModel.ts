import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
    // Поля класса
    protected payment: TPayment | null;  // null = не выбран
    protected address: string;
    protected phone: string;
    protected email: string;

    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
        this.events = events;
    }

    // Частичное обновление данных
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;

        // ✅ Добавлен эмит (единственное изменение)
        this.events.emit('buyer:changed', this.getAllData());
    }

    // Возвращает все данные покупателя
    getAllData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    // Очищает все поля
    clear(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';

        // ✅ Добавлен эмит (единственное изменение)
        this.events.emit('buyer:changed', this.getAllData());
    }

    // Валидация данных
    validate(): TValidationErrors {
        const errors: TValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.email || this.email.trim() === '') {
            errors.email = 'Укажите email';
        }
        if (!this.phone || this.phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        }
        if (!this.address || this.address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }
}