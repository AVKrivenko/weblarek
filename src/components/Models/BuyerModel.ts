import { IBuyer, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel implements IBuyer {
    payment: TPayment | null = null;
    email: string = '';
    phone: string = '';
    address: string = '';

    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    // Способ оплаты
    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:changed', this.getData());
    }

    // Адрес
    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed', this.getData());
    }

    // Email
    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed', this.getData());
    }

    // Телефон
    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed', this.getData());
    }

    // Получить все данные
    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    // Валидация первого шага (способ оплаты + адрес)
    isFirstStepValid(): boolean {
        return !!(this.payment && this.address?.trim());
    }

    // Валидация второго шага (email + телефон)
    isSecondStepValid(): boolean {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
        const phoneValid = this.phone.trim().length > 5;
        return emailValid && phoneValid;
    }

    // Очистить данные
    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed', this.getData());
    }
}