import { Component } from '../base/Component';

export class Modal extends Component<{ content: HTMLElement }> {
    private closeButton: HTMLButtonElement | null;
    private contentContainer: HTMLElement | null;
    private onCloseCallback: () => void;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        
        this.onCloseCallback = onClose;
        this.closeButton = this.container.querySelector('.modal__close');
        this.contentContainer = this.container.querySelector('.modal__content');
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.onCloseCallback();
    }

    set content(value: HTMLElement) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(value);
        }
    }

    render(data: Partial<{ content: HTMLElement }>): HTMLElement {
        if (data.content) {
            this.content = data.content;
        }
        return this.container;
    }
      isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }
}