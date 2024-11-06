// funcioneseditarmasc.js
import { cargarTiposMascota } from './cargartiposmascota.js';
import { cargarRazas } from './cargarrazas.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tipoMascotaSelect = document.getElementById('tipoMascota');

    // Cargar todos los tipos de mascota al iniciar la página
    await cargarTiposMascota(tipoMascotaSelect);

    // Cargar razas cuando cambia el tipo de mascota
    tipoMascotaSelect.addEventListener('change', async () => {
        const razaSelect = document.getElementById('razaMascota');
        await cargarRazas(tipoMascotaSelect.value, razaSelect);
    });
});