// Variables
const carrito = document.querySelector('#carrito')
const listaComidas = document.querySelector('#lista-comidas')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const btnVaciarCarrito = document.querySelector('#vaciar-carrito')
let articulosCarrito = []
const totalAPagarElement = document.querySelector('#total-a-pagar') // Elemento del total a pagar
let totalAPagar = 0 // Variable para el total a pagar
const btnPagar = document.querySelector('#paga-pedido')
// Función para cargar todos los EventListener
cargarEventListener()

function cargarEventListener() {
    // Agregar evento para agregar comida al carrito
    listaComidas.addEventListener('click', agregarComida)
    // Agregar evento para eliminar comida del carrito
    carrito.addEventListener('click', eliminarComida)
    // Agregar evento para vaciar el carrito
    btnVaciarCarrito.addEventListener('click', vaciarCarrito)
}

function eliminarComida(event) {
    event.preventDefault();
    if (event.target.classList.contains('eliminar-comida')) {
        // Aquí puedes escribir el código para eliminar una comida del carrito
        // Por ejemplo, puedes usar el ID de la comida para identificar cuál eliminar.
    }
}

function vaciarCarrito(event) {
    event.preventDefault();
    // Aquí puedes escribir el código para vaciar el carrito
    // Por ejemplo, puedes eliminar todos los elementos del array 'articulosCarrito'
    articulosCarrito = [];
    carritoHTML(); // Llama a la función para actualizar la interfaz gráfica del carrito
}


// Función que agrega elementos al carrito
function agregarComida(event) {
    event.preventDefault()
    if (event.target.classList.contains('agregar-carrito')) {
        const comidaSeleccionada = event.target.parentElement.parentElement
       
        leerDatosComida(comidaSeleccionada)
        
    }
}

//
// Obtén el elemento de entrada de búsqueda
const inputBusqueda = document.querySelector('#buscador');

// Agregar un evento de escucha al campo de búsqueda
inputBusqueda.addEventListener('input', realizarBusqueda);

// Función para realizar la búsqueda
function realizarBusqueda() {
    const textoBusqueda = inputBusqueda.value.toLowerCase();
    
    const comidas = document.querySelectorAll('.card');
    
    comidas.forEach(comida => {
        const nombreComida = comida.querySelector('h4').textContent.toLowerCase();
        if (nombreComida.includes(textoBusqueda)) {
            comida.style.display = 'block'; // Muestra la comida que coincide con la búsqueda
        } else {
            comida.style.display = 'none'; // Oculta las comidas que no coinciden
        }
    });
}
//

// Leer el HTML del comida seleccionado y extraer la información
function leerDatosComida(comida) {
    // Obtener información del comida seleccionado
    const imagen = comida.querySelector('img').src
    const titulo = comida.querySelector('h4').textContent
    const precioTexto = comida.querySelector('.precio span').textContent
    const precio = parseFloat(precioTexto.replace('S/', '').trim())
    const idComida = comida.querySelector('a').getAttribute('data-id')

    // Verificar si la comida ya está en el carrito
    const comidaEnCarrito = articulosCarrito.find(comida => comida.idComida === idComida)

    if (comidaEnCarrito) {
        // Si ya está en el carrito, incrementar la cantidad
        comidaEnCarrito.cantidad++
    } else {
        // Si no está en el carrito, agregarlo con cantidad 1
        articulosCarrito.push({
            idComida,
            imagen,
            titulo,
            precio,
            cantidad: 1
        })
    }
    
    carritoHTML()

}
function carritoHTML(){
    limpiarHTML()
    totalAPagar = 0
    articulosCarrito.forEach(comida => {
        const {imagen, titulo,precio, cantidad ,idComida }  = comida
    const precioTotal = precio * cantidad // Calcula el precio total por la cantidad
    totalAPagar += precioTotal   //sumadelosprecios
    const row = document.createElement('tr')
    row.innerHTML= `
    <td> <img src="${imagen}" width="100"> </td>
    <td> ${titulo} </td>
    <td> ${precio.toFixed(2)} </td>
    <td><input type="number" class="form-control cantidad" style="width:80px" value="${cantidad}" data-id="${idComida}" /></td>
    <td> ${precioTotal.toFixed(2)} </td>
    `
    contenedorCarrito.appendChild(row)
    }) 
    actualizarTotalAPagar() //funciondeltotal
    actualizarNumElementosCarrito() //funciondelanotificacioncarrito
    contenedorCarrito.addEventListener('input', editarCantidad);
}


//
function limpiarHTML(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild) // borrar el primero
    }
}

function actualizarTotalAPagar(){
    totalAPagarElement.textContent = `${totalAPagar.toFixed(2)}`
}


function actualizarNumElementosCarrito() {
    const numElementos = articulosCarrito.reduce((total, comida) => total + comida.cantidad, 0) 
    const numElementosSpan = document.querySelector('.num-elementos')
    numElementosSpan.textContent=numElementos //notificacionesdelcarrito
}

function editarCantidad(event) {
    if (event.target.classList.contains('cantidad')) {
        const nuevaCantidad = parseInt(event.target.value);
        if (nuevaCantidad < 1) {
            event.target.value = 1;
        }
        const comidaId = event.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.map(comida => {
            if (comida.idComida === comidaId) {
                comida.cantidad = nuevaCantidad;
            }
            return comida;
        });
        carritoHTML(); // Actualizar la interfaz del carrito
        actualizarNumElementosCarrito(); // Actualizar el número de elementos en el carrito
    }
}

contenedorCarrito.addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad')) {
        const cantidadInput = event.target;
        let nuevaCantidad = parseInt(cantidadInput.value);

        // Validar si la nueva cantidad es válida
        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            nuevaCantidad = 1; // Si es inválida o menor que 1, establece la cantidad en 1
        }

        // Actualizar la cantidad en el campo input number
        cantidadInput.value = nuevaCantidad;

        // Actualizar la cantidad en el carrito
        const idComidaAActualizar = cantidadInput.getAttribute('data-id');
        articulosCarrito.forEach((comida, index) => {
            if (comida.idComida === idComidaAActualizar) {
                comida.cantidad = nuevaCantidad;
                if (nuevaCantidad === 1) {
                    // Si la cantidad se establece en 1, elimina el producto
                    articulosCarrito.splice(index, 1);
                }
            }
        });

        // Actualizar el total a pagar y la notificación del carrito
        actualizarTotalAPagar();
        actualizarNumElementosCarrito();

        // Actualizar la vista del carrito
        carritoHTML();
    }
});

function abrirWhatsApp() {
    // Obtén la lista de productos en el carrito
    const productosCarrito = articulosCarrito.map(comida => {
        return `${comida.titulo} (${comida.cantidad})`;
    }).join('%0A'); // %0A es el código para salto de línea en la URL

    // Obtén el precio total
    const precioTotal = totalAPagar.toFixed(2);

    // Número de WhatsApp al que deseas enviar el mensaje (en este caso, +51 920 420 515)
    const numeroWhatsApp = '+51920420515';

    // Mensaje de WhatsApp
    const mensajeWhatsApp = `¡Hola BEMBOS! Hice el sigueinte pedido:%0A${productosCarrito}%0AEl precio total es: S/${precioTotal}%0ALo deseo pagar.`;

    // URL de WhatsApp con el mensaje
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}/?text=${mensajeWhatsApp}`;

    // Abre una nueva ventana o pestaña del navegador con el enlace de WhatsApp
    window.open(urlWhatsApp, '_blank');
}

// Agregar evento para abrir WhatsApp al presionar el botón "Pagar"
btnPagar.addEventListener('click', abrirWhatsApp);






