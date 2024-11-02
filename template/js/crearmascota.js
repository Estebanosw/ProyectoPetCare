// crearMascota.js
export async function crearMascota(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const usuarioDocumento = localStorage.getItem('usuarioDocumento');
    if (!usuarioDocumento) {
        alert("Por favor, inicie sesión para crear una mascota.");
        window.location.href = "/template/index.html"; // Redirige al login si no hay sesión
        return;
    }

    data.UsuarioDocumento = usuarioDocumento;

    // Renombrar las claves para que coincidan con lo esperado por el backend
    data.tipomascotaid = data.tipoMascota || null;
    data.nombre = data.nombreMascota || null;
    data.razaid = data.raza || null;
    data.fechanacimiento = data.fechaNacimiento || null;

    // Verificar campos vacíos
    if (!data.tipomascotaid || !data.nombre || !data.razaid || !data.fechanacimiento) {
        alert('Todos los campos son obligatorios.'); // Alert en lugar de console.error
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            alert('Mascota creada: ' + result.message); // Alert en caso de éxito
            event.target.reset(); // Resetea el formulario después de crear la mascota
        } else {
            alert('Error al crear mascota: ' + result.message); // Alert en caso de error
        }
    } catch (error) {
        alert('Error de conexión: ' + error); // Alert si hay un error de conexión
    }
}