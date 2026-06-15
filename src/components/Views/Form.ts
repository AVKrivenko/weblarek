import { Component } from '../base/Component';  // ← добавить эту строку

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement | null;
    protected errorsContainer: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        
        this.submitButton = this.container.querySelector('.button[type="submit"]');
        this.errorsContainer = this.container.querySelector('.form__errors');
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    set valid(isValid: boolean) {
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }
    }

    set errors(value: string) {
        if (this.errorsContainer) {
            this.errorsContainer.textContent = value;
        }
    }

    protected abstract onSubmit(): void;

    render(data: Partial<T>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}