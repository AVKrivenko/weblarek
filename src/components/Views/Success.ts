import { Component } from '../base/Component';

export interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    private descriptionElement: HTMLElement | null;
    private closeButton: HTMLButtonElement | null;
    private onCloseCallback: () => void;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        
        this.onCloseCallback = onClose;
        this.descriptionElement = this.container.querySelector('.order-success__description');
        this.closeButton = this.container.querySelector('.order-success__close');
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.onCloseCallback();
            });
        }
    }

    set total(value: number) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = `Списано ${value} синапсов`;
        }
    }

    render(data: Partial<ISuccessData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}