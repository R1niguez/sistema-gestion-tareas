import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const state = { products: [], category: '', cart: JSON.parse(localStorage.getItem('voltio-cart') || '[]'), admin: false, token: '', view: 'shop' };
const money = (value) => `$${Number(value).toFixed(2)}`;
const categories = [{ key: '', label: 'Todos' }, { key: 'arduino', label: 'Arduino' }, { key: 'esp32', label: 'ESP32' }, { key: 'modulos', label: 'Módulos' }];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json', ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...options.headers }, ...options });
  if (!response.ok) throw new Error((await response.json()).message || 'No se pudo completar la operación.');
  return response.status === 204 ? null : response.json();
}

async function loadProducts() {
  state.products = await request(`/products${state.category ? `?category=${state.category}` : ''}`);
  render();
}

function render() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#app').innerHTML = `
    <div class="min-h-screen bg-white text-ink">
      <header class="border-b border-slate-100 bg-white">
        <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" class="flex items-center gap-3" data-action="home"><span class="grid h-9 w-9 place-items-center rounded-lg bg-voltio text-xl font-black text-white">V</span><span><b class="block text-lg leading-none">voltiolab</b><small class="text-[8px] uppercase tracking-[.25em] text-slate-400">hardware para crear</small></span></a>
          <div class="hidden gap-8 text-sm font-medium text-slate-600 md:flex">${categories.slice(1).map((item) => `<button data-category="${item.key}" class="${state.category === item.key ? 'border-b-2 border-voltio pb-1 text-voltio' : 'hover:text-voltio'}">${item.label}</button>`).join('')}<button data-action="contacto" class="hover:text-voltio">Contacto</button>${state.admin ? '<button data-action="admin" class="border-b-2 border-voltio pb-1 text-voltio">Admin</button>' : ''}</div>
          <button data-action="cart" class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">Carrito <span class="ml-2 rounded-full bg-voltio px-2 py-1 text-xs text-white">${cartCount}</span></button>
        </nav>
      </header>
      ${state.view === 'login' ? loginView() : state.admin && state.view === 'admin' ? adminView() : shopView()}
      <footer class="flex justify-between border-t border-slate-100 px-6 py-7 text-xs text-slate-400"><span>Hecho para probar, aprender y construir. © 2026 VOLTIO LAB</span><button data-action="login" class="hover:text-voltio">${state.admin ? 'Sesión iniciada' : 'Acceso privado'}</button></footer>
    </div>`;
  bindEvents();
}

function shopView() {
  return `<main>
    <section class="grid min-h-[550px] md:grid-cols-2">
      <div class="flex flex-col justify-center bg-mist px-8 py-16 md:px-16"><p class="mb-6 text-xs font-bold uppercase tracking-[.25em] text-voltio">● Componentes para ideas en movimiento</p><h1 class="max-w-xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">Tu próxima gran idea empieza en <span class="text-voltio">una placa.</span></h1><p class="mt-7 max-w-md text-lg leading-8 text-slate-500">Arduino, ESP32 y módulos listos para convertir curiosidad en proyectos reales.</p><button data-action="explore" class="mt-9 w-fit rounded bg-voltio px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200">Explorar productos <span class="ml-5">→</span></button></div>
      <div class="min-h-[400px] bg-cover bg-center" style="background-image:url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85')"></div>
    </section>
    <section id="catalogo" class="mx-auto max-w-7xl px-6 py-16"><div class="mb-8 flex items-end justify-between"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-slate-400">Componentes para crear</p><h2 class="mt-2 text-3xl font-black">Explora el catálogo.</h2></div><span class="text-xs uppercase tracking-widest text-slate-400">${state.products.length} productos</span></div><div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">${state.products.map(productCard).join('')}</div></section>
  </main>`;
}

function loginView() {
  return `<main class="mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-6 py-16"><form data-login-form class="w-full max-w-md border border-slate-200 bg-white p-8 shadow-sm"><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Panel privado</p><h1 class="mt-4 text-4xl font-black">Iniciar sesión.</h1><label class="mt-8 block text-sm font-semibold">Correo<input name="email" type="email" value="admin@voltiolab.com" required class="mt-2 w-full border border-slate-200 px-4 py-3 outline-none focus:border-voltio"></label><label class="mt-5 block text-sm font-semibold">Contraseña<input name="password" type="password" required class="mt-2 w-full border border-slate-200 px-4 py-3 outline-none focus:border-voltio"></label><button class="mt-7 w-full bg-ink px-5 py-3 text-sm font-bold text-white">Entrar →</button><button type="button" data-action="home" class="mt-4 w-full text-sm text-slate-500">Volver a la tienda</button></form></main>`;
}

function productCard(product) {
  return `<article class="group"><div class="relative overflow-hidden rounded-sm bg-slate-100"><img src="${product.image}" alt="${product.name}" class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"><span class="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">${product.category}</span></div><div class="flex items-start justify-between gap-3 pt-4"><div><h3 class="font-bold">${product.name}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${product.description}</p></div><strong class="text-voltio">${money(product.price)}</strong></div><button data-add="${product.id}" class="mt-4 border-b border-slate-300 pb-2 text-xs font-semibold text-slate-600 hover:border-voltio hover:text-voltio">Agregar al carrito <span class="ml-8">+</span></button></article>`;
}

function adminView() {
  return `<main class="mx-auto min-h-[650px] max-w-7xl px-6 py-16"><div class="mb-12 flex items-end justify-between"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Gestión de tienda</p><h1 class="mt-3 text-5xl font-black">Administra <span class="text-voltio">catálogo.</span></h1></div><button data-action="logout" class="border border-slate-200 px-4 py-2 text-sm">Salir</button></div><div class="overflow-x-auto border-y border-slate-200"><table class="w-full text-left text-sm"><thead><tr class="text-xs uppercase tracking-widest text-slate-400"><th class="px-3 py-4">Categoría</th><th>Producto</th><th>Precio</th><th>Acción</th></tr></thead><tbody>${state.products.map((p) => `<tr class="border-t border-slate-100"><td class="px-3 py-5 text-xs uppercase text-slate-400">${p.category}</td><td class="font-semibold">${p.name}</td><td>${money(p.price)}</td><td><button data-delete="${p.id}" class="text-red-500">Eliminar</button></td></tr>`).join('')}</tbody></table></div></main>`;
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.category; loadProducts(); }));
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(Number(button.dataset.add))));
  document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', async () => { await request(`/admin/products/${button.dataset.delete}`, { method: 'DELETE' }); loadProducts(); }));
  document.querySelector('[data-action="explore"]')?.addEventListener('click', () => document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' }));
  document.querySelector('[data-action="home"]')?.addEventListener('click', (event) => { event.preventDefault(); state.admin = false; state.view = 'shop'; state.category = ''; loadProducts(); });
  document.querySelector('[data-action="admin"]')?.addEventListener('click', () => { state.view = 'admin'; render(); });
  document.querySelector('[data-action="login"]')?.addEventListener('click', () => { if (!state.admin) { state.view = 'login'; render(); } });
  document.querySelector('[data-login-form]')?.addEventListener('submit', login);
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => { state.admin = false; state.token = ''; state.view = 'shop'; loadProducts(); });
  document.querySelector('[data-action="cart"]')?.addEventListener('click', checkout);
}

function addToCart(id) {
  const item = state.cart.find((entry) => entry.productId === id);
  if (item) item.quantity += 1; else state.cart.push({ productId: id, quantity: 1 });
  localStorage.setItem('voltio-cart', JSON.stringify(state.cart));
  render();
}

async function login(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  try { const result = await request('/login', { method: 'POST', body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) }); state.token = result.token; state.admin = true; state.view = 'admin'; state.products = await request('/admin/products'); render(); } catch (error) { window.alert(error.message); }
}

async function checkout() {
  if (!state.cart.length) return window.alert('Agrega un producto al carrito primero.');
  const customerName = window.prompt('Nombre para el pedido:');
  const customerEmail = window.prompt('Correo de contacto:');
  if (!customerName || !customerEmail) return;
  try { await request('/checkout', { method: 'POST', body: JSON.stringify({ customerName, customerEmail, items: state.cart }) }); state.cart = []; localStorage.removeItem('voltio-cart'); render(); window.alert('Pedido registrado. ¡Gracias por crear con Voltio Lab!'); } catch (error) { window.alert(error.message); }
}

loadProducts().catch((error) => { document.querySelector('#app').innerHTML = `<p class="p-10 text-red-600">No se pudo conectar con la API: ${error.message}</p>`; });
