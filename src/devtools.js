const reload = require('electron-reload')

function runDevTools () {
  reload(__dirname);
 
}

exports.runDevTools = runDevTools

