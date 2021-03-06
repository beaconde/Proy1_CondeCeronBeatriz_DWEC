'use strict';

const initialURL = 'https://pokeapi.co/api/v2/pokemon/?limit=18';

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

let searchedPokemon;
let favoritePokemon;

// Control de eventos

document.addEventListener('DOMContentLoaded', () => {
    fetchAllPokemon(initialURL);

    // Inicializar lista de favoritos
    if (localStorage.getItem('favoritePokemon') === null || localStorage.getItem('favoritePokemon') === '') {
        favoritePokemon = [];
        localStorage.setItem('favoritePokemon', favoritePokemon);
    } else {
        favoritePokemon = localStorage.getItem('favoritePokemon').split(',');
    }
});

nextButton.addEventListener('click', event => loadNext(event));
prevButton.addEventListener('click', event => loadPrev(event));


// Añadir un pokémon a la lista de favoritos
const toggleFavorite = (id, element) => {
    console.log(element.getAttribute('data-icon'));
    console.log(id);
    if (element.getAttribute('data-icon') === 'clarity:heart-line') {
        favoritePokemon.push(String(id));
        localStorage.setItem('favoritePokemon', favoritePokemon);
        element.removeAttribute('data-icon');
        element.setAttribute('data-icon', 'clarity:heart-solid');
    } else {
        let index = favoritePokemon.indexOf(id);
        favoritePokemon.splice(index, 1);
        localStorage.setItem('favoritePokemon', favoritePokemon);
        element.removeAttribute('data-icon');
        element.setAttribute('data-icon', 'clarity:heart-line');
    }
}


// Recibe una lista de pokémon y los muestra por pantalla
const displayList = async pokemonList => {
    let template = '';

    if (pokemonList.length < 18 && searchedPokemon === undefined) {
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
    } else {
        nextButton.style.display = 'flex';
        prevButton.style.display = 'flex';
    }
    
    for (let i=0; i<pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonName = capitalizeName(pokemon.name);

        let pokemonData = await fetchPokemon(pokemon.url);
        let pokemonNumber = pokemonData[0];
        let pokemonImage = pokemonData[1];

        template += printPokemon(pokemonName, pokemonNumber, pokemonImage);
    }

    section.innerHTML = template;
}

// Recibe los datos a imprimir de cada pokémon y devuelve el HTML del pokémon
const printPokemon = (pokemonName, pokemonNumber, pokemonImage) => {
    let dataIcon = (favoritePokemon.includes(String(pokemonNumber))) ? 'clarity:heart-solid' : 'clarity:heart-line';
    return `
    <div class="pokemon" id="pokemon${pokemonNumber}">
    <a href="pokemon.html?id=${pokemonNumber}" class="pokemon__a">
    <div class="pokemon__div--fondo">
    <img src="${pokemonImage}" alt="${pokemonName}" style="overflow:hidden;">
    </div>
    <div class="pokemon__div--datos">
    <p class="div--datos__p">
    <span>Nº${formatNumber(pokemonNumber)}</span>
    ${pokemonName}
    </p>
    </a>
    <span class="iconify div__icono" data-icon="${dataIcon}" onclick="toggleFavorite(${pokemonNumber}, this)"></span>
    </div>
    </div>
    `
}

// Recibe los datos de un único pokémon de la API
const fetchPokemon = async url => {
    let pokemonData = []
    
    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        pokemonData.push(pokemon.id);
        pokemonData.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`)
    })
    .catch(error => console.log(error))

    return pokemonData
}

// Recibe un JSON con la lista de los pokémon de la API
const fetchAllPokemon = async url => {
    
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

// Establece las URLs para los botones de la paginación de pokémon
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

// Muestra los siguientes 18 pokémon
const loadNext = event => {
    if (event.currentTarget.hasAttribute('data-page')) {
        let pageNumber = event.currentTarget.getAttribute('data-page');
        let pokemons = paginateArray(searchedPokemon, 18, pageNumber);
        displayList(pokemons);
        setPaginatedButtons(pageNumber);
    } else fetchAllPokemon(event.currentTarget.getAttribute('data-url'));
}

// Muestra los anteriores 18 pokémon
const loadPrev = event => {
    if (event.currentTarget.hasAttribute('data-page')) {
        let pageNumber = event.currentTarget.getAttribute('data-page');
        if (pageNumber > 0) {
            let pokemons = paginateArray(searchedPokemon, 18, pageNumber);
            displayList(pokemons);
            setPaginatedButtons(pageNumber);
        }
    } else fetchAllPokemon(event.currentTarget.getAttribute('data-url'));
}


// Buscador

searchForm.addEventListener('submit', (event) => searchPokemon(event));
randomButton.addEventListener('click', (event) => getRandomPokemon(event));

// Busca pokémon en función de su nombre, tipo y categoría
const searchPokemon = async (event) => {
    event.preventDefault();
    
    let name = document.querySelector('#nombre').value.toLowerCase();
    let type = document.querySelector('#tipo').value;
    if (name ==='' && type === '') return;

    let pokemons = [];
    section.innerHTML = loader;

    if (name !== '') {
        let nameCoincidences = await getPokemonsByName(name);
        
        for (let i=0; i<nameCoincidences.length; i++) {
            let pokemon = nameCoincidences[i];

            if (type !== '') {
                let pokemonTypes = await getPokemonTypes(pokemon.url);

                for (let i=0; i<pokemonTypes.length; i++) {
                    if (pokemonTypes[i].type.name === type) {
                        pokemons.push(pokemon);
                    }
                }
            } else pokemons.push(pokemon);
        }
    } else if (type !== '') {
        let typeCoincidences = await getPokemonsByType(type);

        for (let i=0; i<typeCoincidences.length; i++) {
            let pokemon = typeCoincidences[i];
            pokemons.push(pokemon);
        }
    }

    if (pokemons.length > 0) {
        let paginatedPokemon = paginateArray(pokemons, 18, 1);
        displayList(paginatedPokemon);
        setPaginatedButtons(1);
        searchedPokemon = pokemons;
    }
    else section.innerHTML = `<figure class="figure">
                              <img src="img/icono/pokeballs.png" alt="Error" class="pokeballs">
                              <figcaption>No se ha encontrado ningún pokémon.</figcaption>
                              </figure>`;
    
}

const setPaginatedButtons = pageNumber => {

    if (prevButton.hasAttribute('data-page')) prevButton.removeAttribute('data-page');
    prevButton.setAttribute('data-page', pageNumber -1);

    if (nextButton.hasAttribute('data-page')) nextButton.removeAttribute('data-page')
    nextButton.setAttribute('data-page', pageNumber +1);
    
}

// Recibe un string y devuelve todos los pokémon de la API que lo contengan en el nombre
const getPokemonsByName = async name => {
    let pokemons = [];

    let pokemonList = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=899')
    .then(handleError)
    .then(handleResponse)
    .then(data => data.results)
    .catch(error => console.log(error))

    for (let i=0; i<pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        if (pokemon.name.includes(name)) pokemons.push(pokemon);
    }

    return pokemons;
}

// Recibe un tipo y devuelve todos los pokémon de ese tipo
const getPokemonsByType = async type => {
    let pokemons = [];

    let pokemonList = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=899')
    .then(handleError)
    .then(handleResponse)
    .then(data => data.results)
    .catch(error => console.log(error))

    for (let i=0; i<pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonTypes = await getPokemonTypes(pokemon.url);
        for (let i=0; i<pokemonTypes.length; i++) {
            if (pokemonTypes[i].type.name === type) {
                pokemons.push(pokemon)
                break;
            }
        }
    }

    return pokemons;
}

// Recibe la url de un pokémon y devuelve un array con los tipos del pokémon
const getPokemonTypes = async url => {
    let pokemonTypes;
        
    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        pokemonTypes = pokemon.types;
    })
    .catch(error => console.log(error))
    
    return pokemonTypes
}

// Imprime un pokémon aleatorio
const getRandomPokemon = async event => {
    event.preventDefault();

    section.innerHTML = loader;

    let pokemonNumber = getRandomNumber(1, 900);
    let pokemonList = []
    let pokemonData = {url:`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`}

    await fetch(pokemonData.url)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        pokemonData.name = pokemon.name;
    })
    .catch(error => console.log(error))
    
    pokemonList.push(pokemonData);
    displayList(pokemonList);
}

