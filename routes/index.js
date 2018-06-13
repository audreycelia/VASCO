var express = require('express');
var router = express.Router();
//var datalib = require('datalib');
var multer = require('multer');
var csv = require('csv-parser');
var fs = require('fs');
var cql = require('compassql');
var csvToJson = require('convert-csv-to-json');



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
    //console.log(filename);

    //for the button "next"
    res.redirect('/selection');
});


//var dataFile = 'uploads/temp.csv'

/* GET selection. */
router.get('/selection', async function (req, res, next) {

    var opt = {};
    var schema = cql.schema.build(csvToJson, opt);



    var headerX = await getDim(1);
    var headerY = await getDim(3);

    var VegaGraph = {
        "spec": {
            "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
            "data": {"url": "uploads/temp.csv", "format": {type: "csv"}},
            "mark": "?",
            "encodings": [
                {
                    "channel": "x",
                    "field": headerX.name,
                    "type": headerX.type
                },{
                    "channel": "y",
                    "field": headerY.name,
                    "type": headerY.type
                }
            ]
        },
        "chooseBy": "effectiveness"
    };

    var output = cql.recommend(VegaGraph, schema);
    var result = output.result; // recommendation result

    var vlTree = cql.result.mapLeaves(result, function(item) {
        return item.toSpec();
    });


    var topVlSpec = vlTree.items[0];
    document.querySelector('#query').innerHTML =  JSON.stringify(VegaGraph, null, 2);
    document.querySelector('#spec').innerHTML =  JSON.stringify(topVlSpec, null, 2);

    var nameOfAllDim = getNameOfAllDim();

    //Send to the client side
    res.render('selection' ,{keyGraph: VegaGraph, keyDim: nameOfAllDim});

});





/* GET modification. */
router.get('/modification', function (req, res, next) {
    res.render('modification');
});

/* GET exportation. */
router.get('/exportation', function (req, res, next) {
    res.render('exportation');
});



function getDim(nb){
    //put in syncron
    return new Promise(function(resolve, reject){

        //get information from the csv file
        fs.createReadStream('./uploads/temp.csv')
            .pipe(csv())
            //.on('data', function (data) {
                //console.log('Name: %s Calories: %s ',data.Manufacturer, data.Calories)
                //console.log( data)
           // })

            //get the dimension (header)
            .on('headers', function (headerList) {
                //console.log('List of all headers: %s', headerList)
                //Get the first header
                //console.log('First header: %s', headerList[nb])

                var val = getOneData(nb);

                if (isNaN(val)){
                    var type = "ordinal";
                } else
                    var type = "quantitative";

                //tab
                var resultat = {
                    name:headerList[nb],
                    type: type
                }
                resolve(resultat);
            })
    });




}

//take only one data in my csv file
function getOneData(col) {

    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    file = file.split('\n');

    //take only the line 1
    var line = file[1].split(',')

    //choose which column of the row
    console.log(line[col]);
   return line[col];
}

function getNameOfAllDim(){
    var file = fs.readFileSync('./uploads/temp.csv', 'utf8');
    //split into a tab
    file = file.split('\n');
    //take only the line 1
    var line = file[0].split(',')
    return line;
}


function csvToJson() {

    let fileInputName = './uploads/temp.csv';

    //print number as number and not in string
    csvToJson.formatValueByType().getJsonFromCsv(fileInputName);

    //as default delimiter is ; so we set as ,
    csvToJson.fieldDelimiter(',') .getJsonFromCsv(fileInputName);

    let json = csvToJson.getJsonFromCsv('./uploads/temp.csv');


    return json
}








module.exports = router;
