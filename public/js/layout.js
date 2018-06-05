$(document).ready(function () {

    currentState();
});


function currentState() {

    var pathname = new URL(window.location.href).pathname;

    $('.nav-wrapper a[href=\''+pathname+'\']').addClass('current-state');
}