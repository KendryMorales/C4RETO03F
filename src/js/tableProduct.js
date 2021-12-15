$(document).ready(function () {
    clearProduct();
    getProduct();
});

// const user = sessionStorage.getItem("user");
// const userJS = JSON.parse(user);
// const userType = userJS.type;

// IP 129.158.37.103

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
    let myTable = "<thead>";
    myTable += "<tr>";
    myTable += "<th>Referencia</th>";
    myTable += "<th>Marca</th>";
    myTable += "<th>Categoria</th>";
    myTable += "<th>Objetivo</th>";
    myTable += "<th>Descripcion</th>";
    myTable += "<th>Disponibilidad</th>";
    myTable += "<th>Precio</th>";
    myTable += "<th>Cantidad</th>";
    myTable += "<th>Foto</th>";
    myTable += '<th><button class = "btn btn-sm far fa-plus-square btn_new" onclick="newProduct()"></button></th>';
    myTable += '<th colspan="3" class="text-center">Acciones</th>';
    myTable += "</tr>";
    myTable += "</thead>";
    myTable += "<tbody>";

    for (i = 0; i < response.length; i++) {
        myTable += "<tr>";
        myTable += "<td>" + response[i].reference + "</td>";
        myTable += "<td>" + response[i].brand + "</td>";
        myTable += "<td>" + response[i].category + "</td>";
        myTable += "<td>" + response[i].objetivo + "</td>";
        myTable += "<td>" + response[i].description + "</td>";
        myTable += "<td>" + response[i].availability + "</td>";
        myTable += "<td>" + response[i].price + "</td>";
        myTable += "<td>" + response[i].quantity + "</td>";
        myTable += "<td>" + response[i].photography + "</td>";
        myTable += '<td> </td>';
        myTable += "<td> <button class='btn btn-sm far fa-edit' onclick='loadProduct(" + JSON.stringify(response[i].reference) + ")'></button></td>";
        myTable += "<td> <button class='btn btn-sm far fa-trash-alt' onclick='deleteProduct(" + JSON.stringify(response[i].reference) + ")'></button></td>";
        myTable += "</tr>";
    }
    myTable += "</tbody>";
    $("#list").html(myTable);
}


function loadProduct(ref) {
    if (userType == 'ADM') {
        $(".form_product").show(500);
        $(".table_product").hide();
        $(".title_product").text("Actualizar producto");

        console.log("entro aqui", ref);

        $.ajax({
            type: 'GET',
            datatype: "JSON",
            url: 'http://129.158.37.103:8083/api/supplements/' + ref,
            success: function (response) {
                console.log(response);
                console.log("referencia", ref);
                var item = response;
                $("#referenceP").val(item.reference);
                $("#brandP").val(item.brand);
                $("#categoryP").val(item.category);
                $("#objectiveP").val(item.objetivo);
                $("#descriptionP").val(item.description);
                $("#availabilityP").val(item.availability);
                $("#priceP").val(item.price);
                $("#quantityP").val(item.quantity);
                $("#photographyP").val(item.photography);

                let myTable = "<input type='button' class = 'btn btn-primary mb-3 btn-block col-5 btn_edit' onclick='updateProduct(" + JSON.stringify(item.reference) + ")' value='Actualizar'/>";
                myTable += '<input type="button" class = "btn btn-primary mb-3 btn-block col-5 btn_edit" onclick="clearProduct()" value="Cancelar"/>';

                $("#addbtn").html(myTable);

                console.log("la referencia es", item.reference);
                console.log("la referencia es", JSON.stringify(item.reference));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Ha ocurrido un error");
            }
        });
    } else {
        alert("Permiso denegado");
    }
}

function saveProduct() {
    if (userType == 'ADM') {
        $(".needs-validation").addClass("was-validated");
        if (
            $("#referenceP").val().length == 0 ||
            $("#brandP").val().length == 0 ||
            $("#categoryP").val().length == 0 ||
            $("#objectiveP").val().length == 0 ||
            $("#descriptionP").val().length == 0 ||
            $("#availabilityP").val() == null ||
            $("#availabilityP").val().length == 0 ||
            $("#priceP").val().length == 0 ||
            $("#quantityP").val().length == 0 ||
            $("#photographyP").val().length == 0
        ) {
            alert("Los campos no deben estar vacios");
        } else {
            if ($("#descriptionP").val().length < 81) {
                let data = {
                    reference: $("#referenceP").val(),
                    brand: $("#brandP").val(),
                    category: $("#categoryP").val(),
                    objetivo: $("#objectiveP").val(),
                    description: $("#descriptionP").val(),
                    availability: $("#availabilityP").val(),
                    price: $("#priceP").val(),
                    quantity: $("#quantityP").val(),
                    photography: $("#photographyP").val(),
                };
                console.log(data);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "JSON",
                    url: 'http://129.158.37.103:8083/api/supplements/new',
                    data: JSON.stringify(data),
                    success: function (respuesta) {
                        console.log(respuesta);
                        alert("Producto registrado de forma correcta!");
                        clearProduct();
                        // window.location = '../tableProduct.html';            
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("No fue posible registrar el producto");
                    }
                });
                $("#msg_descriptionP1").text("");
            } else {
                $("#msg_descriptionP1").text("La descripcion debe de contener solo 80 caracteres");
            }
        }

    } else {
        alert("No tiene permiso para crear un nuevo producto");
    }
}

function updateProduct(ref) {
    if (userType == 'ADM') {
        $(".needs-validation").addClass("was-validated");
        if (
            $("#referenceP").val().length == 0 ||
            $("#brandP").val().length == 0 ||
            $("#categoryP").val().length == 0 ||
            $("#objectiveP").val().length == 0 ||
            $("#descriptionP").val().length == 0 ||
            $("#availabilityP").val() == null ||
            $("#availabilityP").val().length == 0 ||
            $("#priceP").val().length == 0 ||
            $("#quantityP").val().length == 0 ||
            $("#photographyP").val().length == 0
        ) {
            alert("Los campos no deben estar vacios");
        } else {
            if ($("#descriptionP").val().length < 81) {

                let element = {
                    reference: ref,
                    brand: $("#brandP").val(),
                    category: $("#categoryP").val(),
                    objetivo: $("#objectiveP").val(),
                    description: $("#descriptionP").val(),
                    availability: $("#availabilityP").val(),
                    price: $("#priceP").val(),
                    quantity: $("#quantityP").val(),
                    photography: $("#photographyP").val(),
                };

                console.log(element);
                $.ajax({
                    dataType: 'json',
                    url: "http://129.158.37.103:8083/api/supplements/update",
                    type: 'PUT',
                    data: JSON.stringify(element),
                    contentType: "application/json; charset=utf-8",

                    success: function (response) {
                        console.log(response);
                        $("#list").empty();
                        alert("Se ha actualizado correctamente");
                        clearProduct();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Ha ocurrido un error");
                    }
                });

                $("#msg_descriptionP1").text("");
            } else {
                $("#msg_descriptionP1").text("La descripcion debe de contener solo 80 caracteres");
            }
        }
    } else {
        alert("No tiene permiso para actualizar un producto");
    }
}

function deleteProduct(ref) {
    if (userType == 'ADM') {
        let element = {
            reference: ref,
        };

        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            datatype: "JSON",
            url: 'http://129.158.37.103:8083/api/supplements/' + ref,
            data: JSON.stringify(element),
            success: function (respuesta) {
                console.log(respuesta);
                $("#list").empty();
                alert("Se ha eliminado");
                clearProduct();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("No fue posible borrar el producto");
            }
        });
    } else {
        alert("No tiene permiso para borrar productos");
    }
}

function newProduct() {
    if (userType == 'ADM') {
        $(".form_product").show(500);
        $(".table_product").hide();
        $(".btn_register").show(500);
        $(".title_product").text("Registro de producto");
        let myTable = '<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_register" onclick="saveProduct()" value="Crear"/>';
        myTable += '<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_edit" onclick="clearProduct()" value="Cancelar"/>';
        $("#addbtn").html(myTable);
    } else {
        alert("No tiene permiso para crear un nuevo producto");
    }
}

function clearProduct() {
    $(".table_product").show(500);
    $(".form_product").hide();
    $(".btn_register").hide();
    $(".btn_edit").hide();

    $(".needs-validation").removeClass("was-validated");
    $("#referenceP").val("");
    $("#brandP").val("");
    $("#categoryP").val("");
    $("#objectiveP").val("");
    $("#descriptionP").val("");
    $("#availabilityP").val("");
    $("#priceP").val("");
    $("#quantityP").val("");
    $("#photographyP").val("");
    getProduct();
}