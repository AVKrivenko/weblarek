import { Component } from '../base/Component';

export interface IBasketCardData {
    id: string;
    title: string;
    price: number;
    index: number;
}

export class BasketCard extends Component<IBasketCardData> {
    private titleElement: HTMLElement | null;
    private priceElement: HTMLElement | null;
    private indexElement: HTMLElement | null;
    private deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, onDelete?: (id: string) => void) {
        super(container);
        
        this.titleElement = this.container.querySelector('.card__title');
        this.priceElement = this.container.querySelector('.card__price');
        this.indexElement = this.container.querySelector('.basket__item-index');
        this.deleteButton = this.container.querySelector('.basket__item-delete');
        
        if (this.deleteButton && onDelete) {
            this.deleteButton.addEventListener('click', () => {
                onDelete(this.id);
            });
        }
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number) {
        if (this.priceElement) {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }

    set index(value: number) {
        if (this.indexElement) {
            this.indexElement.textContent = String(value);
        }
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    render(data: Partial<IBasketCardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}