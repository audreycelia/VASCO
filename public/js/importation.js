$(document).ready(function () {
    $('.tooltipped').tooltip();
    $('textarea#textarea-import').characterCounter();
});

// $('#btn').click(function () {
//
//     $('#file-imported').val('uploads/cereal.csv');
//     $('#btnNext').submit();
//
// });

var uploadField = document.getElementById("importfile");

uploadField.onchange = function() {
    //maximum 20Ko
    if(this.files[0].size > 20500){
        alert("File is too big!");
        this.value = "";
    };
};