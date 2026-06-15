import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductsCatalog {
    protected products: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
  
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:loaded', { products: this.products });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
        this.events.emit('product:selected', { product: this.selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}