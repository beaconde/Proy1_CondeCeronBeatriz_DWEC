'use strict';

const initialURL = 'https://pokeapi.co/api/v2/move/?limit=18';
let moveList = [];

let section = document.querySelector('.section');
const nextButton = document.querySelector('.boton--siguiente');
const prevButton = document.querySelector('.boton--anterior');
const randomButton = document.querySelector('.boton--circular');
const searchForm = document.querySelector('.form');
const loader = 
`<figure>
<img src="img/icono/ultraball.png" alt="Logo ultraball" class="loader">
<figcaption>Cargando...</figcaption>
</figure>`;

let searchedMoves;

// Control de eventos

document.addEventListener('DOMContentLoaded', async () => {
    fetchAllMoves(initialURL);
    moveList = await fetch(`https://pokeapi.co/api/v2/move/?limit=827`)
    .then(handleError)
    .then(handleResponse)
    .then(data => data.results)
    .catch(error => console.log(error))
});

nextButton.addEventListener('click', event => loadNext(event));
prevButton.addEventListener('click', event => loadPrev(event));


// Recibe una lista de movimientos y los muestra por pantalla
const displayList = async moveList => {
    let template = '';

    if (moveList.length < 18 && searchedMoves === undefined) {
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
    } else {
        nextButton.style.display = 'flex';
        prevButton.style.display = 'flex';
    }

    for (let i=0; i<moveList.length; i++) {
        let move = moveList[i];

        let moveData = await fetchMove(move.url);
        let moveNumber = moveData[0]
        let damageClass = moveData[1];
        let moveImage = `img/movimiento/categoria/${damageClass}.png`;
        let moveName = capitalizeName(moveData[2]);

        template += printMove(moveName, moveImage, damageClass, moveNumber);
    }

    section.innerHTML = template;
}

// Recibe los datos a imprimir de cada movimiento y devuelve el HTML del movimiento
const printMove = (moveName, moveImage, damageClass, moveNumber) => {
    return `
    <div class="movimiento">
    <a href="movimiento.html?id=${moveNumber}" class="movimiento__a">
    <img src="${moveImage}" alt="${damageClass}">
    <p>${moveName}</p>
    </a>
    </div>
    `
}

// Recibe los datos de un único movimiento de la API
const fetchMove = async url => {
    let moveData = [];

    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(move => {
        moveData.push(move.id);
        moveData.push(move.damage_class.name);
        for (let i=0; i<move.names.length; i++) {
            if (move.names[i].language.name === 'es') {
                moveData.push(move.names[i].name);
                break;
            }
        }
    })
    .catch(error => console.log(error))

    return moveData
}

// Recibe un JSON con la lista de los movimientos de la API
const fetchAllMoves = async url => {

    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(data => {
        section.innerHTML = loader;
        displayList(data.results);
        setButtonsURL(data);
    })
    .catch(error => console.log(error))
}

// Establece las URLs para los botones de la paginación de movimientos
const setButtonsURL = data => {

    if (data.previous != null) {
        if (prevButton.hasAttribute('data-url')) prevButton.removeAttribute('data-url');
        prevButton.setAttribute('data-url', data.previous);
    }

    if (data.next != null) {
        if (nextButton.hasAttribute('data-url')) nextButton.removeAttribute('data-url');
        nextButton.setAttribute('data-url', data.next);
    }
}

// Muestra los siguientes 18 movimientos
const loadNext = event => {
    if (event.currentTarget.hasAttribute('data-page')) {
        let pageNumber = event.currentTarget.getAttribute('data-page');
        let moves = paginateArray(searchedMoves, 18, pageNumber);
        displayList(moves);
        setPaginatedButtons(pageNumber);
    } else fetchAllMoves(event.currentTarget.getAttribute('data-url'));
}

// // Muestra los anteriores 18 movimientos
const loadPrev = event => {
    if (event.currentTarget.hasAttribute('data-page')) {
        let pageNumber = event.currentTarget.getAttribute('data-page');
        if (pageNumber > 0) {
            let moves = paginateArray(searchedMoves, 18, pageNumber);
            displayList(moves);
            setPaginatedButtons(pageNumber);
        }
    } else fetchAllMoves(event.currentTarget.getAttribute('data-url'));
}


// Buscador

searchForm.addEventListener('submit', (event) => searchMove(event));
randomButton.addEventListener('click', (event) => getRandomMove(event));

// Busca movimientos en función de su nombre, tipo y categoría
const searchMove = async (event) => {
    event.preventDefault();
    
    let name = document.querySelector('#nombre').value.toLowerCase();
    let type = document.querySelector('#tipo').value;
    let damageClass = document.querySelector('#categoria').value;
    if (name ==='' && type === '' && damageClass === '') return;

    let moves = [];
    section.innerHTML = loader;

    if (name !== '') {
        let nameCoincidences = await getMovesByName(name);
        
        for (let i=0; i<nameCoincidences.length; i++) {
            let move = nameCoincidences[i];

            if (type !== '') {
                let moveType = await getMoveType(move.url);

                if (moveType === type) {
                    if (damageClass !== '') {
                        let moveDamageClass = await getMoveDamageClass(move.url);

                        if (moveDamageClass === damageClass) {
                            moves.push(move);
                        }
                    } else moves.push(move);
                }

            } else if (damageClass !== '') {
                let moveDamageClass = await getMoveDamageClass(move.url);

                if (moveDamageClass === damageClass) {
                    moves.push(move);
                }

            } else moves.push(move);
        }
    } else if (type !== '') {
        let typeCoincidences = await getMovesByType(type);

        for (let i=0; i<typeCoincidences.length; i++) {
            let move = typeCoincidences[i];
            
            if (damageClass !== '') {
                let moveDamageClass = await getMoveDamageClass(move.url);

                if (moveDamageClass === damageClass) {
                    moves.push(move);
                }
                
            } else moves.push(move);
        }
    } else if (damageClass !== '') {
        let damageClassCoincidences = await getMovesByDamageClass(damageClass);

        for (let i=0; i<damageClassCoincidences.length; i++) {
            let move = damageClassCoincidences[i];
            moves.push(move);
        }
    }

    if (moves.length > 0) {
        let paginatedMoves = paginateArray(moves, 18, 1);
        displayList(paginatedMoves);
        setPaginatedButtons(1);
        searchedMoves = moves;
    }
    else section.innerHTML = `<figure class="figure">
                              <img src="img/icono/pokeballs.png" alt="Error" class="pokeballs">
                              <figcaption>No se ha encontrado ningún movimiento.</figcaption>
                              </figure>`;
    
}

const setPaginatedButtons = pageNumber => {

    if (prevButton.hasAttribute('data-page')) prevButton.removeAttribute('data-page');
    prevButton.setAttribute('data-page', pageNumber -1);

    if (nextButton.hasAttribute('data-page')) nextButton.removeAttribute('data-page')
    nextButton.setAttribute('data-page', pageNumber +1);
    
}

// Recibe un string y devuelve todos los movimientos de la API que lo contengan en el nombre
const getMovesByName = async name => {
    let moves = [];

    for (let i=0; i<moveList.length; i++) {
        let move = moveList[i];
        let moveData = await fetch(move.url)
        .then(handleError)
        .then(handleResponse)
        .catch(error => console.log(error))
        
        for (let i=0; i<moveData.names.length; i++) {
            if (moveData.names[i].language.name === 'es') {
                if ((moveData.names[i].name).toLowerCase().includes(name)) {
                    moves.push(move)
                }
            }
        }
    }

    return moves;
}

// Recibe un tipo y devuelve todos los movimientos de ese tipo
const getMovesByType = async type => {
    let moves = [];
    
    for (let i=0; i<moveList.length; i++) {
        let move = moveList[i];
        let moveType = await getMoveType(move.url);

        if (moveType === type) {
            moves.push(move)
        }
    }

    return moves;
}

// Recibe una categoría de daño y devuelve todos los movimientos de esa categoría
const getMovesByDamageClass = async damageClass => {
    let moves = [];

    for (let i=0; i<moveList.length; i++) {
        let move = moveList[i];
        let moveDamageClass = await getMoveDamageClass(move.url);

        if (moveDamageClass === damageClass) {
            moves.push(move)
        }
    }

    return moves
}


// Recibe la url de un movimiento y devuelve su tipo
const getMoveType = async url => {
    let moveType;
        
    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(move => {
        moveType = move.type.name;
    })
    .catch(error => console.log(error))
    
    return moveType
}

// Recibe la url de un movimiento y devuelve su categoría
const getMoveDamageClass = async url => {
    let moveDamageClass;

    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(move => {
        moveDamageClass = move.damage_class.name;
    })
    .catch(error => console.log(error))

    return moveDamageClass;
}

// Imprime un movimiento aleatorio
const getRandomMove = async event => {
    event.preventDefault();

    section.innerHTML = loader;

    let moveNumber = getRandomNumber(1, 827);
    let moveList = []
    let moveData = {url:`https://pokeapi.co/api/v2/move/${moveNumber}`}

    await fetch(moveData.url)
    .then(handleError)
    .then(handleResponse)
    .then(move => {
        moveData.name = move.name;
    })
    .catch(error => console.log(error))
    
    moveList.push(moveData);
    displayList(moveList);
}

