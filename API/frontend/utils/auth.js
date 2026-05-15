export function getUserId() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "./index.html";
    return null;
  }
  return userId;
}

//Funcion para limpiar token y datos de inicio de sesion.

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "./index.html";
}