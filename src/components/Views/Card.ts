import { Component } from '../base/Component';

export interface ICardData {
    title: string;
    price: number | null;
}

export abstract class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement | null;
    protected priceElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = this.container.querySelector('.card__title');
        this.priceElement = this.container.querySelector('.card__price');
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
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }

    abstract render(data: Partial<T>): HTMLElement;
}