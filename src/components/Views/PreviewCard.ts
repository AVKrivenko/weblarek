import { Card, ICardData } from './Card';

export class PreviewCard extends Card<ICardData> {
    private descriptionElement: HTMLElement | null;
    private imageElement: HTMLImageElement | null;
    private categoryElement: HTMLElement | null;

    constructor(container: HTMLElement, onAddToCart?: (id: string) => void) {
        super(container);
        
        this.descriptionElement = this.container.querySelector('.card__text');
        this.imageElement = this.container.querySelector('.card__image');
        this.categoryElement = this.container.querySelector('.card__category');
        
        if (this.button && onAddToCart) {
            this.button.addEventListener('click', (e) => {
                e.stopPropagation();
                onAddToCart(this.id);
            });
        }
    }

    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
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

    render(data: Partial<ICardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
    setButtonText(text: string) {
    if (this.button) {
        this.button.textContent = text;
    }
}
}