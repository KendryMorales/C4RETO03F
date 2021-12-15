traerOrdenZone();
let estado = "";

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
    let myTable = "<thead>";
    myTable += "<tr>";
    myTable += "<th>Codigo</th>";
    myTable += "<th>Dia de registro</th>";
    myTable += "<th >Estado</th>";
    myTable += "<th >Cambiar estado</th>";
    myTable += "<th>Asesor</th>";
    myTable += "<th>Identificacion</th>";
    myTable += "<th>Correo</th>";
    myTable += "<th colspan='4' class='text-center'>Acciones</th>";
    myTable += "</tr>";
    myTable += "</thead>";
    myTable += "<tbody>";

    for (i = 0; i < response.length; i++) {
        myTable += "<tr>";
        myTable += "<td>" + response[i].id + "</td>";
        myTable += "<td>" + formatoFecha(response[i].registerDay) + "</td>";
        myTable += "<td>" + response[i].status + "</td>";
        myTable += `<td> 
                    <select onchange="cambioSelect(${i})" id="select${[i]}" class="form-control form-select" style="width:150px" required> 
                        <option selected value="" disabled>Seleccione</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>   
                    </select>     
        </td>`;
        myTable += "<td>" + response[i].salesMan.name + "</td>";
        myTable += "<td>" + response[i].salesMan.identification + "</td>";
        myTable += "<td>" + response[i].salesMan.email + "</td>";
        myTable += "<td> <button class='btn fas fa-eye' onclick='verPedido(" + JSON.stringify(response[i].id) + ")'></button></td>";
        myTable += "<td> <button class='btn fas fa-eye-slash' onclick='limpiar()'></button></td>";
        myTable += "<td> <button class='btn btn-success btn-sm' onclick='cambiarEstado(" + JSON.stringify(response[i]) + ")'>Cambiar estado</button></td>";
        myTable += "<td> <button class='btn btn-danger btn-sm' onclick='eliminarOrden(" + JSON.stringify(response[i].id) + ")'>Eliminar</button></td>";
        myTable += "</tr>";
    }
    myTable += "</tbody>";
    $("#list").html(myTable);
}

function verPedido(id) {
    if (userType == 'COORD') {
        $(".form_order").show(500);
        $(".table_order").hide();

        $.ajax({
            type: 'GET',
            datatype: "JSON",
            url: 'http://129.158.37.103:8083/api/order/' + id,
            success: function (response) {
                console.log(response);
                // console.log("Codigo", id);
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
    let prod = response.products;
    let cant = response.quantities;
    let estado = response.status;
    document.querySelector("#orden").innerHTML = "";
    document.querySelector("#detalleOrden").innerHTML = "";

    let body = "";
    let body1 = "";

    body += ` 
    <thead>
    <tr>
    <th colspan="2" class="text-center">Producto solicitado</th>
    <th colspan="2" class="text-center">Cantidad solicitada</th>
    </tr>
    </thead>
    <tbody>`;

    $.each(cant, function (index, value) {
        body += `
            <tr>   <td colspan="2" class="text-center">${index}</td>
                    <td colspan="2" class="text-center">${value}</td>
            <tr>`;
    })
    body1 += `<table>`;
    for (var i in prod) {
        body1 += `<tr><th colspan="2" class="text-center">${[i]}</th></tr>`;
        for (var j in prod[i]) {
            if (j == "availability") {
                body += `<tr>
                            <th class="text-center"> Disponible ${[i]}</th>
                            <td class="text-center">${prod[i][j]} </td>
                        `;
            }
            if (j == "quantity") {
                body += `
                            <th class="text-center">Stock</th>
                            <td class="text-center">${prod[i][j]}</td>
                        </tr>`;
            }
            body1 += `<tr>
                    <th>${[j]}</th>
                    <td class="text-center">${prod[i][j]}</td>
                </tr>`;
        }
    }

    body += `
    <tr>
    <th colspan="2" class="text-center">Estado</th>
    <td colspan="2" class="text-center">${estado}</td>    
    </tr> 
    </tbody>`;

    body1 += `</table>`;

    document.querySelector("#orden").innerHTML = body;
    document.querySelector("#detalleOrden").innerHTML = body1;
}

function cambioSelect(index) {
    let idSelect = `select${index}`;
    estado = document.getElementById(idSelect).value;
    console.log("Cambio el select ", estado)
}

function cambiarEstado(respuesta) {
    if (userType == 'COORD') {
        if (estado != "" && estado != null) {
            let element = {
                id: respuesta.id,
                // registerDay: respuesta.registerDay,
                status: estado,
                // salesMan: respuesta.salesMan,
            };

            console.log(element);
            $.ajax({
                dataType: 'json',
                url: "http://129.158.37.103:8083/api/order/update",
                type: 'PUT',
                data: JSON.stringify(element),
                contentType: "application/json; charset=utf-8",

                success: function (response) {
                    limpiar();
                    console.log(response);
                    alert("Se ha cambia de estado la orden: " + response.status);
                    traerOrdenZone();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("No ha sido posible guardar el nuevo estado");
                }
            });
        } else {
            alert("Seleccione un estado en el select")
        }
    } else {
        alert("No tiene permiso para cambiar el estado");
    }
}

function eliminarOrden(codigo) {
    if (userType == 'COORD') {
        let element = {
            id: codigo,
        };

        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            datatype: "JSON",
            url: 'http://129.158.37.103:8083/api/order/' + codigo,
            data: JSON.stringify(element),
            success: function (respuesta) {
                console.log(respuesta);
                alert("Se ha eliminado la orden");
                traerOrdenZone();
                clearProduct();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("No fue posible crear la cuenta");
            }
        });
    } else {
        alert("No tiene permiso para borrar productos");
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
    $("#orden").empty();
    $("#detalleOrden").empty();
}