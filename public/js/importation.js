$(document).ready(function () {
    $('.tooltipped').tooltip();
    $('textarea#textarea-import').characterCounter();
});

var uploadField = document.getElementById("importfile");

uploadField.onchange = function() {
    //maximum 20Ko
    if(this.files[0].size > 20500){
        alert("File is too big!");
        this.value = "";
    };
};