// editarmascota.js
import { cargarTiposMascotaEdicion } from './cargarTiposMascotaEdicion.js';
import { cargarRazasEdicion } from './cargarRazasEdicion.js';

document.getElementById('formEditarMascota').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario
    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipoMascotaId = tipoMascotaSelect.value; // Obtener el id del tipo de mascota
    const nombreMascota = document.getElementById('nombreMascota').value; // Obtener el nombre de la mascota
    const usuarioDocumento = localStorage.getItem('usuarioDocumento'); // Obtener el documento del usuario desde el caché
    const errorMessage = document.getElementById('error-message'); // Seleccionar el párrafo para mensajes de error
    errorMessage.textContent = ''; // Limpiar el mensaje de error al iniciar
    
    // Consultar mascotas
    try {
        const response = await fetch(`http://localhost:3000/api/consultarmascota/${usuarioDocumento}/${tipoMascotaId}/${nombreMascota}`);
        
        // Manejo del estado de respuesta
        if (!response.ok) {
            const errorData = await response.json();
            errorMessage.textContent = errorData.message || 'Error inesperado al consultar la mascota.'; 
            document.querySelector('#tablaConsMascota tbody').innerHTML = '';
            return;
        }

        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#tablaConsMascota tbody');
            tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

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
                            <option value="${mascota.nombre}" selected>${mascota.descripciontipom}</option>
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

//Función para habilitar la edición de los campos de un registro específico.
async function editmasc(id) {
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
    
    // Vaciar las opciones previas en los selectores
    tipoMascotaSelect.innerHTML = '';
    razaMascotaSelect.innerHTML = '';

    await cargarTiposMascotaEdicion(`tipo-${id}`);
    await cargarRazasEdicion(`raza-${id}`, document.getElementById(`tipo-${id}`).value);
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

window.editmasc = editmasc;
window.savemasc = savemasc;