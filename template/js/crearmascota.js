// Función para cargar los tipos de mascota
async function cargarTiposMascota() {
    try {
        const response = await fetch('http://localhost:3000/api/obtenermascota');
        const data = await response.json();

        if (data.success) {
            const tipoMascotaSelect = document.getElementById('tipoMascota');
            tipoMascotaSelect.innerHTML = ''; // Limpiar el select existente

            // Opción predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = ''; 
            defaultOption.textContent = 'Seleccione el tipo de mascota';
            tipoMascotaSelect.appendChild(defaultOption);

            // Llenar el select con los tipos de mascota
            data.data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id; // Asegúrate de que esta sea la clave correcta
                option.textContent = tipo.descripciontipom;
                tipoMascotaSelect.appendChild(option);
            });
        } else {
            console.error('Error al obtener tipos de mascota:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Agregar el evento de cambio para cargar razas
document.getElementById('tipoMascota').addEventListener('change', cargarRazas);

// Función para cargar razas
async function cargarRazas() {
    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipomascotaid = tipoMascotaSelect.value;

    if (tipomascotaid) {
        try {
            const response = await fetch(`http://localhost:3000/api/obtenerraza/${tipomascotaid}`);
            const data = await response.json();

            if (data.success) {
                const razaSelect = document.getElementById('raza'); // Asumiendo que tienes un select con id 'raza'
                razaSelect.innerHTML = ''; // Limpiar el select existente

                // Opción predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; 
                defaultOption.textContent = 'Seleccione la raza';
                razaSelect.appendChild(defaultOption);

                // Llenar el select con las razas
                data.data.forEach(raza => {
                    const option = document.createElement('option');
                    option.value = raza.id; // Asegúrate de que esta sea la clave correcta
                    option.textContent = raza.descripcionraza; // Asumiendo que tienes un campo llamado descripcionraza
                    razaSelect.appendChild(option);
                });
            } else {
                console.error('Error al obtener razas:', data.message);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }
}

// Agregar el evento de cambio para cargar razas
document.getElementById('tipoMascota').addEventListener('change', cargarRazas);

// Crear Macota
async function crearMascota(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const usuarioDocumento = localStorage.getItem('usuarioDocumento');
    if (!usuarioDocumento) {
        alert("Por favor, inicie sesión para crear una mascota.");
        window.location.href = "/template/index.html"; // Redirige al login si no hay sesión
        return;
    }

    if (usuarioDocumento) {
        data.UsuarioDocumento = usuarioDocumento;
    } else {
        console.error('No se encontró el documento del usuario en localStorage.');
        return;
    }

    // Renombrar las claves para que coincidan con lo esperado por el backend
    if (data.tipoMascota) {
        data.tipomascotaid = data.tipoMascota;
        delete data.tipoMascota;
    } else {
        console.error('El tipo de mascota no puede estar vacío.');
        return;
    }

    // Renombrar nombreMascota a nombre
    if (data.nombreMascota) {
        data.nombre = data.nombreMascota;
        delete data.nombreMascota;
    } else {
        console.error('El nombre de la mascota no puede estar vacío.');
        return;
    }

    // Renombrar raza a razaid
    if (data.raza) {
        data.razaid = data.raza;
        delete data.raza;
    } else {
        console.error('La raza de la mascota no puede estar vacía.');
        return;
    }

    // Renombrar fechaNacimiento a fechanacimiento
    if (data.fechaNacimiento) {
        data.fechanacimiento = data.fechaNacimiento;
        delete data.fechaNacimiento;
    } else {
        console.error('La fecha de nacimiento de la mascota no puede estar vacía.');
        return;
    }

    console.log(data);

    try {
        const response = await fetch('http://localhost:3000/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
            console.log('Mascota creada:', result.message);
        } else {
            console.error('Error al crear mascota:', result.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Llamar a cargarTiposMascota al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    cargarTiposMascota();

    // Agregar el evento de envío del formulario
    const form = document.getElementById('formCrearMascota');
    if (form) {
        form.addEventListener('submit', crearMascota);
    }
});