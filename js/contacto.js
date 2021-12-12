
const validarNombre = () => {
    if (nombreRegExp.test(nombre.value)) return true;
    else if (nombre.value === '') {
        no_valido(nombre, nombreError, 'El nombre no puede estar vacío.');
    } else {
        no_valido(nombre, nombreError,'El nombre no es válido.');
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

const validarMensaje = () => {
    if (mensaje.value === '') {
        no_valido(mensaje, mensajeError, 'El mensaje no puede estar vacío.');
        return false;
    } else {
       return true;
    }
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


// Validación de nombre

const nombre = document.querySelector('#nombre');
const nombreError = document.querySelector('#nombreError');
const nombreRegExp = /^[a-z]+\s*[a-z]+$/i;


// El nombre solo puede contener:
//    - Letras y espacios
//    - No puede terminar ni empezar con espacio
//    - Como mínimo dos caracteres

nombre.addEventListener('blur', validarNombre);

nombre.onfocus = () => {
    return on_focus(nombre, nombreError);
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


// Validación de mensaje

const mensaje = document.querySelector('#mensaje');
const mensajeError = document.querySelector('#mensajeError');

// El mensaje no puede estar vacío

mensaje.addEventListener('blur', validarMensaje);

mensaje.onfocus = () => {
    return on_focus(mensaje, mensajeError);
}


// Controlar el envío del formulario

const validarEnvio = () => {
    let hayErrores = false;

    if (!validarNombre()) hayErrores = true;
    if (!validarEmail()) hayErrores = true;
    if (!validarMensaje()) hayErrores = true;

    return !hayErrores;
}

