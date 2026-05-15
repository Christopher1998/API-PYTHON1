// ============================================================
// pages/login.js
// Este archivo maneja SOLO la lógica del formulario de login.
// Su única responsabilidad es: tomar las credenciales,
// llamar a la API y guardar el token si el login es exitoso.
// ============================================================

// Importamos únicamente la función de login desde api.js
import { loginUsuario } from "../services/api.js";

// Seleccionamos el formulario del HTML
const form = document.querySelector("form");

// Escuchamos cuando el usuario hace clic en "Iniciar sesión"
form.addEventListener("submit", async (e) => {
  // Evita que el formulario recargue la página al enviarse
  e.preventDefault();

  // Leemos los valores de los 2 inputs:
  // [0] email, [1] password
  const inputs = form.querySelectorAll("input");
  const name = inputs[0].value;
  const password = inputs[1].value;

  // --- LLAMADA A LA API ---
  try {
    // Enviamos las credenciales a la API.
    // Si son incorrectas, el servidor responde con error
    // y api.js lanza un Error que atrapa el "catch".
    const data = await loginUsuario(name, password);

    // Guardamos el token en localStorage para que api.js
    // lo agregue automáticamente en las siguientes peticiones.
    // El token identifica al usuario en cada llamada protegida.
    localStorage.setItem("token", data.token);

    // Guardamos el id en localStorage para que api.js
    // lo encuentre automáticamente en las siguientes peticiones.
    // El id identifica al usuario en cada llamada protegida.
    localStorage.setItem("userId", data.id);

    //Guardamos el role en localStorage
    localStorage.setItem("role", data.role)

// =========================
// REDIRECCIÓN SEGÚN ROLE
// =========================

if (data.role === "admin") {

  window.location.href = "./dashboard.html";

} else {

  window.location.href = "./user.html";

}
  } catch (error) {
    const errorDiv = document.getElementById("login-error");

    errorDiv.textContent = error.message;

    errorDiv.classList.remove("hidden");

    setTimeout(() => {
      errorDiv.classList.add("hidden");
    }, 3000);
  }
});
