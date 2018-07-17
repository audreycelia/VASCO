var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var cql = require('compassql');
var csvToJson = require('convert-csv-to-json');
var tooltip = require('vega-tooltip');
var path = require('path');
const rimraf = require('rimraf');


//delete file inside uploads after one day
const directory = 'uploads';
fs.readdir(directory, function(err, files) {
    files.forEach(function(file, index) {
        fs.stat(path.join(directory, file), function(err, stat) {
            var endTime, now;
            if (err) {
                return console.error(err);
            }
            now = new Date().getTime();
            endTime = new Date(stat.ctime).getTime() + 86400000;
            if (now > endTime) {
                return rimraf(path.join(directory, file), function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('successfully deleted');
                });
            }
        });
    });
});


/*store the import file in the uploads directory*/
var name;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        //var name = Date.now()+'-' +file.originalname;
        name =  "temp" + Date.now() + ".csv";
        cb(null, name);
    }
});
var upload = multer({storage: storage});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET importation. */
router.get('/importation', function (req, res, next) {
    res.render('importation');
});

/* POST file importation. */
router.post('/importation', upload.single('file'),function (req, res, next) {

    //store the name of the file imported

        var uploadedFile = name;
        req.session.filename = uploadedFile;
    //for the button "next"
    res.redirect('/selection');
});


/* GET selection. */
router.get('/selection', async function (req, res, next) {

     //Build a data schema.
    var json = convertCsvToJson(req.session.filename);
    var schema = cql.schema.build(json);

    var dims = await getAllDimension(req.session.filename);

    var results = [];

    for(var i=0;i<dims.length;i++){

        //CompasQL query
        var VegaGraph = {
            "spec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": {
                    "url": "uploads/" + req.session.filename,
                    "format": {type: "csv"}
                    },
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
    var dataFile = await getDetailsFile(req.session.filename);

    //get number of line
    var file = fs.readFileSync("./uploads/" + req.session.filename, 'utf8');
    file = file.split('\n');
    file.splice(0,1);

    var fileLength = file.length;

    //Send to the client side
    res.render('selection' ,{keyDim: dataFile, keyResult: results, keyLength: fileLength});

});



/* GET modification. */
router.get('/modification', function (req, res, next) {

    //Build a data schema.
    var json = convertCsvToJson(req.session.filename);
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
                "data": {"url": "uploads/" + req.session.filename, "format": {type: "csv"}},
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
    var json = convertCsvToJson(req.session.filename);
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
            "data": {"url": "uploads/" + req.session.filename, "format": {type: "csv"}},
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
function getOneData(randNum, filename) {
    var file = fs.readFileSync("./uploads/" + filename, 'utf8');
    //split into a tab
    file = file.split('\n');

    //take only the line 1
    var line = file[1].split(',');

   return line[randNum];
}



function convertCsvToJson(filename) {
    let fileInputName = "./uploads/" + filename;
    let content = fs.readFileSync(fileInputName, 'utf8');
    content=content.replace(/\\r/g,"");
    fs.writeFileSync(fileInputName,content);

    //print number as number and not in string
    csvToJson.formatValueByType().getJsonFromCsv(fileInputName);

    //as default delimiter is ; so we set as ,
    var test=  csvToJson.fieldDelimiter(';').getJsonFromCsv(fileInputName);

    let json = csvToJson.getJsonFromCsv("./uploads/" + filename);

    return json;
}



function checkTypeGraph(randNum, filename) {

    var val = getOneData(randNum, filename);

    if (isNaN(val)){
        var type = "ordinal";
    } else
        var type = "quantitative";

    return type;
}

async function getAllDimension(filename) {

    var file = fs.readFileSync("./uploads/" + filename, 'utf8');
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
                    typeX: checkTypeGraph(x, filename),
                    typeY: checkTypeGraph(y, filename)
                };

            //add in the array
            dims.push(dim);
        }
    }
    return dims;
}


async function getDetailsFile(filename){

    var file = fs.readFileSync("./uploads/" + filename, 'utf8');
    //split into a tab
    //tab
    file = file.split('\n');


    //replace empty val by 0
    for(var f= 0;f<file.length;f++) {
            file[f] = file[f].replace(',,', ',0,');
    }


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
        var avg=0;
        var min=1000000000000;
        var max=0;

        //display the element of line
        for(var i= 0;i<file.length;i++){

            // var value = file[i][y];
            //
            //     //check number
            //     if (!isNaN(value)){
            //         var parseValue = parseFloat(value);
            //
            //         var type = "quantitative";
            //         sum += parseValue;
            //         avg = sum/file.length;
            //
            //
            //         if(parseValue < min){
            //             min = parseValue;
            //         }
            //         if (parseValue > max){
            //             max = parseValue;
            //         }
            //     }
            //     else if (isNaN(value))
            //     {
            //         var type = "ordinal";
            //         sum =0;
            //         avg=0;
            //     }


            var value = file[i][y];

            var type = "ordinal";


            //check number
            if (!isNaN(value)){
                var parseValue = parseFloat(value);

                type = "quantitative";
                sum += parseValue;
                avg = sum/file.length;


                if(parseValue < min){
                    min = parseValue;
                }
                if (parseValue > max){
                    max = parseValue;
                }
            }

                //min and max
                if (!isNaN(value)){

                    if(value < min){
                        min = value;
                    }
                    if (value > max){
                        max = value;
                    }
                }


        }
        tabCsv[y][1] = type;
        console.log(tabCsv[y][1])

        //Intl.NumberFormat().format --> add seperate to number
        tabCsv[y][4] = Intl.NumberFormat().format(min);
        tabCsv[y][5] = Intl.NumberFormat().format(max);


        //Sum if decimal number show only two decimals
        var temp = (sum - Math.floor(sum)) !== 0;
        if (temp){
            //take only two decimals
            var truncatedSum = Math.floor(sum * 100) / 100;
            tabCsv[y][2] = Intl.NumberFormat().format(truncatedSum);
        }
        else {
            tabCsv[y][2] = Intl.NumberFormat().format(sum);

        }


        //Avg if decimal number show only two decimals
        var tempAvg = (avg - Math.floor(avg)) !== 0;
        if (tempAvg){
            //take only two decimals
            var truncatedAvg = Math.floor(avg * 100) / 100;
            tabCsv[y][3] = Intl.NumberFormat().format(truncatedAvg);
        }
        else {
            tabCsv[y][3] = Intl.NumberFormat().format(avg);
        }
    }
    return tabCsv;
}


module.exports = router;
