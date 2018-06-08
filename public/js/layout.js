$(document).ready(function () {

    currentState();
    $('.sidenav').sidenav();

    vegaLite();
});


function currentState() {

    var pathname = new URL(window.location.href).pathname;

    //$('.nav-wrapper a[href=\''+pathname+'\']').addClass('current-state');

    $('.arrows a[href=\''+pathname+'\']').addClass('current-state');
}

function vegaLite() {

    // Assign the specification to a local variable vlSpec.
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "data": {
            "values": [
                {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
                {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
                {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
            ]
        },
        "mark": "bar",
        "encoding": {
            "y": {"field": "a", "type": "nominal"},
            "x": {
                "aggregate": "average", "field": "b", "type": "quantitative",
                "axis": {
                    "title": "Average of b"
                }
            }
        }
    };

    // Embed the visualization in the container with id `vis`
    vegaEmbed("#vis", vlSpec);
}