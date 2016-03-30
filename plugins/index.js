/**
 * Plugins is an internal module for plugins management and messages process via loaded plugins.
 *
 * @constructor
 */

function Plugins() {

    var plugins = {
        system: new (require('./system'))()
    };

    console.log(plugins);

    /**
     *
     * @param {SockJSConnection} connection
     * @param message
     * @param subscriber
     */
    this.process = function (connection, message, subscriber) {
        try {
            var msg = JSON.parse(message);
            var channel = msg.channel;
            if ('channel' in msg){
                // console.log('That, this', that, this);
                if (channel in plugins) {
                    console.log('Required plugin found and message will be processed.');
                    if (plugins[channel].process(connection, msg, subscriber)) {
                        // Message processed successfully
                    }
                } else {
                    // Plugin for this channel not loaded.
                }
            } else {
                // @TODO notify client about wrong message.
                console.log('Message received without channel and should be rejected.');
            }
        } catch (e) {
            // Ignore messages with invalid JSON
        }
    }
}

module.exports = Plugins;