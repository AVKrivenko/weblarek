import { Component } from '../base/Component';

export interface IBasketData {
    items: HTMLElement[]; 
    total: number;
}

export class Basket extends Component<IBasketData> {
    private listElement: HTMLElement | null;
    private totalElement: HTMLElement | null;
    private buttonElement: HTMLButtonElement | null;
    private onCheckoutCallback: () => void;

    constructor(container: HTMLElement, onCheckout: () => void) {
        super(container);
        
        this.onCheckoutCallback = onCheckout;
        this.listElement = this.container.querySelector('.basket__list');
        this.totalElement = this.container.querySelector('.basket__price');
        this.buttonElement = this.container.querySelector('.basket__button');
        
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                this.onCheckoutCallback();
            });
        }
    }

    
    set items(elements: HTMLElement[]) {
        if (this.listElement) {
            this.listElement.innerHTML = '';
            
            if (elements.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.textContent = 'Корзина пуста';
                emptyMessage.style.textAlign = 'center';
                this.listElement.appendChild(emptyMessage);
            } else {
                elements.forEach(el => {
                    this.listElement?.appendChild(el);
                });
            }
        }
    }

    set total(value: number) {
        if (this.totalElement) {
            this.totalElement.textContent = `${value} синапсов`;
        }
    }

    set valid(isValid: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = !isValid;
        }
    }

    render(data: Partial<IBasketData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}