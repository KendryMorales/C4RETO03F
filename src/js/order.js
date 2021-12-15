$(document).ready(function () {
    getProduct();
    limpiar();
    traerOrdenZone();
});

let productos = [];//almacena la totalidad de los productos
let productosSeleccionados = [];//almacena solamente los productos seleccionados
let cantidades = [];//almacena la cantidad seleccionada x cada producto
var date = new Date();

function getProduct() {
    $.ajax({
        type: "GET",
        url: "http://129.158.37.103:8083/api/supplements/all",
        datatype: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log(response);
            paintProduct(response);
        }
    });
}

function paintProduct(response) {
    productos = response;
    let myTable = "<thead>";
    myTable += "<tr>";
    myTable += "<th>Referencia</th>";
    myTable += "<th>Marca</th>";
    myTable += "<th>Categoria</th>";
    myTable += "<th>Descripcion</th>";
    myTable += "<th>Disponibilidad</th>";
    myTable += "<th>Precio</th>";
    myTable += "<th>Cantidad</th>";
    myTable += "<th colspan='2' class='text-center'>Acciones</th>";
    myTable += "</tr>";
    myTable += "</thead>";
    myTable += "<tbody>";

    for (i = 0; i < response.length; i++) {
        myTable += `<tr>
        <td>${response[i].reference}</td>
        <td>${response[i].brand}</td>
        <td>${response[i].category}</td>
        <td>${response[i].description}</td>
        <td>${response[i].availability}</td>
        <td>${response[i].price}</td>
        <td><input type="number" id="prod_${response[i].reference}" style="width:70px"/></td>
        <td><button class="btn btn-success" id="bot_${response[i].reference}" onclick="registrarproducto('${i}')" class='btn btn-success'>Agregar</button></td>
        <td><button class="btn btn-danger" id="delete_${response[i].reference}" onclick="eliminarproducto('${i}')" class='btn btn-success'>Eliminar</button></td>
        </td></tr>`;
    }
    myTable += "</tbody>";
    $("#list").html(myTable);
}


function registrarproducto(indice) {

    //Obtengo la referencia del producto
    let ref = productos[indice].reference;
    let idCaja = `prod_${ref}`;
    cantidadProducto = parseInt(document.getElementById(idCaja).value);
    console.log("La cantidad de producto es: " + cantidadProducto);
    console.log("La cantidades de producto es: " + cantidades);

    if (cantidadProducto < 0 || cantidadProducto == null || isNaN(cantidadProducto)) {
        alert("Ingrese la cantidad de productos");
        document.getElementById(idCaja).value = "";
        document.getElementById(idCaja).focus();
    } else {
        let index = 0;
        let encontro = false

        //Valido si previamente existe el producto en el arreglo de cantidades, obtiene la cantidad previa y suma la nueva cantidad
        for (index = 0; index < productosSeleccionados.length; index++) {
            if (productosSeleccionados[index].reference == ref) {
                encontro = true;
                break;
            }
        }

        //si encontro el producto entre los seleccionados, suma la cantidad solicitada a la cantidad de producto
        //o agrega el producto y la cantidad solicitada a los respectivos arreglos
        if (encontro) {
            cantidades[index] = cantidades[index] + cantidadProducto;
        } else {
            cantidades.push(cantidadProducto);
            productosSeleccionados.push(productos[indice]);
        }

        document.getElementById(idCaja).value = "";
        document.getElementById(idCaja).focus();
        pintarPedido();
    }
}


function pintarPedido() {

    let tabla = document.querySelector("#pedido");
    let subtotal = 0;
    tabla.innerHTML = "";

    let tr = document.createElement("tr")
    let tdReference = document.createElement("th")
    let tdPrice = document.createElement("th")
    let tdCantidad = document.createElement("th")
    let tdsubTotal = document.createElement("th")

    var btn = document.createElement("BUTTON");
    btn.setAttribute("id", "btn_id");
    btn.setAttribute("class", "btn_class");

    tdReference.innerHTML = "Referencia";
    tdPrice.innerHTML = "Precio";
    tdCantidad.innerHTML = "Cantidad";
    tdsubTotal.innerHTML = "Subtotal";

    tr.appendChild(tdReference);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdsubTotal);
    tabla.appendChild(tr);

    for (let indice = 0; indice < productosSeleccionados.length; indice++) {

        tr = document.createElement("tr")
        tdReference = document.createElement("td")
        tdPrice = document.createElement("td")
        tdCantidad = document.createElement("td")
        tdsubTotal = document.createElement("td")

        precio = parseInt(productosSeleccionados[indice].price);
        cantidad = parseInt(cantidades[indice]);

        tdReference.innerHTML = productosSeleccionados[indice].reference;
        tdPrice.innerHTML = productosSeleccionados[indice].price;
        tdCantidad.innerHTML = cantidades[indice];
        tdsubTotal.innerHTML = (precio * cantidad);

        tr.appendChild(tdReference);
        tr.appendChild(tdPrice);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdsubTotal);
        tabla.appendChild(tr);

        subtotal = subtotal + precio * cantidad;
    }

    tr = document.createElement("tr");
    tdsubTotal = document.createElement("td")
    tdTitulo = document.createElement("th")
    tdsubTotal.innerHTML = subtotal;
    tdTitulo.innerHTML = "Total";
    tr.appendChild(tdTitulo).colSpan = "3";
    tr.appendChild(tdsubTotal);
    tabla.appendChild(tr);

    $("#pedido").show();

    document.querySelector("#pedido1").innerHTML = "";

    let body = "";
    body +=
        `<thead>
    <tr><th class="text-center">Fecha</th>
    <th class="text-center">Estado</th></tr>
    </thead>
    <tbody>
    <tr><td class="text-center">${formatoFecha(date.toISOString())}</td>
    <td class="text-center">Pendiente</td></tr>
    <tbody>`;

    $("#pedido1").html(body);
    $("#procesarOrden").show();
    $("#limpiar").show();
}


function procesarOrden() {

    let productos = {};
    let quantities = {};

    for (let i = 0; i < productosSeleccionados.length; i++) {
        productos[productosSeleccionados[i].reference] = productosSeleccionados[i];
        quantities[productosSeleccionados[i].reference] = cantidades[i];
    }

    let order = {
        registerDay: date.toISOString(),
        status: "Pendiente",
        salesMan: userJS,
        products: productos,
        quantities: quantities
    }

    let orderJson = JSON.stringify(order);
    $.ajax({
        url: "http://129.158.37.103:8083/api/order/new",
        data: orderJson,
        type: 'POST',
        contentType: "application/JSON",
        success: function (respuesta) {
            alert("El codigo de tu pedido es: " + respuesta.id);
            traerOrdenZone();
            limpiar();
        },
        error: function (xhr, status) {
            alert("No ha sido posible enviar tu pedido");
        }
    });
}

