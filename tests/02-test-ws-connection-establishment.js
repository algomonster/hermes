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

describe('WebSockets connections', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Accepts WebSockets connections on route: ' + url, function(done) {
        client = new WebSocketClient();
        client.connect(url, null, null, null, null);
        client.on('connect', function(){
            done();
        });
    });

    it('Receives message sent via REST API', function(done){
        var client = new WebSocketClient();
        var channel = 'TEST_CHANNEL_2';
        var signal = {channel: channel, rate: Math.random()};

        client.connect(url, null, null, null, null);
        client.on('connect', function(connection){

            var message = {channel: 'system', command: 'subscribe', data: {channel: channel}};

            connection.send(JSON.stringify(message));

            connection.on('message', function(data){
                var utf8Data = data.utf8Data;
                var receivedData = {};
                console.log('Message received: ' + utf8Data);

                try{
                    receivedData = JSON.parse(utf8Data);
                } catch (e){
                    console.log('Message skipped because not JSON object. ' + e);
                }

                if ('channel' in receivedData && receivedData.channel == channel){
                    delete receivedData['serverTime'];
                    assert.deepEqual(signal, receivedData);
                    done();
                }
            });

            // Send message through REST API after
            superagent.post(apiURL + 'messages', signal, function(){

            });
        });

    });
});