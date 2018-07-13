$(document).ready(function(){
    validateForms();
});

$.validator.addMethod("isfileSizeOk", function(value, element) {
    var uploadField = document.getElementById("importfile");

        //maximum 20Ko
        if(uploadField.files[0].size > 20500){
            return false ;
            this.value = "";
        }
        else
            return true;


});


function validateForms() {

    //spot details
    $("#import-form").validate({
        rules:{
            importfile: {
                required:true,
                isfileSizeOk:true
            }
        },
        messages:{
            importfile:{
                required:"Veuillez introduire un fichier csv",
                isfileSizeOk:"Taille maximum du fichier est de 20 Ko"
            }
        },
        errorElement : 'span'
    });
}