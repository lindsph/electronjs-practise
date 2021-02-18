const { Menu, shell } = require('electron');

const buildMenu = () => {
    const template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New Item',
                    click: () => {
                        
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