const { app, BrowserWindow, Tray, ipcMain, dialog, Notification, Menu } = require('electron')
const  setupErrors = require('./handle-errors')
const path = require('path')
const os = require('os')
const { showDialogEvent, openDirectoryEvent, openPreferences, closeWindow, loadPreferences, downloadFile,
    showErrorMessage, openInExternalNavigator } = require('./ipcMainEvents')

 
 
// Mantenga una referencia global al objeto de ventana. Si no lo hace, cuando el objeto de JavaScript es
// Durante la recolección de basura, el objeto de la ventana se cerrará automáticamente
let win
 
function createWindow() {
    // Crea una ventana del navegador.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'BDOUpdater',
        center: true,
        maximizable: false,
        resizable: true,
        icon: path.join(__dirname,'assets','img','icons8_Info.ico'),
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    })
    //Ipc main procces
    showDialogEvent(win);
    showErrorMessage();
    openDirectoryEvent(win);
    openPreferences(win);
    loadPreferences();
    closeWindow();
    downloadFile();
    openInExternalNavigator();

    //Handle errors
    setupErrors(win);
    

    win.once('ready-to-show', () => {
        win.show();
    })



    

    // Cargar archivo index.html
    win.loadURL(`file://${__dirname}/renderer/main_window/index.html`)
 
    // Herramientas de desarrollo abiertas
    win.webContents.openDevTools()
 
    // Este evento se activará cuando se cierre la ventana.
    win.on('closed', () => {
        // Desreferencia del objeto de ventana, si su aplicación admite múltiples ventanas,
        // Por lo general, se almacenan varios objetos de ventana en una matriz,
        // Al mismo tiempo, debe eliminar el elemento correspondiente.
        win = null
    })
}
 
// Electron se inicializará y estará listo
// Llame a esta función al crear una ventana del navegador.
// Algunas API solo se pueden utilizar después de que se active el evento ready.
app.on('ready', createWindow)
app.on('ready', createMenu)

// Salir cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
    // En macOS, a menos que el usuario salga definitivamente con Cmd + Q,
    // De lo contrario, la mayoría de las aplicaciones y sus barras de menú permanecerán activas.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
 
app.on('activate', () => {
    // En macOS, cuando se hace clic en el icono del dock y no hay otras ventanas abiertas,
    // Normalmente vuelve a crear una ventana en la aplicación.
    if (win === null) {
        createWindow()
    }
})



function createMenu() {
    const template = [
        {
            label:'Configuración',
            submenu: [
                {
                    label:'Cerrar',
                    role: 'quit'
                }
            ]
        },
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
}

function showIcon() {
    let icon = null
    let tray = null
    if (os.platform() === 'win32') {
        icon = path.join(__dirname,'assets','img','icons8_Info.ico')
        //icon = './assets/img/icons8_Info.ico'
        console.log('is')
    } else {
        icon = path.join(__dirname,'main_window','assets','img','icons8_Info_32.png')
    }
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' }
      ])
    tray = new Tray(icon)
    tray.setContextMenu(contextMenu)
    tray.setToolTip('This is my application.')
}

// En este archivo, puede continuar escribiendo el código de proceso principal restante de la aplicación.
// También se puede dividir en varios archivos y luego importar con require.
