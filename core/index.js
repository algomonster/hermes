/**
 *
 */

function Core() {
    /**
     * Process messages
     *
     * @param message
     */
    this.process = function (message) {
        console.log('Core got message for processing', message);
    }
}

module.exports = Core;