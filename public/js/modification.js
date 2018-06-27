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


        // Embed the visualization in the container with id
        vegaEmbed("#selectedGraph", vlSpec);
}

function exportGraph(axeX, axeY, typeX, typeY, mark) {

    if (document.getElementById('btn-export')) {
        window.location = "/exportation?axeX="+axeX+"&axeY="+axeY+"&typeX="+typeX+"&typeY="+typeY+"&mark="+mark;

    }
}