import { Component } from '../base/Component';
import { CatalogCard } from './CatalogCard';

export interface ICatalogData {
    cards: CatalogCard[];
}

export class Catalog extends Component<ICatalogData> {
    private galleryElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = this.container.querySelector('.gallery');
    }

    set cards(cards: CatalogCard[]) {
        if (this.galleryElement) {
            this.galleryElement.innerHTML = '';
            
            cards.forEach(card => {
                const cardElement = card.render({});
                this.galleryElement?.appendChild(cardElement);
            });
        }
    }

    render(data: Partial<ICatalogData>): HTMLElement {
        if (data.cards) {
            this.cards = data.cards;
        }
        return this.container;
    }
}