# Arquitectura del Sistema — TODO App

## 1. Descripción General del Sistema
El sistema **TODO App** es una aplicación de gestión de tareas contenedorizada con **Docker**, diseñada bajo una arquitectura **cliente-servidor** y orquestada mediante **Docker Compose**.  
Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una lista de tareas, con persistencia de datos en **PostgreSQL**.  

Su objetivo es demostrar un flujo de trabajo DevOps básico: separación de responsabilidades por capas, uso de imágenes optimizadas y despliegue reproducible en cualquier entorno compatible con Docker.

---

## 2. Arquitectura de Componentes

| Componente | Tecnología | Función Principal |
|-------------|-------------|------------------|
| **Frontend** | Nginx + HTML, CSS, JavaScript | Interfaz visual accesible desde navegador. Envía peticiones HTTP al backend. |
| **Backend** | Node.js + Express | API REST que gestiona la lógica de negocio y operaciones sobre tareas. |
| **Base de Datos** | PostgreSQL 16 | Almacena las tareas con persistencia gracias a un volumen Docker. |
| **Orquestador** | Docker Compose | Coordina los tres servicios, define redes y volúmenes compartidos. |

---

## 3. Arquitectura de Contenedores
Cada módulo del sistema se ejecuta en un contenedor independiente, todos conectados mediante una red interna llamada `todo-net`.  

```text
+--------------------+          +--------------------+          +---------------------+
|   Frontend         | 8080 --> |   Backend          | 3000 --> |   PostgreSQL DB     |
|  (Nginx Server)    |          | (Node.js API REST) |          | (Persistent Volume) |
+--------------------+          +--------------------+          +---------------------+
          ↑                              ↓
          └─────────────── Docker Compose ───────────────┘
```

- **Frontend (todo-web)**: entrega archivos estáticos.
- **Backend (todo-api)**: maneja solicitudes HTTP y conecta con la base.
- **DB (todo-db)**: almacena los datos en el volumen `pgdata`.

---

## 4. Flujo de Datos

1. El usuario accede desde el navegador a `http://localhost:8080`.
2. El frontend (servido por **Nginx**) carga la interfaz estática.
3. Al crear una tarea, la interfaz envía una petición `POST` a `http://localhost:3000/tasks`.
4. El backend (**Express**) procesa la solicitud, se conecta a la base de datos y almacena la información.
5. La base de datos guarda la tarea en el volumen persistente `pgdata`.
6. Las respuestas (JSON) son devueltas al navegador y reflejadas visualmente.

---

## 5. API REST — Endpoints Principales

| Método | Endpoint | Descripción | Código Esperado |
|---------|-----------|--------------|-----------------|
| `GET` | `/health` | Verifica el estado del backend. | 200 OK |
| `GET` | `/tasks` | Obtiene todas las tareas registradas. | 200 OK |
| `POST` | `/tasks` | Crea una nueva tarea. | 201 Created |
| `PUT` | `/tasks/:id` | Actualiza una tarea existente. | 200 OK |
| `DELETE` | `/tasks/:id` | Elimina una tarea específica. | 204 No Content |

Ejemplo de respuesta:
```json
{
  "id": 1,
  "title": "Docker Compose listo",
  "completed": false
}
```

---

## 6. Decisiones Técnicas

- **Uso de imágenes Alpine:** garantiza contenedores livianos y seguros.
- **Separación de dependencias en Dockerfile:** se instalan antes de copiar el código para aprovechar la caché.
- **`healthcheck` en la BD:** el backend solo arranca cuando PostgreSQL está “ready”.
- **Red interna `todo-net`:** evita exposición innecesaria de puertos.
- **`restart: unless-stopped`:** asegura resiliencia ante reinicios.

---

## 7. Persistencia de Datos

- La base de datos usa un volumen Docker nombrado `pgdata`, montado en `/var/lib/postgresql/data`.
- Este volumen permite conservar las tareas aun si el contenedor se elimina o reinicia.
- Prueba realizada:
  ```bash
  docker compose down
  docker compose up -d
  curl http://localhost:3000/tasks
  ```
  Las tareas creadas siguen presentes → persistencia verificada.

---

## 8. Consideraciones de Seguridad

- Variables sensibles (usuario, contraseña) definidas en `.env`, no se exponen en la imagen.
- Acceso al backend restringido a la red interna `todo-net`.
- Uso de imágenes oficiales y firmadas (Node.js, Nginx, PostgreSQL).
- Puerto 5432 de PostgreSQL expuesto solo en entorno local de desarrollo.
- Posible implementación futura de HTTPS con certificados para Nginx.

---

## 9. Mejoras Futuras (opcional)

- Autenticación de usuarios con JWT.
- Gestión de múltiples listas de tareas por usuario.
- Integración con frontend React para SPA.
- Pipeline de CI/CD para despliegues automáticos.
- Implementación de backups automáticos de la base de datos.

---

## 10. Autores

- **Estudiante 1:** Daniel Alexander Reyes Pérez
- **Estudiante 2:** Gilberto José Menéndez Pérez
- **Materia:** Implantación de Sistemas
- **Universidad de Sonsonate — 2025**
