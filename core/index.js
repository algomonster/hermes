/**
 *
 */
var FifoArray = require('fifo-array');

function Core(config) {

    var history = {};
    /**
     * Process messages
     *
     * @param message
     */
    this.process = function (message) {
        message.serverTime = (new Date()).getTime();
        if (!(message.channel in history)){
            var historyDepth = 1;
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