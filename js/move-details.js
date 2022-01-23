'use strict';

const title = document.querySelector('title');
const nameHTML = document.querySelector('.titulo__contenido');
const typeHTML = document.querySelector('.h1__imagen');
const imageHTML = document.querySelector('.datos--movimiento__imagen');
const descriptionHTML = document.querySelector('.descripcion-movimiento');
const powerHTML = document.querySelector('.power'); 
const accuracyHTML = document.querySelector('.accuracy');
const ppHTML = document.querySelector('.pp');
const section = document.querySelector('.movimiento');
const main = document.querySelector('main');
const backButton = document.querySelector('.boton--atras');
const loader = 
`<figure>
<img src="img/icono/ultraball.png" alt="Logo ultraball" class="loader">
<figcaption>Cargando...</figcaption>
</figure>`;


// Control de eventos

// Vuelve al listado de movimientos
backButton.addEventListener('click', () => {
    window.history.go(-1)
    return false
});

// Imprime los detalles del movimiento cuando carga el contenido del DOM
document.addEventListener('DOMContentLoaded', () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if (id < 827) {
        section.style.display = 'none';
        main.style.alignItems = 'center';
        main.insertAdjacentHTML('beforeend', loader);
        fetchMoveDetails(id)
    } else window.location.href = '404.html';
})


// Recibe los datos necesarios del movimiento de la API y llama a la función
// que los muestra por pantalla
const fetchMoveDetails = async id => {
    let moveDetails = [];
    
    await fetch(`https://pokeapi.co/api/v2/move/${id}`)
    .then(handleError)
    .then(handleResponse)
    .then(move => {
        moveDetails.push(move.type.name);
        moveDetails.push(move.damage_class.name);
        moveDetails.push(move.power);
        moveDetails.push(move.accuracy);
        moveDetails.push(move.pp);

        for (let i=0; i<move.names.length; i++) {
            if (move.names[i].language.name === 'es') {
                moveDetails.push(move.names[i].name);
                break;
            }
        }

        for (let i=0; move.flavor_text_entries.length; i++) {
            if (move.flavor_text_entries[i].language.name === 'es') {
                moveDetails.push(move.flavor_text_entries[i].flavor_text);
                break;
            }
        }
    })
    .catch(error => console.log(error))
    
    printMoveDetails(moveDetails);
}

// Imprime los datos del movimiento en el HTML
const printMoveDetails = async moveDetails => {
    let moveName = moveDetails[5];
    title.innerText += moveName;
    nameHTML.innerText = moveName;

    let moveType = moveDetails[0];
    let typeImage = document.createElement('img');
    typeImage.setAttribute('src', `img/movimiento/tipo/${moveType}.png`);
    typeHTML.appendChild(typeImage);

    let damageClass = moveDetails[1];
    let image = `<img src="img/movimiento/categoria/${damageClass}.png" alt="${damageClass}">`;
    imageHTML.insertAdjacentHTML('afterbegin', image);

    let movePower = (moveDetails[2] === null) ? '-' : moveDetails[2];
    powerHTML.innerText = movePower;

    let moveAccuracy = (moveDetails[3] === null) ? '-' : moveDetails[3];
    accuracyHTML.innerText = moveAccuracy;

    let movePP = moveDetails[4];
    ppHTML.innerText = movePP;

    let moveDescription = moveDetails[6];
    descriptionHTML.innerText = moveDescription;

    let loader = document.querySelector('figure');
    main.removeChild(loader);
    main.style.alignItems = '';
    section.style.display = 'flex';
}