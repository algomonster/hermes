var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Access denied to messages list');
});

router.post('/', function (req, res) {
    res.send(JSON.stringify(req.body));
});

module.exports = router;
