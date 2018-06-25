$(document).ready(function () {
    vegaLite();

});

function vegaLite() {

    for(var i =0;i<results.length;i++){

        var result=results[i];
        var test2 = result.items[0]._spec;

        var fieldX = test2.encodings[0].field;
        var fieldY = test2.encodings[1].field;



        vlSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv"},
            "mark": test2.mark,
            "encoding": {
                "x": {
                    "field": fieldX,
                    "type": test2.encodings[0].type,
                },
                "y": {
                    "field":fieldY,
                    "type":test2.encodings[1].type
                },
            }
        };


        // Embed the visualization in the container with id `vis`
        vegaEmbed("#vis"+i, vlSpec);
    }



}


