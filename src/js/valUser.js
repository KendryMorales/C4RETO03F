const ident = document.querySelector("#identUser");
const nameU = document.querySelector("#nameUser");
const email = document.querySelector("#emailUser");
const password = document.querySelector("#passwordUser");
const password1 = document.querySelector("#passwordrepeatUser");
const addresU = document.querySelector("#addressUser");
const cel = document.querySelector("#cellPhoneUser");
const zoneU = document.querySelector("#zoneUser");
const typeU = document.querySelector("#typeUser");

let adClass = document.querySelector('.needs-validation');

document.getElementById('nameUser').addEventListener('blur', lenName, false);
document.getElementById('emailUser').addEventListener('blur', lenEmail, false);
document.getElementById('emailUser').addEventListener('blur', expreRegular, false);
document.getElementById('passwordUser').addEventListener('blur', lenPass, false);
document.getElementById('passwordrepeatUser').addEventListener('blur', compare, false);

//Para que no se recarge la pagina
let formUser = document.getElementById('formUser');
formUser.onsubmit = function (event) {
    event.preventDefault();
}



async function register() {
    // adClass.classList.remove("was-validated")
    try {
        adClass.classList.add("was-validated")

        //para quitar espacios en blancos
        const nameValue = nameU.value.toLowerCase().trim();
        const emailValue = email.value.toLowerCase().trim();
        const passwordValue = password.value.trim();
        // const password1Value = password1.value.trim();

        console.log(`emailValue`, emailValue);

        if (nameValue != "" && passwordValue != "" && emailValue != "" &&
            ident.value.length != "" && addresU.value.length != "" &&
            cel.value.length != "" && zoneU.value.length != "" &&
            typeU.value.length != ""
        ) {
            if (nameU.value.length < 81 && email.value.length < 51 && password.value.length < 51) {
                if (compare()) {
                    if (expreRegular()) {
                        let existE = await existEmail(emailValue);
                        if (!existE) {
                            console.log("Entro en guardar");
                            saveUser();
                        }
                    }
                }
            }
        } else {
            console.log("Los campos no deben estar vacios");
            alert("Los campos no deben estar vacios");
        }
    } catch (error) {
        console.log(`error`, error);
    }
}

async function expreRegular() {
    const emailValue = email.value.toLowerCase().trim();
    //Expresiones regulares
    const emailExpression = /\S+@\S+\.\S+/;
    const isEmailFormated = emailExpression.test(emailValue);
    console.log(`isEmailFormated`, isEmailFormated);

    if (isEmailFormated) {
        document.getElementById('msg_email1').innerHTML = "";
        console.log("Formato de email valido");
        await existEmail(emailValue);
    } else {
        email.value="";
        document.getElementById('msg_email1').innerHTML = "Formato de email invalido";
        console.log("Formato de email invalido");
    }

}

function lenName() {
    if (nameU.value.length < 81) {
        document.getElementById('msg_nombre1').innerHTML = "";
    } else {
        document.getElementById('msg_nombre1').innerHTML = "La maxima cantidad de caracteres es 80";
    }
}

function lenEmail() {
    if (email.value.length < 51) {
        document.getElementById('msg_email1').innerHTML = "";
    } else {
        document.getElementById('msg_email1').innerHTML = "La maxima cantidad de caracteres es 50";
    }
}

function lenPass() {
    if (password.value.length < 51) {
        document.getElementById('msg_pass01').innerHTML = "";
    } else {
        document.getElementById('msg_pass01').innerHTML = "La maxima cantidad de caracteres es 50";
    }
}

function compare() {
    const passwordValue = password.value.trim();
    const password1Value = password1.value.trim();

    let existE = "";

    if (passwordValue == password1Value) {
        document.getElementById('msg_pass01').innerHTML = "";
        document.getElementById('msg_pass02').innerHTML = "";
        console.log("Las contraseñas son iguales");
        return existE = true;
    } else {
        document.getElementById('msg_pass01').innerHTML = "Las contraseñas no son iguales, por favor vuelva a digitarla";
        document.getElementById('msg_pass02').innerHTML = "Las contraseñas no son iguales, por favor vuelva a digitarla";
        console.log("Las contraseñas no son iguales");
        return existE = false;
    }
}

async function existEmail(emailUser) {
    try {
        const url = 'http://129.158.37.103:8083/api/user/emailexist/' + emailUser;
        const response = await fetch(url, {
            method: 'GET',
            headers: { "contentType": "application/json; charset=utf-8" }
        });

        const responseInJsonFormat = await response.json();
        console.log(`Respuesta`, responseInJsonFormat);

        if (responseInJsonFormat) {
            console.log("Existe email", responseInJsonFormat);
            document.getElementById('msg_email1').innerHTML = "El email existe, intente con otro";
            return true;
        } else {
            document.getElementById('msg_email1').innerHTML = "";
            console.log("El email no existe");
            return false;
        }
    } catch (error) {
        console.log(`error`, error);
    }
}
