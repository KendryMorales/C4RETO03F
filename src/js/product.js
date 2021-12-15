function saveProduct() {
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
}


function clearProduct() {
    $(".table_product").show(500);
    $(".form_product").hide();

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
}