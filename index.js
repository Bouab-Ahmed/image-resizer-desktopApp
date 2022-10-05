const path = require('path');
const { app, BrowserWindow } = require('electron');

const isMac = process.platform === 'darwin';

const createMainWindow = () => {
  const window = new BrowserWindow({
    title: 'Image Resizer',
    width: 500,
    height: 600,
  });

  window.loadFile(path.join(__dirname, './renderer/index.html'));
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
