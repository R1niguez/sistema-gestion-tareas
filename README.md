# Sistema de Gestión de Tareas

Aplicación académica basada en SDD con Angular standalone, Node.js, Express
y PostgreSQL.

## Instalación

### Base de datos

Inicie PostgreSQL y ejecute `backend/database.sql` con el usuario administrador:

```bash
psql -U postgres -f backend/database.sql
```

### Backend

```bash
cd backend
npm install
copy .env .env.local
npm start
```

El proyecto ya incluye un `.env` local con la configuración solicitada. En
PowerShell, `copy` puede reemplazarse por `Copy-Item .env .env.local`. No
publique `.env` ni `.env.local`: ambos están excluidos por `.gitignore`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Abra `http://localhost:4200`.

## Verificaciones

```bash
cd backend
npm test

cd ../frontend
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
npm run build -- --configuration production
```

La especificación y los artefactos SDD están en `specs/`. El pipeline de CI está
en `.github/workflows/ci.yml`.
