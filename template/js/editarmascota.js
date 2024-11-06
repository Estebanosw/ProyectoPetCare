//editarmascota.js
document.getElementById('formEditarMascota').addEventListener('submit', async (event) => {
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
                    <td class="actions">
                        <button class="edit-icon" onclick="editmasc('${mascota.id}')">
                            <img src="/template/Recursos/images/editar.png" alt="Editar" title="Editar"/>
                        </button>
                        <button class="save-icon" onclick="savemasc('${mascota.id}')" style="display: none;">
                            <img src="/template/Recursos/images/Guardar.png" alt="Guardar" title="Guardar"/>
                        </button>
                    </td>
                    <td>
                        <select disabled id="tipo-${mascota.id}">
                            <option value="${mascota.tipoMascotaId}" selected>${mascota.descripciontipom}</option>
                        </select>
                    </td>
                    <td><input type="text" id="nombre-${mascota.id}" value="${mascota.nombre}" disabled /></td>
                    <td>
                        <select disabled id="raza-${mascota.id}">
                            <option value="${mascota.razaId}" selected>${mascota.descripcionraza}</option>
                        </select>
                    </td>
                    <td><input type="date" id="fecha-${mascota.id}" value="${mascota.fechanacimiento}" disabled /></td>
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

//Función para habilitar la edición de los campos de un registro específico.

async function editmasc(id) {
    // Habilitar edición de campos
    document.getElementById(`tipo-${id}`).disabled = false;
    document.getElementById(`nombre-${id}`).disabled = false;
    document.getElementById(`raza-${id}`).disabled = false;
    document.getElementById(`fecha-${id}`).disabled = false;

    // Mostrar botón de guardar y ocultar el de editar
    document.querySelector(`#tablaConsMascota tbody tr .edit-icon[onclick="editmasc('${id}')"]`).style.display = 'none';
    document.querySelector(`#tablaConsMascota tbody tr .save-icon[onclick="savemasc('${id}')"]`).style.display = 'inline-block';

    // Cargar opciones de selección para tipo de mascota y raza
    await cargarOpciones(id);
}

// Función para cargar las opciones de selección para 'descripciontipom' y 'descripcionraza'
async function cargarOpciones(id) {
    const tipoMascotaSelect = document.getElementById(`tipo-${id}`);
    const razaMascotaSelect = document.getElementById(`raza-${id}`);
    
    // Cargar todas las opciones de tipos de mascota
    await cargarTiposMascota(tipoMascotaSelect);

    // Llenar las opciones de raza según el tipo de mascota seleccionado
    tipoMascotaSelect.addEventListener('change', async () => {
        await cargarRazas(tipoMascotaSelect.value, razaMascotaSelect);
    });

    // Cargar las razas según el tipo de mascota actual de la mascota
    await cargarRazas(tipoMascotaSelect.value, razaMascotaSelect);
}

//Función para guardar los cambios realizados en el registro.

async function savemasc(id) {
    const tipoMascota = document.getElementById(`tipo-${id}`).value;
    const nombreMascota = document.getElementById(`nombre-${id}`).value;
    const razaMascota = document.getElementById(`raza-${id}`).value;
    const fechaNacimiento = document.getElementById(`fecha-${id}`).value;

    try {
        const response = await fetch(`http://localhost:3000/api/actualizarmascota/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipoMascota, nombreMascota, razaMascota, fechaNacimiento })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al guardar:', errorData.message);
            return;
        }

        alert('Datos actualizados con éxito.');
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
