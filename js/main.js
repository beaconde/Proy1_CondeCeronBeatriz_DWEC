
// Menú desplegable cerrar sesión
const menu_desplegable = document.querySelector('.menu--desplegable');

const desplegar_menu = () => {
    const icono_desplegable = document.querySelector('.icono--desplegable');
    icono_desplegable.classList.toggle('icono--desplegable-abierto');
    menu_desplegable.classList.toggle('menu--desplegable-abierto');
}


// Menú desplegable responsive
const body = document.querySelector('body');
const overlay = document.querySelector('.overlay');
const nav_responsive = document.querySelector('.nav--responsive');
const nav_responsive_boton = document.querySelector('.nav--responsive-boton');

const abrir_menu = (menu) => {

    overlay.style.display = 'block';

    // para cambiar el icono
    menu.classList.add('abierto');
    nav_responsive.style.width = '45%';
    body.classList.add('scroll-desactivado');

}

const cerrar_menu = () => {
    overlay.style.display = 'none';
    nav_responsive_boton.classList.remove('abierto');
    nav_responsive.style.width = '0';
    body.classList.remove('scroll-desactivado');
}

// Cerrar sesión
const cerrar_sesion = () => {
    window.location.href = 'index.html';
}


// Funciones comunes listado y detalle de pokémon y movimientos

// Recibe un string y lo devuelve con la primera letra en mayúsculas
const capitalizeName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Recibe un número y lo devuelve en formato de 3 caracteres
const formatNumber = number => {
    number = String(number);
    while (number.length<3) number = '0'+number;
    return number
}

// Recibe dos números y devuelve un número aleatorio comprendido entre ellos
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Controla si la llamada a la API da error
const handleError = response => {
    if (!response.ok) throw Error(response.error);
    return response;
}

// Convierte la respuesta de la API en JSON
const handleResponse = response => response.json();


let paginateArray = (arr, pageSize, pageNumber) => {
    return arr.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}