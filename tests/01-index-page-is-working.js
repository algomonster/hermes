var assert = require('assert');
var superagent = require('superagent');
var server = require('../app.js');
var status = require('http-status');

describe('Messages API', function() {

    before(function() {
        server.listen(4000);
    });

    after(function() {
    });

    it('Returns 422 if channel parameter is missing', function(done) {
        superagent.post('http://localhost:4000/messages').end(function(err, res) {
            assert.equal(res.status, status.UNPROCESSABLE_ENTITY);
            var result = JSON.parse(res.text);
            assert.deepEqual({ error: 'Channel must be specified' }, result);
            done();
        });
    });
});