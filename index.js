//El array de objetos (base de dato)esta en api.json
//para leer la data desde api.json se usa el Fetch


$(document).ready(function() {
    $("#galeria_art").css({ background: 'turquoise', color: 'white' });
    $("#dscto_cincuenta").css({ background: 'turquoise', color: 'white' });
    $("#boton").prepend("<button class='btn btn-warning' id='btnSuscrip'>Suscribete a nuestra galeria de arte</button>");
    var estaOculto = false;
    $("#btnSuscrip").click(function() {
        $('#btnSuscrip').hide();
        // if (estaOculto) {
        //     $("#btnSuscrip").show();
        //     estaOculto = false;
        // } else {
        //     $("#btnSuscrip").hide();
        //     estaOculto = true;
        // }
        suscribir();
    });

    // //MARCAR COMO ATRIBUTO PARA FILTRAR
    $("#miSeleccion option[ordenar='pordefecto']").attr("selected", true);
});

//eventos de boton usando fadein
$("#muestraParrafo").click(function() {
    $("#parrafo").fadeIn("slow");
});




// const cards = document.getElementById('cards')
const cards = document.getElementById('cards'); //id cards se encuentra en index.html
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content //accedemos al template-card
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {} //objetp vacio




// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
        //aqui almaceno en el localstorage,aqui una vez que se carge el sitio web
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});


//funcion para empezar una subscribir
function suscribir() {
    $("#suscripcion").append(`
    <h4>Suscribete a nuestra Galeria de arte</h4>
    <form id="miFormulario">
    <input type="text" id="email" placeholder="Aqui tu email">
    <button type="submit" class="btn btn-warning">Suscribete ahora</button>
    </form>`);
    //EVENTO
    $("#miFormulario").submit(function(e) {
        //prevenir el comportamiento por defecto
        e.preventDefault();
        //aca una buena validacion de los campos
        //Mensaje de confirmacion de suscripcion
        Swal.fire(
            'Nueva suscripci??n! empieza en el mundo del arte',
            $("#email").val(),
            'success'
        )
        $("#suscripcion").empty(); //para vaciar ese div, logra desaparecer lo renderizado
        $("#btnSuscrip").show();
    });
}


//--------------------APLICANDO AJAX CON JSON LOCAL-----------------------
// function datoLiqui() {
//     console.log('quieres ver obras en liquidacion');
const miJSON = "liquidacion.json";
$("#liquid").prepend('<button class="btn-warning " id="miBoton">obras liquidacion al 80%</button>');
$("#miBoton").click(() => {
    $.getJSON(miJSON, function(respuesta, estado) {
        if (estado == "success") {
            let misObras = respuesta.liquidacion;
            for (const obra of misObras) {
                $("#liquid").append(`<div>
                <h2>APROVECHA LIQUIDACIONES</h2>
                <h3>${obra.nombre}</h3>
                <p>${obra.precioliquidacion}</p>
                <img src=${obra.foto} width="250" height="250">
                
                </div>`);
            }
        }
    });
});
// }


//el e sirve para capturar el evento que se quiere modificar con addEventlistener
cards.addEventListener('click', e => { //los cards que estan en html detectan el click
    addCarrito(e)
});

//fucnion aumentar y disminuir para interactuar
items.addEventListener('click', e => {
    btnAumentarDisminuir(e)
})

// uso fetch para traer productos del api.json(aqui estan toda la data)
const fetchData = async() => {
    try {
        const res = await fetch('api.json');
        const data = await res.json()
            // const datos = dato;
            // console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

// Pintar productos que estan en template-card - funcion pintarCards con forEach
// .innerHTML = ; ????????????????
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('h6').textContent = producto.ficha
        templateCard.querySelector('img').setAttribute("src", producto.foto)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });



    cards.appendChild(fragment)
}

//-------------AGREGAR AL CARRO------------------
const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }

    e.stopPropagation() //para detener otro evento que se genera en EL  cards

}


//--------------MANIPULE EL OBJETO DEL CARRO con setCarrito------
const setCarrito = objeto => { //cuando se va seleccionando esta funcion va empujando al carrito
    // console.log(objeto) //captura en consola
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto } // lo 3 puntos adquerimos la informacion de los productos y hacemos una copia
    pintarCarrito();

    // console.log(producto)
}



//----PINTAR CARRITO--
const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    //pintar footer
    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//------PINTANDO FOOTER-TOTAL DE CARRITO
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vac??o - comience a comprar!</th>
        `

        return
    }

    //--aqui vamos acumulando el total del carrito
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
        // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //---vaciamos el carrito mediante funcion btnVaciar,asignamos el evento click
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {

        carrito = {}
        pintarCarrito()
        Swal.fire(
            'Gracias por tu compra! vuelve pronto',
            'success'

        );
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target)
    //accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        // console.log(carrito[e.target.dataset.id])
        // carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
            // producto.cantidad= carrito[e.target.dataset.id].cantidad + 1//para aumentar
        producto.cantidad++ //opcion que tambien sirve para aumentar
            carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }

    //accion para disminuir
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        pintarCarrito()

    }

    e.stopPropagation()

}