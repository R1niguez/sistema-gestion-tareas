import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const state = {
  products: [],
  category: '',
  cart: JSON.parse(localStorage.getItem('voltio-cart') || '[]'),
  admin: false,
  token: localStorage.getItem('voltio-admin-token') || '',
  view: localStorage.getItem('voltio-admin-token') ? 'admin' : 'home',
  admin: Boolean(localStorage.getItem('voltio-admin-token')),
  editingId: null,
};
const categories = [
  { key: 'arduino', label: 'Arduino' },
  { key: 'esp32', label: 'ESP32' },
  { key: 'modulos', label: 'Módulos' },
];
const money = (value) => `$${Number(value).toFixed(2)}`;

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error || 'No se pudo completar la operación.');
  }
  return response.status === 204 ? null : response.json();
}

async function loadProducts() {
  const query = state.category ? `?category=${state.category}` : '';
  state.products = await request(`/products${query}`);
  render();
}

function render() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  const navigation = [
    `<button data-view="home" class="${state.view === 'home' ? 'nav-active' : ''}">Inicio</button>`,
    ...categories.map((item) => `<button data-category="${item.key}" class="${state.category === item.key ? 'nav-active' : ''}">${item.label}</button>`),
    `<button data-view="contact" class="${state.view === 'contact' ? 'nav-active' : ''}">Contacto</button>`,
    state.admin ? `<button data-view="admin" class="${state.view === 'admin' ? 'nav-active' : ''}">Admin</button>` : '',
    state.admin ? '' : `<button data-view="login" class="${state.view === 'login' ? 'nav-active' : ''}">Iniciar sesión</button>`,
  ].join('');

  document.querySelector('#app').innerHTML = `
    <div class="min-h-screen bg-white text-ink">
      <header class="border-b border-slate-100 bg-white">
        <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#/" data-view="home" class="flex items-center gap-3"><span class="grid h-9 w-9 place-items-center rounded-lg bg-voltio text-xl font-black text-white">V</span><span><b class="block text-lg leading-none">voltiolab</b><small class="text-[8px] uppercase tracking-[.25em] text-slate-400">hardware para crear</small></span></a>
          <div class="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">${navigation}</div>
          <button data-action="cart" class="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">Carrito <span class="ml-2 rounded-full bg-voltio px-2 py-1 text-xs text-white">${count}</span></button>
        </nav>
        <div class="flex flex-wrap justify-center gap-5 border-t border-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 md:hidden">${navigation}</div>
      </header>
      ${state.view === 'login' ? loginView() : state.view === 'contact' ? contactView() : state.view === 'admin' && state.admin ? adminView() : state.view === 'category' ? categoryView() : homeView()}
      <footer class="border-t border-slate-100 px-6 py-7 text-center text-xs text-slate-400">Hecho para probar, aprender y construir. © 2026 VOLTIO LAB</footer>
    </div>`;
  bindEvents();
}

function homeView() {
  return `<main>
    <section class="grid min-h-[550px] md:grid-cols-2">
      <div class="flex flex-col justify-center bg-mist px-8 py-16 md:px-16"><p class="mb-6 text-xs font-bold uppercase tracking-[.25em] text-voltio">● Componentes para ideas en movimiento</p><h1 class="max-w-xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">Tu próxima gran idea empieza en <span class="text-voltio">una placa.</span></h1><p class="mt-7 max-w-md text-lg leading-8 text-slate-500">Arduino, ESP32 y módulos listos para convertir curiosidad en proyectos reales.</p><button data-view="category" data-category="arduino" class="mt-9 w-fit rounded bg-voltio px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200">Explorar productos <span class="ml-5">→</span></button></div>
      <div class="min-h-[400px] bg-cover bg-center" style="background-image:url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85')"></div>
    </section>
  </main>`;
}

function categoryView() {
  const title = categories.find((item) => item.key === state.category)?.label || 'Productos';
  return `<main class="mx-auto max-w-7xl px-6 py-14"><div class="mb-12 flex items-end justify-between border-b border-slate-200 pb-6"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Catálogo Voltio Lab</p><h1 class="mt-3 text-5xl font-black">${title}.</h1></div><span class="text-xs uppercase tracking-widest text-slate-400">${state.products.length} productos</span></div><div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">${state.products.map(productCard).join('')}</div></main>`;
}

function productCard(product) {
  return `<article class="group"><div class="relative overflow-hidden rounded-sm bg-slate-100"><img src="${product.image}" alt="${product.name}" class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"><span class="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">${product.category}</span></div><div class="flex items-start justify-between gap-3 pt-4"><div><h3 class="font-bold">${product.name}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${product.description}</p></div><strong class="text-voltio">${money(product.price)}</strong></div><button data-add="${product.id}" class="mt-4 border-b border-slate-300 pb-2 text-xs font-semibold text-slate-600 hover:border-voltio hover:text-voltio">Agregar al carrito <span class="ml-8">+</span></button></article>`;
}

function contactView() {
  return `<main class="mx-auto grid min-h-[650px] max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Estamos para ayudarte</p><h1 class="mt-4 text-5xl font-black leading-tight">Hablemos de tu próxima <span class="text-voltio">idea.</span></h1><p class="mt-6 max-w-lg text-lg leading-8 text-slate-500">¿Tienes dudas sobre un componente o quieres contarnos sobre tu proyecto? Escríbenos y te ayudaremos a encontrar el punto de partida.</p><div class="mt-10 space-y-4 text-sm"><p><b class="block text-slate-400">Correo</b> hola@voltiolab.com</p><p><b class="block text-slate-400">Horario</b> Lunes a viernes · 09:00 - 17:00</p><p><b class="block text-slate-400">Ubicación</b> Ecuador · Comunidad maker</p></div></div><form data-contact-form class="border border-slate-200 p-8 shadow-sm"><label class="block text-sm font-semibold">Nombre<input name="name" required class="mt-2 w-full border border-slate-200 px-4 py-3"></label><label class="mt-5 block text-sm font-semibold">Correo<input name="email" type="email" required class="mt-2 w-full border border-slate-200 px-4 py-3"></label><label class="mt-5 block text-sm font-semibold">Mensaje<textarea name="message" rows="5" required class="mt-2 w-full border border-slate-200 px-4 py-3"></textarea></label><button class="mt-6 w-full bg-ink px-5 py-3 text-sm font-bold text-white">Enviar mensaje →</button></form></main>`;
}

function loginView() {
  return `<main class="mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-6 py-16"><form data-login-form class="w-full max-w-md border border-slate-200 bg-white p-8 shadow-sm"><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Panel privado</p><h1 class="mt-4 text-4xl font-black">Iniciar sesión.</h1><label class="mt-8 block text-sm font-semibold">Correo<input name="email" type="email" value="admin@voltiolab.com" required class="mt-2 w-full border border-slate-200 px-4 py-3"></label><label class="mt-5 block text-sm font-semibold">Contraseña<input name="password" type="password" required class="mt-2 w-full border border-slate-200 px-4 py-3"></label><button class="mt-7 w-full bg-ink px-5 py-3 text-sm font-bold text-white">Entrar →</button></form></main>`;
}

function adminView() {
  const product = state.products.find((item) => String(item.id) === String(state.editingId));
  return `<main class="mx-auto min-h-[650px] max-w-7xl px-6 py-14"><div class="mb-10 flex items-end justify-between"><div><p class="text-xs font-bold uppercase tracking-[.25em] text-voltio">Gestión de tienda</p><h1 class="mt-3 text-5xl font-black">Administra <span class="text-voltio">catálogo.</span></h1></div><button data-action="logout" class="border border-slate-200 px-4 py-2 text-sm">Cerrar sesión</button></div><form data-product-form class="mb-12 grid gap-4 border border-slate-200 p-6 md:grid-cols-5"><input name="name" placeholder="Nombre" required value="${product?.name || ''}" class="border border-slate-200 px-3 py-3"><select name="category" class="border border-slate-200 px-3 py-3">${categories.map((item) => `<option value="${item.key}" ${product?.category === item.key ? 'selected' : ''}>${item.label}</option>`).join('')}</select><input name="price" type="number" step="0.01" min="0" placeholder="Precio" required value="${product?.price || ''}" class="border border-slate-200 px-3 py-3"><input name="image" placeholder="URL de imagen" required value="${product?.image || ''}" class="border border-slate-200 px-3 py-3"><input name="description" placeholder="Descripción" required value="${product?.description || ''}" class="border border-slate-200 px-3 py-3 md:col-span-4"><button class="bg-voltio px-4 py-3 text-sm font-bold text-white">${product ? 'Guardar cambios' : 'Nuevo producto'}</button>${product ? '<button type="button" data-action="cancel-edit" class="border border-slate-200 px-4 py-3 text-sm">Cancelar</button>' : ''}</form><div class="overflow-x-auto border-y border-slate-200"><table class="w-full text-left text-sm"><thead><tr class="text-xs uppercase tracking-widest text-slate-400"><th class="px-3 py-4">Categoría</th><th>Producto</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>${state.products.map((item) => `<tr class="border-t border-slate-100"><td class="px-3 py-5 text-xs uppercase text-slate-400">${item.category}</td><td class="font-semibold">${item.name}</td><td>${money(item.price)}</td><td class="space-x-4"><button data-edit="${item.id}" class="text-voltio">Editar</button><button data-delete="${item.id}" class="text-red-500">Eliminar</button></td></tr>`).join('')}</tbody></table></div></main>`;
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.category; state.view = 'category'; loadProducts(); }));
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view, button.dataset.category)));
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(Number(button.dataset.add))));
  document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', async () => { if (!window.confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) return; await request(`/admin/products/${button.dataset.delete}`, { method: 'DELETE' }); state.products = await request('/admin/products'); render(); }));
  document.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => { state.editingId = button.dataset.edit; state.view = 'admin'; render(); }));
  document.querySelector('[data-product-form]')?.addEventListener('submit', saveProduct);
  document.querySelector('[data-login-form]')?.addEventListener('submit', login);
  document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => { event.preventDefault(); window.alert('Mensaje enviado. Gracias por contactar a Voltio Lab.'); event.currentTarget.reset(); });
  document.querySelector('[data-action="cancel-edit"]')?.addEventListener('click', () => { state.editingId = null; render(); });
  document.querySelector('[data-action="logout"]')?.addEventListener('click', () => { state.admin = false; state.token = ''; state.view = 'home'; state.category = ''; localStorage.removeItem('voltio-admin-token'); loadProducts(); });
  document.querySelector('[data-action="cart"]')?.addEventListener('click', checkout);
}

async function navigate(view, category = '') {
  state.category = category || '';
  state.view = view === 'category' ? 'category' : view === 'admin' && state.admin ? 'admin' : view;
  state.editingId = null;
  if (state.view === 'admin') {
    state.category = '';
    state.products = await request('/admin/products');
    render();
    return;
  }
  if (state.view === 'category' || state.view === 'home') {
    await loadProducts();
    return;
  }
  render();
}

async function login(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try { const result = await request('/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); state.token = result.token; localStorage.setItem('voltio-admin-token', result.token); state.admin = true; state.view = 'admin'; state.products = await request('/admin/products'); render(); } catch (error) { window.alert(error.message); }
}

async function saveProduct(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const data = Object.fromEntries(form.entries());
  data.price = Number(data.price);
  try { await request(state.editingId ? `/admin/products/${state.editingId}` : '/admin/products', { method: state.editingId ? 'PUT' : 'POST', body: JSON.stringify(data) }); state.editingId = null; state.products = await request('/admin/products'); render(); } catch (error) { window.alert(error.message); }
}

function addToCart(id) {
  const item = state.cart.find((entry) => entry.productId === id);
  if (item) item.quantity += 1; else state.cart.push({ productId: id, quantity: 1 });
  localStorage.setItem('voltio-cart', JSON.stringify(state.cart));
  render();
}

async function checkout() {
  if (!state.cart.length) return window.alert('Agrega un producto al carrito primero.');
  const customerName = window.prompt('Nombre para el pedido:');
  const customerEmail = window.prompt('Correo de contacto:');
  if (!customerName || !customerEmail) return;
  try { await request('/checkout', { method: 'POST', body: JSON.stringify({ customerName, customerEmail, items: state.cart }) }); state.cart = []; localStorage.removeItem('voltio-cart'); render(); window.alert('Pedido registrado. ¡Gracias por crear con Voltio Lab!'); } catch (error) { window.alert(error.message); }
}

async function initialize() {
  try {
    if (state.admin) {
      state.products = await request('/admin/products');
      render();
      return;
    }
    await loadProducts();
  } catch (error) {
    state.admin = false;
    state.token = '';
    localStorage.removeItem('voltio-admin-token');
    await loadProducts().catch(() => {
      document.querySelector('#app').innerHTML = `<p class="p-10 text-red-600">No se pudo conectar con la API: ${error.message}</p>`;
    });
  }
}

initialize();
