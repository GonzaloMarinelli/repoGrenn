//Está no va a ser la funcionalidad final, por lo tanto el nombre del archivo (main.js), como de las funciones van a cambiar más adelante

//Varibale para guardar los productos provenientes del JSON
let listaProductosJSON;
let tipoProd = sessionStorage.getItem('tipoProd');
//Esto se ejecuta una vez cargado el DOM.
let contadorCBox; //esta variable sirve para contabilizar por id cada cbox por separado, esto evita que se bugueen los dropdown menu y funcione el clickableInside 
let listaCboxBtnListo = []; //Este array va a ser multidimensional y va a guardar cada btn listo con su grupo de cbox

$.get('data/products.json', (respuesta, estado) => {
    listaProductosJSON = respuesta; //guardamos el json en una variable
    contadorCBox = 1; //Seteamos esta variable en 1 cada vez que listemos los productos 
    var i = 1;
    listaProductosJSON.map(prod => { //recorremos el array y utilizamos sus datos aplicandolos al dom.
            if (prod.tipoProd == tipoProd) {
                $("#sectProducts").append(`<!-- bloque Product ${i} -->
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
                                    <div>
                                        <button class="btn" onclick="mostrarFicha(${prod.id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                            <strong>Ficha Técnica</strong>
                                        </button>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuClickableInside" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                            <strong>Comparar con</strong>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuClickableInside">
                                            ${listarOtrosProductos(prod.id, "btnListoN"+i)} 
                                            <li><hr class="dropdown-divider"></li>
                                            <li><button class="dropdown-item" type="button" onclick="comparar(${prod.id}, 'btnListoN${i}')" id="btnListoN${i}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Listo</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`).slideDown("slow");
                i++;
            }
        }) //llamo a la función listarOtrosProductos mediante el id del producto seleccionado
})

function mostrarFicha(idProducto) {
    limpiarModal();
    let productoS; //ProductoSeleccionado
    listaProductosJSON.map(prod => {
        if (prod.id == idProducto) {
            productoS = prod;
        }
    })
    $("#staticBackdropLabel").append(productoS.hibrido);
    $("#modalBody").append(`<div class="row" id="ficha">
                                <div class="col-md-4">
                                    <h5><u>Siembra</u></h5>
                                    <img src="${productoS.img}" class="" alt="Imagen del mapa de siembra">
                                </div>
                                <div class="col-md-8">
                                    <h5><u>Descripción</u></h5>
                                    <p>${productoS.resume}</p>
                                    <ul>
                                        <li>Comparaciones: ${productoS.nComparaciones}</li>
                                        <li>Rinde (kg/ha): ${productoS.rindeKGxHA}</li>
                                        <li>${productoS.desc}: ${productoS.info}</li>
                                        <li>Éxito%: ${productoS.pExito}</li>
                                        <li>Madurez relativa: ${productoS.madurez}</li>
                                        <li>Tipo de grano: ${productoS.tipoGrano}</li>
                                        <li>Peso mil granos (g): ${productoS.pesoMilGranos}</li>
                                    </ul>
                                </div>
                            </div>
    `);
}

//función para listar los otros productos no seleccionados en el btn comparar con
//Además separa cada btnListoN+id con su grupo de cbox para luego comparar en una tabla con los id de los productos marcados por los cbox seleccionados
function listarOtrosProductos(idProducto, btnListoN) {
    let arrayLista = [btnListoN]; //Este array va a albergar cada btn listo con su grupo de cbox
    let acumulador = "";
    listaProductosJSON.map(prod => {
        if (prod.id != idProducto && prod.tipoProd == tipoProd) {
            acumulador += `<li class="dropdown-item"><span class="form-check"><input class="form-check-input" type="checkbox" id="cbox${contadorCBox}" value="${prod.id}"><label class="form-check-label" for="cbox${contadorCBox}">${prod.hibrido}</label></span></li>`;
            arrayLista.push("cbox" + contadorCBox)
            contadorCBox++; //sumamos uno para diferenciar cada id con cbox + el numero de cbox
        }
    })
    listaCboxBtnListo.push(arrayLista);
    return acumulador;
}

//Función que recibe el producto a comparar con el id del btn Listo, para buscar los productos comparativos seleccionados
function comparar(idProducto, idBtnListo) {
    limpiarModal();
    let listaTestigos = obtenerTestigosS(idBtnListo); //listamos como objetos los productos testigos comparativos
    if (listaTestigos.length == 0) {
        $("#staticBackdropLabel").append("Aviso");
        $("#modalBody").append(`<p id="aviso">Por favor seleccione algún testigo</tr>`);
    } else {
        let productoS; //ProductoSeleccionado
        listaProductosJSON.map(prod => {
            if (prod.id == idProducto) {
                productoS = prod;
            }
        })
        $("#staticBackdropLabel").append("Análisis");
        $("#modalBody").append(`<table class="table table-striped" id="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tu híbrido</th>
                                            <th scope="col">Tetigos</th>
                                            <th scope="col">N° </th>
                                            <th scope="col">Híbrido (kg/ha)</th>
                                            <th scope="col">Testigo (kg/ha)</th>
                                            <th scope="col">Diferencia</th>
                                            <th scope="col">% éxito</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowspan=${listaTestigos.length} class="text-center"><strong>${productoS.hibrido}</strong></td>
                                            ${calcularListarTetigosS(listaTestigos, productoS)}
                                        </tr>
                                    </tbody>
                                </table>`)
    }
}

//Función que cálcula los datos de los testigos, los compara con el hibrido seleccionado y los lista para mostrar en la tabla
function calcularListarTetigosS(listaTestigos, productoS) {
    let acumulador = "";
    var rindeKGxHAhibrido = productoS.rindeKGxHA + 0.123; //Calculos inventados por mi, no tienen ninguna lógica más que la de alternar resultados
    listaTestigos.map(prod => {
        var dif = rindeKGxHAhibrido - prod.rindeKGxHA;
        var exito = (productoS.pExito * prod.pExito) / 100;
        acumulador += `<td>${prod.hibrido}</td><td>${prod.nComparaciones}</td><td>${rindeKGxHAhibrido}</td><td>${prod.rindeKGxHA}</td><td>${Math.round(dif * 1000) / 1000}</td><td>${exito}</td></tr>`;
        acumulador += `<tr>`;
        rindeKGxHAhibrido += 0.253;
    })
    return acumulador;
}

//Función que obtiene los testigos seleccionados en un array como objetos
function obtenerTestigosS(idBtnListo) {
    let productsTestigos = []; //Array que guardará todos los productos testigos comparativos
    for (let i = 0; i < listaCboxBtnListo.length; i++) {
        if (listaCboxBtnListo[i][0] == idBtnListo) { // solo obtenemos el array con los cb de idBtnListo
            //obtengo el tamaño del array que está en la posición i
            var innterArrayLenght = listaCboxBtnListo[i].length;
            for (let j = 1; j < innterArrayLenght; j++) { //recorro el primer array obtenido
                var cb = document.getElementById(listaCboxBtnListo[i][j]);
                if (cb.checked) {
                    listaProductosJSON.map(prod => {
                        if (prod.id == cb.value) {
                            productsTestigos.push(prod);
                        }
                    })
                }
            }
        }
    }
    return productsTestigos;
}

function limpiarModal() {
    $("#staticBackdropLabel").empty();
    $("#aviso").remove();
    $("#table").remove();
    $("#ficha").remove();
}