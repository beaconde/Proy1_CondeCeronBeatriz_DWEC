
let usuarios = [
    {
        usuario: 'usuario',
        contrasenya: 'usuario'
    }
]


// Datos del usuario

const input_usuario = document.querySelector('#usuario');
const input_contrasenya = document.querySelector('#contraseña');

// Mensaje de error

const login_error = document.querySelector('#loginError');


const validarLogin = () => {

    for (let usuario of usuarios) {
        if (input_usuario.value === usuario.usuario && input_contrasenya.value === usuario.contrasenya) return true;
    }

    login_error.classList.add('invalid');
    login_error.classList.remove('hidden');
    login_error.innerText = 'Los datos no coinciden.';
    return false;

}

