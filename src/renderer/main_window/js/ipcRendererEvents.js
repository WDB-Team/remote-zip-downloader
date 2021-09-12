const { ipcRenderer } = require('electron');

function updateDownloadProgress() {
    ipcRenderer.on('download-progress', (event, percentage) => {
        document.getElementById('download-progress-bar').value = percentage;
        document.getElementById('progress-bar-info').innerHTML = `${percentage}%`;
    })
}

function downloadEnd() {
    ipcRenderer.on('download-end', (event) => {
        //Actualizar la interfaz 
        document.getElementById('progress-bar-info').innerHTML = `Actualizando`;
    })
}

function updateEnd() {
    ipcRenderer.on('update-end', (event) => {
        //Actualizar la interfaz 
        document.getElementById('download-progress-bar').value = 0;
        document.getElementById('progress-bar-info').innerHTML = `Actualización terminada`;
    })
}

function gameDirNotSelected() {
    ipcRenderer.on('game-dir-not-selected', (event) => {
        showErrorMessage('Directorio Faltante','Necesitas escoger el directorio del juego antes actualizar')
    })
}

function showDialog(type, title, msg) {
    ipcRenderer.invoke('show-dialog', {
        type: type,
        title: title,
        message: msg
    })
}

function showErrorMessage(title, msg) {
    ipcRenderer.invoke('show-error-message', {
        title: title,
        message: msg
    })
}

function openPreferences() {
    ipcRenderer.invoke('open-preferences');
}

function download() {
    ipcRenderer.invoke('download');
}

function openInExternalWindowForo() {
    const url = document.getElementById('link-foro').getAttribute('class');
    ipcRenderer.invoke('open-link', {
        url: url,
    })
}

function openInExternalWindowWeb() {
    const url = document.getElementById('link-web').getAttribute('class');
    ipcRenderer.invoke('open-link', {
        url: url,
    })
}

module.exports = {
    showDialog: showDialog,
    showErrorMessage: showErrorMessage,
    openPreferences: openPreferences,
    download: download,
    updateDownloadProgress: updateDownloadProgress,
    downloadEnd: downloadEnd,
    updateEnd: updateEnd,
    gameDirNotSelected: gameDirNotSelected,
    openInExternalWindowWeb: openInExternalWindowWeb,
    openInExternalWindowForo: openInExternalWindowForo
}