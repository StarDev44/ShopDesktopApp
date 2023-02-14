'use strict'

const { app, BrowserWindow, contextBridge, ipcMain } = require('electron')
const remote = require('electron').remote;
const path = require('path')
const sqlite3Lib = require('./lib/database');

// Código porque electron compiler murió :'v
const devtools = require('./devtools');

if (process.env.NODE_ENV === 'development') {
  devtools.runDevTools();
}
// ------------------------------------------

console.log("Iniciando")

app.on('before-quit', () => {
  console.log('Saliendo...')
})

app.on('ready', () => {
  
  let win = new BrowserWindow({
    title: 'Punto de venta',
    frame: false,
    center: true,
    webPreferences: 
    {
      nodeIntegration:true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  
  ipcMain.on('minimize', () => {
    win.minimize(); 
    console.log("minimize");
  })

  ipcMain.on('maximize', () => {
    if (!win.isMaximized()) 
    {
        win.maximize();            
    } else {
        win.unmaximize();
    }
    console.log("maximize");
  })

  ipcMain.on('addProductDB', (event,product) => {
    const myDB = new sqlite3Lib.programDataBase();
    
    myDB.productInsert(product);

    console.log("DB");
  })

  ipcMain.on('getProductsDB', (event) => {
    const myDB = new sqlite3Lib.programDataBase();
    
    const dataFound = myDB.getProducts();

    event.returnValue = dataFound;
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.loadURL('file://' + (__dirname) + '/renderer/index.html')

  win.on('closed', () => {
    win = null
    app.quit()
  })
})

