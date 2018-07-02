$(document).ready(function () {

    currentState();
    $('.sidenav').sidenav();

    //canno't click on importation and exportation
    $(".ignore-click").click(function(){
        return false;
    })

});

/*GET THE CURRENT STATE*/
function currentState() {
    var pathname = new URL(window.location.href).pathname;
    $('.arrows a[href=\''+pathname+'\']').addClass('current-state');
}

