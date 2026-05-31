// src/components/Models/BuyerModel.ts

import { IBuyer, TPayment } from '../../../types';

export class BuyerModel {
  // Поля класса
  protected _payment: TPayment | null;  // null = не выбран
  protected _address: string;
  protected _phone: string;
  protected _email: string;

  // Конструктор принимает частичные данные (Partial - все поля опциональны)
  // ?? - оператор nullish coalescing: если слева null/undefined, берёт значение справа
  constructor(initialData?: Partial<IBuyer>) {
    this._payment = initialData?.payment ?? null;
    this._address = initialData?.address ?? '';
    this._phone = initialData?.phone ?? '';
    this._email = initialData?.email ?? '';
  }

  // Частичное обновление данных
  // Благодаря Partial<IBuyer> можно передать только нужные поля
  setData(data: Partial<IBuyer>): void {
    // Проверяем, что поле передано (!== undefined) и только тогда обновляем
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
  }

  // Возвращает все данные покупателя
  getAllData(): IBuyer {
    return {
      payment: this._payment as TPayment,  // as - приведение типа (мы уверены, что при валидации проверим)
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  // Очищает все поля
  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  // Валидация данных
  // Возвращает объект с ошибками: ключ = поле, значение = текст ошибки
  // Если поле валидно - его нет в объекте
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    // Проверка способа оплаты: не null и не undefined
    if (!this._payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    // Проверка email: не пустая строка после удаления пробелов по краям
    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }
    // Проверка телефона
    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    // Проверка адреса
    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
}