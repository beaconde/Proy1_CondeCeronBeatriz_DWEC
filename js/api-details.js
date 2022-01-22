
const title = document.querySelector('title');
const nameHTML = document.querySelector('.titulo__contenido');
const typeHTML = document.querySelector('.h1__imagen');
const imageHTML = document.querySelector('.datos--pokemon__imagen');
const numberHTML = document.querySelector('.numero-pokemon');
const descriptionHTML = document.querySelector('.descripcion-pokemon');
const abilitiesHTML = document.querySelector('.texto--pokemon__ul');
const heightHTML = document.querySelector('.height');
const weightHTML = document.querySelector('.weight');

const section = document.querySelector('.pokemon');
const main = document.querySelector('main');
const loader = 
`<figure>
<img src="img/icono/ultraball.png" alt="Logo ultraball" class="loader">
<figcaption>Cargando...</figcaption>
</figure>`;

const backButton = document.querySelector('.boton--atras');

backButton.addEventListener('click', () => {
    window.history.go(-1)
    return false
});

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



// Ir a los detalles del pokémon

document.addEventListener('DOMContentLoaded', () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    section.style.display = 'none';
    main.style.alignItems = 'center';
    main.insertAdjacentHTML('beforeend', loader);
    fetchPokemonDetails(id)
})

const fetchPokemonDetails = async id => {
    let pokemonDetails = [];
    pokemonDetails.push(formatNumber(id));
    pokemonDetails.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`);
    let pokemonDescription = await getPokemonDescription(id);
    pokemonDetails.push(pokemonDescription);

    await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        pokemonDetails.push(capitalizeName(pokemon.name));
        pokemonDetails.push(pokemon.types);
        pokemonDetails.push(pokemon.abilities);
        pokemonDetails.push((pokemon.height)/10);
        pokemonDetails.push((pokemon.weight)/10);
    })
    .catch(error => console.log(error))

    printPokemonDetails(pokemonDetails);
}

const getPokemonDescription = async id => {
    let pokemonDescription;

    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .then(handleError)
    .then(handleResponse)
    .then(pokemon => {
        for (let i=0; i<pokemon.flavor_text_entries.length; i++) {
            if (pokemon.flavor_text_entries[i].language.name === 'es') {
                pokemonDescription = pokemon.flavor_text_entries[i].flavor_text;
                break;
            }
        }
    })
    .catch(error => console.log(error))

    return pokemonDescription
}

const getAbilityTranslation = async url => {
    let translatedAbility;

    await fetch(url)
    .then(handleError)
    .then(handleResponse)
    .then(ability => {
        for (let i=0; i<ability.names.length; i++) {
            if (ability.names[i].language.name === 'es') {
                translatedAbility = ability.names[i].name;
                break;
            }
        }
    })

    return translatedAbility
}

const printPokemonDetails = async pokemonDetails => {

    let pokemonName = pokemonDetails[3];
    title.innerText += pokemonName;
    nameHTML.innerText = pokemonName;
    
    let pokemonTypes = pokemonDetails[4];
    for (let i=0; i<pokemonTypes.length; i++) {
        let typeImage = document.createElement('img');
        typeImage.setAttribute('src', `img/movimiento/tipo/${pokemonTypes[i].type.name}.png`);
        typeHTML.appendChild(typeImage);
    }

    let pokemonImage = pokemonDetails[1];
    let image = document.createElement('img');
    image.setAttribute('src', pokemonImage);
    imageHTML.appendChild(image);
    
    let pokemonNumber = pokemonDetails[0];
    numberHTML.innerText = `Nº${pokemonNumber}`;

    let pokemonDescription = pokemonDetails[2];
    descriptionHTML.innerText = pokemonDescription;

    let pokemonHeight = pokemonDetails[6];
    heightHTML.innerText = `${pokemonHeight} m`;

    let pokemonWeight = pokemonDetails[7];
    weightHTML.innerText = `${pokemonWeight} kg`

    let loader = document.querySelector('figure');
    main.removeChild(loader);
    main.style.alignItems = 'flex-start';
    section.style.display = 'flex';

    let pokemonAbilities = pokemonDetails[5];
    for (let i=0; pokemonAbilities.length; i++) {
        let ability = await getAbilityTranslation(pokemonAbilities[i].ability.url);
        let listedAbility = `<li>${ability}</li>`;
        abilitiesHTML.innerHTML += listedAbility;
    }

}
