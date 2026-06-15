import { Component } from '../base/Component';

export interface ICatalogData {
    items: HTMLElement[];   
}

export class Catalog extends Component<ICatalogData> {
    private galleryElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = this.container.querySelector('.gallery');
    }

    set items(elements: HTMLElement[]) {
        if (this.galleryElement) {
            this.galleryElement.innerHTML = '';
            elements.forEach(el => {
                this.galleryElement?.appendChild(el);
            });
        }
    }

    render(data: Partial<ICatalogData>): HTMLElement {
        if (data.items) {
            this.items = data.items;
        }
        return this.container;
    }
}