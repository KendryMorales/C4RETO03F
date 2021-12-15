function eliminarproducto(indice) {

    //Obtengo la referencia del producto
    let ref = productos[indice].reference;
    let idCaja = `prod_${ref}`;
    cantidadProducto = parseInt(document.getElementById(idCaja).value);
    console.log("Cantidad a eliminar: " + cantidadProducto);

    if (cantidadProducto < 0 || cantidadProducto == null || isNaN(cantidadProducto)) {
        alert("Ingrese la cantidad a eliminar");
        document.getElementById(idCaja).value = "";
        document.getElementById(idCaja).focus();
    } else {
        let index = 0;
        let encontro = false

        for (index = 0; index < productosSeleccionados.length; index++) {
            if (productosSeleccionados[index].reference == ref) {
                encontro = true;
                break;
            }
        }

        if (cantidadProducto <= cantidades[index]) {
            if (encontro) {
                cantidades[index] = cantidades[index] - cantidadProducto;
            } else {
                cantidades.push(cantidadProducto);
                productosSeleccionados.push(productos[indice]);
            }
        } else {
            alert("La cantidad a eliminar es mayor a la cantidad agregada");
        }
        document.getElementById(idCaja).value = "";
        document.getElementById(idCaja).focus();

        pintarPedido();
    }
}


function formatoFecha(fechaInicio) {
    var vFecha = new Date(fechaInicio);
    var vdia = vFecha.getDate();
    var vmes = vFecha.getMonth() + 1;
    var vanio = vFecha.getFullYear();
    vdia = ('0' + vdia).slice(-2);
    vmes = ('0' + vmes).slice(-2);
    return vdia + "/" + vmes + "/" + vanio;
}

function limpiar() {
    $("#pedido").empty();
    $("#pedido1").empty();
    $("#orden").empty();
    $("#procesarOrden").hide();
    $("#limpiar").hide();
    productosSeleccionados = [];
    cantidades = [];
}

function traerOrdenZone() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "JSON",
        url: 'http://129.158.37.103:8083/api/order/zona/' + userJS.zone,
        success: function (response) {
            console.log(response);
            pintarRespuesta(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("No fue posible traer las ordenes por zona");
        }
    });
}

function pintarRespuesta(response) {
    if (userType == 'ASE') {
        let myTable = "<thead>";
        myTable += "<tr>";
        myTable += "<th>Codigo</th>";
        myTable += "<th>Dia de registro</th>";
        myTable += "<th >Estado</th>";
        myTable += "<th>Asesor</th>";
        myTable += "<th>Identificacion</th>";
        myTable += "<th class='text-center' colspan='3'>Acciones</th>";
        myTable += "</tr>";
        myTable += "</thead>";
        myTable += "<tbody>";

        for (i = 0; i < response.length; i++) {
            if (userJS.identification == response[i].salesMan.identification) {
                myTable += "<tr>";
                myTable += "<td>" + response[i].id + "</td>";
                myTable += "<td>" + formatoFecha(response[i].registerDay) + "</td>";
                myTable += "<td>" + response[i].status + "</td>";
                myTable += "<td>" + response[i].salesMan.name + "</td>";
                myTable += "<td>" + response[i].salesMan.identification + "</td>";
                myTable += "<td> <button class='btn fas fa-eye' onclick='verPedido(" + JSON.stringify(response[i].id) + ")'></button></td>";
                myTable += "<td> <button class='btn fas fa-eye-slash' onclick='limpiar()'></button></td>";
                myTable += "</tr>";
        }
            myTable += "</tbody>";
            $("#guardadas").html(myTable);
        }

    } else {
        alert("No tiene permiso");
    }
}

function verPedido(id) {
    if (userType == 'ASE') {
        $(".form_order").show(500);
        $(".table_order").hide();

        $.ajax({
            type: 'GET',
            datatype: "JSON",
            url: 'http://129.158.37.103:8083/api/order/' + id,
            success: function (response) {
                console.log(response);
                traerDetalleOrder(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Ha ocurrido un error");
            }
        });
    } else {
        alert("Permiso denegado");
    }
}


function traerDetalleOrder(response) {
    let cant = response.quantities;
    let estado = response.status;
    document.querySelector("#orden").innerHTML = "";

    let body = "";

    body += ` 
    <thead>
    <tr>
    <th colspan="2" class="text-center">Producto solicitado</th>
    <th colspan="2" class="text-center">Cantidad solicitada</th>
    </tr>
    </thead>
    <tbody>`;

    $.each(cant, function (index, value) {
        // console.log("Producto = " + index + " Cantidad = " + value);
        body += `
            <tr>   <td colspan="2" class="text-center">${index}</td>
                    <td colspan="2" class="text-center">${value}</td>
            <tr>`;
    })
    body += `
    <tr>
    <th colspan="2" class="text-center">Estado</th>
    <td colspan="2" class="text-center">${estado}</td>    
    </tr> 
    </tbody>`;

    document.querySelector("#orden").innerHTML = body;
}
