const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("node:path");
const { createDatabase, registerDatabaseHandlers } = require("./database.cjs");

let database;

function createWindow() {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: true,
    icon: path.join(__dirname, "logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const renderUrl = process.env.MOTOPARTES_RENDER_URL;
  const loadingPage = path.join(__dirname, "loading.html");
  const frontendPage = path.join(__dirname, "..", "dist", "index.html");

  window.webContents.on("did-finish-load", () => {
    if (window.webContents.getURL().includes("loading.html")) {
      console.log("Pantalla de carga visible; esperando frontend...");
    } else {
      console.log(`Frontend cargado: ${renderUrl || "build local"}`);
    }
  });
  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`Frontend no pudo cargar (${errorCode}): ${errorDescription} - ${validatedURL}`);
  });
  window.webContents.on("console-message", (_event, _level, message, line, source) => {
    console.log(`Frontend: ${message} (${source}:${line})`);
  });

  window.loadFile(loadingPage).then(() => {
    if (renderUrl) {
      return window.loadURL(renderUrl);
    }
    return window.loadFile(frontendPage);
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const result = createDatabase(app.getPath("userData"));
  database = result.database;
  registerDatabaseHandlers(ipcMain, database);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (database) database.close();
  if (process.platform !== "darwin") app.quit();
});