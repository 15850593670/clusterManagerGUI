'use strict'
const {app, BrowserWindow, ipcMain} = require('electron')

let mainWindow = null

app.on('ready', () => {

	mainWindow = new BrowserWindow({
		frame: true,
		resizable: false,
		height: 700,
		//width: 368
		width:1500
	})		
	mainWindow.webContents.openDevTools()

	//mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    // mainWindow.loadURL(`file://${__dirname}/appG/public/index.html`)\
	mainWindow.loadURL(`file://${__dirname}/appF/index.html`)
})

ipcMain.on('close-main-window', () => {
	app.quit();
})