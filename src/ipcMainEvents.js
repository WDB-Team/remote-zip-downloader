const {ipcMain, dialog, BrowserWindow, Notification } = require('electron');
const  settings  = require('electron-settings');
const path  = require('path');
const fs = require('fs');



function loadPreferences() {
    ipcMain.handle('load-preferences', async (event) => {
        try {
            let gameDirectory = await settings.get('game-directory');
            event.sender.send('load-preferences', gameDirectory);
        } catch (error) {
            dialog.showErrorBox("Error", `Error al cargar las preferencias`)
        }
    })
}


function openDirectoryEvent(window) {
    ipcMain.handle('choose-game-directory', async (event) => {
        try {
            let gameDirectory = await dialog.showOpenDialog(window, {
                title: 'Seleccione la ruta del juego',
                buttonLabel: 'Seleccionar ubicación',
                properties: ['openDirectory']
            });
            if(gameDirectory.canceled === false){
                await settings.set('game-directory', gameDirectory.filePaths[0])
                event.sender.send('change-game-directory-text', gameDirectory.filePaths[0])
            }
            
        } catch (error) {
            console.log(error);
        }     
    })
}

function openPreferences(window) {
    ipcMain.handle('open-preferences', async () =>{

        const preferencesWindows = new BrowserWindow({
            parent: window,
            width: 400,
            height: 300,
            title: 'Preferencias',
            center: true,
            modal: true,
            frame: false,
            show: false,
            icon: path.join(__dirname,'assets','img','icons8_Settings.ico'),
            resizable: false,
            closable: true,
            webPreferences: {
                devTools: false,
                nodeIntegration: true,
                contextIsolation: false,
                //preload: path.join(__dirname,'preload.js')
            },
        })
        
        //preferencesWindows.setParentWindow(window);
        preferencesWindows.once('ready-to-show', ()=> {
            preferencesWindows.show();
            preferencesWindows.focus();
        })
        
        preferencesWindows.loadURL(`file://${__dirname}/renderer/preferences_window/preferences.html`)
    })
}

function showDialogEvent(window) {
    ipcMain.handle('show-dialog', async (event, info) => {
        dialog.showMessageBox(window, {
            type: info.type,
            title: info.title,
            message: info.message
        })
    })
}

function showErrorMessage() {
    ipcMain.handle('show-error-message', async (event, info) => {
        dialog.showErrorBox(info.title, info.message)
    })
}

function showNotification (title, message) {
    new Notification({ title: title, body: message }).show()
}

function closeWindow() {
    ipcMain.handle('close-window', async (event) => {
        let focusWindow = BrowserWindow.getFocusedWindow();
        if(focusWindow){
            focusWindow.close();
        } else {
            console.log('asd')
        }
    })
}

function downloadFile() {
    ipcMain.handle('download', async (event) => {
        const gameDirectory = await settings.get('game-directory')
        if (gameDirectory) {
            const axios = require('axios').default;
            try {
                //Starting the dowload
                const response = await axios({
                    url: 'http://10.96.66.50/updateBDO.zip', //your url bdologo.png 
                    method: 'GET',
                    responseType: 'stream', // important
                });
    
                if(response.status === 200) {
                    const os = require('os');
                    let tmpdir = os.tmpdir; //Temp Directory of OS
                    const downloadPath = path.resolve(`${tmpdir}`,'bdoDownload.zip');
                    const writer = fs.createWriteStream(downloadPath);
    
                    response.data.pipe(writer);
    
                    //Calculating Progress
                    const totalLength = response.headers['content-length']; //Total of bytes
                    let loadedData = 0; //Bytes downloaded
                    let lastPercent = 0;
    
                    
                    response.data.on('data', (chunk) => {
                        loadedData += chunk.length; //Adding bytes per chunk
                
                        let percentage =  Math.round((loadedData * 100) / totalLength); //Calculating downloaded percent
                        
                        if (lastPercent < percentage) { // Evit sending to many events for update the progress
                            lastPercent = percentage;
                            event.sender.send('download-progress', percentage) // Sending percent value 
                            //console.log(percentage + "% | " + loadedData + " bytes out of " + totalLength + " bytes.");
                        }
                    })
    
                    response.data.on('error', () => { //When error occurs delete de archive
                        writer.destroy();
                        writer.unlink(downloadPath, (err) => {
                            if (err) throw err;
                            dialog.showErrorBox("Error", "Error al eliminar el archivo temp")
                        })
                    })
        
                    response.data.on('end', () => { //When download is over
                        writer.end();
                    })
    
    
                    writer.on('finish', () => { //When write is over 
                        event.sender.send('download-end');
                        extractingArchives(downloadPath, gameDirectory, event);
                    })
        
                    writer.on('error', (err) => {
                        writer.close();
                        if (err.code === 'EEXIST'){
                            dialog.showErrorBox("Error", "El archivo ya existe")
                        } else {
                            writer.unlink(dest, (error) => { //Deleting the archive
                                if(error){
                                    dialog.showErrorBox("Error", `Error eliminando el archivo temp`)
                                    throw error
                                }
                            })
                        }
                    })
    
                } else {
                    dialog.showErrorBox("Error", `El servidor respondio con ${response.status} : ${response.code}`)
                    //console.log(`Server responded with ${response.status}: ${response.status}`)
                }
    
            } catch (error) {
                throw error
            }
        } else {
            event.sender.send('game-dir-not-selected')
        }
        
    })
}

function extractingArchives(zipLocation, gameDir, event) {
    const admZip = require('adm-zip');
    const zip = new admZip(zipLocation);
    zip.extractAllToAsync(gameDir, true, (error) => {
        if (error) {
            dialog.showErrorBox("Error", `Error al extraer los archivos`)
            throw error
        } else {
            event.sender.send('update-end')
            showNotification('Actualización','Se terminó de actualizar el Juego')
        }
    })
}

function openInExternalNavigator() {
    ipcMain.handle('open-link' , async (event, info) => {
        require('electron').shell.openExternal(info.url)
    })
}

function createTempApliactionDir() {
    let date = new Date();
    let tmpDir = os.tmpdir();
    fs.mkdtemp(path.join(tmpDir, `bdo-${date.getMonth()}-${date.getDate()}-${date.getFullYear()}-`), (err, directory) => {
        if (err) throw err;
        console.log(directory);
      });
}

function progressDownload(params) {
    
}
module.exports = {
    showDialogEvent: showDialogEvent,
    showErrorMessage: showErrorMessage,
    openDirectoryEvent: openDirectoryEvent,
    openPreferences: openPreferences,
    closeWindow: closeWindow,
    loadPreferences: loadPreferences,
    downloadFile: downloadFile,
    openInExternalNavigator: openInExternalNavigator
}
