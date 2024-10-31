document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const Documento = loginForm.Documento.value;
        const contrasenia = loginForm.password.value;

        fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Documento, contrasenia })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Documento o contraseña incorrecta");
                } else {
                    throw new Error("Error en el servidor");
                }
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            localStorage.setItem('usuarioDocumento', Documento); // Guarda el Documento en localStorage
            window.location.href = "/template/paginaprincipal.html"; // Redirige a la página de inicio o de bienvenida
        })
        .catch(error => {
            // Alerta de error
            alert(error.message); // Mensaje de usuario incorrecto
            loginForm.reset(); // Limpia los campos del formulario
        });
    });
});