# Plan técnico

## Arquitectura

La solución utiliza tres capas:

1. **Frontend:** Angular standalone, componentes de presentación y
   `TareaService` como cliente HTTP.
2. **Backend:** Node.js con Express, validación de entrada y API REST.
3. **Persistencia:** PostgreSQL con restricciones para `titulo` y `estado`.

El frontend consume `http://localhost:3000/api/tareas`. En producción, esa URL
debe configurarse mediante un entorno de Angular.

## Contrato de API

| Método | Ruta | Éxito |
|---|---|---|
| GET | `/api/tareas` | `200`, arreglo de tareas |
| GET | `/api/tareas/:id` | `200`, tarea |
| POST | `/api/tareas` | `201`, tarea creada |
| PUT | `/api/tareas/:id` | `200`, tarea actualizada |
| DELETE | `/api/tareas/:id` | `204` |

Los errores de validación devuelven `400`, los recursos inexistentes `404` y
los errores inesperados `500`, siempre con `{ "error": "..." }`.

## Persistencia

La tabla `tareas` usa `SERIAL` para el identificador, `TIMESTAMPTZ` para la
fecha de creación, un valor predeterminado de `pendiente` y un `CHECK` para
los estados permitidos.

## Calidad y entrega

- Angular: TypeScript, lint con ESLint, Jasmine/Karma para pruebas.
- Backend: pruebas HTTP con Node.js y una app Express aislada.
- CI: `npm ci`, lint, pruebas unitarias y build en Ubuntu con Node 20.
- Integración: ramas cortas, Pull Request y protección de `main`.

## Riesgos y mitigaciones

- **Base de datos no disponible:** documentar variables de entorno y probar la
  conexión antes de usar la API.
- **Secretos expuestos:** usar `.env.example` sin valores reales y `.gitignore`.
- **Cambios incompatibles:** mantener el contrato de datos y ejecutar CI en
  cada Pull Request.
