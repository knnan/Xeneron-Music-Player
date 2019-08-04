// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const util = require('util');
const mm = require('music-metadata')
const { ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


const readdirPromise = util.promisify(fs.readdir)
let mainWindow;
console.log('started the process');






ipcMain.on('asynchronous-message', (event, arg) =>
{
	parseFilesPromise(event, arg);
})



async function parseFilesPromise (event, arg)
{
	try
	{
		let audioFiles = await readdirPromise('/media/knnan/F/Music/');
		for (const audioFile of audioFiles)
		{
			if (path.parse(audioFile).ext === '.mp3')
			{
				filepath = '/media/knnan/F/Music/' + String(audioFile);
				metadata = await mm.parseFile(filepath);
				metadata.common.picture[ 0 ].data = metadata.common.picture[ 0 ].data.toString('base64');
				event.reply('asynchronous-reply', metadata);
			}
		}

	} catch (error)
	{
		console.log(error);
	}
}




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


	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

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
