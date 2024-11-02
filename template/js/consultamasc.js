// consultamasc.js

document.getElementById('formCrearMascota').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipoMascotaId = tipoMascotaSelect.options[tipoMascotaSelect.selectedIndex].text; // Obtener el texto del tipo de mascota
    const nombreMascota = document.getElementById('nombreMascota').value; // Obtener el nombre de la mascota
    const usuarioDocumento = localStorage.getItem('usuarioDocumento'); // Asegúrate de que la clave sea correcta

    // Consultar mascotas
    try {
        const response = await fetch(`http://localhost:3000/api/consultarmascota/${usuarioDocumento}/${tipoMascotaId}/${nombreMascota}`);
        const data = await response.json();

        if (data.success) {
            // Limpiar la tabla antes de llenar
            const tbody = document.querySelector('#personaTable tbody');
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