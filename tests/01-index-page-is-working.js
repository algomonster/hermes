var assert = require('assert');
var superagent = require('superagent');
var server = require('../app.js');
var status = require('http-status');

var config = require('config');
var proto = config.has('Server.SSL') && config.get('Server.SSL') ? 'https' : 'http';
var domain = config.get('Server.domain');

describe('Messages API', function() {

    before(function() {
        server.listen(config.get('Server.port'));
    });

    after(function() {
    });

    it('Returns 422 if channel parameter is missing', function(done) {
        var url = proto + '://' + domain + ':' + config.get('Server.port') + '/messages';
        console.log('URL', url);
        superagent.post(url).end(function(err, res) {
            assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
            var result = JSON.parse(res.text);
            assert.deepEqual({ error: 'Channel must be specified' }, result);
            done();
        });
    });
});