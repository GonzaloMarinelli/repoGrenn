//Está no va a ser la funcionalidad final, por lo tanto el nombre del archivo (main.js), como de las funciones van a cambiar más adelante

//creo una funcion guardar local
const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
//Guardo en el STORAGE local la lista de productos Maiz JSON
//obtengo los productos almacenados de la listaProductosMaiz
//Variable que guarda el producto seleccionado para comparar
let productoSeleccionado;
//Guardo en una variable la sección donde se van a mostrar los productos
let sectProducts = document.getElementById("sectProducts");

listaProductos = []; //declaro el array de objetos que contendra los productos guardadas


$(() => { //Esto se ejecuta una vez termina de cargar todo el DOM
    $.getJSON("data/data.JSON", (respuesta) => { //Obtenemos los datos desde un JSON en forma estática. Es una petición asíncrona.
        // GUARDAMOS LA RESPUESTA EN UNA VARIABLE DENTRO DE LISTATAREASJSON.
        listaProductos = respuesta;
        console.log(listaProductos);
    })
})

//Muestro los productos ya guardados
mostrarProductos();

function mostrarProductos() {
    //Actualizamos los productos almacenados de la listaProductosMaiz, por si hubo algun cambio (Más adelate).
    almacenados = JSON.parse(localStorage.getItem("listaProductosMaiz"));
    for (const producto of almacenados) {
        sectProducts.innerHTML += `<!-- bloque Product ${producto.id} -->
        <div class="col-4 sectProducts__div" id="product">
            <div class="sectProducts__div__product">
                <div class="sectProducts__div__product__header">
                    <h2><strong>${producto.hibrido}</strong></h2>
                    <img src="img/Icons/maiz.png" class="sect" alt="maiz">
                </div>
                <div class="sectProducts__div__product__body">
                    <p>Tecnología</p>
                    <p><strong>${producto.tecnologia}</strong></p>
                </div>
                <div class="sectProducts__div__product__footer">
                    <button><strong>Ficha Técnica</strong></button>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <strong>Comparar con</strong>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        ${listarOtrosProductos(producto.id, almacenados)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

function listarOtrosProductos(idProducto, arrayProductos) {
    let acumulador = "";
    for (const producto of arrayProductos) {
        if (producto.id != idProducto) {
            acumulador += `<li><a class="dropdown-item" onclick="comparar(${idProducto},${producto.id})">${producto.hibrido}</a></li>`;
        }
    }
    return acumulador;
}

function comparar(idProducto, idTestigo) {
    let table = document.getElementById("tabla");
    if (table != null) {
        table.parentNode.removeChild(table);
    }
    //Como recibimos el id del producto ahora hay que guardar el objeto producto en la variable que corresponde.
    for (const product of almacenados) {
        if (product.id == idProducto) {
            var producto = product;
        }
    }
    //Como recibimos el id del testigo ahora hay que guardar el objeto testigo en la variable que corresponde.
    for (const testig of almacenados) {
        if (testig.id == idTestigo) {
            var testigo = testig;
        }
    }
    $("#sectProducts").prepend(`<table class="table table-bordered" id="tabla" style="display: none">
    <thead>
     <tr>
        <th scope="col">Tu híbrido</th>
        <th scope="col">Testigo</th>
        <th scope="col">N°</th>
        <th scope="col">Rinde tu híbrido (kg/ha)</th>
        <th scope="col">Rinde testigo (kg/ha)</th>
        <th scope="col">DIF</th>
     </tr>
    </thead>
    <tbody>
     <tr>
        <th scope="row">${producto.hibrido}</th>
        <td>${testigo.hibrido}</td>
        <td>${producto.nComparaciones}</td>
        <td>${producto.rindeKGxHA}</td>
        <td>${testigo.rindeKGxHA}</td>
        <td>${producto.rindeKGxHA - testigo.rindeKGxHA}</td>
     </tr>
    </tbody>
 </table>`);
    $("#tabla").fadeIn("slow", function() {
        $("#tabla").animate({ width: '80%' }, "slow");
    });
}