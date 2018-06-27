$(document).ready(function () {

    selectedGraphVegaLite();

});

function selectedGraphVegaLite() {

    //variables
    var test = result.items[0]._spec;
    var fieldX = test.encodings[0].field;
    var fieldY = test.encodings[1].field;

    //Vega-lite structure
    vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {"url": "uploads/temp.csv"},
        "mark": test.mark,
        "encoding": {
            "x": {
                "field": fieldX,
                "type": test.encodings[0].type
            },
            "y": {
                "field": fieldY,
                "type": test.encodings[1].type
            },

        }
    };

    // if (document.getElementById("default").checked){
    //     document.getElementById("selectedGraph").innerHTML =  vegaEmbed("#selectedGraph", vlSpec);
    // } else if (document.getElementById("dark").checked){
    //     document.getElementById("selectedGraph").innerHTML = vegaEmbed("#selectedGraph", vlSpec,{theme: 'dark'});
    // }

    $('input:radio').on( "click", function() {
        if ($(this).attr('id') === 'default') {

            vegaEmbed("#selectedGraph", vlSpec);
        }
        else if ($(this).attr('id') === 'dark') {

            vegaEmbed("#selectedGraph", vlSpec,{theme: 'dark'});
        }
        else if ($(this).attr('id') === 'excel') {

            vegaEmbed("#selectedGraph", vlSpec,{theme: 'excel'});
        }
        else if ($(this).attr('id') === 'ggplot2') {

            vegaEmbed("#selectedGraph", vlSpec,{theme: 'ggplot2'});
        }
        else if ($(this).attr('id') === 'quartz') {

            vegaEmbed("#selectedGraph", vlSpec,{theme: 'quartz'});
        }
        else if ($(this).attr('id') === 'vox') {

            vegaEmbed("#selectedGraph", vlSpec,{theme: 'vox'});
        }
        else {
            $(this).attr('checked', false);
            vegaEmbed("#selectedGraph", vlSpec);
        }
    });
    vegaEmbed("#selectedGraph", vlSpec);
    // Embed the visualization in the container with id
    //vegaEmbed("#selectedGraph", vlSpec);
}


function modifGraph(axeX, axeY, typeX, typeY, mark) {

    if (document.getElementById('btn-export')) {
        window.location = "/exportation?axeX="+axeX+"&axeY="+axeY+"&typeX="+typeX+"&typeY="+typeY+"&mark="+mark;

    }
}

// function radioButton(radio){
//     var value;
//     // if (document.getElementById('default').checked) {
//     //     value = document.getElementById('default').value;
//     //     document.getElementById("#selectedGraph").innerHTML = value;
//     // }
//     // else if (document.getElementById('dark').checked) {
//     //     value = document.getElementById('dark').value;
//     //     document.getElementById("#selectedGraph").innerHTML = value;
//     // }
//
//     if(radio.checked && radio.id === "default"){
//         document.getElementById("selectedGraph").innerHTML =vegaEmbed("#selectedGraph", vlSpec);
//     }
//     else if(radio.checked && radio.id === "dark"){
//         document.getElementById("selectedGraph").innerHTML =vegaEmbed("#selectedGraph", vlSpec,{theme: 'dark'});
//     }
// }

