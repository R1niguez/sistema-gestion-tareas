# Plan técnico - Voltio Lab

## Arquitectura

1. **Frontend:** HTML semántico y JavaScript modular servido por Vite, con
   Tailwind CSS para la composición visual responsive.
2. **Backend:** NestJS con controlador REST, servicio de dominio y un servicio
   de conexión PostgreSQL.
3. **Persistencia:** PostgreSQL con tablas de usuarios, productos, órdenes,
   artículos y pagos.

## Calidad y entrega

- `npm run lint`, `npm test` y `npm run build` en frontend.
- `npm test` y `npm run build` en backend.
- Pull Requests, CODEOWNERS, protección de `main` y GitHub Actions.
- Variables de entorno para `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` y
  `PORT`.

## Riesgos

- **Base de datos no disponible:** la API informa el fallo de arranque y se
  documenta la configuración local.
- **Credenciales expuestas:** `.env` se excluye mediante `.gitignore`; la
  contraseña se deriva con `scrypt`.
- **Cambios visuales incompatibles:** el catálogo se valida con build y pruebas
  antes de fusionar.
