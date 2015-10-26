var server = require('../app.js');
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var url = 'ws://localhost:4000/comet/websocket';

describe('WebSockets connections', function() {

    before(function() {
        server.listen(4000);
    });

    after(function() {
    });

    it('Accepts WebSockets connections on route: ' + url, function(done) {
        client.connect(url, null, null, null, null);
        client.on('connect', function(connection){
            done();
        });
    });
});