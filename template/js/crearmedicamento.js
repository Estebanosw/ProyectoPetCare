// crearmedicamento.js
export async function crearMedicamento(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Renombrar las claves para que coincidan con lo esperado por el backend
    data.mascotaid = data.Mascota || null;
    data.nombre = data.nombreMedicamento || null;
    data.dosis = data.dosis || null;
    data.frecuencia = data.frecuencia || null;
    data.duracion = data.duracionTrat || null;

    // Capturar el valor del checkbox "estado" y asignar 1 o 0
    data.estado = document.getElementById('estado').checked ? 1 : 0;

    // Verificar campos vacíos
    if (!data.mascotaid || !data.nombre || !data.dosis || !data.frecuencia || !data.duracion) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/guardarmedicamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            alert('Medicamento creado: ' + result.message); // Alert en caso de éxito
            event.target.reset(); // Resetea el formulario después de crear el medicamento
        } else {
            alert('Error al crear Medicamento: ' + result.message); // Alert en caso de error
        }
    } catch (error) {
        alert('Error de conexión: ' + error); // Alert si hay un error de conexión
    }
}