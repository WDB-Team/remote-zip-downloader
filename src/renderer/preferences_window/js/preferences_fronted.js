const { closePreferences, chooseGameDirectory, changeGameDirectoryText, 
    loadAllPreferences, sendLoadPreferencesEvent } = require('./js/ipcRendererEvent')

window.addEventListener('load', () => {
    //Add Events
    addButtomEvent('close','click', closePreferences);
    addButtomEvent('choose-game-directory','click', chooseGameDirectory);
    //Send events
    sendLoadPreferencesEvent();
    //Listen events
    loadAllPreferences();
    changeGameDirectoryText();
})

function addButtomEvent(id, event, callback){
    const buttom = document.getElementById(id);
    buttom.addEventListener(event, callback)
}




