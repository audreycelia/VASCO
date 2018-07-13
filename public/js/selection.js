$(document).ready(function () {

    //freeze while everything is ready
    $(window).on('load', function() {
        $("#cover").hide();
    });

    vegaLite();
    singleGraph();
    $('select').formSelect();
    applyFilter();

    tableResponsive();

});

/*RESPONSIVE RESUM TABLE*/
function tableResponsive() {

    var $table = $('#resum-table'),
        $bodyCells = $table.find('tbody tr:first').children(),
        colWidth;

    $table.addClass('scroll');

    // Adjust the width of thead cells when window resizes
    $(window).resize(function () {

        // Get the tbody columns width array
        colWidth = $bodyCells.map(function () {
            return $(this).width();
        }).get();

        // Set the width of thead columns
        $table.find('thead tr').children().each(function (i, v) {
            $(v).width(colWidth[i]);
        });

    }).resize(); // Trigger resize handler
}



/*CREATE ALL THE GRAPH WITH VEGA-LITE*/
function vegaLite() {

    for (var i = 0; i < results.length; i++) {

        //variable
        var result = results[i];
        var path = result.items[0]._spec;
        var dataFile = result.items[0]._spec.data.url;
        var fieldX = path.encodings[0].field;
        var fieldY = path.encodings[1].field;

        vlSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": dataFile},
            "mark": path.mark,
            "encoding": {
                "x": {
                    "field": fieldX,
                    "type": path.encodings[0].type,
                },
                "y": {
                    "field": fieldY,
                    "type": path.encodings[1].type
                }
            }
        };
        // Embed the visualization in the container with id `vis`
        vegaEmbed("#vis" + i, vlSpec);
    }
}

/*DISPLAY HISTOGRAMME IN THE RESUME TAB*/
function singleGraph() {
    for (var i = 0; i < dataFile.length; i++) {

            //variable
            var result = results[i];
            var data = result.items[0]._spec.data.url;
            var dim = dataFile[i];
            var value = dim[0];
            var type = dim[1];

            singleSpec = {
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": {"url": data},
                "mark": "bar",
                "encoding": {
                    "x": {
                        "bin": true,
                        "field": value,
                        "type": type
                    },
                    "y": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            };
            // Embed the visualization in the container with id `vis`
            vegaEmbed("#single" + i, singleSpec);
    }
}

/*APPLY THE FILTER SELECTED BY THE USER*/
function applyFilter() {
    //apply filter when selected
    document.getElementById('select-filter').addEventListener('change', function() {
        var selector = document.getElementById('select-filter');
        var value = selector[selector.selectedIndex].value;
        createGraphFilter(value);
    });

}

/*DISPLAY FILTERED GRAPH*/
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

/*SEND IN THE URL SOME PARAMETER*/
function selectGraph(axeX, axeY, typeX, typeY, mark) {
        axeX=axeX.replace(/%/g,"%25");
        axeY=axeY.replace(/%/g,"%25");
        window.location = "/modification?axeX="+axeX+"&axeY="+axeY+"&typeX="+typeX+"&typeY="+typeY+"&mark="+mark;
}

