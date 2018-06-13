$(document).ready(function () {


    vegaLite();

});

function vegaLite() {
    // Assign the specification to a local variable vlSpec.
    // Embed the visualization in the container with id `vis`
    vegaEmbed("#vis", VegaGraph);

    vlSpec2 = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": {"url": "uploads/temp.csv"},
        //"data":{"name": "values"},
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "Manufacturer",
                "type": "ordinal"
            },
            "y": {
                "field": "Calories",
                "type": "quantitative"
            }
        }
    };

    vegaEmbed("#vis2", vlSpec2);
}