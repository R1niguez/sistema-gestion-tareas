# Especificación: Voltio Lab

## 1. Propósito y alcance

Voltio Lab es una tienda web de componentes electrónicos para makers,
estudiantes y personas que desarrollan prototipos. Permite explorar un
catálogo de Arduino, ESP32 y módulos, gestionar un carrito y registrar pedidos.
Incluye un acceso administrativo para mantener el catálogo y consultar órdenes.

## 2. Historias de usuario

### HU-01: Explorar el catálogo

**Como** visitante, **quiero** ver productos con imagen, categoría, precio y
descripción, **para** elegir componentes para mi proyecto.

**Criterios de aceptación**

- El catálogo muestra únicamente productos activos.
- Cada tarjeta muestra nombre, imagen, categoría, precio y descripción.
- El visitante puede filtrar por Arduino, ESP32 o módulos.

### HU-02: Comprar componentes

**Como** cliente, **quiero** agregar productos al carrito y registrar mis datos,
**para** enviar un pedido sin abandonar la tienda.

**Criterios de aceptación**

- El botón de carrito refleja la cantidad de unidades seleccionadas.
- El checkout exige nombre, correo válido y al menos un producto.
- La API registra la orden, sus artículos y un pago pendiente dentro de una
  transacción PostgreSQL.

### HU-03: Administrar productos

**Como** administrador, **quiero** iniciar sesión y gestionar el catálogo,
**para** mantener actualizada la oferta de Voltio Lab.

**Criterios de aceptación**

- El acceso requiere `admin@voltiolab.com` y una contraseña configurada por
  variable de entorno.
- Las rutas administrativas exigen un Bearer token válido.
- El administrador puede consultar, crear, editar y eliminar productos.

### HU-04: Consultar pedidos

**Como** administrador, **quiero** consultar las órdenes registradas, **para**
  dar seguimiento a las compras.

**Criterios de aceptación**

- `GET /api/admin/orders` solo responde con autorización válida.
- Cada orden conserva cliente, correo, total y fecha.

## 3. Requisitos funcionales

- **RF-01:** La aplicación Angular debe presentar el hero, navegación, catálogo y
  filtros responsive con Tailwind CSS.
- **RF-02:** La API NestJS debe exponer `GET /api/products` con filtro opcional.
- **RF-03:** La API debe autenticar mediante `POST /api/login`.
- **RF-04:** La API debe proteger el CRUD de `/api/admin/products`.
- **RF-05:** La API debe proteger `GET /api/admin/orders`.
- **RF-06:** La API debe registrar pedidos mediante `POST /api/checkout`.
- **RF-07:** PostgreSQL debe persistir usuarios, productos, órdenes, artículos y
  pagos con restricciones e integridad referencial.
- **RF-08:** El pipeline debe instalar dependencias, ejecutar lint, pruebas y
  compilación de frontend y backend.

## 4. Requisitos no funcionales

- **RNF-01:** Node.js 20 o superior y PostgreSQL 14 o superior.
- **RNF-02:** La conexión se configura con `DATABASE_URL`; ningún secreto se
  versiona.
- **RNF-03:** La API usa consultas parametrizadas y contraseñas derivadas con
  `scrypt`.
- **RNF-04:** La solución mantiene frontend, backend, persistencia y pruebas en
  directorios separados.
- **RNF-05:** El diseño debe ser legible en dispositivos móviles y escritorio.

## 5. Contrato de API

| Método | Ruta | Autorización |
|---|---|---|
| GET | `/api/products?category=arduino` | Pública |
| POST | `/api/login` | Pública |
| GET/POST/PUT/DELETE | `/api/admin/products` | Bearer token |
| GET | `/api/admin/orders` | Bearer token |
| POST | `/api/checkout` | Pública |

## 6. Trazabilidad

| Requisito | Evidencia |
|---|---|
| RF-01 | `frontend/src/app.component.ts`, `frontend/src/app.component.html` y Tailwind |
| RF-02 a RF-07 | `backend/src`, `backend/database.sql` y pruebas |
| RF-08 | `.github/workflows/ci.yml` |
