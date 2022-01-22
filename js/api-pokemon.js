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

const capitalizeName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

const formatNumber = number => {
    number = String(number);
    while (number.length<3) number = '0'+number;
    return number
}

// Controla si la llamada a la API da error
const handleError = response => {
    if (!response.ok) throw Error(response.error);
    return response;
}

// Convierte la respuesta de la API en JSON
const handleResponse = response => response.json();

// Recibe una lista de pokémon y los muestra por pantalla
const displayList = async pokemonList => {
    let template = '';

    if (pokemonList.length < 18) {
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
    <span class="iconify div__icono" data-icon="clarity:heart-line"></span>
    </div>
    </a>
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
    fetchAllPokemon(event.currentTarget.getAttribute('data-url'));
}

// Muestra los anteriores 18 pokémon
const loadPrev = event => {
    fetchAllPokemon(event.currentTarget.getAttribute('data-url'));
}


document.addEventListener('DOMContentLoaded', () => {
    fetchAllPokemon(initialURL);
});

nextButton.addEventListener('click', event => loadNext(event));
prevButton.addEventListener('click', event => loadPrev(event));


// Buscador

searchForm.addEventListener('submit', (event) => searchPokemon(event));
randomButton.addEventListener('click', (event) => getRandomPokemon(event));

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
            }
        }
    }

    return pokemons;
}

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
            let pokemonTypes = await getPokemonTypes(pokemon.url);

            if (type !== '') {
                for (let i=0; i<pokemonTypes.length; i++) {
                    if (pokemonTypes[i].type.name === type) {
                        pokemons.push(pokemon)
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

    if (pokemons.length > 0) displayList(pokemons);
    else section.innerHTML = `<figure class="figure">
                              <img src="img/icono/pokeballs.png" alt="Error" class="pokeballs">
                              <figcaption>No se ha encontrado ningún pokémon.</figcaption>
                              </figure>`;
    
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

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

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

