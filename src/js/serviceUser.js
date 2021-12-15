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
            $("#identUser").val("");
            $("#nameUser").val("");
            $("#addressUser").val("");
            $("#cellPhoneUser").val("");
            $("#emailUser").val("");
            $("#passwordUser").val("");
            $("#passwordrepeatUser").val("");
            $("#zoneUser").val("");
            $("#typeUser").val("");
            $(".needs-validation").removeClass("was-validated");
            alert("¡Cuenta creada de forma correcta!");
            // window.location = '../tableUser.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("No fue posible crear la cuenta");
        }
    });

}