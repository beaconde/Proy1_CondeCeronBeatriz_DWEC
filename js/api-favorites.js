'use strict';

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
const error = 
`<figure class="figure">
<img src="img/icono/pokeballs.png" alt="Error" class="pokeballs">
<figcaption>Aún no tienes ningún pokémon favorito.</figcaption>
</figure>`;

let searchedPokemon;
let favoritePokemon;

// Control de eventos

// Carga los pokémon favorites de localStorage
document.addEventListener('DOMContentLoaded', () => {
    section.innerHTML = loader;
    if (localStorage.getItem('favoritePokemon') !== null && localStorage.getItem('favoritePokemon') !== '') {
        favoritePokemon = localStorage.getItem('favoritePokemon').split(',');
        favoritePokemon.sort((a,b) => a-b);
        fetchFavoritePokemon(favoritePokemon);
    } else {
        section.innerHTML = error;
    }

});

nextButton.addEventListener('click', event => loadNext(event));
prevButton.addEventListener('click', event => loadPrev(event));

randomButton.addEventListener('click', (event) => getRandomFavorite(event));
searchForm.addEventListener('submit', (event) => searchFavorite(event));


// Muestra los pokémon favoritos por pantalla
const fetchFavoritePokemon = async favoritePokemon => {
    let template = '';
    let pokemonName, pokemonNumber, pokemonImage;

    if (favoritePokemon.length < 18) {
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
    } else {
        nextButton.style.display = 'flex';
        prevButton.style.display = 'flex';
    }

    let paginatedPokemon = paginateArray(favoritePokemon, 18, 1);
    setPaginatedButtons(1);
    searchedPokemon = favoritePokemon;

    for (let id of paginatedPokemon) {

        await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(handleError)
        .then(handleResponse)
        .then(pokemon => {
            pokemonName = capitalizeName(pokemon.name);
            pokemonNumber = pokemon.id;
            pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        })
        .catch(error => console.log(error))

        template += printPokemon(pokemonName, pokemonNumber, pokemonImage);
    }

    section.innerHTML = template;
}

// Devuelve el HTML con los datos del pokémon
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
    </a>
    <span class="iconify div__icono" data-icon="clarity:heart-solid" onclick="removeFromFavorites(${pokemonNumber}, this)"></span>
    </div>
    </div>
    `
}

// Recibe una lista de pokémon y la muestra por pantalla
const displayList = pokemonList => {
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
        let pokemonNumber = pokemon.id;
        let pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

        template += printPokemon(pokemonName, pokemonNumber, pokemonImage);
    }

    section.innerHTML = template;

}

// Eliminar un pokémon de favoritos
const removeFromFavorites = (id, element) => {
    let index = favoritePokemon.indexOf(id);
    favoritePokemon.splice(index, 1);
    localStorage.setItem('favoritePokemon', favoritePokemon);
    element.parentNode.parentNode.remove();
    if (favoritePokemon.length === 0) {
        section.innerHTML = error;
    }
}

// Elige un pokémon aleatorio entre la lista de favoritos y lo muestra por pantalla
const getRandomFavorite = async event => {
    event.preventDefault();

    section.innerHTML = loader;
    let template = '';

    let index = getRandomNumber(0, favoritePokemon.length);
    let id = favoritePokemon[index];
    let pokemonName, pokemonNumber, pokemonImage;

    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        pokemonName = capitalizeName(pokemon.name);
        pokemonNumber = pokemon.id;
        pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    })
    .catch(error => console.log(error))
    
    template += printPokemon(pokemonName, pokemonNumber, pokemonImage);
    section.innerHTML = template;
}

// Busca entre los pokémon favoritos en función del nombre y tipo
const searchFavorite = async event => {
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
                let pokemonTypes = pokemon.types;

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

// Recibe un string y devuelve los pokémon favoritos que lo contengan en el nombre
const getPokemonsByName = async name => {
    let pokemons = [];

    for (let id of favoritePokemon) {
        await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(handleError)
        .then(handleResponse)
        .then(pokemon => {
            if (pokemon.name.includes(name)) pokemons.push(pokemon);
        })
        .catch(error => console.log(error))
    }

    return pokemons;
}

// Recibe un tipo y devuelve los pokémon favoritos de ese tipo
const getPokemonsByType = async type => {
    let pokemons = [];

    for (let id of favoritePokemon) {
        await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(handleError)
        .then(handleResponse)
        .then(pokemon => {
            for (let i=0; i<pokemon.types.length; i++) {
                if (pokemon.types[i].type.name === type) {
                    pokemons.push(pokemon);
                    break;
                }
            }
        })
        .catch(error => console.log(error))
    }

    return pokemons;
}

const setPaginatedButtons = pageNumber => {

    if (prevButton.hasAttribute('data-page')) prevButton.removeAttribute('data-page');
    prevButton.setAttribute('data-page', pageNumber -1);

    if (nextButton.hasAttribute('data-page')) nextButton.removeAttribute('data-page')
    nextButton.setAttribute('data-page', pageNumber +1);
    
}

// Muestra los siguientes 18 pokémon
const loadNext = event => {
    let pageNumber = event.currentTarget.getAttribute('data-page');
    let pokemons = paginateArray(searchedPokemon, 18, pageNumber);
    fetchFavoritePokemon(pokemons);
    setPaginatedButtons(pageNumber);
}

// Muestra los anteriores 18 pokémon
const loadPrev = event => {
    let pageNumber = event.currentTarget.getAttribute('data-page');
    if (pageNumber > 0) {
        let pokemons = paginateArray(searchedPokemon, 18, pageNumber);
        fetchFavoritePokemon(pokemons);
        setPaginatedButtons(pageNumber);
    }
}