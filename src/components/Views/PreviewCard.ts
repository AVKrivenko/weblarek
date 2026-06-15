import { ProductCard, IProductCardData } from './ProductCard';

export interface IPreviewCardData extends IProductCardData {
    description: string;
}

export class PreviewCard extends ProductCard<IPreviewCardData> {
    private descriptionElement: HTMLElement | null;

    constructor(container: HTMLElement, onButtonClick?: () => void) {
        super(container);
        
        this.descriptionElement = this.container.querySelector('.card__text');
        
        if (this.button && onButtonClick) {
            this.button.addEventListener('click', (e) => {
                e.stopPropagation();
                onButtonClick();
            });
        }
    }

    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }

    render(data: Partial<IPreviewCardData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}