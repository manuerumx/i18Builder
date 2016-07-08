var express = require('express');
var router = express.Router();
var initCtrl = require('../controllers/init');

router.get('/', initCtrl.init);

module.exports = router;
