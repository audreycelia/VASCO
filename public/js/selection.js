$(document).ready(function () {
    vegaLite();

});

function vegaLite() {

    // Embed the visualization in the container with id `vis`
    // vegaEmbed("#vis", VegaGraph);
    //

    console.log(result.items[0]._spec);
    var test = result.items[0]._spec;

    vlSpec2 = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {"url": "uploads/temp.csv"},
        "mark": test.mark,
        "encoding": {
            "x": {
                "field": test.encodings[0].field,
                "type": test.encodings[0].type
            },
            "y": {
                "field": test.encodings[1].field,
                "type":test.encodings[1].type
            }
        }
    };
    //
    //
    //
    //
    // vegaEmbed("#vis2", vlSpec2);

    vegaEmbed("#vis2", vlSpec2);

}


