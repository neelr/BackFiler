import { app, ipcMain } from 'electron';
import path from "path"
import serve from 'electron-serve';
import { createWindow, scrape } from './helpers';
import sqlite3 from "sqlite3"

console.log(app.getPath("userData"))

var db = new sqlite3.Database(path.join(app.getPath("userData"), "debateCards.db"), () => {
  db.run(`CREATE VIRTUAL TABLE cards USING FTS5(
    id,
    tag,
    cite,
    card,
    text,
    file
  )`, () => { })
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
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('query', async (event, arg) => {
  db.all(`SELECT * 
  FROM cards 
  WHERE cards MATCH ?`, arg, (err, rows) => {
    console.log(err)
    event.sender.send('query', JSON.stringify(rows));
  })
});

ipcMain.on('scrape', async (event, arg) => {
  console.log("BOOOM scraping 123")
  await scrape(arg, (card, dir) => {
    event.sender.send('card-added', JSON.stringify([card, dir]));
  })
  event.sender.send('cards-done');
});

ipcMain.on('delete-all', async (event, arg) => {
  db.run("DELETE FROM cards")
});

ipcMain.on('delete', async (event, arg) => {
  db.run("DELETE FROM cards WHERE id=?", arg)
});
