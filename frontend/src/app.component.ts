import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, Category, Product, ProductCategory } from './app.models';
import { ProductService } from './product.service';

type View = 'home' | 'category' | 'contact' | 'login' | 'admin';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly productsApi = inject(ProductService);
  readonly categories: Category[] = [
    { key: 'arduino', label: 'Arduino' },
    { key: 'esp32', label: 'ESP32' },
    { key: 'modulos', label: 'Módulos' },
  ];
  products: Product[] = [];
  view: View = 'home';
  category: ProductCategory | '' = '';
  cart: CartItem[] = this.readCart();
  token = localStorage.getItem('voltio-admin-token') ?? '';
  admin = Boolean(this.token);
  editingId: string | number | null = null;
  loading = false;
  error = '';
  notice = '';
  loginEmail = 'admin@voltiolab.com';
  loginPassword = '';
  productForm: Omit<Product, 'id'> = this.emptyProduct();
  contact = { name: '', email: '', message: '' };

  ngOnInit(): void {
    if (this.admin) {
      this.view = 'admin';
      this.loadAdminProducts(true);
    } else {
      this.loadProducts();
    }
  }

  get cartCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get editingProduct(): Product | undefined {
    return this.products.find((item) => String(item.id) === String(this.editingId));
  }

  navigate(view: View, category: ProductCategory | '' = ''): void {
    this.error = '';
    this.notice = '';
    this.editingId = null;
    this.category = category;
    if (view === 'admin' && this.admin) {
      this.view = 'admin';
      this.loadAdminProducts();
      return;
    }
    this.view = view;
    if (view === 'category') this.loadProducts();
    if (view === 'home') this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsApi.products(this.category || undefined).subscribe({
      next: (products) => { this.products = products; this.loading = false; },
      error: (error: Error) => this.showError(error),
    });
  }

  private loadAdminProducts(validate = false): void {
    this.loading = true;
    this.productsApi.adminProducts(this.token).subscribe({
      next: (products) => { this.products = products; this.loading = false; },
      error: (error: Error) => {
        this.loading = false;
        if (validate) this.logout();
        else this.showError(error);
      },
    });
  }

  addToCart(product: Product): void {
    const item = this.cart.find((entry) => String(entry.productId) === String(product.id));
    if (item) item.quantity += 1;
    else this.cart = [...this.cart, { productId: product.id, quantity: 1 }];
    this.saveCart();
    this.notice = `${product.name} se agregó al carrito.`;
  }

  checkout(): void {
    if (!this.cart.length) {
      this.showError(new Error('Agrega un producto al carrito primero.'));
      return;
    }
    const customerName = window.prompt('Nombre para el pedido:');
    const customerEmail = window.prompt('Correo de contacto:');
    if (!customerName || !customerEmail) return;
    this.productsApi.checkout(customerName, customerEmail, this.cart).subscribe({
      next: () => {
        this.cart = [];
        this.saveCart();
        this.notice = 'Pedido registrado. ¡Gracias por crear con Voltio Lab!';
      },
      error: (error: Error) => this.showError(error),
    });
  }

  login(): void {
    this.error = '';
    this.productsApi.login(this.loginEmail, this.loginPassword).subscribe({
      next: (result) => {
        this.token = result.token;
        this.admin = true;
        localStorage.setItem('voltio-admin-token', this.token);
        this.view = 'admin';
        this.loadAdminProducts();
      },
      error: (error: Error) => this.showError(error),
    });
  }

  logout(): void {
    this.admin = false;
    this.token = '';
    this.view = 'home';
    this.category = '';
    localStorage.removeItem('voltio-admin-token');
    this.loadProducts();
  }

  edit(product: Product): void {
    this.editingId = product.id;
    this.productForm = {
      category: product.category,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      image: product.image,
      active: product.active ?? true,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.productForm = this.emptyProduct();
  }

  saveProduct(): void {
    const request = this.editingId === null
      ? this.productsApi.create(this.productForm, this.token)
      : this.productsApi.update(this.editingId, this.productForm, this.token);
    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.notice = 'Producto guardado correctamente.';
        this.loadAdminProducts();
      },
      error: (error: Error) => this.showError(error),
    });
  }

  remove(product: Product): void {
    if (!window.confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;
    this.productsApi.remove(product.id, this.token).subscribe({
      next: () => {
        this.notice = 'Producto eliminado correctamente.';
        this.loadAdminProducts();
      },
      error: (error: Error) => this.showError(error),
    });
  }

  submitContact(): void {
    this.contact = { name: '', email: '', message: '' };
    this.notice = 'Mensaje enviado. Gracias por contactar a Voltio Lab.';
  }

  money(value: number | string): string {
    return `$${Number(value).toFixed(2)}`;
  }

  categoryLabel(category: ProductCategory | ''): string {
    return this.categories.find((item) => item.key === category)?.label ?? category;
  }

  private emptyProduct(): Omit<Product, 'id'> {
    return { category: 'arduino', name: '', price: 0, description: '', image: '', active: true };
  }

  private saveCart(): void {
    localStorage.setItem('voltio-cart', JSON.stringify(this.cart));
  }

  private readCart(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('voltio-cart') ?? '[]') as CartItem[]; }
    catch { return []; }
  }

  private showError(error: Error): void {
    this.loading = false;
    this.error = error.message || 'No se pudo completar la operación.';
  }
}
