# Constitución del proyecto

## Principios obligatorios

1. **La especificación precede a la implementación.** Toda funcionalidad debe
   relacionarse con una historia de usuario y un requisito de `spec.md`.
2. **Calidad automatizada.** Los cambios deben pasar comprobaciones, pruebas y
   compilación de frontend y backend antes de integrarse en `main`. El tipo y
   alcance de cada prueba deben informarse sin presentar pruebas estructurales
   como evidencia de integración o de aceptación visual.
3. **Seguridad por configuración.** Las credenciales y la configuración
   específica de cada entorno se proporcionan mediante variables de entorno;
   nunca se publican secretos ni se aceptan credenciales predeterminadas en
   producción.
4. **Contratos explícitos.** Las rutas REST, autorizaciones, códigos HTTP e
   interfaces TypeScript deben conservar los nombres y tipos documentados.
5. **Cambios pequeños y revisables.** El trabajo se desarrolla en ramas
   `feature/*` o `fix/*`, con commits descriptivos y Pull Requests enfocados.
6. **Revisión humana del código generado por IA.** Copilot puede asistir, pero
   cada resultado debe revisarse, probarse y ajustarse a esta constitución.
7. **Documentación veraz.** `spec.md`, `plan.md` y `tasks.md` deben reflejar la
   arquitectura existente y diferenciar requisitos implementados, parciales y
   pendientes.

## Estándares técnicos

- Node.js 20 o superior y PostgreSQL 14 o superior.
- Frontend Angular standalone con TypeScript, `HttpClient`, formularios y
  Tailwind CSS para la interfaz responsive.
- Backend NestJS con TypeScript y PostgreSQL.
- Plantillas HTML semánticas y validación de entradas en el servidor.
- Consultas PostgreSQL parametrizadas y transacciones en operaciones que
  escriben datos relacionados.
- Contraseñas derivadas con `scrypt`; credenciales configuradas por entorno y
  tokens administrativos con vigencia limitada.
- Categorías de producto limitadas a `arduino`, `esp32` y `modulos`.
- No se aceptan errores silenciosos ni respuestas de éxito para operaciones
  fallidas.

## Definición de terminado

Una funcionalidad está terminada cuando su código, pruebas, documentación y
criterios de aceptación están implementados; lint o comprobaciones equivalentes,
pruebas y builds pasan localmente y en GitHub Actions; y el Pull Request fue
revisado. Los criterios que dependen de PostgreSQL, navegador, configuración de
GitHub o despliegue requieren evidencia de esos entornos y no se consideran
validados solo por inspección estática o compilación.
