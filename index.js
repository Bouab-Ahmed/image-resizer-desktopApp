const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

const isMac = process.platform === 'darwin';
let mainWindow;
let aboutWindow;
// create the main window
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, './renderer/js/preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
  // window.webContents.openDevTools();
};

// create the About window
const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    title: 'About Image Resizer',
    width: 300,
    height: 400,
  });

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
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
  let mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => (mainMenu = null));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// respond to ipcRenderer

ipcMain.on('image:resize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageResizer');
  resizeImage(options);
});

// resize the image

function resizeImage({ imgPath, width, height, dest }) {
  try {
    (async () => {
      const newImage = await resizeImg(fs.readFileSync(imgPath), {
        width: +width,
        height: +height,
      });

      //create file name
      const fileName = `${path.basename(imgPath)}-${width}x${height}`;

      // create dest folder if not exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }

      fs.writeFileSync(path.join(dest, fileName), newImage);

      // send success message to renderer
      mainWindow.webContents.send('image:done');

      // open the dest
      shell.openPath(dest);
    })();
  } catch (error) {
    console.log(error);
  }
}

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
