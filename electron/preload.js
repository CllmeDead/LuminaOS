const { contextBridge } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    platform: process.platform,
    version: process.version.electron,
})