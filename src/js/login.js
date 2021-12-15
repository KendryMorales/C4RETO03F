$(document).ready(function () {
    $(".btn").click(function (event) {
        $(".needs-validation").addClass("was-validated");
    });

    $("#solicitar").click(function (event) {
        alert("Solicita tu cuenta al administardor");
    });
});

function loginEvento(event) {
    try {
        event.preventDefault();
        const email = document.querySelector("#email");
        const password = document.querySelector("#password");
        //para quitar espacios en blancos
        const emailValue = email.value.toLowerCase().trim();
        const passwordValue = password.value.trim();

        console.log(`emailValue`, emailValue);
        console.log(`passwordValue`, passwordValue);

        //Expresiones regulares
        const emailExpression = /\S+@\S+\.\S+/;

        const isEmailFormated = emailExpression.test(emailValue);
        console.log(`isEmailFormated`, isEmailFormated);

        if (emailValue != "" && isEmailFormated) {
            console.log(`email valido`);
            if (passwordValue != "") {
                console.log(`password valido`);
                autenticar(emailValue, passwordValue);
            } else {
                console.log(`password no valido`);
            }
        } else {
            console.log(`email no valido`);
            $("#msg_email").text("Email no valido");
            $("#email").val("");
        }

    } catch (error) {
        console.log(`error`, error);
    }
}

function autenticar(email, pass) {
    $.ajax({
        type: "GET",
        datatype: "JSON",
        url: 'http://129.158.37.103:8083/api/user/' + email + '/' + pass,
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.id != null) {
                console.log(`El usuario se autentico`, email);
                // alert("Bienvenido, "+ respuesta.name);
                $(".needs-validation").removeClass("was-validated");
                $("#email").val("");
                $("#password").val("");
                gestionaResultado(respuesta);
                //     sessionStorage.setItem("userId1", respuesta.id)
                //     sessionStorage.setItem("userName1", respuesta.name)
                //     sessionStorage.setItem("userEmail1", respuesta.email)
                //     window.location = '../C4RETO2F/welcome.html';

            } else {
                console.log("El usuario no existe");
                $("#email").val("");
                $("#password").val("");
                $("#msg_email").text("La combinacion de correo y contraseña no existe");
                $("#msg_contraseña").text("La combinacion de correo y contraseña no existe");
                alert("Usuario no esta registrado");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Ha ocurrido un error");
        }
    });
}

function gestionaResultado(respuesta) {

    let userJS = {
        id: respuesta.id,
        identification: respuesta.identification,
        name: respuesta.name,
        birthtDay: respuesta.birthtDay,
        monthBirthtDay: respuesta.monthBirthtDay,
        address: respuesta.address,
        cellPhone: respuesta.cellPhone,
        email: respuesta.email,
        password: respuesta.password,
        zone: respuesta.zone,
        type: respuesta.type
    };

    let user = JSON.stringify(userJS);
    sessionStorage.setItem("user", user);
    location.href = "welcome.html";

    alert("Bienvenido(a) " + userJS.name);

}
