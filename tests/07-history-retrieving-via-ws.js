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

    it('Receiving messages only from specified channel', function(done){

        var client = new WebSocketClient();
        var testChannel = 'TEST_CHANNEL_7';

        client.connect(url, null, null, null, null);
        client.on('connect', function(connection){

            // Send some message to our test channel
            var testMessage = {channel: testChannel, data: Math.random()};
            connection.send(JSON.stringify(testMessage));

            // Require history for our test channel
            var systemMessage = {channel: 'system', command: 'history', data: {channel: testChannel}};
            connection.send(JSON.stringify(systemMessage));

            connection.on('message', function(data){
                try{
                    var history = JSON.parse(data.utf8Data);
                    var lastMessage = history[0];
                    assert.equal(lastMessage.channel, testMessage.channel);
                    assert.equal(lastMessage.data, testMessage.data);
                    done();
                } catch (e){
                    // Skip messages with invalid JSON
                }
            });
        });

    });
});