import { getUsuarioPorId, getUsuarios } from "../services/api.js";
import { getUserId, logout } from "../utils/auth.js";
import { renderUsuario, renderTablaUsuarios } from "../utils/render.js";

// =========================
// PROTEGER RUTA ADMIN
// =========================

const token = localStorage.getItem("token");

const role = localStorage.getItem("role");

if (!token) {

  window.location.href = "./index.html";

}

if (role !== "admin") {

  window.location.href = "./user.html";

}
async function cargarUsuario() {
  try {
    const userId = getUserId(); // redirige si no hay sesión
    if (!userId) return;

    const usuario = await getUsuarioPorId(userId);
    renderUsuario(usuario);
  } catch (error) {
    console.error("Error al cargar usuario:", error.message);
  }
}

cargarUsuario();

async function cargarDashboard() {

  try {

    const userId = getUserId();

    if (!userId) return;

    const usuario = await getUsuarioPorId(userId);
    renderUsuario(usuario);

    const usuarios = await getUsuarios();
    renderTablaUsuarios(usuarios);

  } catch (error) {
    console.error(error);
  }
}

cargarDashboard();

document.getElementById("btn-logout").addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});


