const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { updater } = require('./updater');
const { readItem } = require('./readItem');
const { buildMenu } = require('./menu');

// keep global reference of the window object, so it won't be closed automatically when the JS object is garbage collected
let mainWindow;

const createWindow = () => {

    // check for app updates after 3 seconds
    setTimeout(updater, 3000);

    const state = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    });

    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, maxWidth: 750, minHeight: 300,
        webPreferences: {
            nodeIntegration: true
        }
    });

    
    // load index.html into mainWindow
    mainWindow.loadFile('./renderer/index.html');
    
    // manage state for the mainWindow
    state.manage(mainWindow);
    
    // reference to mainWindow's webContents
    const mainWebContents = mainWindow.webContents;
    buildMenu(mainWebContents);

    // open dev tools 
    mainWebContents.openDevTools();

    // listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// electron app is ready 
app.on('ready', createWindow);

// quit when all windows are closed
app.on('windows-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// when app icon is clicked and app is running, recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

ipcMain.on('valid-url', (event, url) => {
    readItem(url, item => {
        // console.log('### ITEM ###', item);
        event.sender.send('created-new-item', item);
    });
});