//Está no va a ser la funcionalidad final, por lo tanto el nombre del archivo (main.js), como de las funciones van a cambiar más adelante

//Varibale para guardar los productos provenientes del JSON
let listaProductosJSON;
let tipoProd = sessionStorage.getItem('tipoProd');
//variables para trabajar con el DOM.
let sectProducts = document.querySelector("#sectProducts");
let table = document.querySelector("#tabla");
//Esto se ejecuta una vez cargado el DOM.
let contadorCBox; //esta variable sirve para contabilizar por id cada cbox por separado, esto evita que se bugueen los dropdown menu y funcione el clickableInside 

$.get('data/products.json', (respuesta, estado) => {
    listaProductosJSON = respuesta; //guardamos el json en una variable
    contadorCBox = 1; //Seteamos esta variable en 1 cada vez que listemos los productos 
    var i = 1;
    listaProductosJSON.map(prod => { //recorremos el array y utilizamos sus datos aplicandolos al dom.
            if (prod.tipoProd == tipoProd) {
                $("#sectProducts").prepend(`<!-- bloque Product ${i} -->
                        <div class="col-4 sectProducts__div" id="product">
                            <div class="sectProducts__div__product">
                                <div class="sectProducts__div__product__header">
                                    <h2><strong>${prod.hibrido}</strong></h2>
                                    <img src="img/Icons/${prod.tipoProd}.png" class="sect" alt="maiz">
                                </div>
                                <div class="sectProducts__div__product__body">
                                    <p>${prod.desc}</p>
                                    <p><strong>${prod.info}</strong></p>
                                </div>
                                <div class="sectProducts__div__product__footer">
                                <button><strong>Ficha Técnica</strong></button>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuClickableInside" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                            <strong>Comparar con</strong>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuClickableInside">
                                            ${listarOtrosProductos(prod.id)} 
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item" >Listo</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`).slideDown("slow");
                i++;
            }
        }) //llamo a la función listarOtrosProductos mediante el id del producto seleccionado
})

//funcion para listar los otros productos no seleccionados en el btn comparar con
function listarOtrosProductos(idProducto) {
    let acumulador = "";
    listaProductosJSON.map(prod => {
        if (prod.id != idProducto && prod.tipoProd == tipoProd) {
            acumulador += `<li class="dropdown-item"><span class="form-check"><input class="form-check-input" type="checkbox" id="cbox${contadorCBox}" value="${prod.id}"><label class="form-check-label" for="cbox${contadorCBox}">${prod.hibrido}</label></span></li>`;
            contadorCBox++; //sumamos uno para diferenciar cada id con cbox + el numero de cbox
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