
import { IBuyer, TPayment, TValidationErrors } from '../../types';

export class BuyerModel {
  // Поля класса
  protected payment: TPayment | null;  // null = не выбран
  protected address: string;
  protected phone: string;
  protected email: string;

    constructor() {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  // Частичное обновление данных
  // Благодаря Partial<IBuyer> можно передать только нужные поля
  setData(data: Partial<IBuyer>): void {
    // Проверяем, что поле передано (!== undefined) и только тогда обновляем
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
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
  }

  // Валидация данных
  // Возвращает объект с ошибками: ключ = поле, значение = текст ошибки
  // Если поле валидно - его нет в объекте
  validate(): Partial<Record<keyof IBuyer, string>> {
   const errors: TValidationErrors = {};

    // Проверка способа оплаты: не null и не undefined
    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    // Проверка email: не пустая строка после удаления пробелов по краям
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }
    // Проверка телефона
    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    // Проверка адреса
    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
}