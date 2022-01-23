

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem('darkMode') === null) {
        // Comprueba si el ordenador del usuario está en modo oscuro y pone la página en modo oscuro por defecto
        let modo_oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('darkMode', modo_oscuro);
    }

    let modo_oscuro = localStorage.getItem('darkMode');
    console.log(modo_oscuro);
    if (modo_oscuro === 'true') {
        activarModoOscuro();
    }

    const botones_modo_oscuro = document.querySelectorAll('.boton--modo-oscuro');

    for (let i = 0; i < botones_modo_oscuro.length; i++) {
        botones_modo_oscuro[i].addEventListener('click', toggleModoOscuro);
    }

})


// Activar y desactivar modo oscuro

const head = document.querySelector('head');


const toggleModoOscuro = () => {
    localStorage.getItem('darkMode') === 'true' ? desactivarModoOscuro() : activarModoOscuro();
}

const activarModoOscuro = () => {

    const iconos_luna = document.querySelectorAll('[data-icon="ic:baseline-dark-mode"]');

    // Añade el css del modo oscuro
    let css_oscuro = document.createElement('link');
    css_oscuro.setAttribute('rel', 'stylesheet');
    css_oscuro.setAttribute('href', 'css/style-dark.css');
    head.appendChild(css_oscuro);

    // Cambia el icono
    for (let i=0; i < iconos_luna.length; i++) {
        let nuevo_icono = document.createElement('span');
        nuevo_icono.setAttribute('class', 'iconify');
        nuevo_icono.setAttribute('data-icon', 'ic:baseline-light-mode');
        iconos_luna[i].parentElement.appendChild(nuevo_icono);
        iconos_luna[i].remove();
    }

    localStorage.setItem('darkMode', true);

}

const desactivarModoOscuro = () => {

    const iconos_sol = document.querySelectorAll('[data-icon="ic:baseline-light-mode"]');

    // Elimina el css del modo oscuro
    let css_oscuro = document.querySelector('link[href="css/style-dark.css"]');
    css_oscuro.remove();

    // Cambia el icono
    for (let i=0; i < iconos_sol.length; i++) {
        let nuevo_icono = document.createElement('span');
        nuevo_icono.setAttribute('class', 'iconify');
        nuevo_icono.setAttribute('data-icon', 'ic:baseline-dark-mode');
        iconos_sol[i].parentElement.appendChild(nuevo_icono);
        iconos_sol[i].remove();
    }

    localStorage.setItem('darkMode', false);

}

