import { Card, ICardData } from './Card';
import { categoryMap } from '../../utils/constants';

export class CatalogCard extends Card<ICardData> {
    private categoryElement: HTMLElement | null;
    private imageElement: HTMLImageElement | null;

    constructor(container: HTMLElement, onClick?: (id: string) => void) {
        super(container);
        
        this.categoryElement = this.container.querySelector('.card__category');
        this.imageElement = this.container.querySelector('.card__image');
        
        if (onClick) {
            this.container.addEventListener('click', () => {
                onClick(this.id);
            });
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this.categoryElement.classList.add(categoryClass);
            }
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.title);
        }
    }

    render(data: Partial<ICardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}