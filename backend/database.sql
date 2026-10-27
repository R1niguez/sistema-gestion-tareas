-- Ejecutar este archivo con psql como el usuario postgres:
-- psql -U postgres -f backend/database.sql
-- La contraseña local indicada para el desarrollo es admin123.

CREATE DATABASE sistema_tareas;

\connect sistema_tareas

CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL CHECK (char_length(btrim(titulo)) BETWEEN 1 AND 150),
    descripcion TEXT NOT NULL DEFAULT '',
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'en progreso', 'completada')),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
