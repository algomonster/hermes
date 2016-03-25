var express = require('express');
var sockjs = require('sockjs');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

var routes = require('./routes/index');
var messages = require('./routes/messages');

var app = express();

var pubsub = require('node-internal-pubsub');

// Configs loading
var config = require('config');
console.log('Used configuration: ', config);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/messages', messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler, no StackTraces leaked to user
app.use(function(err, req, res, next) {
    if (typeof res.status == 'function'){
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

if (config.has('Server.SSL') && config.get('Server.SSL')){
    var server = require('https').createServer(config.get('Server.options'));
} else {
    var server = require('http').createServer();
}

// WebSockets server for WS connections serving.
var sockJsServer = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });

sockJsServer.on('connection', function(connection) {

    //console.log('Connected new WebSockets client');
    var subscriber = pubsub.createSubscriber();

    // @TODO Dummy subscription for all channels ny regexp, should be removed.
    // subscriber.psubscribe(/channel/);

    subscriber.on('pmessage', function(pattern, channel, message) {
        console.log('Pattern [%s], channel [%]: client got new message [%s]', pattern, channel, message);
        connection.write(message);
    });

    subscriber.on('message', function(channel, message) {
        console.log('Channel [%s]: client got new message [%s]', channel, message);
        connection.write(message);
    });


    // @TODO Handle messages from clients received over WebSockets...
    connection.on('data', function(message) {
        // connection.write(message);
        console.log('Received from client:', message);

        try {
            var msg = JSON.parse(message);
            if ('channel' in msg) {
                var channel = msg.channel;
                if (channel == 'system' && msg.command == 'subscribe') {
                    subscriber.subscribe(msg.data.channel);
                    console.log('Client subscribed to channel [' + msg.data.channel + ']');
                }
            }
        } catch (e) {
            // Ignore messages with invalid JSON
        }
    });

    connection.on('close', function() {
        subscriber.punsubscribe(/channel/);
        //console.log('Client connection closed');
    });
});

// Install Echo Server as handler
sockJsServer.installHandlers(server, {prefix: '/comet'});

server.on('request', app);

module.exports = server;
