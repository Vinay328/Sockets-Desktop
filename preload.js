const ipcRenderer = require('electron').ipcRenderer;

let addDataAndEmitMessage;

function showNotificationToUser(data, referenceToEmitMessageFunction) {
    ipcRenderer.send('show-notification', data);
    addDataAndEmitMessage = referenceToEmitMessageFunction;
}

ipcRenderer.on('notification-reply', (event, data) => {

    if (data.message.trim()) {
        addDataAndEmitMessage(data);
    }

});

window.alphaDemo = {
    showNotificationToUser: showNotificationToUser
};

