document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cedula = document.getElementById("cedula").value;
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const profesion = document.getElementById("profesion").value;

    try {
        const response = await fetch("http://localhost:3000/api/guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Cedula: cedula,
                Nombre: nombre,
                Edad: edad,
                Profesion: profesion,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("responseMessage").textContent = "Registro guardado exitosamente";
            document.getElementById("registroForm").reset();
        } else {
            document.getElementById("responseMessage").textContent = "Error al guardar el registro: " + result.error;
        }
    } catch (error) {
        document.getElementById("responseMessage").textContent = "Error de conexión: " + error.message;
    }
});