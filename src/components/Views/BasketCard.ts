import { Card, ICardData } from './Card';

export interface IBasketCardData extends ICardData {
    index: number;
}

export class BasketCard extends Card<IBasketCardData> {
    private indexElement: HTMLElement | null;
    private deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);
        
        this.indexElement = this.container.querySelector('.basket__item-index');
        this.deleteButton = this.container.querySelector('.basket__item-delete');
        
        if (this.deleteButton && onDelete) {
            this.deleteButton.addEventListener('click', () => {
                onDelete();  
            });
        }
    }

    set index(value: number) {
        if (this.indexElement) {
            this.indexElement.textContent = String(value);
        }
    }

    render(data: Partial<IBasketCardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}