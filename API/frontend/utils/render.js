import { adminActivarCuenta, adminDesactivarCuenta } from "../services/api.js";

//En esta funcion renderizamos el nombre del usuario, y el acronimo del nombre para el avatar
export function renderUsuario(usuario) {
  //Renderiza en el html el ID de usuario.
  document.querySelectorAll(".show-id").forEach((el) => {
    el.textContent = `#${usuario.id}`;
  });

  // Actualiza todos los elementos con clase show-username (divs, spans)
  document.querySelectorAll(".show-username").forEach((el) => {
    el.textContent = usuario.name;
  });

  // Actualiza el input de profile.html (solo existe ahí)
  const input = document.getElementById("username");
  if (input) input.value = usuario.name;

  // Actualiza todos los avatares
  const partes = usuario.name.trim().split(" ");
  const iniciales =
    partes.length >= 2
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : partes[0].slice(0, 2).toUpperCase();

  document.querySelectorAll(".show-avatar").forEach((el) => {
    el.textContent = iniciales;
  });
}

export function renderTablaUsuarios(usuarios) {
  const tbody = document.getElementById("users-table-body");

  tbody.innerHTML = "";

  usuarios.forEach((usuario) => {
    const partes = usuario.name.trim().split(" ");

    const iniciales =
      partes.length >= 2
        ? (partes[0][0] + partes[1][0]).toUpperCase()
        : partes[0].slice(0, 2).toUpperCase();

    const fila = `
       <tr>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">

            <div class="avatar" style="width:28px;height:28px;font-size:11px;">
              ${iniciales}
            </div>
            </td>
            <td>
            <div>
              <div style="font-size:13px;font-weight:500;">
                ${usuario.name}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="status-pill ${usuario.is_active ? "tag-green" : "tag-red"}">
            ${usuario.is_active ? "Cuenta activa" : "Cuenta desactivada"}
          </span>
        </td>
      </tr>
    `;

    tbody.innerHTML += fila;
  });
}

export function renderTablaUsuariosAdmin(usuarios) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  usuarios.forEach((usuario) => {
    const partes = usuario.name.trim().split(" ");
    const iniciales =
      partes.length >= 2
        ? (partes[0][0] + partes[1][0]).toUpperCase()
        : partes[0].slice(0, 2).toUpperCase();

    const fila = `
      <tr id="row-${usuario.id}">
        <td>
          <div class="user-cell">
            <div class="avatar">${iniciales}</div>
          </div>
        </td>
        <td>
          <div class="user-name">${usuario.name}</div>
        </td>
        <td>
          <span class="${usuario.is_active ? "status-green" : "status-red"}" id="status-${usuario.id}">
            ${usuario.is_active ? "Activa" : "Desactiva"}
          </span>
        </td>
        <td>
          <label class="switch">
            <input
              type="checkbox"
              class="user-status-switch"
              data-id="${usuario.id}"
              ${usuario.is_active ? "checked" : ""}
            >
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <button class="btn-delete" data-id="${usuario.id}" data-name="${usuario.name}">
            Eliminar
          </button>
        </td>
      </tr>
    `;

    tbody.innerHTML += fila;
  });

  // Eventos switch
  document.querySelectorAll(".user-status-switch").forEach((switchEl) => {
    switchEl.addEventListener("change", async (e) => {
      const userId = e.target.dataset.id;
      const statusEl = document.getElementById(`status-${userId}`);
      try {
        if (e.target.checked) {
          await adminActivarCuenta(userId);
          statusEl.className = "status-green";
          statusEl.textContent = "Activa";
        } else {
          await adminDesactivarCuenta(userId);
          statusEl.className = "status-red";
          statusEl.textContent = "Desactiva";
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

  // Eventos eliminar
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const userId = btn.dataset.id;
      const userName = btn.dataset.name;
      document.getElementById("modal-msg").textContent =
        `¿Seguro que quieres borrar a ${userName}? Esta acción no se puede deshacer.`;
      document.getElementById("modal").dataset.pendingId = userId;
      document.getElementById("modal").classList.add("visible");
    });
  });
}
