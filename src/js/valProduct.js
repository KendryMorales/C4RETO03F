let formProduct = document.getElementById('formProduct');
formProduct.onsubmit = function (event) {
    event.preventDefault();
}

const descriptionP = document.querySelector("#descriptionP");
document.getElementById('descriptionP').addEventListener('blur', lenDescription, false);

function lenDescription() {
    if (descriptionP.value.length < 81) {
        document.getElementById('msg_descriptionP1').innerHTML = "";
    } else {
        document.getElementById('msg_descriptionP1').innerHTML = "La maxima cantidad de caracteres es 80";
    }
}