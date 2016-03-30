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

describe('Unsubscribe', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Stop receiving messages after unsubscribe', function(done){

        var client = new WebSocketClient();
        var waitedChannel = 'TEST_CHANNEL_4';

        client.connect(url, null, null, null, null);

        client.on('connect', function(connection){

            // Subscribe to wanted channel
            var receivedMessagesCount = 0;
            var message = {channel: 'system', command: 'subscribe', data: {channel: waitedChannel}};
            connection.send(JSON.stringify(message));

            connection.on('message', function(){
                // We got first message and just now should unsubscribe from channel
                if (!receivedMessagesCount++) {
                    var message = {channel: 'system', command: 'unsubscribe', data: {channel: waitedChannel}};
                    connection.send(JSON.stringify(message));

                    var message = {channel: waitedChannel, data: Math.random()};
                    superagent.post(apiURL + 'messages', message, function(){});

                    setTimeout(done, 100);
                } else {
                    // We got second message at least, and it is wrong behavior.
                    assert.deepEqual(0, 1);
                }

            });

            var msg = {channel: waitedChannel, data: Math.random()};
            superagent.post(apiURL + 'messages', msg, function(){});
        });

    });
});