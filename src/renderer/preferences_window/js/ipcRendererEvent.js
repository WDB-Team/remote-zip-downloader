const { ipcRenderer } = require('electron');


function sendLoadPreferencesEvent() {
    ipcRenderer.invoke('load-preferences');
}

function loadAllPreferences() {
    ipcRenderer.on('load-preferences', (event, directory) => {
        const element = document.getElementById('game-directory');
        if (directory) {
            element.innerHTML = directory;
        } else {
            element.innerHTML = "Ruta no escogida"
        }
        
        
    })
}

function closePreferences() {
    ipcRenderer.invoke('close-window');
}

function savePreferences(window) {
    
}

function chooseGameDirectory() {
    ipcRenderer.invoke('choose-game-directory');
}

function changeGameDirectoryText() {
    ipcRenderer.on('change-game-directory-text', (event, directory) => {
        const element = document.getElementById('game-directory')
        element.innerHTML = directory;
    })
}

function showDialog(type, title, msg) {
    ipcRenderer.invoke('show-dialog', {
        type: type,
        title: title,
        message: msg
    })
}



module.exports = {
    showDialog: showDialog,
    closePreferences: closePreferences,
    chooseGameDirectory: chooseGameDirectory,
    changeGameDirectoryText: changeGameDirectoryText,
    sendLoadPreferencesEvent: sendLoadPreferencesEvent,
    loadAllPreferences: loadAllPreferences,
}