var express = require('express');
var sockjs = require('sockjs');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');

var routes = require('./routes/index');
var routeMessages = require('./routes/messages');
var routeClient = require('./routes/client');

var app = express();

var pubsub = require('node-internal-pubsub');

// Load plugins manager
var plugins = new (require('./plugins'))();

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
app.use('/messages', routeMessages);
app.use('/client', routeClient);

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
    
    var subscriber = pubsub.createSubscriber();

    subscriber.on('pmessage', function(pattern, channel, message) {
        console.log('Pattern [%s], channel [%]: client got new message [%s]', pattern, channel, message);
        connection.write(message);
    });

    subscriber.on('message', function(channel, message) {
        console.log('Channel [%s]: client got new message [%s]', channel, message);
        connection.write(message);
    });

    connection.on('data', function(message) {
        plugins.process(connection, message, subscriber);
    });

    connection.on('close', function() {
        console.log('Connection closed.');
        // @TODO message duplicates, bug because disconnect processing is wrong. Create a test for this bug and fix it.
        subscriber.punsubscribe();
        subscriber.unsubscribe();
    });
});

// Install Echo Server as handler
sockJsServer.installHandlers(server, {prefix: '/comet'});

server.on('request', app);

module.exports = server;
