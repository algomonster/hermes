/**
 *
 */
var FifoArray = require('fifo-array');
var cfg = null;
var history = {};

function Core(config) {
    if (cfg == null) {
        cfg = config;
    }
}

module.exports = Core;

/**
 * Process messages
 *
 * @param message
 */
Core.prototype.process = function (message) {
    message.serverTime = (new Date()).getTime();
    if (!(message.channel in history)){
        var historyDepth = 10;
        try {
            historyDepth = cfg.core.history.maxDepth;
        } catch (e) {}
        history[message.channel] = new FifoArray(historyDepth);
    }
    console.log('Core got message for processing', message);
    history[message.channel].push(message);
    return message;
};

Core.prototype.getHistory = function (channel) {
    if (!(channel in history)){
        return [];
    }
    return history[channel];
};