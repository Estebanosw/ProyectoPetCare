document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Obtener datos del formulario
        const Documento = form.Documento.value;
        const nombres = form.name.value;
        const apellidos = form.Apellidos.value;
        const correo = form.email.value;
        const contrasenia = form.password.value;

        // Crear el objeto de datos a enviar
        const personaData = { Documento, nombres, apellidos, correo, contrasenia };

        // Enviar datos al servidor
        createPersona(personaData);
    });

    // Función para enviar el registro al servidor
    function createPersona(personaData) {
        fetch("http://localhost:3000/api/insertar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personaData)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 409) {
                    // Lanza un error con el mensaje específico para conflicto
                    throw new Error("El documento ya está registrado. Por favor, utiliza otro.");                    
                } else {
                    throw new Error("Error en la creación del registro.");
                }
            }
            return response.json();
        })
        .then(data => {
            // Alerta de éxito
            alert("Registro exitoso: " + data.nombres);
            // Aquí puedes hacer cualquier otra cosa, como limpiar el formulario o actualizar la lista de personas
            window.location.href = "/template/login.html"; // Cambia esto a la URL correcta de tu página de inicio de sesión
        })
        .catch(error => {
            console.error("Error en el fetching:", error);
            alert("Hubo un error en el registro: " + error.message);
            // Limpiar los campos del formulario
            document.getElementById("registroForm").reset();
        });
    }
});