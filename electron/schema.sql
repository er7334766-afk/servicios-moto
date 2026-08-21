PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
);

INSERT INTO schema_version (version)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM schema_version);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT
);

CREATE TABLE IF NOT EXISTS motos (
    id_moto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    anio INTEGER,
    cilindraje TEXT,
    tipo_motor TEXT,
    refrigeracion TEXT,
    sistema_combustible TEXT,
    piezas_json TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS recomendado (
    id_recomendado INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    anio INTEGER,
    cilindraje TEXT,
    tipo_motor TEXT,
    refrigeracion TEXT,
    sistema_combustible TEXT,
    datos_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS galera (
    id_galera INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cliente TEXT NOT NULL,
    repuestos TEXT NOT NULL DEFAULT '',
    total_lps REAL NOT NULL DEFAULT 0 CHECK (total_lps >= 0),
    trabajo_terminado INTEGER NOT NULL DEFAULT 0 CHECK (trabajo_terminado IN (0, 1))
);

CREATE TABLE IF NOT EXISTS galera_items (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_galera INTEGER NOT NULL,
    repuesto TEXT NOT NULL,
    precio_lps REAL NOT NULL CHECK (precio_lps >= 0),
    FOREIGN KEY (id_galera) REFERENCES galera(id_galera) ON DELETE CASCADE
);