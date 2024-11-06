//consultarmasc.js
document.getElementById('formConsultarMascota').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipoMascotaId = tipoMascotaSelect.value; // Obtener el texto del tipo de mascota
    const nombreMascota = document.getElementById('nombreMascota').value; // Obtener el nombre de la mascota
    const usuarioDocumento = localStorage.getItem('usuarioDocumento'); // Obtener el documento del usuario desde el caché
    const errorMessage = document.getElementById('error-message'); // Seleccionar el párrafo para mensajes de error
    errorMessage.textContent = ''; // Limpiar el mensaje de error al iniciar
    // Consultar mascotas
    try {
        const response = await fetch(`http://localhost:3000/api/consultarmascota/${usuarioDocumento}/${tipoMascotaId}/${nombreMascota}`);
        
        // Manejo del estado de respuesta
        if (!response.ok) {
            // Si la respuesta no es 200 OK, trata de obtener el mensaje de error
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Error inesperado al consultar la mascota.'; // Mostrar el mensaje de error
            const tbody = document.querySelector('#tablaConsMascota tbody');
            tbody.innerHTML = '';
            return; // Salir de la función
        }
        const data = await response.json();

        if (data.success) {
            // Limpiar la tabla antes de llenar
            const tbody = document.querySelector('#tablaConsMascota tbody');
            tbody.innerHTML = '';

            // Llenar la tabla con los resultados
            data.data.forEach(mascota => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${mascota.descripciontipom}</td>
                    <td>${mascota.nombre}</td>
                    <td>${mascota.descripcionraza}</td>
                    <td>${new Date(mascota.fechanacimiento).toLocaleDateString()}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Error al obtener las mascotas:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
});