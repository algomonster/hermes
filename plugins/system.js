function System() {
    this.process = function (connection, message, subscriber) {
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