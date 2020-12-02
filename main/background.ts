import { app, protocol, ipcMain } from 'electron';
import serve from 'electron-serve';

import createWindow from './create-window';
import { registerIpcChannels } from './ipc';
import path from 'path';

app.allowRendererProcessReuse = true;

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
    serve({ directory: 'app' });
} else {
    app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
    await app.whenReady();

    const mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
    });

    registerIpcChannels();

    if (isProd) {
        await mainWindow.loadURL('app://./home.html');
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }
})();

app.on('window-all-closed', () => {
    app.quit();
});

protocol.registerSchemesAsPrivileged([
    { scheme: 'audio', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: false } },
]);

app.on('ready', async () => {
    const protocolName = 'audio';
    // eslint-disable-next-line
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.replace(`${protocolName}://`, '');
        try {
            return callback(decodeURIComponent(url));
        } catch (error) {
            console.error(error);
        }
    });
});

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: path.resolve(__dirname, '../icon.png'),
    });
});
