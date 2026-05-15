# API Usuarios Fullstack

Proyecto fullstack desarrollado con Flask, JWT, SQLite y JavaScript Vanilla.

Este proyecto fue creado como práctica para aprender:

* Backend con Flask
* APIs REST
* Autenticación JWT
* Manejo de usuarios
* Frontend modular con JavaScript
* Roles de usuario
* Seguridad básica
* Consumo de APIs
* Arquitectura frontend/backend

---

# Tecnologías utilizadas

## Backend

* Python
* Flask
* Flask-JWT-Extended
* SQLAlchemy
* SQLite
* Werkzeug Security

## Frontend

* HTML5
* TailwindCSS
* JavaScript ES Modules

---

# Funcionalidades implementadas

## Sistema de autenticación

* Registro de usuarios
* Login
* JWT Authentication
* Protección de rutas
* Logout

---

## Gestión de usuarios

* Crear usuario
* Obtener usuarios
* Obtener usuario por ID
* Actualizar username
* Cambiar contraseña
* Desactivar cuenta
* Activar cuenta
* Eliminar usuario

---

## Roles de usuario

El sistema utiliza roles:

* `admin`
* `user`

### Funciones del admin

* Ver todos los usuarios
* Activar cuentas
* Desactivar cuentas
* Eliminar usuarios
* Acceso a dashboard administrativo

### Funciones del usuario normal

* Ver su perfil
* Editar username
* Cambiar contraseña

---

# Arquitectura del proyecto

## Backend

```text
app/
│
├── __init__.py
├── models.py
├── routes.py
└── config.py
```

---

## Frontend

```text
frontend/
│
├── pages/
│   ├── login.js
│   ├── dashboard.js
│   ├── user.js
│   ├── profile.js
│   └── register.js
│
├── services/
│   └── api.js
│
├── utils/
│   ├── auth.js
│   └── render.js
│
├── styles/
│   ├── global.css
│   ├── dashboard.css
│   └── profile.css
│
├── index.html
├── dashboard.html
├── user.html
└── profile.html
```

---

# Explicación de la arquitectura

## services/api.js

Este archivo centraliza todas las peticiones HTTP.

Ventajas:

* No repetir fetch
* Reutilización
* Mejor mantenimiento
* Centralizar token JWT
* Centralizar manejo de errores

---

## utils/

Contiene funciones reutilizables.

Ejemplos:

* logout
* getUserId
* renderUsuario
* renderTablaUsuarios

---

## pages/

Cada página tiene su propia lógica JavaScript.

Ejemplo:

* login.js → lógica de login
* dashboard.js → lógica del dashboard admin
* user.js → lógica de usuarios normales
* profile.js → edición de perfil

---

# Seguridad implementada

## Contraseñas hasheadas

Las contraseñas nunca se almacenan en texto plano.

Se utiliza:

```python
generate_password_hash()
```

Y para verificar:

```python
check_password_hash()
```

---

## JWT Authentication

Después del login se genera un token JWT.

El token se guarda en:

```javascript
localStorage
```

Luego se envía automáticamente en cada petición protegida:

```javascript
Authorization: Bearer TOKEN
```

---

## Protección por roles

Los endpoints verifican:

```python
if user.role != "admin"
```

Esto evita que usuarios normales accedan a funciones administrativas.

---

# Flujo de login

## 1. Usuario inicia sesión

Frontend envía:

```json
{
  "name": "demo",
  "password": "123"
}
```

---

## 2. Backend verifica credenciales

* Busca usuario
* Verifica contraseña
* Genera JWT

---

## 3. Backend responde

```json
{
  "token": "JWT_TOKEN",
  "id": 1,
  "role": "admin"
}
```

---

## 4. Frontend guarda sesión

```javascript
localStorage.setItem("token", data.token)
localStorage.setItem("userId", data.id)
localStorage.setItem("role", data.role)
```

---

## 5. Redirección según rol

```javascript
if (data.role === "admin") {
  window.location.href = "./dashboard.html";
} else {
  window.location.href = "./user.html";
}
```

---

# Endpoints principales

## Login

```http
POST /login
```

---

## Crear usuario

```http
POST /users
```

---

## Obtener usuarios

```http
GET /users
```

---

## Obtener usuario por ID

```http
GET /users/<id>
```

---

## Actualizar username

```http
PUT /users/<id>
```

---

## Cambiar contraseña

```http
PUT /change-password
```

---

## Desactivar cuenta

```http
PUT /users/deactivate/<id>
```

---

## Activar cuenta

```http
PUT /users/activate/<id>
```

---

## Eliminar usuario

```http
DELETE /users/<id>
```

---

# Lo aprendido durante el proyecto

## Backend

* Crear APIs REST
* Manejo de rutas
* SQLAlchemy ORM
* Relaciones entre frontend y backend
* JWT Authentication
* Roles y permisos
* Seguridad básica

---

## Frontend

* JavaScript modular
* Fetch API
* Manipulación del DOM
* Eventos
* Renderizado dinámico
* Manejo de errores
* Protección de rutas frontend

---

# Mejoras futuras

* Refresh tokens
* Roles más avanzados
* Validaciones frontend/backend
* Docker
* Deploy
* PostgreSQL
* Flask migrations
* Panel administrativo avanzado
* Upload de imágenes
* Emails de recuperación
* Rate limiting

---

# Cómo ejecutar el proyecto

## Backend

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Ejecutar servidor:

```bash
flask run
```

---

## Frontend

Abrir:

```text
index.html
```

O utilizar Live Server.

---

# Objetivo del proyecto

Este proyecto fue desarrollado como práctica para fortalecer conocimientos de desarrollo fullstack y crear una base sólida en:

* APIs REST
* JWT
* Seguridad
* Frontend modular
* Arquitectura de aplicaciones
* Manejo de usuarios y roles

---

# Autor

Cristofer Jiménez
