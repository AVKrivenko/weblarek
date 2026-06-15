import { Form } from './Form';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    private cardButton: HTMLButtonElement | null;
    private cashButton: HTMLButtonElement | null;
    private addressInput: HTMLInputElement | null;
    
    private onChangeCallback: (field: keyof IOrderFormData, value: string) => void;
    private onSubmitCallback: () => void;

    constructor(
        container: HTMLElement,
        onChange: (field: keyof IOrderFormData, value: string) => void,
        onSubmit: () => void
    ) {
        super(container);
        
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        
        this.cardButton = this.container.querySelector('button[name="card"]');
        this.cashButton = this.container.querySelector('button[name="cash"]');
        this.addressInput = this.container.querySelector('input[name="address"]');
        
        // Обработчик для кнопки "Онлайн" — только эмит
        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.onChangeCallback('payment', 'card');
            });
        }
        
        // Обработчик для кнопки "При получении" 
        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.onChangeCallback('payment', 'cash');
            });
        }
        
        // Обработчик для поля адреса 
        if (this.addressInput) {
            this.addressInput.addEventListener('input', () => {
                this.onChangeCallback('address', this.addressInput?.value || '');
            });
        }
    }

    // Визуальное выделение кнопки (вызывается из презентера через сеттер payment)
    private setPaymentVisual(type: 'card' | 'cash' | null) {
        if (this.cardButton && this.cashButton) {
            if (type === 'card') {
                this.cardButton.classList.add('button_alt-active');
                this.cashButton.classList.remove('button_alt-active');
            } else if (type === 'cash') {
                this.cashButton.classList.add('button_alt-active');
                this.cardButton.classList.remove('button_alt-active');
            } else {
                this.cardButton.classList.remove('button_alt-active');
                this.cashButton.classList.remove('button_alt-active');
            }
        }
    }

    // Сеттер для адреса (обновляет поле, вызывается из презентера)
    set address(value: string) {
        if (this.addressInput) {
            this.addressInput.value = value;
        }
    }

    // Сеттер для способа оплаты 
    set payment(value: 'card' | 'cash' | null) {
        this.setPaymentVisual(value);
    }

    // Установить состояние валидности 
    set valid(isValid: boolean) {
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }
    }

    // Показать ошибку
    set errors(value: string) {
        if (this.errorsContainer) {
            this.errorsContainer.textContent = value;
        }
    }

    protected onSubmit(): void {
        this.onSubmitCallback();
    }

    render(data: Partial<IOrderFormData>): HTMLElement {
        if (data.address !== undefined) this.address = data.address;
        if (data.payment !== undefined) this.payment = data.payment;
        return this.container;
    }
}
