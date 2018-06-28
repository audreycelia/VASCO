$(document).ready(function () {

    exportedGraphVegaLite();


});

function exportedGraphVegaLite() {

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
            "tooltip":
                {"field": fieldX, "type": test.encodings[0].type}
        },

    };

    //get value of the design color
    var url_string =  window.location.href;
    var url = new URL(url_string);
    var design = url.searchParams.get("design");


    // Embed the visualization in the container with id
   vegaEmbed("#exportedGraph", vlSpec, {theme:design});


}



