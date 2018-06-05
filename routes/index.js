var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET importation. */
router.get('/importation', function (req, res, next) {
    res.render('importation');
});

/* GET selection. */
router.get('/selection', function (req, res, next) {
    res.render('selection');
});

/* GET modification. */
router.get('/modification', function (req, res, next) {
    res.render('modification');
});

/* GET modification. */
router.get('/exportation', function (req, res, next) {
    res.render('exportation');
});


module.exports = router;
