function System() {
    this.process = function (connection, message, subscriber, core) {
        if ('command' in message) {
            switch (message.command) {
                case 'unsubscribe':
                case 'subscribe': {
                    if (typeof message.data.channel == 'undefined'){
                        console.error('Channel unspecified...');
                        return false;
                    }
                    subscriber[message.command](message.data.channel);
                    console.log('Message processed successfully');
                    return true;
                }
                case 'history': {
                    console.log('History request received');
                    if (typeof message.data.channel == 'undefined'){
                        console.error('Channel unspecified...');
                        return false;
                    }
                    var history = core.getHistory(message.data.channel);
                    connection.write(JSON.stringify(history));
                    return true;
                }
                default: {
                    console.error('Wrong command...');
                    return false;
                }
            }
        } else {
            console.error('Wrong message...');
            return false;
        }
    }
}

module.exports = System;