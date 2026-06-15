import { ProductCard, IProductCardData } from './ProductCard';
import { categoryMap } from '../../utils/constants';

export class CatalogCard extends ProductCard<IProductCardData> {
    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        
        if (onClick) {
            this.container.addEventListener('click', () => {
                onClick();
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

    render(data: Partial<IProductCardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}