import { cargarTiposMascota } from './cargartiposmascota.js';
import { cargarMacota } from './cargarmascota.js';
import { crearDesparacitacion } from './creardesparacitacion.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarTiposMascota(); // Carga los tipos de mascota al iniciar

    const tipoMascotaSelect = document.getElementById('tipoMascota');
    tipoMascotaSelect.addEventListener('change', cargarMacota); // Llama a cargarMacota al cambiar el tipo

    // Agregar el evento de envío del formulario
    const form = document.getElementById('formcreardesparacitacion');
    if (form) {
        form.addEventListener('submit', crearDesparacitacion);
    }
});