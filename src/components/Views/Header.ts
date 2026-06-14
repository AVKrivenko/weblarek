import { Component } from '../base/Component'

export interface IHeaderData {
    counter: number;  
}


export class Header extends Component<IHeaderData> {
    private basketCounter: HTMLElement | null;;   
    private basketButton: HTMLButtonElement | null;; 
    private onBasketClick: () => void;    


    constructor(container: HTMLElement, onBasketClick: () => void) {
        super(container); 
        
        this.onBasketClick = onBasketClick;
        this.basketCounter = this.container.querySelector('.header__basket-counter');
        this.basketButton = this.container.querySelector('.header__basket');
      
        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                this.onBasketClick();
            });
        }
    }

    set counter(value: number) {
        if (this.basketCounter) {
            this.basketCounter.textContent = String(value);
        }
    }

    render(data: Partial<IHeaderData>): HTMLElement {
        Object.assign(this, data);
        return this.container;
    }
}