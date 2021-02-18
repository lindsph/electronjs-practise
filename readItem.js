const { BrowserWindow } = require('electron');

let offscreenWindow;

const readItem = (url, callback) => {
    // create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500, height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    // load item url
    offscreenWindow.loadURL(url);

    // reference to offscreenWindow webContents
    offscreenWebContents = offscreenWindow.webContents;

    // wait for content to finish loading
    offscreenWebContents.on('did-finish-load', async (event) => {
        // page title
        const title = offscreenWindow.getTitle();

        // get screenshot (thumbnail)
        await offscreenWebContents.capturePage()
            .then(image => {
                // get image as a dataURL
                const screenshot = image.toDataURL();

                // execute callback with new item object
                callback({
                    title,
                    screenshot,
                    url
                });
            })
            .catch(error => {
                console.log(error)
            });

        // clean up offscreenWindow
        offscreenWindow.close();
        offscreenWindow = null;
    });
};

module.exports = {
    readItem
};