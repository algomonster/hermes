var assert = require('assert');
var server = require('../app.js');
var WebSocketClient = require('websocket').client;
var superagent = require('superagent');

var url = 'ws://localhost:4000/comet/websocket';
var apiURL = 'http://localhost:4000/';

describe('WebSockets connections', function() {

    before(function() {
        server.listen(4000);
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
        client = new WebSocketClient();
        var signal = {channel: 'TEST_CHANNEL', rate: Math.random()};

        client.connect(url, null, null, null, null);
        client.on('connect', function(connection){
            connection.on('message', function(data){
                var utf8Data = data.utf8Data;
                var receivedData = {};
                console.log('Message received: ' + utf8Data);

                try{
                    receivedData = JSON.parse(utf8Data);
                } catch (e){
                    console.log('Message skipped because not JSON object. ' + e);
                }

                if ('channel' in receivedData){
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