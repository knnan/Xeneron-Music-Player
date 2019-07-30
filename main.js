// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const mm = require('music-metadata')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
console.log('started the process');
async function parseFiles ()
{
  try
  {
    console.time("jskdl");
    Taginfos = []
    pictures = []
    let audioFiles = []
    fs.readdirSync('/media/knnan/New Volume/Music/').forEach(file =>
    {
      if (path.parse(file).ext === '.mp3')
      {
        // console.log(file);
        str1 = '/media/knnan/New Volume/Music/' + String(file)
        audioFiles.push(str1)
      }
    });
    // console.log(audioFiles);

    metadata = [];
    count = 0;
    for (const audioFile of audioFiles)
    {

      // await will ensure the metadata parsing is completed before we move on to the next file
      metadata = await mm.parseFile(audioFile);
      // console.log(metadata.common.title)
      metadata.common.picture[ 0 ].data = metadata.common.picture[ 0 ].data.toString('base64');
      Taginfos.push(metadata);
      // music_text += `${metadata.common.title} - ${metadata.common.artist}\n`;
      // console.log(music_text);
      // pictures.push(metadata.common.picture)
      // Do great things with the metadata
    }
    console.timeEnd("jskdl");

    console.log("Total files parsed = ", Taginfos.length);
    console.log("this is the result      ", Taginfos[ 0 ].common.title);
    return Taginfos;
  }
  catch (error)
  {
    console.log(error);
  }
}




// parseFiles();
function createWindow ()
{
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,

      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-finish-load', () =>
  {
    console.log("printing the result");
    let result = parseFiles();
    result.then((data) =>
    {

      // console.log("final result si        -------------------------- ", result);
      mainWindow.webContents.send('secretmessage', data);
    });

  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);


  // Open the DevTools.

  // Emitted when the window is closed.
  mainWindow.on('closed', function ()
  {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}





const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item'
      },
      {
        label: 'ClearItem'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click ()
        {
          app.quit();
        }
      }
    ]
  } ];



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function ()
{
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function ()
{
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
