
// import { IBuyer, TPayment, TValidationErrors } from '../../types';

// export class BuyerModel {
//   // Поля класса
//   protected payment: TPayment | null;  // null = не выбран
//   protected address: string;
//   protected phone: string;
//   protected email: string;

//     constructor() {
//     this.payment = null;
//     this.address = '';
//     this.phone = '';
//     this.email = '';
//   }

//   // Частичное обновление данных
//   // Благодаря Partial<IBuyer> можно передать только нужные поля
//   setData(data: Partial<IBuyer>): void {
//     // Проверяем, что поле передано (!== undefined) и только тогда обновляем
//     if (data.payment !== undefined) this.payment = data.payment;
//     if (data.address !== undefined) this.address = data.address;
//     if (data.phone !== undefined) this.phone = data.phone;
//     if (data.email !== undefined) this.email = data.email;
//   }

//   // Возвращает все данные покупателя
//   getAllData(): IBuyer {
//     return {
//       payment: this.payment,  
//       email: this.email,
//       phone: this.phone,
//       address: this.address,
//     };
//   }

//   // Очищает все поля
//   clear(): void {
//     this.payment = null;
//     this.address = '';
//     this.phone = '';
//     this.email = '';
//   }

//   // Валидация данных
//   // Возвращает объект с ошибками: ключ = поле, значение = текст ошибки
//   // Если поле валидно - его нет в объекте
//   validate(): Partial<Record<keyof IBuyer, string>> {
//    const errors: TValidationErrors = {};

//     // Проверка способа оплаты: не null и не undefined
//     if (!this.payment) {
//       errors.payment = 'Не выбран вид оплаты';
//     }
//     // Проверка email: не пустая строка после удаления пробелов по краям
//     if (!this.email || this.email.trim() === '') {
//       errors.email = 'Укажите email';
//     }
//     // Проверка телефона
//     if (!this.phone || this.phone.trim() === '') {
//       errors.phone = 'Укажите телефон';
//     }
//     // Проверка адреса
//     if (!this.address || this.address.trim() === '') {
//       errors.address = 'Укажите адрес доставки';
//     }

//     return errors;
//   }
// }


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

    // Установить способ оплаты
    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('buyer:changed', this.getData());
    }

    // Установить адрес
    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:changed', this.getData());
    }

    // Установить email
    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:changed', this.getData());
    }

    // Установить телефон
    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:changed', this.getData());
    }

    // Заполнить все данные из формы
    setOrderData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        
        this.events.emit('buyer:changed', this.getData());
    }

    // Очистить данные покупателя
    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        
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

    // Проверить, заполнены ли данные для первого шага
    isFirstStepValid(): boolean {
        return !!(this.payment && this.address.trim());
    }

    // Проверить, заполнены ли данные для второго шага
    isSecondStepValid(): boolean {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
        const phoneValid = this.phone.trim().length > 5;
        return emailValid && phoneValid;
    }
}