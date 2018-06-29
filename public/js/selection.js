$(document).ready(function () {

    $(window).on('load', function() {
        $("#cover").hide();
    });

    vegaLite();
    singleGraph();
    $('select').formSelect();
    applyFilter();
});

function vegaLite() {

    for (var i = 0; i < results.length; i++) {

        var result = results[i];
        var test = result.items[0]._spec;
        var fieldX = test.encodings[0].field;
        var fieldY = test.encodings[1].field;

        vlSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv"},
            "mark": test.mark,
            "encoding": {
                "x": {
                    "field": fieldX,
                    "type": test.encodings[0].type,
                },
                "y": {
                    "field": fieldY,
                    "type": test.encodings[1].type
                },
                "tooltip":
                    {"field": fieldX, "type": test.encodings[0].type}

            }
        };
        // Embed the visualization in the container with id `vis`
        vegaEmbed("#vis" + i, vlSpec);
    }
}

function singleGraph() {

    for (var i = 0; i < dataFile.length; i++) {

        var dim = dataFile[i];
        var value = dim[0];
        var type = dim[1];

        singleSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv"},
            "mark": "point",
            "encoding": {
                "x": {
                    "field": value,
                    "type": type
                }
            }
        };
        // Embed the visualization in the container with id `vis`
        vegaEmbed("#single" + i, singleSpec);
    }
}

function applyFilter() {
    var selector = document.getElementById('select-filter');
    var value = selector[selector.selectedIndex].value;
    createGraphFilter(value);
}


function createGraphFilter(value) {

    if (value === "") {
        $(".resize-graph").show();
        return
    }
    else if (value === "all"){
        $(".resize-graph").show();
        return
    }

    for (var i = 0; i < results.length; i++) {

        var result = results[i];
        var test = result.items[0]._spec;


        if (test.encodings[0].field === value) {
            $("#graphFilter" + i).show();
        }
        else if (test.encodings[1].field === value) {
            $("#graphFilter" + i).show();
        }
        else {
            $("#graphFilter" + i).hide();
        }

    }


}


function selectGraph(axeX, axeY, typeX, typeY, mark) {
        axeX=axeX.replace(/%/g,"%25");
        axeY=axeY.replace(/%/g,"%25");
        window.location = "/modification?axeX="+axeX+"&axeY="+axeY+"&typeX="+typeX+"&typeY="+typeY+"&mark="+mark;
}