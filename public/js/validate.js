$(document).ready(function(){
    validateForms();
});


function validateForms() {

    //spot details
    $("#import-form").validate({
        rules:{
            importfile: {
                required:true,
            }
        },
        messages:{
            importfile:{
                required:"Veuillez introduire un fichier csv",
            }
        },
        errorElement : 'span'
    });
}