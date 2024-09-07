// start-electron.js
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Set environment variable for Electron main process
process.env.ELECTRON_START_URL = 'http://localhost:3000';

// Start Electron process
const electronProcess = spawn(electron, [path.join(__dirname, 'electron.js')]);

electronProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

electronProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
