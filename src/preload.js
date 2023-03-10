// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    minimize:       () => ipcRenderer.send('minimize'),
    maximize:       () => ipcRenderer.send('maximize'),
    addProductDB:   (product) => ipcRenderer.send('addProductDB',product),
    getProductsDB:  () => ipcRenderer.sendSync('getProductsDB')
})

