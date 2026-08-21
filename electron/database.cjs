const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

function createDatabase(userDataPath) {
  fs.mkdirSync(userDataPath, { recursive: true });
  const databasePath = path.join(userDataPath, "motopartes.sqlite");
  const database = new Database(databasePath);

  database.pragma("foreign_keys = ON");
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  database.exec(schema);
  migrateSchema(database);

  return { database, databasePath };
}

function registerDatabaseHandlers(ipcMain, database) {
  ipcMain.on("database:health", (event) => {
    event.returnValue = database.prepare("SELECT 1 AS ok").get().ok === 1;
  });

  ipcMain.on("database:summary", (event) => {
    const clientes = database.prepare("SELECT COUNT(*) AS count FROM clientes").get().count;
    const motos = database.prepare("SELECT COUNT(*) AS count FROM motos").get().count;
    const recomendados = database.prepare("SELECT COUNT(*) AS count FROM recomendado").get().count;
    event.returnValue = { clientes, motos, recomendados };
  });

  ipcMain.on("database:request", (event, request) => {
    try {
      event.returnValue = handleRequest(database, request);
    } catch (error) {
      event.returnValue = {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });
}

const baseMotoColumns = [
  "marca",
  "modelo",
  "anio",
  "cilindraje",
  "tipo_motor",
  "refrigeracion",
  "sistema_combustible",
];

const pieceColumns = [
  "bloque_carter_motor", "cilindro", "culata", "piston", "aros_piston", "bulon_piston", "biela", "ciguenal", "arbol_levas", "valvulas_admision_escape", "resortes_valvula", "balancines", "cadena_distribucion", "tensor_distribucion", "engranajes_distribucion", "bomba_aceite", "filtro_aceite", "tapon_drenaje", "carter_aceite",
  "embrague", "discos_embrague", "separadores_embrague", "canasta_campana_embrague", "plato_presion", "resortes_embrague", "caja_cambios", "ejes_transmision", "engranajes", "selector_cambios", "horquillas_selectoras", "pinon_salida", "cadena", "corona_trasera", "tensor_ajustadores_cadena",
  "tanque_combustible", "tapa_tanque", "llave_combustible", "bomba_gasolina", "filtro_combustible", "carburador_inyector", "cuerpo_aceleracion", "mangueras_combustible", "regulador_presion", "inyectores", "flotador_sensor_nivel",
  "filtro_aire", "caja_filtro_aire", "conductos_admision", "multiple_admision", "escape", "multiple_escape", "silenciador", "catalizador", "sensor_oxigeno",
  "radiador", "ventilador", "bomba_agua", "mangueras_refrigeracion", "termostato", "deposito_refrigerante", "sensor_temperatura", "aletas_refrigeracion", "conductos_deflectores_aire",
  "rin_delantero", "neumatico_delantero", "camara_delantera", "eje_delantero", "rodamientos_delanteros", "disco_freno_delantero", "rin_trasero", "neumatico_trasero", "camara_trasera", "eje_trasero", "rodamientos_traseros", "corona", "disco_freno_trasero", "tambor_freno_trasero", "maneta_freno", "bomba_freno", "deposito_liquido_freno", "latiguillo_manguera_freno", "pinza_freno", "pastillas_freno", "disco_freno", "tambor", "zapatas",
  "chasis_bastidor", "subchasis", "basculante", "amortiguador_trasero", "horquilla_delantera", "barras_horquilla", "botellas_horquilla", "resortes_horquilla", "tijas_superior_inferior", "rodamientos_direccion", "eje_direccion",
  "manillar", "punos", "acelerador", "cable_sensor_acelerador", "maneta_embrague", "maneta_freno_control", "pedal_cambio", "pedal_freno", "estriberas", "soporte_estriberas", "caballete_lateral", "caballete_central",
  "bateria", "alternador_estator", "rotor_volante_magnetico", "regulador_rectificador", "motor_arranque", "rele_arranque", "solenoide", "ecu_cdi", "bobina_encendido", "bujia", "cableado", "fusibles", "reles", "interruptor_encendido", "interruptor_luces", "interruptor_intermitentes", "claxon", "sensores",
  "faro_delantero", "luz_posicion", "luz_trasera", "luz_freno", "intermitentes", "bombillas_modulos_led", "luz_matricula",
  "deposito_tanque", "asiento", "guardabarros_delantero", "guardabarros_trasero", "carenados", "paneles_laterales", "colin", "cupula_parabrisas", "parrilla_portaequipaje", "soporte_matricula",
  "velocimetro", "tacometro", "odometro", "indicador_combustible", "indicador_temperatura", "pantalla_panel_instrumentos", "testigo_aceite", "testigo_motor", "testigo_direccionales", "testigo_luces_altas", "testigo_neutro",
  "tornillos", "tuercas", "arandelas", "pasadores", "clips", "seguros", "abrazaderas", "retenes", "juntas", "o_rings", "rodamientos", "bujes", "resortes", "cables", "mangueras",
];

function quoteColumn(column) {
  return `"${column.replaceAll('"', '""')}"`;
}

const motoColumns = [...baseMotoColumns, ...pieceColumns];
const recomendadoColumns = [
  "marca",
  "modelo",
  "anio",
  "cilindraje",
  "tipo_motor",
  "refrigeracion",
  "sistema_combustible",
  ...pieceColumns,
  ...pieceColumns.map((column) => `posible_adaptacion_${column}`),
];

function migrateSchema(database) {
  const version = database.prepare("SELECT version FROM schema_version LIMIT 1").get().version;
  if (version >= 4) return;

  database.exec(`
    CREATE TABLE IF NOT EXISTS galera (
      id_galera INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_cliente TEXT NOT NULL,
      repuestos TEXT NOT NULL,
      total_lps REAL NOT NULL DEFAULT 0 CHECK (total_lps >= 0),
      trabajo_terminado INTEGER NOT NULL DEFAULT 0 CHECK (trabajo_terminado IN (0, 1))
    )
  `);

  database.exec(`
    CREATE TABLE IF NOT EXISTS galera_items (
      id_item INTEGER PRIMARY KEY AUTOINCREMENT,
      id_galera INTEGER NOT NULL,
      repuesto TEXT NOT NULL,
      precio_lps REAL NOT NULL CHECK (precio_lps >= 0),
      FOREIGN KEY (id_galera) REFERENCES galera(id_galera) ON DELETE CASCADE
    )
  `);

  const legacyGalera = database.prepare("SELECT id_galera, repuestos, total_lps FROM galera WHERE repuestos <> '' AND NOT EXISTS (SELECT 1 FROM galera_items WHERE galera_items.id_galera = galera.id_galera)").all();
  const insertLegacyItem = database.prepare("INSERT INTO galera_items (id_galera, repuesto, precio_lps) VALUES (?, ?, ?)");
  for (const record of legacyGalera) insertLegacyItem.run(record.id_galera, record.repuestos, Number(record.total_lps) || 0);

  if (version >= 3) {
    database.prepare("UPDATE schema_version SET version = 4").run();
    return;
  }

  if (version >= 2) {
    database.prepare("UPDATE schema_version SET version = 4").run();
    return;
  }

  const motoExisting = new Set(database.prepare("PRAGMA table_info(motos)").all().map((column) => column.name));
  const recomendadoExisting = new Set(database.prepare("PRAGMA table_info(recomendado)").all().map((column) => column.name));

  const migrateTable = (table, columns, existing) => {
    for (const column of columns) {
      if (!existing.has(column)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${quoteColumn(column)} TEXT`);
    }
  };

  migrateTable("motos", pieceColumns, motoExisting);
  migrateTable("recomendado", pieceColumns.flatMap((column) => [column, `posible_adaptacion_${column}`]), recomendadoExisting);

  const motoRows = database.prepare("SELECT id_moto, piezas_json FROM motos WHERE piezas_json <> '{}' AND piezas_json IS NOT NULL").all();
  const updateMoto = database.prepare(`UPDATE motos SET ${pieceColumns.map((column) => `${quoteColumn(column)} = @${column}`).join(", ")}, piezas_json = '{}' WHERE id_moto = @id_moto`);
  for (const row of motoRows) {
    const values = parseJson(row.piezas_json);
    updateMoto.run({
      id_moto: row.id_moto,
      ...Object.fromEntries(pieceColumns.map((column) => [column, values[column] ?? null])),
    });
  }

  const recomendadoRows = database.prepare("SELECT id_recomendado, datos_json FROM recomendado WHERE datos_json <> '{}' AND datos_json IS NOT NULL").all();
  const recomendadoAllColumns = pieceColumns.flatMap((column) => [column, `posible_adaptacion_${column}`]);
  const updateRecomendado = database.prepare(`UPDATE recomendado SET ${recomendadoAllColumns.map((column) => `${quoteColumn(column)} = @${column}`).join(", ")}, datos_json = '{}' WHERE id_recomendado = @id_recomendado`);
  for (const row of recomendadoRows) {
    const values = parseJson(row.datos_json);
    updateRecomendado.run({
      id_recomendado: row.id_recomendado,
      ...Object.fromEntries(recomendadoAllColumns.map((column) => [column, values[column] ?? null])),
    });
  }

  database.prepare("UPDATE schema_version SET version = 4").run();
}

function parseJson(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}

function serializeRecord(record, columns, jsonColumn) {
  const core = {};
  const extra = {};

  for (const [key, value] of Object.entries(record)) {
    if (columns.includes(key)) core[key] = value;
    else if (key !== jsonColumn && key !== "id_moto" && key !== "id_recomendado" && key !== "id_cliente") extra[key] = value;
  }

  return { core, extra };
}

function hydrateRecord(record, jsonColumn) {
  const { [jsonColumn]: json, ...base } = record;
  return { ...base, ...parseJson(json) };
}

function getAll(database, entity) {
  if (entity === "clientes") return database.prepare("SELECT * FROM clientes ORDER BY id_cliente").all();
  if (entity === "motos") return database.prepare("SELECT * FROM motos ORDER BY id_moto").all().map((row) => hydrateRecord(row, "piezas_json"));
  if (entity === "recomendado") return database.prepare("SELECT * FROM recomendado ORDER BY id_recomendado").all().map((row) => hydrateRecord(row, "datos_json"));
  if (entity === "galera") return getGaleraAll(database);
  throw new Error(`Entidad no soportada: ${entity}`);
}

function getGaleraAll(database) {
  const records = database.prepare("SELECT id_galera, nombre_cliente FROM galera ORDER BY id_galera DESC").all();
  const items = database.prepare("SELECT id_item, id_galera, repuesto, precio_lps FROM galera_items ORDER BY id_item").all();
  return records.map((record) => {
    const galeraItems = items.filter((item) => item.id_galera === record.id_galera);
    return {
      ...record,
      items: galeraItems,
      total_lps: galeraItems.reduce((sum, item) => sum + Number(item.precio_lps), 0),
    };
  });
}

function getById(database, entity, id) {
  const idColumn = entity === "clientes" ? "id_cliente" : entity === "motos" ? "id_moto" : entity === "recomendado" ? "id_recomendado" : "id_galera";
  const rows = database.prepare(`SELECT * FROM ${entity} WHERE ${idColumn} = ?`).all(id);
  if (rows.length === 0) return null;
  if (entity === "galera") return getGaleraAll(database).find((record) => record.id_galera === id) || null;
  return entity === "clientes" ? rows[0] : hydrateRecord(rows[0], entity === "motos" ? "piezas_json" : "datos_json");
}

function createRecord(database, entity, data) {
  if (entity === "clientes") {
    const result = database.prepare("INSERT INTO clientes (nombre, telefono) VALUES (?, ?)").run(data.nombre, data.telefono || null);
    return getById(database, entity, result.lastInsertRowid);
  }

  if (entity === "galera") {
    const result = database.prepare(
      "INSERT INTO galera (nombre_cliente) VALUES (?)"
    ).run(data.nombre_cliente);
    return getById(database, entity, result.lastInsertRowid);
  }

  const isMoto = entity === "motos";
  const columns = isMoto ? motoColumns : recomendadoColumns;
  const { core, extra } = serializeRecord(data, columns);
  if (isMoto) {
    core.id_cliente = data.id_cliente ?? null;
    const values = [...columns.map((column) => core[column] ?? null), core.id_cliente, JSON.stringify(extra)];
    database.prepare(`INSERT INTO motos (${columns.map(quoteColumn).join(", ")}, id_cliente, piezas_json) VALUES (${columns.map(() => "?").join(", ")}, ?, ?)`).run(...values);
    return getById(database, entity, database.prepare("SELECT last_insert_rowid() AS id").get().id);
  }

  const values = [...columns.map((column) => core[column] ?? null), JSON.stringify(extra)];
  database.prepare(`INSERT INTO recomendado (${columns.map(quoteColumn).join(", ")}, datos_json) VALUES (${columns.map(() => "?").join(", ")}, ?)`).run(...values);
  return getById(database, entity, database.prepare("SELECT last_insert_rowid() AS id").get().id);
}

function updateRecord(database, entity, id, data) {
  const current = getById(database, entity, id);
  if (!current) return null;
  if (entity === "galera") {
    database.prepare(
      "UPDATE galera SET nombre_cliente = ?, repuestos = ?, total_lps = ?, trabajo_terminado = ? WHERE id_galera = ?"
    ).run(
      data.nombre_cliente ?? current.nombre_cliente,
      data.repuestos ?? current.repuestos,
      Number(data.total_lps ?? current.total_lps) || 0,
      data.trabajo_terminado === undefined ? current.trabajo_terminado : data.trabajo_terminado ? 1 : 0,
      id
    );
    return getById(database, entity, id);
  }
  if (entity === "clientes") {
    database
      .prepare("UPDATE clientes SET nombre = ?, telefono = ? WHERE id_cliente = ?")
      .run(data.nombre ?? current.nombre, data.telefono ?? current.telefono ?? null, id);
    return getById(database, entity, id);
  }

  const merged = { ...current, ...data };
  const isMoto = entity === "motos";
  const columns = isMoto ? motoColumns : recomendadoColumns;
  const { core, extra } = serializeRecord(merged, columns);
  if (isMoto) {
    core.id_cliente = merged.id_cliente ?? null;
    const assignments = [...columns.map((column) => `${quoteColumn(column)} = ?`), "id_cliente = ?", "piezas_json = ?"];
    const values = [...columns.map((column) => core[column] ?? null), core.id_cliente, JSON.stringify(extra), id];
    database.prepare(`UPDATE motos SET ${assignments.join(", ")} WHERE id_moto = ?`).run(...values);
    return getById(database, entity, id);
  }

  const assignments = [...columns.map((column) => `${quoteColumn(column)} = ?`), "datos_json = ?"];
  const values = [...columns.map((column) => core[column] ?? null), JSON.stringify(extra), id];
  database.prepare(`UPDATE recomendado SET ${assignments.join(", ")} WHERE id_recomendado = ?`).run(...values);
  return getById(database, entity, id);
}

function deleteRecord(database, entity, id) {
  const idColumn = entity === "clientes" ? "id_cliente" : entity === "motos" ? "id_moto" : entity === "recomendado" ? "id_recomendado" : "id_galera";
  const result = database.prepare(`DELETE FROM ${entity} WHERE ${idColumn} = ?`).run(id);
  return result.changes > 0;
}

function addGaleraItem(database, id, data) {
  const result = database.prepare(
    "INSERT INTO galera_items (id_galera, repuesto, precio_lps) VALUES (?, ?, ?)"
  ).run(id, data.repuesto, Number(data.precio_lps) || 0);
  return database.prepare("SELECT id_item, id_galera, repuesto, precio_lps FROM galera_items WHERE id_item = ?").get(result.lastInsertRowid);
}

function deleteGaleraItem(database, id) {
  return database.prepare("DELETE FROM galera_items WHERE id_item = ?").run(id).changes > 0;
}

function handleRequest(database, request) {
  const { operation, payload = {} } = request || {};
  if (operation === "getAll") return getAll(database, payload.entity);
  if (operation === "getById") return getById(database, payload.entity, payload.id);
  if (operation === "getByClienteId") {
    return getAll(database, "motos").find((moto) => moto.id_cliente === payload.id) || null;
  }
  if (operation === "create") return createRecord(database, payload.entity, payload.data);
  if (operation === "update") return updateRecord(database, payload.entity, payload.id, payload.data);
  if (operation === "delete") return deleteRecord(database, payload.entity, payload.id);
  if (operation === "addGaleraItem") return addGaleraItem(database, payload.id, payload.data);
  if (operation === "deleteGaleraItem") return deleteGaleraItem(database, payload.id);
  if (operation === "search") {
    const marca = String(payload.marca || "").toLowerCase().trim();
    const modelo = String(payload.modelo || "").toLowerCase().trim();
    return getAll(database, "recomendado").filter((record) =>
      (!marca || record.marca.toLowerCase().includes(marca)) &&
      (!modelo || record.modelo.toLowerCase().includes(modelo))
    );
  }
  throw new Error(`Operación no soportada: ${operation}`);
}

module.exports = { createDatabase, registerDatabaseHandlers };