const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load React build output or React dev server (in development mode)
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'build/index.html')}`
  );

  mainWindow.on('closed', () => (mainWindow = null));

  // Detect if the page failed to load
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('Page failed to load. Refreshing...');
    setTimeout(() => {
      mainWindow.reload();
    }, 1000); // Adjust timeout as needed
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
