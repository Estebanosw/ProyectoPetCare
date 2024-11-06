// cargarMacota.js
export async function cargarMacota() {
    const tipoMascotaSelect = document.getElementById('tipoMascota');
    const tipomascotaid = tipoMascotaSelect.value;
    const usuarioDocumento = localStorage.getItem('usuarioDocumento');

    if (tipomascotaid) {
        try {
            const response = await fetch(`http://localhost:3000/api/obtenernombremascota/${usuarioDocumento}/${tipomascotaid}`);
            const data = await response.json();

            if (data.success) {
                const MascotaSelect = document.getElementById('Mascota'); // Asumiendo que tienes un select con id 'Mascota'
                MascotaSelect.innerHTML = ''; // Limpiar el select existente

                // Opción predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; 
                defaultOption.textContent = 'Seleccione la mascota';
                MascotaSelect.appendChild(defaultOption);

                // Llenar el select con las Mascotas
                data.data.forEach(Mascota => {
                    const option = document.createElement('option');
                    option.value = Mascota.id; // ID de la mascota
                    option.textContent = Mascota.nombre; // Asumiendo que tienes un campo llamado nombre de mascota
                    MascotaSelect.appendChild(option);
                });
            } else {
                console.error('Error al obtener razas:', data.message);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }
}