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