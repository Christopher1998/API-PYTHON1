import { getUserId } from "../utils/auth.js";
import { renderUsuario } from "../utils/render.js";
import { getUsuarioPorId, actualizarUsuario, cambiarPassword,  } from "../services/api.js";

const editing = { username: false, password: false };
let toastTimeout = null;


async function cargarUsuario() {
  try {
    const userId = getUserId();

    if (!userId) return;

    const usuario = await getUsuarioPorId(userId);

    renderUsuario(usuario);

  } catch (error) {
    console.error("Error al cargar usuario:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();

  window.toggleEdit = toggleEdit;
  window.saveChanges = saveChanges;
  window.checkMatch = checkMatch;

 
  window.addEventListener("beforeunload", () => {
    console.log("⚠️ PÁGINA DESCARGÁNDOSE");
  });
});


function checkMatch() {
  const pw = document.getElementById("password").value;
  const confirm = document.getElementById("password-confirm").value;
  const hint = document.getElementById("match-hint");
  const saveBtn = document.getElementById("save-btn");

  if (!editing.password) {
    hint.textContent = "";
    return;
  }

  if (confirm === "") {
    hint.className = "hint";
    hint.innerHTML = "";
    saveBtn.disabled = true;
    return;
  }

  if (pw === confirm) {
    hint.className = "hint ok";
    hint.innerHTML =
      '<i class="ti ti-circle-check" aria-hidden="true"></i> Las contraseñas coinciden';
    saveBtn.disabled = false;
  } else {
    hint.className = "hint err";
    hint.innerHTML =
      '<i class="ti ti-alert-circle" aria-hidden="true"></i> Las contraseñas no coinciden';
    saveBtn.disabled = true;
  }
}

function toggleEdit(field) {
  const input = document.getElementById(field);
  const btn = document.getElementById("btn-" + field);
  editing[field] = !editing[field];

  if (editing[field]) {
    input.removeAttribute("readonly");
    input.focus();
    btn.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i> Cancelar';
    if (field === "password") {
      input.value = "";
      input.type = "password";
      input.placeholder = "Escribe tu nueva contraseña";
      document.getElementById("confirm-block").classList.remove("hidden");

      document
        .getElementById("current-password-block")
        .classList.remove("hidden");
      document.getElementById("password-confirm").value = "";
      document.getElementById("match-hint").textContent = "";
      document.getElementById("save-btn").disabled = true;
    }
  } else {
    input.setAttribute("readonly", true);
    if (field === "password") {
      input.type = "password";
      input.placeholder = "";
      input.value = "mypassword123";
      document.getElementById("confirm-block").classList.add("hidden");

      document.getElementById("current-password-block").classList.add("hidden");
      document.getElementById("match-hint").textContent = "";
      document.getElementById("save-btn").disabled = false;
    }
    btn.innerHTML = '<i class="ti ti-edit" aria-hidden="true"></i> Editar';
  }
}

async function saveChanges() {
  const userId = getUserId();
  if (!userId) return;

  try {
    if (editing.username) {
      const username = document.getElementById("username").value;
      await actualizarUsuario(userId, username);
      toggleEdit("username");
    }

    const toast = document.getElementById("toast");
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.classList.remove("hidden");
    
    toastTimeout = setTimeout(() => {
      toast.classList.add("hidden");
      toastTimeout = null;
    }, 3000);

  } catch (error) {
    console.error("ERROR:", error.message);
    alert("Error: " + error.message);
  }
}
document.getElementById("save-btn").addEventListener("click", saveChanges);
