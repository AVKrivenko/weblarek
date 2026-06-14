import { Component } from '../base/Component';

export interface ICardData {
    id: string;
    title: string;
    price: number | null;
    image?: string;
    category?: string;
    description?: string;
}

export abstract class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement | null;
    protected priceElement: HTMLElement | null;
    protected button: HTMLButtonElement | null;

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = this.container.querySelector('.card__title');
        this.priceElement = this.container.querySelector('.card__price');
        this.button = this.container.querySelector('.card__button');
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            if (value === null) {
                this.priceElement.textContent = 'Бесценно';
                if (this.button) {
                    this.button.disabled = true;
                    this.button.textContent = 'Недоступно';
                }
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    abstract render(data: Partial<T>): HTMLElement;
}