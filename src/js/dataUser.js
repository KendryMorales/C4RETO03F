$(document).ready(function () {
    estadoInicial();

    //si hizo clic en el enlace de cerrar sesion
    $("#cerrarSession").click(function () {
        sessionStorage.removeItem("user");
        location.href = "index.html"
    });

});


function estadoInicial() {
    $("#menu_user").hide();
    $("#menu_product").hide();
    $("#menu_order").hide();
    $("#menu_tabUser").hide();
    $("#menu_tabProduct").hide();
    $("#menu_tabOrder").hide();

    try {
        let user = sessionStorage.getItem("user");

        if (user == null) {
            location.href = "index.html";
            console.log("Usuario null");
        } else {
            let userJS = JSON.parse(user);
            const x = document.getElementById("resultado").innerHTML = userJS.name;
            console.log(x, userJS.id);

            //Tipo de usuario
            let typeUser;
            if (userJS.type == 'ASE') {
                typeUser = "ASESOR";
            }
            else if (userJS.type == 'ADM') {
                typeUser = "ADMINISTRADOR";
            }
            else if (userJS.type == 'COORD') {
                typeUser = "COORDINADOR";
            }

            //Informacion del usuario
            let myTable = "<tr>"
            myTable += "<th>Identificación</th>";
            myTable += "<td>" + userJS.identification + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Nombre</th>";
            myTable += "<td>" + userJS.name + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Direccion</th>";
            myTable += "<td>" + userJS.address + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Telefono</th>";
            myTable += "<td>" + userJS.cellPhone + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Correo</th>";
            myTable += "<td>" + userJS.email + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Contraseña</th>";
            myTable += "<td>" + "******" + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Zona</th>";
            myTable += "<td>" + userJS.zone + "</td>";
            myTable += "</tr>"
            myTable += "<tr>";
            myTable += "<th>Tipo</th>";
            myTable += "<td>" + typeUser + "</td>";
            myTable += "</tr>"
            $("#infoUser").html(myTable);

            let userType = userJS.type;
            console.log("Tipo de usuario: " +userType)
            permisoUser(userType);
        }
    } catch (error) {
        console.log(`error`, error)
    }

}



function permisoUser(userType) {
    // ASE
    // Listado de orden de pedido
    // Llistado de ordenes x fecha
    // Llistado de ordenes x estado

    // ADM
    // Listado de usuario
    // Listado de suplementos

    // COOD
    // Gestion de ordenes

    //Permisos del usuario
    if (userType == "ASE") {
        $("#menu_order").show();
    } else if (userType == "ADM") {
        $("#menu_user").show();
        $("#menu_product").show();
        $("#menu_tabUser").show();
        $("#menu_tabProduct").show();
    } else if (userType == "COORD") {
        $("#menu_order").hide();
        $("#menu_tabOrder").show();
    }
}