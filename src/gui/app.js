const exec = require('child_process').exec;
const express = require('express');

let app = express();
let server = require('http').Server(app);

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile('./index.html');
});

server.listen(8999);

let cmd;
const url = 'http://localhost:8999/';

if (process.platform === 'darwin') {
  cmd = 'open';
} else if (process.platform === 'win32') {
  cmd = 'start';
} else {
  cmd = 'xdg-open';
}

exec(cmd + ' ' + url);
