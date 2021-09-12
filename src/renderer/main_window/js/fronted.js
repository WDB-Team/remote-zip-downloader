const { updateDownloadProgress, showDialog, openPreferences,
     download , downloadEnd, updateEnd, gameDirNotSelected,
      openInExternalWindowForo, openInExternalWindowWeb } = require('./js/ipcRendererEvents');


window.addEventListener('load', () => {
    //Listen events
    updateDownloadProgress();
    downloadEnd();
    updateEnd();
    gameDirNotSelected();
    //Buttoms events
    addButtomEvent('open-preferences','click', openPreferences);
    addButtomEvent('download','click', download);
    addOpenInExternalWindowEvent();
});

function addDownloadEvent() {
    let datos;

    fetch('http://localhost:3000/api/files')
        .then((res) => res.json())
        .then( function(data){
            datos = data.body;
        })
        .catch( function(error) {
            console.log(error);
        })

    const buttom = document.querySelector('button');

    buttom.addEventListener('click', () => {
        console.log(datos)
    })
}

function addButtomEvent(id, event, callback) {
    const buttom = document.getElementById(id);
    buttom.addEventListener(event, callback)
}

function addOpenInExternalWindowEvent() {
    const a = document.getElementById('link-foro');
    a.addEventListener('click', openInExternalWindowForo)

    const b = document.getElementById('link-web');
    b.addEventListener('click', openInExternalWindowWeb)
}

