// ============================================================
// pages/registro.js
// Este archivo maneja SOLO la lógica del formulario de registro.
// No sabe cómo funciona fetch ni la API, solo llama a la función
// que le corresponde desde services/api.js
// ============================================================


// Importamos únicamente la función que necesitamos de api.js
import { registrarUsuario } from "../services/api.js";


// Seleccionamos el formulario del HTML
const form = document.querySelector("form");


// Escuchamos cuando el usuario hace clic en "Registrarse"
form.addEventListener("submit", async (e) => {

  // Evita que el formulario recargue la página al enviarse
  e.preventDefault();

  // Leemos los valores de los 3 inputs en orden:
  // [0] name, [1] password, [2] confirmar contraseña
  const inputs = form.querySelectorAll("input");
  const name    = inputs[0].value;
  const password = inputs[1].value;
  const confirmar = inputs[2].value;


  // --- VALIDACIÓN EN EL CLIENTE ---
  // Verificamos que las contraseñas coincidan ANTES de llamar a la API.
  // Esto evita una petición innecesaria al servidor.
  if (password !== confirmar) {
    alert("Las contraseñas no coinciden");
    return; // Detenemos todo aquí
  }


  // --- LLAMADA A LA API ---
  try {
    // Llamamos a la función de api.js, que se encarga de hacer el fetch.
    // Si algo falla, lanza un Error que atrapa el "catch" de abajo.
    await registrarUsuario(name, password);
  
    window.location.href = "./index.html";

    // Redirigimos al login para que inicie sesión
    

  } catch (error) {
    // Mostramos el mensaje de error que lanzó api.js
    // Puede ser un error del servidor (email ya existe, etc.)
    // o un error de red (sin internet, servidor caído)
    alert("Error: " + error.message);
  }

});