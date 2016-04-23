var assert = require('assert');
var server = require('../app.js');
var WebSocketClient = require('websocket').client;
var superagent = require('superagent');
var config = require('config');


var proto = config.has('Server.SSL') && config.get('Server.SSL') ? 'https' : 'http';
var wsProto = config.has('Server.SSL') && config.get('Server.SSL') ? 'wss' : 'ws';
var domain = config.get('Server.domain');
var url = wsProto + '://' + domain + ':' + config.get('Server.port') + '/comet/websocket';
var apiURL = proto + '://' + domain + ':' + config.get('Server.port') + '/';

describe('History retrieving through REST API', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Try GET request to /history/<channel>', function(done){
        var channel = 'TEST_CHANNEL_6';
        var message = {channel: channel, data: Math.random()};
        // Send message through REST API after
        superagent.post(apiURL + 'messages', message, function(){
            // Get messages history
            superagent.get(apiURL + 'history/' + channel).end(function (err, res) {
                if (err) {
                    throw err;
                } else {
                    var history = JSON.parse(res.text);
                    var receivedMessage = history[0];
                    assert.equal(receivedMessage.channel, message.channel);
                    assert.equal(receivedMessage.data, message.data);
                    done();
                }
            });
        });
    });
});