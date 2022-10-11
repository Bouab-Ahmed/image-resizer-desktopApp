const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');

const isMac = process.platform === 'darwin';

// create the main window
const createMainWindow = () => {
  const window = new BrowserWindow({
    title: 'Image Resizer',
    width: 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, './renderer/js/preload.js'),
    },
  });

  window.loadFile(path.join(__dirname, './renderer/index.html'));
  window.webContents.openDevTools();
};

// create the About window
const createAboutWindow = () => {
  const window = new BrowserWindow({
    title: 'About Image Resizer',
    width: 300,
    height: 400,
  });

  window.loadFile(path.join(__dirname, './renderer/about.html'));
};

// custome menu
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'about',
              click: createAboutWindow,
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
              click: createAboutWindow,
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
