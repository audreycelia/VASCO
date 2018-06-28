var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var cql = require('compassql');
var csvToJson = require('convert-csv-to-json');
var tooltip = require('vega-tooltip');





/*store the import file in the uploads directory*/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now()+'-' +file.originalname);
        cb(null, 'temp.csv');
    }
});
var upload = multer({storage: storage});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/', (req, res, next) => {
//     res.render('index', { title: 'Express' });
// });

/* GET importation. */
router.get('/importation', function (req, res, next) {
    res.render('importation');
});

/* POST file importation. */
router.post('/importation', upload.single('file'),function (req, res, next) {
    //store the name of the file imported
    var filename=req.body.importfile;

    //for the button "next"
    res.redirect('/selection');
});


/* GET selection. */
router.get('/selection', async function (req, res, next) {


     //Build a data schema.
    var json = convertCsvToJson();
    var schema = cql.schema.build(json);

    var dims = await getAllDimension();

    var results = [];

    for(var i=0;i<dims.length;i++){

        //CompasQL query
        var VegaGraph = {
            "spec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": {"url": "uploads/temp.csv", "format": {type: "csv"}},
                "mark": "?",
                "encodings": [
                    {
                        "channel": "x",
                        "field": dims[i].axeX,
                        "type": dims[i].typeX
                    },{
                        "channel": "y",
                        "field":dims[i].axeY,
                        "type": dims[i].typeY
                    }
                ]
            },
            "chooseBy": "effectiveness"
        };

        var output = cql.recommend(VegaGraph, schema);
        var result = output.result; // recommendation result
        results.push(result);
    }
    var dataFile = getDetailsFile();

    //Send to the client side
    res.render('selection' ,{keyDim: dataFile, keyResult: results});

});





/* GET modification. */
router.get('/modification', function (req, res, next) {

    //Build a data schema.
    var json = convertCsvToJson();
    var schema = cql.schema.build(json);

    var mark = req.query.mark;
    var typeX = req.query.typeX;
    var typeY = req.query.typeY;
    var fieldX = req.query.axeX;
    var fieldY = req.query.axeY;


        //CompasQL query
        var VegaGraph = {
            "spec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": {"url": "uploads/temp.csv", "format": {type: "csv"}},
                "mark": mark,
                "encodings": [
                    {
                        "channel": "x",
                        "field": fieldX,
                        "type": typeX
                    },{
                        "channel": "y",
                        "field":fieldY,
                        "type": typeY
                    }
                ]
            },
            "chooseBy": "effectiveness"
        };



        var output = cql.recommend(VegaGraph, schema);
        var result = output.result; // recommendation result


    res.render('modification', { keySelectedGraph: result});
});


/* GET exportation. */
router.get('/exportation', function (req, res, next) {

    //Build a data schema.
    var json = convertCsvToJson();
    var schema = cql.schema.build(json);

    var mark = req.query.mark;
    var typeX = req.query.typeX;
    var typeY = req.query.typeY;
    var fieldX = req.query.axeX;
    var fieldY = req.query.axeY;


    //CompasQL query
    var VegaGraph = {
        "spec": {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv", "format": {type: "csv"}},
            "mark": mark,
            "encodings": [
                {
                    "channel": "x",
                    "field": fieldX,
                    "type": typeX
                },{
                    "channel": "y",
                    "field":fieldY,
                    "type": typeY
                }
            ]
        },
        "chooseBy": "effectiveness"
    };

    var output = cql.recommend(VegaGraph, schema);
    var result = output.result; // recommendation result

    res.render('exportation',{ keyExportedGraph: result});
});


//take only one data in my csv file
function getOneData(randNum) {
    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    file = file.split('\n');

    //take only the line 1
    var line = file[1].split(',');

   return line[randNum];
}

function getNameOfAllDim(){
    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    file = file.split('\n');
    //take only the line 1
    var line = file[0].split(',');
    return line;
}


function convertCsvToJson() {
    let fileInputName = './uploads/temp.csv';
    let content = fs.readFileSync(fileInputName, 'utf8');
    content=content.replace(/\\r/g,"");
    fs.writeFileSync(fileInputName,content);


    //print number as number and not in string
    csvToJson.formatValueByType().getJsonFromCsv(fileInputName);

    //as default delimiter is ; so we set as ,
    var test=  csvToJson.fieldDelimiter(';').getJsonFromCsv(fileInputName);


    let json = csvToJson.getJsonFromCsv('./uploads/temp.csv');


    console.log(json)
    return json;

}



function checkTypeGraph(randNum) {

    var val = getOneData(randNum);

    if (isNaN(val)){
        var type = "ordinal";
    } else
        var type = "quantitative";

    return type;
}

async function getAllDimension() {

    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    file = file.split('\n');
    //take only the header
    var arrayOfHeader = file[0].split(',');

    var dims=[];

    for(var index = 0;index<arrayOfHeader.length;index++){

        for (var index2 = index+1; index2<arrayOfHeader.length;index2++){
            x=index;
            y=index2;

                var dim = {
                    axeX : arrayOfHeader[x],
                    axeY :arrayOfHeader[y],
                    typeX: checkTypeGraph(x),
                    typeY: checkTypeGraph(y)
                };

            //add in the array
            dims.push(dim);
        }
    }
    return dims;
}

function getDetailsFile(){

    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    //tab
    file = file.split('\n');

    //display name of headers
    var arrayOfHeader = file[0].split(',');

    file.splice(0,1);

    //put my csv in array
    for(var i= 0;i<file.length;i++){
        file[i] =file[i].split(',');
    }

    //display the element of line
    var tabCsv =[];

    //display the element of column
    for(var y= 0;y<file[0].length;y++){

        //give all the name of the header on the column 0
        tabCsv[y]=[];
        tabCsv[y][0] = arrayOfHeader[y];

        var sum=0;
        var avg=0 ;


        //display the element of line
        for(var i= 0;i<file.length;i++){

            var value =file[i][y];
            //check number
            if (!isNaN(value)){
                var type = "quantitative";
                sum+=parseFloat(value);
                avg = sum/file.length;

            } else{
                var type = "ordinal";


            }
            var length =file[0].length;

        }

        tabCsv[y][1] = type;

        //Sum if decimal number show only two decimals
        var temp = (sum - Math.floor(sum)) !== 0;

        if (temp){
            //take only two decimals
            var truncatedSum = Math.floor(sum * 100) / 100;
            tabCsv[y][2] = truncatedSum;
        }
        else {
            tabCsv[y][2] = sum;
        }

        //Avg if decimal number show only two decimals
        var tempAvg = (avg - Math.floor(avg)) !== 0;

        if (tempAvg){
            //take only two decimals
            var truncatedAvg = Math.floor(avg * 100) / 100;
            tabCsv[y][3] = truncatedAvg;
        }
        else {
            tabCsv[y][3] = avg;
        }



    }


    return tabCsv;

}

module.exports = router;
