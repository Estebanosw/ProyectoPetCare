/*PAGINA PRINCIPAL*/
//Mostrar y ocultar los submenús

// Selecciona todos los elementos con la clase .menupadre
const menuPadres = document.querySelectorAll('.menupadre');
// Recorre cada elemento .menupadre
menuPadres.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Previene que el enlace navegue a un nuevo destino

        const elementopadre = item.parentElement; // Obtiene el <li> que es el padre del enlace
        const submenu = elementopadre.querySelector('.submenu'); // Busca el submenú dentro del elemento padre

        // Cambia la visibilidad del submenú
        if (submenu.style.display === 'block') {
            submenu.style.display = 'none'; // Oculta el submenú
        } else {
            submenu.style.display = 'block'; // Muestra el submenú
        }
    });
});

//Mostrar y ocultar la opción de cerrar sesión
document.getElementById('settingsButton').addEventListener('click', function() {
    const logoutMenu = document.getElementById('logoutMenu');
    logoutMenu.classList.toggle('visible'); // Alterna la clase para mostrar/ocultar
});
