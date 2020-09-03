import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import mysql from "nodejs-mysql";

const db = mysql.getInstance({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWD,
  database: process.env.SQL_DB
});

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('query', async (event, arg) => {
  let rows = await db.exec(`SELECT * FROM cards WHERE cards.text LIKE '%${arg}%'`)
  console.log(rows.length)
  event.sender.send('query', JSON.stringify(rows));
});
