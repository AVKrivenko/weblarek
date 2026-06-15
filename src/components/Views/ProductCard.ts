import { Card, ICardData } from './Card';

export interface IProductCardData extends ICardData {
    image: string;
    category: string;
}

export abstract class ProductCard<T extends IProductCardData> extends Card<T> {
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;
    protected button: HTMLButtonElement | null;

    constructor(container: HTMLElement) {
        super(container);
        
        this.imageElement = this.container.querySelector('.card__image');
        this.categoryElement = this.container.querySelector('.card__category');
        this.button = this.container.querySelector('.card__button');
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.title);
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
        }
    }

    setButtonText(text: string): void {
        if (this.button) {
            this.button.textContent = text;
        }
    }

    set price(value: number | null) {
        super.price = value;
        if (this.button && value === null) {
            this.button.disabled = true;
            this.button.textContent = 'Недоступно';
        }
    }

    abstract render(data: Partial<T>): HTMLElement;
}