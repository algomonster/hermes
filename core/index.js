/**
 *
 */
var FifoArray = require('fifo-array');
var history = {};
var i = 0;

function Core(config) {


    var index = ++i;
    console.log('Core instance #' + index + ' created.');

    /**
     * Process messages
     *
     * @param message
     */
    this.process = function (message) {
        message.serverTime = (new Date()).getTime();
        if (!(message.channel in history)){
            var historyDepth = 10;
            try {
                historyDepth = config.core.history.maxDepth;
            } catch (e) {}
            history[message.channel] = new FifoArray(historyDepth);
        }
        console.log('Core got message for processing', message);
        history[message.channel].push(message);
        return message;
    };

    this.getHistory = function (channel) {
        if (!(channel in history)){
            return [];
        }
        return history[channel];
    };
}

module.exports = Core;