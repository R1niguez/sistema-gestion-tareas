# Especificación: Sistema de Gestión de Tareas

## 1. Propósito y contexto

El Sistema de Gestión de Tareas permitirá a un equipo de una empresa de software
ecuatoriana registrar, consultar, actualizar y eliminar tareas de trabajo desde
una aplicación web. La solución busca reducir la falta de organización y de
trazabilidad identificada en el informe, manteniendo una separación clara entre
el frontend, la API y la base de datos.

## 2. Alcance

### Incluido

- Gestión de tareas con los campos `id`, `titulo`, `descripcion` y `estado`.
- Estados permitidos: `pendiente`, `en progreso` y `completada`.
- API REST para las operaciones CRUD.
- Interfaz Angular para consultar y administrar tareas.
- Persistencia en PostgreSQL.
- Validación automática mediante lint, pruebas unitarias y compilación en
  GitHub Actions.

### Fuera de alcance de esta versión

- Autenticación y autorización de usuarios.
- Asignación de tareas a personas.
- Notificaciones, archivos adjuntos y comentarios.
- Priorización, fechas límite y reportes.

## 3. Actores

| Actor | Responsabilidad |
|---|---|
| Usuario del equipo | Crear, consultar, modificar y eliminar tareas |
| API del sistema | Validar solicitudes y aplicar las operaciones CRUD |
| PostgreSQL | Persistir la información de las tareas |
| Pipeline CI | Verificar automáticamente la calidad del código |

## 4. Historias de usuario

### HU-01: Registrar una tarea

**Como** usuario del equipo, **quiero** registrar una tarea con título,
descripción y estado, **para** organizar el trabajo pendiente.

**Criterios de aceptación**

- **Dado** que el usuario completa un título válido, **cuando** guarda la tarea,
  **entonces** el sistema la persiste y devuelve un identificador único.
- El título debe contener entre 1 y 150 caracteres después de eliminar espacios
  al inicio y al final.
- Si no se especifica el estado, el sistema asigna `pendiente`.
- Una solicitud sin título se rechaza con HTTP 400 y un mensaje explicativo.

### HU-02: Consultar tareas

**Como** usuario del equipo, **quiero** consultar todas las tareas, **para**
conocer el estado actual del trabajo.

**Criterios de aceptación**

- **Dado** que existen tareas, **cuando** el usuario consulta la lista,
  **entonces** el sistema devuelve HTTP 200 y un arreglo de tareas.
- Si no existen tareas, el sistema devuelve HTTP 200 con un arreglo vacío.
- Cada elemento contiene `id`, `titulo`, `descripcion` y `estado`.
- El sistema también permite consultar una tarea por su identificador.

### HU-03: Actualizar una tarea

**Como** usuario del equipo, **quiero** modificar los datos de una tarea,
**para** mantener su información actualizada.

**Criterios de aceptación**

- **Dado** un identificador existente y datos válidos, **cuando** se actualiza
  la tarea, **entonces** el sistema guarda los cambios y devuelve la tarea
  actualizada con HTTP 200.
- El estado solo puede ser `pendiente`, `en progreso` o `completada`.
- Si el identificador no existe, el sistema devuelve HTTP 404.
- Si los datos no cumplen las validaciones, el sistema devuelve HTTP 400.

### HU-04: Eliminar una tarea

**Como** usuario del equipo, **quiero** eliminar una tarea, **para** retirar
información que ya no sea necesaria.

**Criterios de aceptación**

- **Dado** un identificador existente, **cuando** el usuario confirma la
  eliminación, **entonces** la tarea deja de aparecer en las consultas.
- Una eliminación exitosa devuelve HTTP 204 sin contenido.
- Si el identificador no existe, el sistema devuelve HTTP 404.

### HU-05: Recibir información clara ante errores

**Como** usuario del sistema, **quiero** recibir mensajes claros cuando una
operación falle, **para** saber cómo corregir la solicitud.

**Criterios de aceptación**

- Los errores de validación devuelven HTTP 400 y un objeto JSON con `error`.
- Los recursos inexistentes devuelven HTTP 404 y un objeto JSON con `error`.
- Los errores inesperados no exponen credenciales, consultas SQL ni trazas
  internas al cliente y devuelven HTTP 500.

## 5. Requisitos funcionales

- **RF-01:** El sistema deberá crear tareas mediante `POST /api/tareas`.
- **RF-02:** El sistema deberá listar tareas mediante `GET /api/tareas`.
- **RF-03:** El sistema deberá obtener una tarea mediante
  `GET /api/tareas/:id`.
- **RF-04:** El sistema deberá actualizar una tarea mediante
  `PUT /api/tareas/:id`.
- **RF-05:** El sistema deberá eliminar una tarea mediante
  `DELETE /api/tareas/:id`.
- **RF-06:** La API deberá validar el título y el estado antes de escribir en
  la base de datos.
- **RF-07:** La base de datos deberá generar automáticamente el identificador
  y la fecha de creación de cada tarea.
- **RF-08:** La interfaz deberá mostrar el listado y permitir las operaciones
  CRUD a través del servicio Angular.
- **RF-09:** La API deberá responder en JSON, excepto en respuestas 204.
- **RF-10:** El pipeline deberá ejecutar lint, pruebas unitarias y compilación
  antes de aceptar cambios en `main`.

## 6. Requisitos no funcionales

- **RNF-01 (mantenibilidad):** El backend, frontend y persistencia se
  mantendrán separados en sus respectivos directorios.
- **RNF-02 (seguridad):** Las credenciales de PostgreSQL deberán configurarse
  mediante variables de entorno en ambientes compartidos.
- **RNF-03 (calidad):** Todo cambio deberá pasar las verificaciones del
  workflow de integración continua.
- **RNF-04 (compatibilidad):** La API deberá funcionar con Node.js 20 o
  superior y PostgreSQL 14 o superior.
- **RNF-05 (usabilidad):** Los formularios deberán indicar los campos
  obligatorios y los errores de validación de forma comprensible.

## 7. Contrato de datos

```json
{
  "id": 1,
  "titulo": "Preparar informe",
  "descripcion": "Revisar resultados del sprint",
  "estado": "pendiente"
}
```

Los valores permitidos para `estado` son `pendiente`, `en progreso` y
`completada`. Las fechas y datos técnicos adicionales podrán agregarse en una
versión posterior sin romper este contrato.

## 8. Trazabilidad de validación

| Requisito | Verificación |
|---|---|
| RF-01 a RF-05 | Pruebas de integración de los endpoints CRUD |
| RF-06 y RF-07 | Pruebas de validación y restricciones de PostgreSQL |
| RF-08 | Pruebas unitarias del servicio y componentes Angular |
| RF-09 | Pruebas de contrato HTTP |
| RF-10 | Ejecución satisfactoria de `.github/workflows/ci.yml` |
