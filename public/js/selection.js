$(document).ready(function () {
    vegaLite();
    singleGraph();
    $('select').formSelect();
});

    function vegaLite() {

        for(var i =0;i<results.length;i++){

            var result=results[i];
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
                        "field":fieldY,
                        "type":test.encodings[1].type
                    },
                }
            };


            // Embed the visualization in the container with id `vis`
            vegaEmbed("#vis"+i, vlSpec);
        }

    }

function singleGraph() {

    for(var i =0;i<dataFile.length;i++){

        var dim=dataFile[i];
        var value = dim[0];
        var type = dim[1];

        singleSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv"},
            "mark": "point",
            "encoding": {
                "x": {
                    "field": value,
                    "type": type,
                }
            }
        };


        // Embed the visualization in the container with id `vis`
        vegaEmbed("#single"+i, singleSpec);
    }

}




