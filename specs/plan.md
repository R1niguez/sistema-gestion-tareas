# Plan técnico - Voltio Lab

## Alcance y arquitectura

La solución es una tienda web dividida en una aplicación Angular y una API
NestJS, con PostgreSQL como persistencia. El código de cada parte vive en su
directorio para poder instalarlo, probarlo y compilarlo por separado.

### Frontend

- **Tecnología:** Angular 20 standalone, TypeScript, `HttpClient`, formularios
  con `FormsModule` y Tailwind CSS.
- **Arranque:** `frontend/src/main.ts` inicia `AppComponent` y la configuración
  de `HttpClient`.
- **Interfaz:** `frontend/src/app.component.html` contiene navegación, hero,
  catálogo, formularios de contacto y login, carrito y panel de productos.
  `frontend/src/app.component.ts` controla la vista, filtros, sesión y estado
  del carrito.
- **Acceso a la API:** `frontend/src/product.service.ts` concentra las
  solicitudes HTTP a `http://localhost:3001/api`.
- **Persistencia local:** el carrito y el token administrativo se guardan en
  `localStorage`.
- **Estilos:** clases Tailwind responsivas; las plantillas están separadas de
  la lógica del componente.

### Backend

- **Tecnología:** NestJS 11 sobre Node.js, TypeScript y Express.
- **Rutas:** `backend/src/app.controller.ts` expone el catálogo, login,
  administración de productos, consulta de órdenes y checkout bajo `/api`.
- **Lógica de aplicación:** `backend/src/app.service.ts` implementa
  autenticación, validación, consultas del catálogo y operaciones de negocio.
- **Persistencia:** `backend/src/database.service.ts` proporciona el pool de
  PostgreSQL y transacciones.
- **Inicialización:** al arrancar, el servicio crea las tablas si faltan,
  registra el administrador inicial y carga productos de ejemplo si el
  catálogo está vacío.

### Datos

PostgreSQL almacena usuarios, productos, órdenes, artículos de orden y pagos.
El esquema está en `backend/database.sql`; el backend también crea las tablas
durante el arranque. Las operaciones de checkout se ejecutan en una
transacción y guardan el total, las líneas de producto y un pago pendiente.

## Contratos y flujo principal

1. El frontend solicita el catálogo público y puede enviar una categoría.
2. El carrito mantiene identificadores de producto y cantidades en el
   navegador.
3. Checkout envía los datos del cliente y los artículos a la API; el servidor
   vuelve a consultar los precios y registra la orden en PostgreSQL.
4. El administrador inicia sesión y envía el token como `Bearer` para las
   operaciones administrativas.
5. El panel permite crear, editar y eliminar productos. La API ofrece también
   la ruta protegida para consultar órdenes.

Las rutas completas y sus criterios están en `specs/spec.md`.

## Configuración y ejecución

- Requisitos documentados: Node.js 20 o superior y PostgreSQL 14 o superior.
- Backend: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `PORT`.
- Frontend: la URL de API está actualmente fijada en el servicio Angular a
  `http://localhost:3001/api`.
- Instalación conjunta: `npm run install:all` desde la raíz.
- Ejecución: `npm run api --prefix backend` y `npm run dev --prefix frontend`.

La configuración local y los comandos están descritos en `README.md`. Para
producción, debe eliminarse cualquier credencial predeterminada y configurarse
la URL del frontend por entorno.

## Calidad y entrega

- Backend: `npm test` y `npm run build`.
- Frontend: `npm run lint`, `npm test` y `npm run build`.
- GitHub Actions ejecuta esos pasos en solicitudes de cambio y pushes a
  `main`, usando Node.js 20.
- Las pruebas actuales son principalmente comprobaciones estructurales del
  código; no sustituyen pruebas de integración contra PostgreSQL ni pruebas
  end-to-end del navegador.
- La existencia/configuración efectiva de CODEOWNERS, reglas de protección de
  ramas y revisión de Pull Requests depende del repositorio GitHub y no se
  verifica con el código local.

## Riesgos y trabajo pendiente

- **Credenciales iniciales:** asegurar que `ADMIN_PASSWORD` sea obligatorio y
  fuerte fuera de desarrollo; no usar valores predeterminados en producción.
- **Sesiones administrativas:** los tokens viven en memoria y no tienen
  expiración; se invalidan al reiniciar el proceso.
- **Validación del checkout:** reforzar la validación del correo y devolver
  errores HTTP de cliente para entradas inválidas.
- **Contacto:** el formulario actualmente muestra confirmación local; no envía
  ni persiste mensajes.
- **Órdenes:** existe una API administrativa, pero el panel Angular no muestra
  la lista de órdenes.
- **Configuración frontend:** externalizar la URL base de la API para permitir
  despliegues distintos de localhost.
- **Cobertura:** añadir pruebas funcionales de API con PostgreSQL y pruebas de
  interacción del frontend antes de considerar validada la experiencia
  completa.
