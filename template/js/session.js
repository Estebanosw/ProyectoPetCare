// auth.js

// Verificar si el usuario está autenticado
const usuarioId = localStorage.getItem('usuarioDocumento'); // Debe coincidir con el nombre que utilizas para guardar el documento
if (!usuarioId) {
    // Si no está autenticado, redirigir al login
    window.location.href = "/template/login.html";
}

// Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem('usuarioDocumento'); // Elimina el ID del localStorage
            window.location.href = "/template/login.html"; // Redirige al login
        });
    }
});