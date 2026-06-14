import { Form } from './Form';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    private cardButton: HTMLButtonElement | null;
    private cashButton: HTMLButtonElement | null;
    private addressInput: HTMLInputElement | null;
    
    private onChangeCallback: (data: Partial<IOrderFormData>) => void;
    private onSubmitCallback: (data: IOrderFormData) => void;

    constructor(
        container: HTMLElement,
        onChange: (data: Partial<IOrderFormData>) => void,
        onSubmit: (data: IOrderFormData) => void
    ) {
        super(container);
        
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        
        this.cardButton = this.container.querySelector('button[name="card"]');
        this.cashButton = this.container.querySelector('button[name="cash"]');
        this.addressInput = this.container.querySelector('input[name="address"]');
        
        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.setPayment('card');
                this.onInputChange();
            });
        }
        
        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.setPayment('cash');
                this.onInputChange();
            });
        }
    }

    private setPayment(type: 'card' | 'cash') {
        if (this.cardButton && this.cashButton) {
            if (type === 'card') {
                this.cardButton.classList.add('button_alt-active');
                this.cashButton.classList.remove('button_alt-active');
            } else {
                this.cashButton.classList.add('button_alt-active');
                this.cardButton.classList.remove('button_alt-active');
            }
        }
    }

    private getFormData(): IOrderFormData {
        let payment: 'card' | 'cash' | null = null;
        if (this.cardButton?.classList.contains('button_alt-active')) {
            payment = 'card';
        } else if (this.cashButton?.classList.contains('button_alt-active')) {
            payment = 'cash';
        }
        
        return {
            payment: payment,
            address: this.addressInput?.value || ''
        };
    }

    private validate(data: IOrderFormData): boolean {
        return !!(data.payment && data.address.trim());
    }

    protected onInputChange(): void {
        const data = this.getFormData();
        const isValid = this.validate(data);
        this.valid = isValid;
        
        if (this.onChangeCallback) {
            this.onChangeCallback(data);
        }
        
        if (!isValid) {
            if (!data.payment) {
                this.errors = 'Выберите способ оплаты';
            } else if (!data.address.trim()) {
                this.errors = 'Введите адрес доставки';
            }
        } else {
            this.errors = '';
        }
    }

    protected onSubmit(): void {
        const data = this.getFormData();
        if (this.validate(data)) {
            this.onSubmitCallback(data);
        }
    }
}