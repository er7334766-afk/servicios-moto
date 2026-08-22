const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const path = require("node:path");
const { createDatabase, registerDatabaseHandlers } = require("./database.cjs");

let database;
const sharedDatabasePath = process.env.MOTOPARTES_DATABASE_PATH || "\\\\100.105.212.66\\Compartido";

function createWindow(onLoadingReady) {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
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
      window.show();
      setImmediate(onLoadingReady);
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

  const loadFrontend = () => {
    if (renderUrl) return window.loadURL(renderUrl);
    return window.loadFile(frontendPage);
  };

  window.loadFile(loadingPage);
  return loadFrontend;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const databasePath = path.join(sharedDatabasePath, "motopartes.sqlite");
  console.log(`Base de datos: ${databasePath}`);
  const loadFrontend = createWindow(() => {
    try {
      const result = createDatabase(sharedDatabasePath);
      console.log(result.databaseExists ? "Base de datos existente abierta" : "Base de datos no encontrada; creada en la carpeta compartida");
      database = result.database;
      registerDatabaseHandlers(ipcMain, database);
      loadFrontend();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`No se pudo abrir la base de datos: ${message}`);
      dialog.showErrorBox("No se pudo abrir Inversiones Rodriguez", `No se pudo acceder a la base de datos compartida:\n\n${message}\n\nVerifica que tengas acceso a ${sharedDatabasePath} y vuelve a intentarlo.`);
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(() => {});
  });
});

app.on("window-all-closed", () => {
  if (database) database.close();
  if (process.platform !== "darwin") app.quit();
});