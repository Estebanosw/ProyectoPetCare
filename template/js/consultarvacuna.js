document.getElementById('formVacuna').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipoMascotaId = tipoMascotaSelect.value; // Obtener el id del tipo de mascota
    const nombreMascota = document.getElementById('nombreMascota').value; // Obtener el nombre de la mascota
    const usuarioDocumento = localStorage.getItem('usuarioDocumento'); // Obtener el documento del usuario desde el caché
    const errorMessage = document.getElementById('error-message'); // Seleccionar el párrafo para mensajes de error
    errorMessage.textContent = ''; // Limpiar el mensaje de error al iniciar
    // Consultar Vacuna
    try {
        const response = await fetch(`http://localhost:3000/api/consultarvacuna/${usuarioDocumento}/${tipoMascotaId}/${nombreMascota}`);
        
        // Manejo del estado de respuesta
        if (!response.ok) {
            // Si la respuesta no es 200 OK, trata de obtener el mensaje de error
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Error inesperado al consultar la Vacuna.'; // Mostrar el mensaje de error
            return; // Salir de la función
        }
        const data = await response.json();

        if (data.success) {
            // Limpiar la tabla antes de llenar
            const tbody = document.querySelector('#tablavacuna tbody');
            tbody.innerHTML = '';

            // Llenar la tabla con los resultados
            data.data.forEach(vacuna => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vacuna.nombre}</td>
                    <td>${new Date(vacuna.fechaaplicacion).toLocaleDateString()}</td>
                    <td>${new Date(vacuna.fecproxrefuerzo).toLocaleDateString()}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Error al obtener las vacunas:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
});