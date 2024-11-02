// init.js
import { cargarTiposMascota } from './cargartiposmascota.js';
import { cargarRazas } from './cargarrazas.js';
import { crearMascota } from './crearmascota.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarTiposMascota();

    // Agregar el evento de cambio para cargar razas
    document.getElementById('tipoMascota').addEventListener('change', cargarRazas);

    // Agregar el evento de envío del formulario
    const form = document.getElementById('formCrearMascota');
    if (form) {
        form.addEventListener('submit', crearMascota);
    }
});