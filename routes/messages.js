var express = require('express');
var router = express.Router();
var pubsub = require('node-internal-pubsub');
var publisher = pubsub.createPublisher();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Access denied to messages list');
});

router.post('/', function (req, res) {
    //res.send(JSON.stringify(req.body));
    if (typeof req.body.channel !== 'undefined' && req.body.channel){
        var channelName = 'channel:' + req.body.channel;
        var messageData = req.body;
        delete messageData.channel;
        var messageString = JSON.stringify(messageData);
        console.log('REST API publishes new message to channel', channelName, messageString);
        publisher.publish(channelName , messageString);
        res.send('Message published to channel [' + channelName + ']');
    } else {
        res.send('Channel must be specified.');
    }
});

module.exports = router;
