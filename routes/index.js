var express = require('express');
var router = express.Router();
//var datalib = require('datalib');
var multer = require('multer');



/*store the import file in the uploads directory*/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ '.csv')
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
    var filename=req.body.importfile;

    res.redirect('/selection');
});



/* GET selection. */
router.get('/selection', function (req, res, next) {
    res.render('selection');
});

/* GET modification. */
router.get('/modification', function (req, res, next) {
    res.render('modification');
});

/* GET exportation. */
router.get('/exportation', function (req, res, next) {
    res.render('exportation');
});


module.exports = router;
