const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');

const isMac = process.platform === 'darwin';

// create the main window
const createMainWindow = () => {
  const window = new BrowserWindow({
    title: 'Image Resizer',
    width: 500,
    height: 600,
  });

  window.loadFile(path.join(__dirname, './renderer/index.html'));
};

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'about',
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'help',
          submenu: [
            {
              label: 'About',
            },
          ],
        },
      ]
    : []),
];

// app is ready
app.whenReady().then(() => {
  createMainWindow();

  //implement the menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
