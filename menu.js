const { Menu, shell } = require('electron');

const buildMenu = async appWin => {
    const getStorage = () => {
        return appWin.executeJavaScript('JSON.parse(localStorage.getItem("readit-items"));');
    };

    const isStorage = await getStorage();

    const template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New Item',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        // messaging the renderer process
                        appWin.send('menu-show-modal');
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    enabled: isStorage ? true : false,
                    click: () => {
                        appWin.send('menu-open-item');
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item');
                    }
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native');
                    }
                },
                {
                    label: 'Search Items',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        appWin.send('menu-focus-search');
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'See Github Repository',
                    click: () => {
                        shell.openExternal('https://github.com/lindsph/electronjs-practise');
                    }
                }
            ]
        }
    ];

    // macos specific
    if (process.platform === 'darwin') template.unshift({ role: 'appMenu' });
    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
};

module.exports = {
    buildMenu
};