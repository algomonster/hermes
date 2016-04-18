var express = require('express');
var router = express.Router();
var path = require('path');

/* GET client page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../views/client.html'));
});

module.exports = router;
