import { cargarRazasEdicion } from './cargarRazasEdicion.js';

export async function cargarTiposMascotaEdicion(idElemento) {
    try {
        const response = await fetch('http://localhost:3000/api/obtenermascota');
        const data = await response.json();

        if (data.success) {
            const tipoMascotaSelect = document.getElementById(idElemento);
            tipoMascotaSelect.innerHTML = ''; // Limpiar el select existente

            // Opción predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione el tipo de mascota';
            tipoMascotaSelect.appendChild(defaultOption);

            // Llenar el select con los tipos de mascota
            data.data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.descripciontipom;
                tipoMascotaSelect.appendChild(option);
            });

            // Agregar evento para cargar razas al cambiar el tipo de mascota
            tipoMascotaSelect.addEventListener('change', () => {
                const razaMascotaId = idElemento.replace('tipo', 'raza');
                cargarRazasEdicion(razaMascotaId, tipoMascotaSelect.value);
            });
        } else {
            console.error('Error al obtener tipos de mascota:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}