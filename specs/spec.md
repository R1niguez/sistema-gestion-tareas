# Especificación: Voltio Lab

## 1. Propósito y alcance

Voltio Lab es una tienda web de componentes electrónicos para makers,
estudiantes y personas que desarrollan prototipos. Permite explorar un
catálogo de Arduino, ESP32 y módulos, gestionar un carrito y registrar pedidos.
Incluye acceso administrativo para mantener el catálogo y consultar órdenes.

Esta especificación describe los requisitos del producto. La sección
«Estado de implementación» diferencia los requisitos comprobados en el código
de los que siguen pendientes o solo tienen verificación estructural.

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
- El checkout exige nombre, correo con formato válido y al menos un producto.
- La API valida cada producto y cantidad, calcula el total usando precios de la
  base de datos y registra la orden, sus artículos y un pago pendiente en una
  transacción PostgreSQL.
- Una solicitud inválida produce una respuesta HTTP de cliente y no deja datos
  parciales.

### HU-03: Administrar productos

**Como** administrador, **quiero** iniciar sesión y gestionar el catálogo,
**para** mantener actualizada la oferta de Voltio Lab.

**Criterios de aceptación**

- El acceso usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` configurados en el entorno; no
  existen credenciales predeterminadas en producción.
- Las rutas administrativas exigen un token válido.
- El administrador puede consultar, crear, editar y eliminar productos.
- Las entradas se validan en el servidor antes de persistirse.

### HU-04: Consultar pedidos

**Como** administrador, **quiero** consultar las órdenes registradas, **para**
dar seguimiento a las compras.

**Criterios de aceptación**

- `GET /api/admin/orders` solo responde con autorización válida.
- La interfaz administrativa permite visualizar cliente, correo, total y
  fecha de cada orden.

### HU-05: Contactar a la tienda

**Como** visitante, **quiero** enviar una consulta desde Contacto, **para**
recibir ayuda sobre productos o proyectos.

**Criterios de aceptación**

- El formulario valida nombre, correo y mensaje.
- La consulta se envía a un destino definido y la interfaz comunica el
  resultado real del envío.

## 3. Requisitos funcionales

- **RF-01:** La aplicación Angular standalone presenta hero, navegación,
  catálogo, filtros y formularios con diseño responsive y Tailwind CSS.
- **RF-02:** La API NestJS expone `GET /api/products` con filtro de categoría
  opcional y devuelve solo productos activos.
- **RF-03:** La API autentica mediante `POST /api/login`, verifica la contraseña
  derivada con `scrypt` y emite un token administrativo.
- **RF-04:** La API protege el CRUD de `/api/admin/products`.
- **RF-05:** La API protege `GET /api/admin/orders`.
- **RF-06:** La API registra pedidos mediante `POST /api/checkout` con orden,
  artículos y pago pendiente en una única transacción.
- **RF-07:** PostgreSQL persiste usuarios, productos, órdenes, artículos y
  pagos con restricciones e integridad referencial.
- **RF-08:** El pipeline instala dependencias, ejecuta las comprobaciones,
  pruebas y compilaciones de frontend y backend.
- **RF-09:** La interfaz administrativa presenta las órdenes del cliente.
- **RF-10:** El formulario de Contacto envía y confirma consultas reales.

## 4. Requisitos no funcionales

- **RNF-01:** Node.js 20 o superior y PostgreSQL 14 o superior.
- **RNF-02:** La conexión se configura con `DATABASE_URL`; ningún secreto se
  versiona ni se usa una contraseña por defecto en producción.
- **RNF-03:** La API usa consultas parametrizadas, validación de entradas y
  contraseñas derivadas con `scrypt`.
- **RNF-04:** La solución mantiene frontend, backend, persistencia y pruebas en
  directorios separados.
- **RNF-05:** El diseño debe ser legible y operable en dispositivos móviles y
  escritorio.
- **RNF-06:** Los tokens administrativos tienen vigencia limitada y pueden
  invalidarse; los secretos se transmiten únicamente mediante HTTPS en
  producción.
- **RNF-07:** La URL de la API del frontend se configura según el entorno.

## 5. Contrato de API

| Método | Ruta | Autorización |
|---|---|---|
| GET | `/api/products?category=arduino` | Pública |
| POST | `/api/login` | Pública |
| GET | `/api/admin/products` | Bearer token |
| POST | `/api/admin/products` | Bearer token |
| PUT | `/api/admin/products/:id` | Bearer token |
| DELETE | `/api/admin/products/:id` | Bearer token |
| GET | `/api/admin/orders` | Bearer token |
| POST | `/api/checkout` | Pública |

## 6. Estado de implementación

| Requisito | Estado | Evidencia / observación |
|---|---|---|
| RF-01 | Parcial | Angular standalone, plantilla y clases responsivas existen en `frontend/src`; las pruebas no validan interacción visual en navegador. |
| RF-02 | Cumple en código | Controlador y servicio filtran por categoría y por `active`. |
| RF-03 | Parcial | Login y `scrypt` existen; el backend conserva un valor predeterminado si no se configura contraseña y el token no expira. |
| RF-04 | Cumple en código | Las rutas administrativas de productos invocan la autorización Bearer. |
| RF-05 | Cumple en código | La ruta de órdenes invoca la misma autorización. |
| RF-06 | Parcial | Se usan transacciones y precios de base de datos; validación del correo y manejo HTTP de entradas inválidas deben endurecerse. |
| RF-07 | Cumple en esquema | Tablas, claves foráneas y restricciones están en `backend/database.sql`; no se ejecutaron pruebas contra una instancia PostgreSQL durante la verificación. |
| RF-08 | Cumple como pipeline | `.github/workflows/ci.yml` ejecuta pruebas y builds; `npm run lint` es una comprobación estructural, no un linter convencional. |
| RF-09 | Pendiente | Existe la ruta API, pero el frontend no presenta órdenes. |
| RF-10 | Pendiente | El formulario solo muestra una confirmación local y no envía el mensaje. |
| RNF-01, RNF-02, RNF-04 | Cumple/documentado | Versiones, configuración y separación están descritas en README y en la estructura del repositorio. La ausencia de secretos debe verificarse al desplegar. |
| RNF-03 | Parcial | Las consultas observadas están parametrizadas y se usa `scrypt`; la validación y el manejo de errores requieren mejoras. |
| RNF-05 | Parcial | Se usan utilidades responsive de Tailwind; falta validación automatizada de accesibilidad y experiencia en distintos viewports. |
| RNF-06 | Pendiente | Los tokens se mantienen en memoria y no tienen expiración. |
| RNF-07 | Pendiente | El frontend fija la URL de API en el código. |

## 7. Trazabilidad

| Requisito | Evidencia principal |
|---|---|
| RF-01, RF-09, RF-10, RNF-05 | `frontend/src/app.component.ts`, `frontend/src/app.component.html` |
| RF-02 a RF-06, RNF-03 | `backend/src/app.controller.ts`, `backend/src/app.service.ts` |
| RF-07 | `backend/database.sql`, `backend/src/database.service.ts` |
| RF-08 | `.github/workflows/ci.yml`, scripts de `backend/package.json` y `frontend/package.json` |
| RNF-01, RNF-02 | `README.md`, `.gitignore`, configuración de backend |
