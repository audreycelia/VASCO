$(document).ready(function () {

    currentState();
    $('.sidenav').sidenav();


});



function currentState() {
    var pathname = new URL(window.location.href).pathname;
    $('.arrows a[href=\''+pathname+'\']').addClass('current-state');
}

