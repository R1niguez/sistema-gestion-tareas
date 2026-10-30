# Tareas de implementación y seguimiento

## Implementado

- [x] Definir especificación, constitución y plan técnico de Voltio Lab.
- [x] Crear esquema PostgreSQL para usuarios, catálogo, órdenes, artículos y
  pagos.
- [x] Implementar API NestJS para catálogo, autenticación, productos
  administrativos, órdenes y checkout.
- [x] Implementar frontend Angular standalone con navegación, catálogo,
  categorías, formularios y diseño responsive con Tailwind CSS.
- [x] Implementar filtros de categoría y carrito persistente en el navegador.
- [x] Implementar checkout que registra órdenes, artículos y pago pendiente.
- [x] Configurar pruebas automatizadas básicas y comandos de validación.
- [x] Configurar GitHub Actions para instalar, probar y compilar frontend y
  backend con Node.js 20.

## Pendiente para cumplir completamente la especificación

- [ ] Hacer obligatoria una contraseña administrativa segura y eliminar
  credenciales predeterminadas en entornos no locales.
- [ ] Añadir expiración e invalidación de tokens administrativos.
- [ ] Validar el formato del correo y los datos de checkout en servidor, con
  respuestas HTTP apropiadas para entradas inválidas.
- [ ] Implementar la vista de órdenes en el panel Angular usando la ruta
  administrativa existente.
- [ ] Conectar el formulario de Contacto a un servicio real o a un endpoint y
  mostrar el resultado del envío.
- [ ] Mover la URL base de la API Angular a configuración por entorno.
- [ ] Añadir pruebas de integración con PostgreSQL y pruebas end-to-end del
  frontend.
- [ ] Verificar accesibilidad y diseño en viewports móviles y de escritorio.
- [ ] Confirmar en GitHub la protección de `main`, los revisores requeridos y
  las reglas de Pull Request; no se puede certificar desde los archivos
  locales.

## Verificación local registrada

- Backend: `npm test` y `npm run build`.
- Frontend: `npm run lint`, `npm test` y `npm run build`.
- La suite actual comprueba estructura y presencia de comportamientos en el
  código; un resultado exitoso no acredita por sí solo el funcionamiento de
  PostgreSQL, la interfaz en navegador o el despliegue.
