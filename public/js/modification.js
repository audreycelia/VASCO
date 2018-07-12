$(document).ready(function () {
    selectedGraphVegaLite();
});

/*GET AND DISPLAY THE GRAPH SELECTED */
function selectedGraphVegaLite() {

    //variables
    var data = result.items[0]._spec.data.url;
    var path = result.items[0]._spec;
    var fieldX = path.encodings[0].field;
    var fieldY = path.encodings[1].field;

    //Vega-lite structure
    vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {"url": data},
        "mark": path.mark,
        "encoding": {
            "x": {
                "field": fieldX,
                "type": path.encodings[0].type
            },
            "y": {
                "field": fieldY,
                "type": path.encodings[1].type
            },
            "tooltip": [
                {"field": fieldX, "type": path.encodings[0].type},
                {"field": fieldY, "type": path.encodings[1].type}
            ]
        }
    };

    //APPLY FILTER FROM VEGA-TOOLBOX
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

    // Embed the visualization in the container with id
    vegaEmbed("#selectedGraph", vlSpec);

}

/*SEND IN THE URL SOME PARAMETER*/
function modifGraph(axeX, axeY, typeX, typeY, mark) {

    //value of the radio button
    var designColor = getRadioVal(document.getElementById('form-modif'), 'input' );


    if (document.getElementById('btn-export')) {
        axeX=axeX.replace(/%/g,"%25");
        axeY=axeY.replace(/%/g,"%25");
        window.location = "/exportation?axeX="+axeX+"&axeY="+axeY+"&typeX="+typeX+"&typeY="+typeY+"&mark="+mark+"&radio="+"&design="+designColor;

    }
}

/*GET THE VALUE OF THE RADIOBUTTON*/
function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}