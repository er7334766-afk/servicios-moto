const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("motoPartsDesktop", {
  isElectron: true,
  databaseHealth: () => ipcRenderer.sendSync("database:health"),
  databaseSummary: () => ipcRenderer.sendSync("database:summary"),
  databaseRequest: (operation, payload) =>
    ipcRenderer.sendSync("database:request", { operation, payload }),
});