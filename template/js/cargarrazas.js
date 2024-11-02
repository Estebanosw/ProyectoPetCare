// cargarRazas.js
export async function cargarRazas() {
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