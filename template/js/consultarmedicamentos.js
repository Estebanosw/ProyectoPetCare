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
                    <td><input type="text" id="nombre-${medicamento.id}" value="${medicamento.nombre}" disabled /></td>
                    <td><input type="text" id="dosis-${medicamento.id}" value="${medicamento.dosis}" disabled /></td>
                    <td><input type="text" id="frecuencia-${medicamento.id}" value="${medicamento.frecuencia}" disabled /></td>
                    <td><input type="text" id="duracion-${medicamento.id}" value="${medicamento.duracion}" disabled /></td>
                    <td><input type="checkbox" id="estado-${medicamento.id}" ${medicamento.estado === 1 ? 'checked' : ''} disabled /></td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Error al obtener los medicamentos:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
});

//Función para habilitar la edición de los campos de un registro específico.
async function editarmed(id) {
    document.getElementById(`nombre-${id}`).disabled = false;
    document.getElementById(`dosis-${id}`).disabled = false;
    document.getElementById(`frecuencia-${id}`).disabled = false;
    document.getElementById(`duracion-${id}`).disabled = false;
    document.getElementById(`estado-${id}`).disabled = false;

    // Mostrar botón de guardar y ocultar el de editar
    document.querySelector(`#tablamedicamento tbody tr .edit-icon[onclick="editmasc('${id}')"]`).style.display = 'none';
    document.querySelector(`#tablamedicamento tbody tr .save-icon[onclick="savemasc('${id}')"]`).style.display = 'inline-block';

    // Cargar opciones de selección para tipo de mascota y raza
    await cargarOpciones(id);
}

//Función para guardar los cambios realizados en el registro.
async function savemed(id) {
    const nombreMedicamento = document.getElementById(`nombre-${id}`).value;
    const dosisMedicamento = document.getElementById(`dosis-${id}`).value;
    const frecuenciaMedicamento = document.getElementById(`frecuencia-${id}`).value;
    const duracionMedicamento = document.getElementById(`duracion-${id}`).value;
    const estadoMedicamento = document.getElementById(`estado-${id}`).value;

    try {
        const response = await fetch(`http://localhost:3000/api/actualizarmascota/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipomascotaid: tipoMascota,
                nombremascota: nombreMascota,
                razaid: razaMascota,
                fechanacimiento: fechaNacimiento
            })
        });

        if (response.ok) {
            // Si la actualización es exitosa, redirigir al usuario
            alert('Mascota actualizada con éxito');
            window.location.href = '/template/editarmascota.html'; 
        } else {
            const errorData = await response.json();
            console.error('Error al guardar:', errorData.message);
            alert('Hubo un error al guardar la información');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }

    // Desactivar edición y actualizar botones
    document.getElementById(`tipo-${id}`).disabled = true;
    document.getElementById(`nombre-${id}`).disabled = true;
    document.getElementById(`raza-${id}`).disabled = true;
    document.getElementById(`fecha-${id}`).disabled = true;

    document.querySelector(`#tablaConsMascota tbody tr .edit-icon[onclick="editmasc('${id}')"]`).style.display = 'inline-block';
    document.querySelector(`#tablaConsMascota tbody tr .save-icon[onclick="savemasc('${id}')"]`).style.display = 'none';
}

window.editarmed = editarmed;
window.savemasc = savemasc;