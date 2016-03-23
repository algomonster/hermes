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

describe('Subscription', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Receiving messages only from specified channel', function(done){

        this.timeout(10000);

        var client = new WebSocketClient();

        var waitedMessagesCount = 0;
        var receivedMessageCount = 0;
        var waitedChannel = 'TEST_CHANNEL_3';
        var messages = [];

        for(var i = 0; i < 200; i++){
            var channel = Math.random() > 0.5 ? waitedChannel : waitedChannel + '_' + Math.random();
            if (channel == waitedChannel) {
                waitedMessagesCount++;
            }
            messages.push({channel: channel, data: null});
        }

        client.connect(url, null, null, null, null);
        client.on('connect', function(connection){

            connection.on('message', function(data){
                try{
                    var receivedData = JSON.parse(data.utf8Data);
                } catch (e){
                    console.log('Message skipped because not JSON object. ' + e);
                }
                receivedMessageCount++;
                assert.deepEqual(receivedData.channel, waitedChannel);

                if (receivedMessageCount == waitedMessagesCount) {
                    done();
                }
            });

            for(var i = 0; i < messages.length; i++){
                superagent.post(apiURL + 'messages', messages[i], function(){
                });
            }
        });

    });
});