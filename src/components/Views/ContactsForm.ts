import { Form } from './Form';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    private emailInput: HTMLInputElement | null;
    private phoneInput: HTMLInputElement | null;
    
    private onChangeCallback: (data: Partial<IContactsFormData>) => void;
    private onSubmitCallback: (data: IContactsFormData) => void;

    constructor(
        container: HTMLElement,
        onChange: (data: Partial<IContactsFormData>) => void,
        onSubmit: (data: IContactsFormData) => void
    ) {
        super(container);
        
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        
        this.emailInput = this.container.querySelector('input[name="email"]');
        this.phoneInput = this.container.querySelector('input[name="phone"]');
    }

    private getFormData(): IContactsFormData {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }

    private validate(data: IContactsFormData): boolean {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
        const phoneValid = data.phone.trim().length > 5;
        return emailValid && phoneValid;
    }

    protected onInputChange(): void {
        const data = this.getFormData();
        const isValid = this.validate(data);
        this.valid = isValid;
        
        if (this.onChangeCallback) {
            this.onChangeCallback(data);
        }
        
        if (!isValid) {
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                this.errors = 'Введите корректный email';
            } else if (!data.phone || data.phone.trim().length < 6) {
                this.errors = 'Введите номер телефона';
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