$(document).ready(function () {
    $(".btn_new").click(function (event) {
        $(".needs-validation").addClass("was-validated");
    });
});

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
            alert("¡Cuenta creada de forma correcta!");
            $(".needs-validation").removeClass("was-validated");
            window.location = '../tableUser.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("No fue posible crear la cuenta");
        }
    });

}

function existEmail(emailUser) {
    // let data ={
    //     email:emailUser,
    // }
    $.ajax({
        type: "GET",
        datatype: "JSON",
        url: "http://129.158.37.103:8083/api/user/emailexist/" + emailUser,
        // data: JSON.stringify(data),
        success: function (respuesta) {
            if (respuesta) {
                console.log("Existe email", respuesta, emailUser);
                $("#emailUser").val("");
                $("#msg_email").text("El email existe, intente con otro");
                return true;
            } else {
                console.log("El email no existe");
                saveUser();
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Ha ocurrido un error");
        }
    });
}

function register(event) {
    try {
        event.preventDefault();
        const name = document.querySelector("#nameUser");
        const email = document.querySelector("#emailUser");
        const password = document.querySelector("#passwordUser");
        const password1 = document.querySelector("#passwordrepeatUser");
        //para quitar espacios en blancos
        const nameValue = name.value.toLowerCase().trim();
        const emailValue = email.value.toLowerCase().trim();
        const passwordValue = password.value.trim();
        const password1Value = password1.value.trim();

        console.log(`emailValue`, emailValue);
        console.log(`Comparar contraseñas`, passwordValue, password1Value);

        //Expresiones regulares
        const emailExpression = /\S+@\S+\.\S+/;

        const isEmailFormated = emailExpression.test(emailValue);
        console.log(`isEmailFormated`, isEmailFormated);

        if (nameValue != "" && passwordValue != "" && emailValue != "") {
                if(compare(passwordValue, password1Value)){
                    if (isEmailFormated) {
                        existEmail(emailValue);
                    } else {
                        // alert("Formato de email invalido");
                        console.log(`Formato de email invalido`);
                        $("#emailUser").val("");
                        $("#msg_email").text("Formato de email invalido");
                    }
                }
        } else {
            console.log(`Campos vacios`)
        }
    } catch (error) {
        console.log(`error`, error);
    }
}

function compare(pass1, pass2) {
    if (pass1 == pass2) {
        console.log("Las contraseñas son iguales");
        return true;
    } else {
        // alert("¡Las contraseñas no son iguales!");
        $("#passwordrepeatUser").val("");
        $("#passwordUser").val("");
        $("#msg_pass").text("Las contraseñas no son iguales, por favor vuelva a digitarla");
        $("#msg_pass1").text("Las contraseñas no son iguales, por favor vuelva a digitarla");
        console.log("Las contraseñas no son iguales");
        return false;
    }
}