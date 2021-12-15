$(document).ready(function () {
    getUser();
    clearUser();
});

function getUser() {
    $.ajax({
        url: "http://129.158.37.103:8083/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            console.log(response);
            paintUser(response);
        }
    });
}

function paintUser(response) {
    let myTable = "<thead>"
    myTable += "<tr>";
    myTable += "<th>Identificación</th>";
    myTable += "<th>Nombre</th>";
    // myTable += "<th>Direccion</th>";
    // myTable += "<th>Telefono</th>";
    myTable += "<th>Correo</th>";
    myTable += "<th>Zona</th>";
    myTable += "<th>Tipo</th>";
    myTable += '<th><button class = "btn btn-sm fas fa-user-plus btn_new" onclick="newUser()"></button></th>';
    myTable += '<th colspan="3" class="text-center">Acciones</th>';
    myTable += "</tr>";
    myTable += "</thead>";
    myTable += "<tbody>";

    for (i = 0; i < response.length; i++) {
        myTable += "<tr>";
        myTable += "<td>" + response[i].identification + "</td>";
        myTable += "<td>" + response[i].name + "</td>";
        // myTable += "<td>" + response[i].address + "</td>";
        // myTable += "<td>" + response[i].cellPhone + "</td>";
        myTable += "<td>" + response[i].email + "</td>";
        myTable += "<td>" + response[i].zone + "</td>";
        myTable += "<td>" + response[i].type + "</td>";
        myTable += '<td></td>';
        myTable += '<td><button class = "btn btn-sm fas fa-user-edit" onclick="loadUser(' + response[i].id + ')"></button></td>';
        myTable += '<td><button class = "btn btn-sm fas fa-user-minus" onclick="deleteUser('+ response[i].id +')"></button></td>';
        myTable += "</tr>";
    }
    myTable += "</tbody>";
    $("#list").html(myTable);
}

function loadUser(idUser) {
    $(".form_user").show(500);
    $(".table_user").hide();
    $(".title_user").text("Actualizar usuario");

    console.log("el id es", idUser);

    $.ajax({
        type: 'GET',
        datatype: "JSON",
        url: 'http://129.158.37.103:8083/api/user/' + idUser,
        success: function (response) {
            console.log(response);
            var item = response;

            $("#identUser").val(item.identification);
            $("#nameUser").val(item.name);
            $("#addressUser").val(item.address);
            $("#cellPhoneUser").val(item.cellPhone);
            $("#emailUser").val(item.email);
            $("#passwordUser").val(item.password);
            $("#passwordrepeatUser").val(item.password);
            $("#zoneUser").val(item.zone);
            $("#typeUser").val(item.type);
            let myTable ='<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_edit" onclick="updateUser('+ item.id +')" value="Actualizar"/>';
            myTable += '<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_edit" onclick="clearUser()" value="Cancelar"/>';
            $("#addbtn").html(myTable);            
        },
        
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Ha ocurrido un error");
        }
    });
}

function saveUser() {
    let data = {
        identification:$("#identUser").val(),
        name: $("#nameUser").val(),
        address: $("#addressUser").val(),
        cellPhone: $("#cellPhoneUser").val(),
        email: $("#emailUser").val(),
        password: $("#passwordUser").val(),
        zone: $("#zoneUser").val(),
        type: $("#typeUser").val(),
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "JSON",
        url: "http://129.158.37.103:8083/api/user/new",
        data: JSON.stringify(data),
        success: function (respuesta) {
            console.log(respuesta);
            alert("¡Cuenta creada de forma correcta!");
            // window.location = '../tableUser.html';
            // location.reload();
            clearUser();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("No fue posible crear la cuenta");
        }
    });
}

function updateUser(idUser) {
    $(".needs-validation").addClass("was-validated");
    if (
        $("#identUser").val().length == 0 ||
        $("#nameUser").val().length == 0 ||
        $("#addressUser").val().length == 0 ||
        $("#cellPhoneUser").val().length == 0 ||
        $("#emailUser").val().length == 0 ||
        $("#passwordUser").val().length == 0 ||
        $("#passwordrepeatUser").val().length == 0 ||
        $("#zoneUser").val().length == 0 ||
        $("#typeUser").val().length == 0
    ) {
        alert("Los campos no deben estar vacios");
    } else {
        
        if(compare()){
            let element = {
                id: idUser,
                identification: $("#identUser").val(),
                name: $("#nameUser").val(),
                address: $("#addressUser").val(),
                cellPhone: $("#cellPhoneUser").val(),
                email: $("#emailUser").val(),
                password: $("#passwordUser").val(),
                zone: $("#zoneUser").val(),
                type: $("#typeUser").val(),
            }
            console.log(element);
            let dataSend = JSON.stringify(element);
    
            $.ajax({
                dataType: 'json',
                url: "http://129.158.37.103:8083/api/user/update",
                type: 'PUT',
                data: dataSend,
                contentType: "application/json; charset=utf-8",
    
                success: function (response) {
                    console.log(response);
                    $("#list").empty();
                    alert("Se ha actualizado correctamente")
                    clearUser();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Ha ocurrido un error");
                }
            });
        }
    }
}

function deleteUser(idUser) {
    let element = {
        id: idUser
    };

    $.ajax({
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        datatype: "JSON",
        url: "http://129.158.37.103:8083/api/user/" + idUser,
        data: JSON.stringify(element),
        success: function (respuesta) {
            console.log(respuesta);
            $("#list").empty();
            alert("Se ha eliminado");
            getUser();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("No fue posible crear la cuenta");
        }
    });
}

function newUser(){
    $(".form_user").show(500);
    $(".table_user").hide();
    $(".title_user").text("Registro de usuario");
    let myTable ='<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_register" onclick="register()" value="Crear"/>';
    myTable += '<input type="submit" class = "btn btn-primary mb-3 btn-block col-5 btn_edit" onclick="clearUser()" value="Cancelar"/>';
    $("#addbtn").html(myTable); 
}

function clearUser() {
    $(".table_user").show(500);
    $(".form_user").hide();
    $(".btn_register").hide();
    $(".btn_edit").hide();

    $(".needs-validation").removeClass("was-validated");
    $("#identUser").val("");
    $("#nameUser").val("");
    $("#addressUser").val("");
    $("#cellPhoneUser").val("");
    $("#emailUser").val("");
    $("#passwordUser").val("");
    $("#passwordrepeatUser").val("");
    $("#zoneUser").val("");
    $("#typeUser").val("");
    $("#msg_pass01").text("");
    $("#msg_pass02").text("");
    $("#msg_email1").text("");
    $("#msg_nombre1").text("");
    getUser();
}