const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const shell = require('shelljs');

shell.config.execPath = shell.which('node').toString();

let mainWindow;
let settingsWindow;

let username;
let address;
let port;
let serverCorePath;
let localCorePath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 480,
    minWidth: 600,
    minHeight: 480,
    icon: './assets/images/icon.png',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  // building and applying custom menu
  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 480,
    minWidth: 600,
    minHeight: 480,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  settingsWindow.loadFile('config.html');
}

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [{
      label: 'Access Settings',
      click() {
        createSettingsWindow()
      }
    }]
  },
  {
    label: 'Developer Tools',
    submenu: [{
      label: 'Toogle DevTools',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }]
  }
];

ipcMain.on('start', (e, item) => {
  username = item.username;
  address = item.address;
  port = item.port;
  serverCorePath = item.serverCorePath;
  localCorePath = item.localCorePath;
});

ipcMain.on('settings', (e, item) => {
  username = item.username;
  address = item.address;
  port = item.port;
  serverCorePath = item.serverCorePath;
  localCorePath = item.localCorePath;

  settingsWindow.close();
});

ipcMain.on('download', (e, item) => {
  const serverFilePath = item.serverFilePath;
  const localFilePath = item.localFilePath;

  let downloadCommand;

  if(localFilePath === '/') {
    downloadCommand = `scp -P ${port} ${username}@${address}:${serverCorePath}/${serverFilePath} "${localCorePath}"`;
  } else {
    downloadCommand = `scp -P ${port} ${username}@${address}:${serverCorePath}/${serverFilePath} "${localCorePath}/${localFilePath}"`;
  }

  shell.exec(downloadCommand);
});

ipcMain.on('upload', (e, item) => {
  const serverFilePath = item.serverFilePath;
  const localFilePath = item.localFilePath;

  let uploadCommand;

  if(serverFilePath === '/') {
    uploadCommand = `scp -P ${port} "${localCorePath}/${localFilePath}" ${username}@${address}:${serverCorePath}`;
  } else {
    uploadCommand = `scp -P ${port} "${localCorePath}/${localFilePath}" ${username}@${address}:${serverCorePath}/${serverFilePath}`;
  }
  
  shell.exec(uploadCommand);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});