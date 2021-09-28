//Está no va a ser la funcionalidad final, por lo tanto el nombre del archivo (main.js), como de las funciones van a cambiar más adelante

//Varibale para guardar los productos provenientes del JSON
let listaProductosJSON;

//variables para trabajar con el DOM.
let sectProducts = document.querySelector("#sectProducts");
let table = document.querySelector("#tabla");
//Esto se ejecuta una vez cargado el DOM.

mostrarProductos();

function mostrarProductos() {
    //obtenemos el json
    $.get('data/data.json', (respuesta, estado) => {
        listaProductosJSON = respuesta; //guardamos el json en una variable
        listaProductosJSON.map(prod => { //recorremos el array y utilizamos sus datos aplicandolos al dom.
                $("#sectProducts").prepend(`<!-- bloque Product ${prod.id} -->
                    <div class="col-4 sectProducts__div" id="product">
                        <div class="sectProducts__div__product">
                            <div class="sectProducts__div__product__header">
                                <h2><strong>${prod.hibrido}</strong></h2>
                                <img src="img/Icons/maiz.png" class="sect" alt="maiz">
                            </div>
                            <div class="sectProducts__div__product__body">
                                <p>Tecnología</p>
                                <p><strong>${prod.tecnologia}</strong></p>
                            </div>
                            <div class="sectProducts__div__product__footer">
                                <div class="dropdown">
                                    <div class="btn-group dropend">
                                        <button type="button" class="btn btn-secondary dropdown-toggle" onclick="consultarStock(${prod.id})" data-bs-toggle="dropdown" aria-expanded="false">
                                        <strong>Consultar stock</strong>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" id="mostrarStock${prod.id}">
                                        </ul>
                                    </div>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    <strong>Comparar con</strong>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    ${listarOtrosProductos(prod.id)} 
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`).slideDown("slow");
            }) //llamo a la función listarOtrosProductos mediante el id del producto seleccionado
    })
}

function consultarStock(idProducto) {
    //Url para el GET
    let URLGET = "https://jsonplaceholder.typicode.com/todos/"
    URLGET = URLGET + idProducto; //Preparamos el url con la id del "producto"
    $("#mostrarStock" + idProducto).empty(); //Vaciamos el contenedor por si no es la primera vez que se aplica la función
    let rta;
    $.get(URLGET, function(respuesta, estado) {
        if (estado === "success") {
            let producto = respuesta;
            if (producto.completed == true) {
                rta = "Hay stock";
            } else {
                rta = "No hay stock";
            }
            return $("#mostrarStock" + idProducto).prepend(rta);
        }
    })
}

//Function para listar los otros productos no seleccionados en el btn comparar
function listarOtrosProductos(idProducto) {
    let acumulador = "";
    listaProductosJSON.map(prod => {
        if (prod.id != idProducto) {
            acumulador += `<li><a class="dropdown-item" onclick="comparar(${idProducto},${prod.id})">${prod.hibrido}</a></li>`;
        }
    })
    return acumulador;
}

function comparar(idProducto, idTestigo) {
    table = document.querySelector("#tabla");
    //Si la tabla ya fue creada la removemos
    let productoS; //ProductoSeleccionado
    let testigoS; //Testigo seleccionado
    if (table != null) {
        table.parentNode.removeChild(table);
    }
    listaProductosJSON.map(prod => {
        if (prod.id == idProducto) {
            productoS = prod;
        } else if (prod.id == idTestigo) {
            testigoS = prod;
        }
    })
    $("#sectProducts").append(`<table class="table table-bordered" id="tabla">
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
             <th scope="row">${productoS.hibrido}</th>
             <td>${testigoS.hibrido}</td>
             <td>${productoS.nComparaciones}</td>
             <td>${productoS.rindeKGxHA}</td>
             <td>${testigoS.rindeKGxHA}</td>
             <td>${productoS.rindeKGxHA - testigoS.rindeKGxHA}</td>
         </tr>
        </tbody>
      </table>`).fadeIn("slow"); //Por alguna razón no hace la animación (?
}