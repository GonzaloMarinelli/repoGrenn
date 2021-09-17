$(":submit").on('click', function() {
    let name = $("#inputFirstName").val();
    let lastname = $("#inputLastName").val();
    return alert("Hemos enviado correctamente su mensaje " + name + " " + lastname + ".");
});