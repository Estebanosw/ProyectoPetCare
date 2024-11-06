// crearVacuna.js
export async function crearVacuna(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Renombrar las claves para que coincidan con lo esperado por el backend
    data.mascotaid = data.Mascota || null;
    data.nombre = data.nombreVacuna || null;
    data.fechaaplicacion = data.fechaAplicacion || null;
    data.fecproxrefuerzo = data.fechaRefuerzo || null;

    // Verificar campos vacíos
    if (!data.mascotaid || !data.nombre || !data.fechaaplicacion || !data.fecproxrefuerzo) {
        alert('Todos los campos son obligatorios.'); // Alert en lugar de console.error
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/guardarvacuna', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            alert('Vacuna creada: ' + result.message); // Alert en caso de éxito
            event.target.reset(); // Resetea el formulario después de crear la mascota
        } else {
            alert('Error al crear masVacunacota: ' + result.message); // Alert en caso de error
        }
    } catch (error) {
        alert('Error de conexión: ' + error); // Alert si hay un error de conexión
    }
}