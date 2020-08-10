const electron = require('electron');
const { ipcRenderer } = electron;

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');

  button.addEventListener('click', sendConfig);

  const userData = JSON.parse(localStorage.getItem('userData'));
  if(userData) {
    document.getElementById('username').value = userData.username;
    document.getElementById('address').value = userData.address;
    document.getElementById('port').value = userData.port;
    document.getElementById('server-path').value = userData.serverCorePath;
    document.getElementById('local-path').value = userData.localCorePath;
  }
});

function sendConfig() {
  const username = document.getElementById('username').value;
  const address = document.getElementById('address').value;
  const port = document.getElementById('port').value;
  const serverCorePath = document.getElementById('server-path').value;
  const localCorePath = document.getElementById('local-path').value;

  const userData = { username, address, port, serverCorePath, localCorePath };

  localStorage.setItem('userData', JSON.stringify(userData));

  ipcRenderer.send('settings', userData);
}