// like a bridge to use the node js build-in modules or other modules in the renderer file
const os = require('os');
const path = require('path');
const toastify = require('toastify-js');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('os', {
  homeDir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('toastify', {
  toast: (options) => toastify(options).showToast(),
});
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
