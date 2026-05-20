//  Array de aficiones

var aficiones = [];

function agregarAficion() {
  var input = document.getElementById("input-aficion");
  var valor = input.value.trim();

  if (valor === "") return;

  aficiones.push(valor);
  renderAficiones();
  input.value = "";
}

function eliminarAficion(indice) {
  aficiones.splice(indice, 1);
  renderAficiones();
}

function renderAficiones() {
  var lista = document.getElementById("lista-aficiones");
  lista.innerHTML = "";

  for (var i = 0; i < aficiones.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = aficiones[i] + '<button onclick="eliminarAficion(' + i + ')">✕</button>';
    lista.appendChild(li);
  }
}


// Mostrar y ocultar errores 
function mostrarError(id, mensaje) {
  var span = document.getElementById(id);
  span.textContent = mensaje;
  span.style.display = "block";
}

function limpiarError(id) {
  var span = document.getElementById(id);
  span.textContent = "";
  span.style.display = "none";
}


// Validaciones individuales

function validarUsuario(valor) {
  if (valor === "") return "El nombre de usuario es obligatorio.";

  if (valor.length < 5 || valor.length > 10)
    return "Debe tener entre 5 y 10 caracteres.";

  // Debe comenzar con letra (a-z o A-Z)
  var primera = valor.charCodeAt(0);
  var esLetra = (primera >= 65 && primera <= 90) || (primera >= 97 && primera <= 122);
  if (!esLetra) return "Debe comenzar con una letra.";

  // Solo letras sin acentos y dígitos, sin simbolos
  for (var i = 0; i < valor.length; i++) {
    var c = valor.charCodeAt(i);
    var esLetraValida = (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    var esDigito = c >= 48 && c <= 57;
    if (!esLetraValida && !esDigito)
      return "Solo letras (sin acentos) y números, sin símbolos.";
  }

  // Digitos solo al final: no puede haber una letra despues de un digito
  var yaHayDigito = false;
  for (var i = 0; i < valor.length; i++) {
    var c = valor.charCodeAt(i);
    var esDigito = c >= 48 && c <= 57;
    var esLetraValida = (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    if (esDigito) yaHayDigito = true;
    if (yaHayDigito && esLetraValida) return "Los dígitos solo pueden ir al final.";
  }

  return "";
}

function validarContrasena(pass, usuario) {
  if (pass === "") return "La contraseña es obligatoria.";

  if (pass.length < 3 || pass.length > 6)
    return "Debe tener entre 3 y 6 caracteres.";

  var tieneLetra = false;
  var tieneDigito = false;
  for (var i = 0; i < pass.length; i++) {
    var c = pass.charCodeAt(i);
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) tieneLetra = true;
    if (c >= 48 && c <= 57) tieneDigito = true;
  }
  if (!tieneLetra || !tieneDigito)
    return "Debe contener al menos una letra y un dígito.";

  // No puede contener el nombre de usuario
  if (usuario !== "" && contieneSubcadena(pass.toLowerCase(), usuario.toLowerCase()))
    return "No puede contener el nombre de usuario.";

  return "";
}

// Busca si 'texto' contiene 'sub' sin usar indexOf ni REGEX
function contieneSubcadena(texto, sub) {
  if (sub.length === 0) return false;
  for (var i = 0; i <= texto.length - sub.length; i++) {
    var coincide = true;
    for (var j = 0; j < sub.length; j++) {
      if (texto[i + j] !== sub[j]) { coincide = false; break; }
    }
    if (coincide) return true;
  }
  return false;
}

function validarURL(valor) {
  if (valor === "") return ""; // No es obligatorio

  var tieneProtocolo = false;
  if (valor.length >= 7 && valor.substring(0, 7) === "http://")  tieneProtocolo = true;
  if (valor.length >= 8 && valor.substring(0, 8) === "https://") tieneProtocolo = true;
  if (!tieneProtocolo) return "La URL debe comenzar con http:// o https://";

  var tienePunto = false;
  for (var i = 0; i < valor.length; i++) {
    if (valor[i] === ".") { tienePunto = true; break; }
  }
  if (!tienePunto) return "La URL debe contener un dominio válido (con punto).";

  return "";
}

function validarTelefono(valor) {
  if (valor === "") return "El teléfono es obligatorio.";

  var inicio = 0;
  if (valor[0] === "+") inicio = 1;

  var largo = valor.length - inicio;
  if (largo < 8 || largo > 11)
    return "El teléfono debe tener entre 8 y 11 dígitos.";

  for (var i = inicio; i < valor.length; i++) {
    var c = valor.charCodeAt(i);
    if (c < 48 || c > 57)
      return "El teléfono solo puede contener dígitos (y + al inicio).";
  }

  return "";
}


//  Envio del formulario 

function enviarFormulario() {
  var usuario    = document.getElementById("usuario").value.trim();
  var contrasena = document.getElementById("contrasena").value;
  var confirmar  = document.getElementById("confirmar").value;
  var direccion  = document.getElementById("direccion").value.trim();
  var comuna     = document.getElementById("comuna").value;
  var telefono   = document.getElementById("telefono").value.trim();
  var url        = document.getElementById("url").value.trim();

  var hayError = false;

  // Limpiar todos los errores previos
  var ids = ["err-usuario", "err-contrasena", "err-confirmar", "err-direccion",
             "err-comuna", "err-telefono", "err-url", "err-aficiones"];
  for (var i = 0; i < ids.length; i++) limpiarError(ids[i]);

  // Validar cada campo
  var errU = validarUsuario(usuario);
  if (errU !== "") { mostrarError("err-usuario", errU); hayError = true; }

  var errP = validarContrasena(contrasena, usuario);
  if (errP !== "") { mostrarError("err-contrasena", errP); hayError = true; }

  if (contrasena !== confirmar) {
    mostrarError("err-confirmar", "Las contraseñas no coinciden.");
    hayError = true;
  }

  if (direccion === "") {
    mostrarError("err-direccion", "La dirección es obligatoria.");
    hayError = true;
  }

  if (comuna === "") {
    mostrarError("err-comuna", "Debe seleccionar una comuna.");
    hayError = true;
  }

  var errT = validarTelefono(telefono);
  if (errT !== "") { mostrarError("err-telefono", errT); hayError = true; }

  var errURL = validarURL(url);
  if (errURL !== "") { mostrarError("err-url", errURL); hayError = true; }

  if (aficiones.length < 2) {
    mostrarError("err-aficiones", "Debe ingresar al menos 2 aficiones.");
    hayError = true;
  }

  if (hayError) return;

  // Objeto con los datos del usuario
  var datosUsuario = {
    usuario:   usuario,
    direccion: direccion,
    comuna:    comuna,
    telefono:  telefono,
    url:       url,
    aficiones: aficiones
  };

  console.log("Datos registrados:", datosUsuario);

  document.getElementById("exito").style.display = "block";
}

