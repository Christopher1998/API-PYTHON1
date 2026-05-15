// ============================================================
// services/api.js
// Este archivo es el "puente" entre tu frontend y tu API.
// Toda petición HTTP pasa por aquí. Si algo cambia en la API
// (URL, headers, token), solo lo editas en este archivo.
// ============================================================


// URL base de tu API. Si cambias de servidor, solo editas esta línea.
const BASE_URL = "http://127.0.0.1:5000";


// --- FUNCIÓN CENTRAL DE FETCH ---
// Esta función es la que realmente hace las peticiones HTTP.
// El resto de funciones la usan por debajo para no repetir código.
//
// @param endpoint  - la ruta específica, ej: "/users" o "/auth/login"
// @param options   - método, body, etc. (opcionales)
async function apiFetch(endpoint, options = {}) {

  // Intentamos obtener el token guardado al hacer login.
  // Si el usuario no ha iniciado sesión, esto será null.
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      // Le decimos al servidor que enviamos y esperamos JSON
      "Content-Type": "application/json",

      // Si existe un token, lo agregamos al header Authorization.
      // El operador "&&" evita agregar el header si token es null.
      // El "..." (spread) mezcla este header con los demás.
      ...(token && { "Authorization": `Bearer ${token}` })
    },

    // Mezclamos las opciones extras que recibimos (method, body, etc.)
    ...options
  });

    const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }

  // Si todo salió bien, retornamos la respuesta convertida a objeto JS
  return data;
}


// --- ENDPOINTS DISPONIBLES ---
// Cada función representa una acción específica de tu API.
// Las páginas importan solo las que necesitan.


// Crea un usuario nuevo en la base de datos
// Se usa en: pages/registro.js
export async function registrarUsuario(name, password) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify({ name, password })
  });
}


// Inicia sesión y devuelve un token de autenticación
// Se usa en: pages/login.js
export async function loginUsuario(name, password) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ name, password })
  });
}


// Obtiene la lista de todos los usuarios (requiere token)
// Se usa en cualquier página que necesite listar usuarios
export async function getUsuarios() {
  return apiFetch("/users"); // GET es el método por defecto de fetch
}

// Obtiene la lista de un usuario (segun su id)
// Se usa en el dashboard desdpues de iniciar sesion
export async function getUsuarioPorId(id) {
  return apiFetch(`/users/${id}`); // GET es el método por defecto de fetch
}

// Actualizar username
export async function actualizarUsuario(id, name) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }) 
  });
}

// Cambiar contraseña
export async function cambiarPassword(current_password, new_password) {
  return apiFetch("/change-password", {
    method: "PUT",
    body: JSON.stringify({
      current_password,
      new_password
    })
  });
}

// Desactivar cuenta (admin)
export async function adminDesactivarCuenta(id) {
  return apiFetch(`/users/deactivate/${id}`, {
    method: "PUT"
  });
}

// Activar cuenta (admin)
export async function adminActivarCuenta(id) {
  return apiFetch(`/users/activate/${id}`, {
    method: "PUT"
  });
}

//Eliminar usuario
export async function adminEliminarUsuario(id) {
  return apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
}