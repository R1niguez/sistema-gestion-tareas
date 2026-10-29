# Voltio Lab

Tienda web de hardware para crear: Arduino, ESP32 y módulos para makers y
estudiantes. El frontend usa HTML, JavaScript, Vite y Tailwind CSS. La API usa
NestJS y PostgreSQL.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Instalación

```bash
git clone https://github.com/R1niguez/sistema-gestion-tareas.git
cd sistema-gestion-tareas
npm run install:all
```

También puedes instalar cada aplicación por separado:

```bash
cd backend
npm install
```

Configura `backend/.env` (no se versiona):

```text
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/voltiolabDB
ADMIN_EMAIL=admin@voltiolab.com
ADMIN_PASSWORD=admin123
PORT=3001
```

La API crea las tablas y datos iniciales al arrancar. También puedes ejecutar
[`backend/database.sql`](./backend/database.sql) manualmente.

```bash
cd frontend
npm install
```

## Ejecución

En dos terminales:

```bash
cd backend
npm run build
npm run api
```

```bash
cd frontend
npm run dev
```

La tienda queda en `http://localhost:5173` y la API en
`http://localhost:3001`.

## Funcionalidades

- Catálogo filtrable por Arduino, ESP32 y módulos.
- Carrito persistente en el navegador.
- Checkout que registra órdenes, artículos y pago pendiente.
- Login administrativo y eliminación de productos con Bearer token.
- Esquema PostgreSQL con integridad referencial.

## API REST

- `GET /api/products`
- `POST /api/login`
- `GET /api/admin/products` (Bearer token)
- `POST /api/admin/products` (Bearer token)
- `PUT /api/admin/products/:id` (Bearer token)
- `DELETE /api/admin/products/:id` (Bearer token)
- `GET /api/admin/orders` (Bearer token)
- `POST /api/checkout`

## Verificaciones

```bash
cd backend
npm test
npm run build

cd ../frontend
npm test
npm run lint
npm run build
```

La especificación y los artefactos SDD están en [`specs/`](./specs/). El
pipeline de CI está en [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).
