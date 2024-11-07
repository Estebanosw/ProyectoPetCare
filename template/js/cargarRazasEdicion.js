export async function cargarRazasEdicion(idSelect, tipoMascotaId) {
    if (tipoMascotaId) {
        try {
            const response = await fetch(`http://localhost:3000/api/obtenerraza/${tipoMascotaId}`);
            const data = await response.json();

            if (data.success) {
                const razaSelect = document.getElementById(idSelect);
                razaSelect.innerHTML = ''; // Limpiar el select existente

                // Opción predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Seleccione la raza';
                razaSelect.appendChild(defaultOption);

                // Llenar el select con las razas
                data.data.forEach(raza => {
                    const option = document.createElement('option');
                    option.value = raza.id;
                    option.textContent = raza.descripcionraza;
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