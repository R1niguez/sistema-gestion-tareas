# Constitución del proyecto

## Principios obligatorios

1. **La especificación precede a la implementación.** Toda funcionalidad debe
   relacionarse con una historia de usuario y un requisito de `spec.md`.
2. **Calidad automatizada.** Todo cambio debe pasar lint, pruebas unitarias y
   compilación antes de integrarse en `main`.
3. **Seguridad por configuración.** Las credenciales y la configuración
   específica de cada entorno se proporcionan mediante variables de entorno;
   nunca se publican secretos reales.
4. **Contratos explícitos.** La API REST y las interfaces TypeScript deben
   conservar nombres, tipos y códigos HTTP documentados.
5. **Cambios pequeños y revisables.** El trabajo se desarrolla en ramas
   `feature/*` o `fix/*`, con commits descriptivos y Pull Requests enfocados.
6. **Revisión humana del código generado por IA.** Copilot puede asistir, pero
   cada resultado debe revisarse, probarse y ajustarse a esta constitución.

## Estándares técnicos

- Node.js 20 o superior y PostgreSQL 14 o superior.
- TypeScript estricto en NestJS y Angular standalone en el frontend.
- Plantillas HTML semánticas y Tailwind CSS para la interfaz responsive.
- Consultas PostgreSQL parametrizadas.
- Categorías de producto limitadas a `arduino`, `esp32` y `modulos`.
- No se aceptan errores silenciosos ni respuestas de éxito para operaciones
  fallidas.

## Definición de terminado

Una funcionalidad está terminada cuando su código, pruebas, documentación y
criterios de aceptación están implementados; el lint, las pruebas y el build
pasan localmente y en GitHub Actions; y el Pull Request fue revisado.
