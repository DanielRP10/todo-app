# TODO App - Sistema de Gestión de Tareas

## Descripción
Aplicación de gestión de tareas desarrollada en **Node.js (backend)** y **HTML, CSS, JavaScript (frontend)**. Permite crear, listar, actualizar y eliminar tareas desde una interfaz web sencilla. La persistencia de datos se realiza en **PostgreSQL**, y todo el sistema está **contenedorizado con Docker** y **orquestado mediante Docker Compose** para garantizar portabilidad y ejecución en cualquier entorno.

## Arquitectura
El sistema se compone de tres servicios: **Frontend (Nginx)** que sirve la interfaz web, **Backend (Node.js + Express)** que gestiona la API REST, y **Base de datos (PostgreSQL)** que almacena las tareas de forma persistente. Todos los contenedores comparten una red interna `todo-net` y un volumen `pgdata`.

### Diagrama
[ Usuario / Navegador ]
          ↓
   (HTTP 8080)
[ Frontend - Nginx ]
          ↓
   (Fetch API)
[ Backend - Node.js / Express ]
          ↓
   (TCP 5432)
[ PostgreSQL ]

## Tecnologías
- **Backend:** Node.js + Express + PostgreSQL 
- **Frontend:** HTML + CSS + JavaScript + Nginx 
- **Orquestación:** Docker + Docker Compose 

## Requisitos Previos
- Docker 20 o superior 
- Docker Compose 2 o superior 
- Git 

## Instalación y Ejecución
### 1. Clonar repositorio
git clone https://github.com/DanielRP10/todo-app.git

cd todo-app

### 2. Levantar servicios
docker compose build --no-cache

docker compose up -d

### 3. Acceder a la aplicación
Frontend: http://localhost:8080 

Backend: http://localhost:3000 

## Comandos Útiles
docker compose ps 
docker compose logs -f todo-api 
docker compose logs -f todo-web 
docker compose logs -f todo-db 
docker compose down 
docker compose down -v 
docker compose build --no-cache 

## Estructura del Proyecto
todo-app/
├── docker-compose.yml
├── README.md
├── docs/
│   └── tecnico.md
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   └── index.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── nginx.conf

## API Endpoints
GET /health - Verifica el estado del servidor 
GET /tasks - Lista todas las tareas 
POST /tasks - Crea una nueva tarea 
PUT /tasks/:id - Actualiza una tarea existente 
DELETE /tasks/:id - Elimina una tarea 

## Variables de Entorno (backend/.env.example)
PORT=3000 
DB_HOST=db 
DB_USER=todo 
DB_PASSWORD=todo 
DB_NAME=todoapp 
DB_PORT=5432 

## Persistencia de Datos
El sistema utiliza el volumen `pgdata` para almacenar los datos de la base de datos. Esto asegura que la información se mantenga incluso después de reiniciar los contenedores.

## Autores
- Estudiante 1: Daniel Alexander Reyes Pérez 
- Estudiante 2: Gilberto José Menéndez Pérez

## Fecha
Miercoles 15 Octubre 2025
Universidad de Sonsonate – Materia: Implantación de Sistemas

