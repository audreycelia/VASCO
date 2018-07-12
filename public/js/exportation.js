$(document).ready(function () {
    exportedGraphVegaLite();


    //hide button "open in vega editor"
    $('div.vega-actions').each(function(){
        $(this).children("a:nth-child(4)").remove();
    });
});

/*DISPLAY THE GRAPH*/
function exportedGraphVegaLite() {

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
        },

    };

    //get value of the design color
    var url_string =  window.location.href;
    var url = new URL(url_string);
    var design = url.searchParams.get("design");


    // Embed the visualization in the container with id
   vegaEmbed("#exportedGraph", vlSpec, {theme:design});
}


