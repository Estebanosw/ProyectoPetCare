// auth.js

// Verificar si el usuario está autenticado
const usuarioId = localStorage.getItem('Documento'); // Asegúrate de que 'Documento' sea la clave correcta en el localStorage
if (!usuarioId) { // Cambié Documento por usuarioId
    // Si no está autenticado, redirigir al login
    window.location.href = "/template/login.html";
}

// Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem('usuarioId'); // Elimina el ID del localStorage
            window.location.href = "/template/login.html"; // Redirige al login
        });
    }
});