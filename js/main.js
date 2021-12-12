
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
