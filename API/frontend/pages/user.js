import { getUsuarioPorId } from "../services/api.js";

import { getUserId, logout } from "../utils/auth.js";

import { renderUsuario } from "../utils/render.js";

// =========================
// PROTEGER RUTA
// =========================

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./index.html";
}

// =========================
// CARGAR USUARIO
// =========================

async function cargarUsuario() {
  try {
    const userId = getUserId();

    if (!userId) return;

    const usuario = await getUsuarioPorId(userId);

    renderUsuario(usuario);
  } catch (error) {
    console.error(error);
  }
}

cargarUsuario();

// =========================
// LOGOUT
// =========================
document.getElementById("btn-logout").addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});