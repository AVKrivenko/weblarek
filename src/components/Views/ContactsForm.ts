import { Form } from './Form';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    private emailInput: HTMLInputElement | null;
    private phoneInput: HTMLInputElement | null;
    
    private onChangeCallback: (field: keyof IContactsFormData, value: string) => void;
    private onSubmitCallback: () => void;

    constructor(
        container: HTMLElement,
        onChange: (field: keyof IContactsFormData, value: string) => void,
        onSubmit: () => void
    ) {
        super(container);
        
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        
        
        this.emailInput = this.container.querySelector('input[name="email"]');
        this.phoneInput = this.container.querySelector('input[name="phone"]');
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                this.onChangeCallback('email', this.emailInput?.value || '');
            });
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', () => {
                this.onChangeCallback('phone', this.phoneInput?.value || '');
            });
        }
    }

    set email(value: string) {
        if (this.emailInput) {
            this.emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this.phoneInput) {
            this.phoneInput.value = value;
        }
    }

    protected onSubmit(): void {
        this.onSubmitCallback();
    }

    render(data: Partial<IContactsFormData>): HTMLElement {
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        return this.container;
    }
}