var express = require('express');
var router = express.Router();
var status = require('http-status');
var core = new (require('../core'))();

router.get('/', function(req, res) {
    res.send('Channel must be specified');
});

router.param('channel', function(req, res, next, channel) {
    console.log('We got channel parameter with value [' + channel + ']');
    req.channel = channel;
    next();
});


router.get('/:channel', function (req, res) {
    var history = core.getHistory(req.channel);
    res.send(JSON.stringify(history));
});

module.exports = router;
