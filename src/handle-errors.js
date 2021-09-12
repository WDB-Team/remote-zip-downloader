const { dialog, app } = require("electron")

function setupErrors(window) {

    //Escuchando por eventos de crash
    window.webContents.on('crashed', () => {
        relaunchApp(window);
    })

    //Escuchando por eventos de no responde la app
    window.on('unresponsive', () => {
        dialog.showMessageBox(win, {
            type:'warning',
            title: 'Ocurrio un error',
            message: `Un proceso esta tardando mas de lo esperado
                    puede esperar o reiniciar la aplicacion`
        })
    })

    //Escuchando por eventos de execiones no controladas del proceso de node
    process.on('uncaughtException', (err) =>{
        console.log(err)
        //relaunchApp(window)
    })
}

function relaunchApp(window) {
    dialog.showMessageBox(window, {
        type:'error',
        title: 'Ocurrio un error',
        message: `Ocurrio un error inseperado, se reiniciara
                la aplicacion`
    }).then( () => {
        app.relaunch();
        app.exit(0);
    })
}

module.exports = setupErrors;