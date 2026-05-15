import { getUsuarioPorId, getUsuarios, adminEliminarUsuario } from "../services/api.js";
import { getUserId, logout } from "../utils/auth.js";
import { renderUsuario, renderTablaUsuariosAdmin } from "../utils/render.js";

async function cargarDashboardAdmin() {
  try {
    const userId = getUserId();
    if (!userId) return;

    const usuario = await getUsuarioPorId(userId);
    renderUsuario(usuario);

    const usuarios = await getUsuarios();
    renderTablaUsuariosAdmin(usuarios);

  } catch (error) {
    console.error(error);
  }
}

cargarDashboardAdmin();

document.getElementById("btn-cancel").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("visible");
});

document.getElementById("btn-confirm").addEventListener("click", async () => {
  const modal = document.getElementById("modal");
  const userId = modal.dataset.pendingId;
  if (!userId) return;

  try {
    await adminEliminarUsuario(userId);
    document.getElementById(`row-${userId}`).remove();
    modal.classList.remove("visible");
  } catch (error) {
    console.error(error);
  }
});


