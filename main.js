//In-built modules
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipc = require('electron').ipcMain;
const Notification = require('electron').Notification;
const dialog = require('electron').dialog;

//Third party dependencies
const io = require('socket.io-client');
let socket = io.connect('https://server-socket.herokuapp.com');

socket.on('connect_error', (error) => {
    dialog.showErrorBox("Connection Error", "Can't establish connection to the socket server, quitting the app");
    app.quit();
});

socket.on('connect', () => {

    let myNotification = new Notification({
        title: "Connection Successfull",
        body: "Successfully established connection to the socket server"
    });

    myNotification.show();

});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    //Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadFile('public/index.html');

    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

ipc.on('capture-username', function (events, user) {
    userName = user;
});

ipc.on('emit-message', function (events, data) {

    userName = data.userName;

    socket.emit('chat', {
        message: data.message,
        userName: data.userName
    });

});

//listen for events
socket.on('chat', function (data) {

    mainWindow.webContents.send('message-received', data);

    let myNotification = new Notification({
        title: data.userName,
        body: data.message,
        hasReply: true,
        silent: false,
        closeButtonText: 'close'
    });

    myNotification.show();

    myNotification.on('reply', (event, hasReply) => {

        let data = {
            message: hasReply,
            userName: userName,
        };

        mainWindow.webContents.send('own-message', data);
        socket.emit('chat', data);

    });
});

