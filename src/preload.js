//Not used, Is used for more security in the app
const { contextBridge } = require('electron');
const  settings  = require('electron-settings');


contextBridge.exposeInMainWorld('settings',
    {
        getGameDirectory(){
            return settings.getSync('game-directory')
        }
    }
)