
const validarUsuario = () => {
    if (usuarioRegExp.test(usuario.value)) return true;
    else if (usuario.value === '') {
        no_valido(usuario, usuarioError, 'El usuario no puede estar vacío.');
    } else {
        no_valido(usuario, usuarioError,'El usuario no es válido.');
    }
    return false;
}

const validarEmail = () => {
    if (emailRegExp.test(email.value)) return true;
    else if (email.value === '') {
        no_valido(email, emailError, 'El email no puede estar vacío.');
    } else {
        no_valido(email, emailError, 'El email no es válido.');
    }
    return false;
}

const validarContrasenya = () => {
    if (contrasenyaRegExp.test(contrasenya.value)) {
        return true;
    } else if (contrasenya.value === '') {
        no_valido(contrasenya, contrasenyaError, 'La contraseña no puede estar vacía.');
    } else {
        let error = contrasenya.value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : 'La contraseña debe contener mayúsculas, minúsculas y números.';
        no_valido(contrasenya, contrasenyaError, error);
    }
    return false;
}

const validarConfirmacionContrasenya = () => {
    if (confirmarContrasenya.value === contrasenya.value ) return true;
    else no_valido(confirmarContrasenya, confirmarContrasenyaError, 'Las contraseñas no coinciden.');
}

const no_valido = (campo, campoError, mensajeError) => {
    campo.classList.add('invalid');
    campoError.classList.remove('hidden');
    campoError.innerText = mensajeError;
}

const on_focus = (campo, campoError) => {
    if (campo.classList.contains('invalid')) {
        campo.classList.remove('invalid');
        campoError.classList.add('hidden');
        campoError.innerText = '';
    }
}


// Validación de usuario

const usuario = document.querySelector('#usuario');
const usuarioError = document.querySelector('#usuarioError');
const usuarioRegExp = /^[a-z]+[.\-_\d]*[a-z\d]+$/i;

// El usuario solo puede contener:
//   - Letras, guión, guión bajo, puntos y números (dos o más)
//   - Debe empezar y terminar con letras
//   - Como mínimo dos caracteres


usuario.addEventListener('blur', validarUsuario);

usuario.onfocus = () => {
    return on_focus(usuario, usuarioError);
}


// Validación de email

const email = document.querySelector('#email');
const emailError = document.querySelector('#emailError');
const emailRegExp = /^([\da-z_.\-]+)@([a-z.\-]+)\.([a-z.]{2,})$/;

// El email puede contener, en el siguiente orden:
//    - Números, letras, guión bajo, guión o punto (uno o más)
//    - Un @
//    - Letras, punto o guión (uno o más)
//    - Un .
//    - Letras o punto (dos o más)


email.addEventListener('blur', validarEmail);

email.onfocus = () => {
    return on_focus(email, emailError);
}


// Validación de contraseña

const contrasenya = document.querySelector('#contraseña');
const contrasenyaError = document.querySelector('#contraseñaError');
const contrasenyaRegExp = /(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{8,}/;

// La contraseña puede contener:
//    - Letras mayúsculas y minúsculas (al menos una de cada)
//    - Números (uno o más)
//    - Debe tener al menos 8 caracteres


contrasenya.addEventListener('blur', validarContrasenya);

contrasenya.onfocus = () => {
    return on_focus(contrasenya, contrasenyaError);
}


// Validación de la confirmación de la contraseña

const confirmarContrasenya = document.querySelector('#confirmarcontraseña');
const confirmarContrasenyaError = document.querySelector('#confirmarcontraseñaError');

confirmarContrasenya.addEventListener('blur', validarConfirmacionContrasenya);

confirmarContrasenya.onfocus = () => {
    return on_focus(confirmarContrasenya, confirmarContrasenyaError);
}


// Validación de los términos

const terminos = document.querySelector('#terminos');
const terminosError = document.querySelector('#terminosError');

validarTerminos = () => {
    return terminos.checked;
}

terminos.onfocus = () => {
    return on_focus(terminos, terminosError)
}


// Controlar el envío del formulario

const validarRegistro = () => {
    let hayErrores = false;

    if (!validarUsuario()) hayErrores = true;
    if (!validarEmail()) hayErrores = true;
    if (!validarContrasenya()) hayErrores = true;
    if (!validarConfirmacionContrasenya()) hayErrores = true;
    if (!validarTerminos()) {
        no_valido(terminos, terminosError, 'Debes aceptar los términos.');
        hayErrores = true;
    }
    return !hayErrores;
}
