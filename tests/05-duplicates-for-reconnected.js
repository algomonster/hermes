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

describe('Duplicates for reconnected', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Stop receiving messages after unsubscribe', function(done){

        var client = new WebSocketClient();
        var client2 = new WebSocketClient();
        var waitedChannel = 'TEST_CHANNEL_5';
        var message = {channel: 'system', command: 'subscribe', data: {channel: waitedChannel}};

        client.connect(url, null, null, null, null);

        var receivedMessagesCount = 0;

        client.on('connect', function(connection){
            console.log('First connection established successfully.');
            connection.on('message', function (data) {
                receivedMessagesCount++;
                console.log('Connection #1: Message from server received', data);
            });
            // Subscribe to channel
            connection.send(JSON.stringify(message));
            connection.close();
            console.log('Connection aborted.');
            setTimeout(function () {
                client2.connect(url, null, null, null, null);
                client2.on('connect', function(connection2) {
                    console.log('Second connection established successfully.');
                    connection2.on('message', function (data) {
                        receivedMessagesCount++;
                        console.log('Connection #2: Message from server received', data);
                    });

                    connection2.send(JSON.stringify(message));

                    // Send broadcasting message through REST API.
                    var msg = {channel: waitedChannel, data: Math.random()};
                    superagent.post(apiURL + 'messages', msg, function(){});

                    setTimeout(function () {
                        console.log('Received messages count: ' + receivedMessagesCount);
                        assert.equal(1, receivedMessagesCount, 'Only one message should be received');
                        done();
                    }, 1000);
                });
            },50);
        });
    });
});