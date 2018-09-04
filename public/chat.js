let ipc = require('electron').ipcRenderer;

// query dom
const message = document.getElementById('message');
const sendMessageButton = document.getElementById('send-message');
const writeContent = document.getElementById('write-content');
const submitBtn = document.getElementById('username-submit');
const overlay = document.getElementById('overlay');

let username;

submitBtn.addEventListener('click', function (event) {

    event.preventDefault();

    if (document.getElementById('user-name').value.trim()) {
        username = document.getElementById('user-name').value;
        overlay.style.display = "none";
        ipc.send('capture-username', username);
    } else {
        alert("please enter user name");

    }

});

//Send user message
sendMessageButton.addEventListener('click', function (event) {

    event.preventDefault();

    if (message.value.trim()) {

        let data = {
            message: message.value,
            userName: username
        };

        writeContent.innerHTML += "<p><strong>" + data.userName + ':</strong>' + data.message + '</p>';
        ipc.send('emit-message', data);
    } else {
        alert("please enter your message");
    }

});

//On receiving the message from the server, write the content to the block
ipc.on('message-received', function (events, data) {
    writeContent.innerHTML += "<p><strong>" + data.userName + ':</strong>' + data.message + '</p>';
});

//Write your own message
ipc.on('own-message', function (events, data) {
    writeContent.innerHTML += "<p><strong>" + data.userName + ':</strong>' + data.message + '</p>';
});
