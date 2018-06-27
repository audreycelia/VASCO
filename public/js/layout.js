$(document).ready(function () {

    currentState();
    $('.sidenav').sidenav();

    $(".ignore-click").click(function(){
        return false;
    })

});



function currentState() {
    var pathname = new URL(window.location.href).pathname;
    $('.arrows a[href=\''+pathname+'\']').addClass('current-state');
}

