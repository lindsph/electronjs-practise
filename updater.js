const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
autoUpdater.logger = require("electron-log");
// where this logs on depends on the system
// for mac: `cat ~/Library/Logs/electron-project-readit/main.log`
// run `npm run build`, then open the /dist folder and open the project which will run createWindow() and create a log from inside the setTimeout
// to clear the logs: `echo '' > ~/Library/Logs/electron-project-readit/main.log`
// `tail -f ~/Library/Logs/electron-project-readit/main.log`
autoUpdater.logger.transports.file.level = "info";

// disable auto downloading of updates
autoUpdater.autoDownload = false;

const updater = () => {
    autoUpdater.checkForUpdates();

    // listen for update found
    autoUpdater.on('update-available', () => {
        // prompt user to start download
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: "A new version is available. Do you want to update now?",
            buttons: [
                'Update',
                'Later'
            ]
        }).then(answer => {
            const buttonIndex = answer.response;
            if (buttonIndex === 0) autoUpdater.downloadUpdate();
        }).catch(error => {
            console.log('error in update-available')
        });
    });

    // listen for download being ready
    autoUpdater.on('update-downloaded', () => {
        // prompt user to install update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: "Install and restart now?",
            buttons: [
                'Sure!',
                'Later'
            ]
        }).then(answer => {
            const buttonIndex = answer.response;

            // install and restart if answer is 0 "Sure!"
            if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
        }).catch(error => {
            console.log('error in update-downloaded')
        });
    });
};

module.exports = {
    updater
};