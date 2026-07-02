const { app, BrowserWindow, shell } = require("electron")
const path = require("path")
const { spawn } = require("child_process")

const isDev = !app.isPackaged

console.log("Electron main.js starting...")

function createWindow() {
  const mainWindow = new BrowserWindow({
    width:    1200,
    height:   800,
    minWidth:  900,
    minHeight: 600,
    titleBarStyle:   "hiddenInset",
    backgroundColor: "#1C1C1E",
    webPreferences: {
      preload:          path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration:  false,
    },
    autoHideMenuBar: true,
  })

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../frontend/dist/index.html")}`

  mainWindow.loadURL(startUrl)

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" })
  }

  mainWindow.on("closed", () => {
    mainWindow.destroy()
  })
}

app.whenReady().then(() => {
  try {
    createWindow()
    console.log("Window created successfully")
  } catch (err) {
    console.error("Failed to create window:", err)
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})