var express = require('express');
var router = express.Router();
var pubsub = require('node-internal-pubsub');
var publisher = pubsub.createPublisher();
var status = require('http-status');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('Access denied to messages list');
});

router.post('/', function (req, res) {
    if (typeof req.body.channel !== 'undefined' && req.body.channel){
        var channelName = req.body.channel;
        var messageData = req.body;
        var messageString = JSON.stringify(messageData);
        console.log('REST API publishes new message to channel [%s]', channelName, messageString);
        publisher.publish(channelName , messageString);
        res.send('Message published to channel [' + channelName + ']');
    } else {
        return res.status(status.UNPROCESSABLE_ENTITY) . json({ error: 'Channel must be specified' });
    }
});

module.exports = router;
