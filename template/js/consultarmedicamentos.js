//consultarmedicamentos.js
document.getElementById('formMedicamento').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipoMascotaId = tipoMascotaSelect.value; // Obtener el id del tipo de mascota
    const nombreMascota = document.getElementById('nombreMascota').value; // Obtener el nombre de la mascota
    const usuarioDocumento = localStorage.getItem('usuarioDocumento'); // Obtener el documento del usuario desde el caché
    const errorMessage = document.getElementById('error-message'); // Seleccionar el párrafo para mensajes de error
    errorMessage.textContent = ''; // Limpiar el mensaje de error al iniciar
    // Consultar Medicamento
    try {
        const response = await fetch(`http://localhost:3000/api/consultarmedicamentos/${usuarioDocumento}/${tipoMascotaId}/${nombreMascota}`);
        
        // Manejo del estado de respuesta
        if (!response.ok) {
            // Si la respuesta no es 200 OK, trata de obtener el mensaje de error
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Error inesperado al consultar el medicamento.'; // Mostrar el mensaje de error
            return; // Salir de la función
        }
        const data = await response.json();

        if (data.success) {
            // Limpiar la tabla antes de llenar
            const tbody = document.querySelector('#tablamedicamento tbody');
            tbody.innerHTML = '';

            data.data.forEach(medicamento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="actions">
                        <button class="edit-icon" onclick="editmasc('${medicamento.id}')">
                            <img src="/template/Recursos/images/editar.png" alt="Editar" title="Editar"/>
                        </button>
                        <button class="save-icon" onclick="savemasc('${medicamento.id}')" style="display: none;">
                            <img src="/template/Recursos/images/Guardar.png" alt="Guardar" title="Guardar"/>
                        </button>
                    </td>
                    <td>
                        <select disabled id="tipo-${medicamento.id}">
                            <option value="${mascota.tipoMascotaId}" selected>${mascota.descripciontipom}</option>
                        </select>
                    </td>
                    <td><input type="text" id="nombre-${mascota.id}" value="${mascota.nombre}" disabled /></td>
                    <td>
                        <select disabled id="raza-${mascota.id}">
                            <option value="${mascota.razaId}" selected>${mascota.descripcionraza}</option>
                        </select>
                    </td>
                    <td><input type="date" id="fecha-${mascota.id}" value="${mascota.fechanacimiento.split('T')[0]}" disabled /></td>
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