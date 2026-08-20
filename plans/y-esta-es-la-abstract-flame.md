# Plan: Sistema de Gestión — Taller de Repuestos de Motocicletas

## Context

La app es una herramienta interna de punto de venta para un taller/tienda de repuestos de motos. Debe permitir a un empleado buscar clientes, consultar piezas de sus motos, y consultar catálogo de piezas recomendadas/adaptaciones rápidamente mientras atiende un cliente. Sin login. Datos en `localStorage` (sin backend). App nueva — `src/App.tsx` es un stub vacío.

---

## Stance

**Dark industrial / técnico.** Fondo oscuro slate (`#0f1117`), bordes hairline sutiles, acento naranja-ámbar (`#f97316`), tipografía condensada para headings. Sin gradientes. Sin redondeados exagerados. Sensación de software de taller profesional.

**Fuentes (Google Fonts):**
- Display: `Barlow Condensed` (headings, labels de categoría)
- Body: `Inter` (texto, formularios, tablas)
- Mono: `JetBrains Mono` (valores de piezas, datos técnicos)

---

## Arquitectura de archivos

```
src/
  index.css              — @import fonts + tokens CSS dark theme
  App.tsx                — router de vistas con useState
  lib/
    schema.ts            — tipos TypeScript + definición de categorías de piezas (120+ campos)
    db.ts                — CRUD localStorage para clientes, motos, recomendado
  components/
    Sidebar.tsx          — nav lateral fija (Dashboard, Clientes, Motos, Recomendados)
    Dashboard.tsx        — stats cards + búsqueda rápida + acciones
    ClientesList.tsx     — tabla de clientes con búsqueda
    ClienteForm.tsx      — crear/editar cliente
    ClienteDetail.tsx    — perfil cliente + tarjeta moto asociada
    MotosList.tsx        — tabla motos con % completitud
    MotoForm.tsx         — crear/editar moto (info base + 13 acordeones de piezas)
    MotoDetail.tsx       — perfil moto con acordeones, barra de completitud por categoría
    RecomendadoSearch.tsx — selector marca/modelo + resultados
    RecomendadoDetail.tsx — tabla pieza | recomendado | adaptación
    PieceAccordion.tsx   — acordeón reutilizable para categorías de piezas
    ConfirmDialog.tsx    — modal de confirmación de eliminación
    Toast.tsx            — mensajes éxito/error transitorios
```

---

## Capa de datos (`src/lib/`)

### `schema.ts`
- Tipos: `Cliente`, `Moto`, `Recomendado`
- Array `PIECE_CATEGORIES`: 13 categorías, cada una con `{ id, label, fields: [{key, label}] }`
- Los `key` de campos coinciden exactamente con las columnas del schema SQL
- Función `completitudMoto(moto)` → `{ total, filled }` por categoría y global

### `db.ts`
- `clientesDB`: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- `motosDB`: igual + `getByClienteId()`
- `recomendadoDB`: `getAll()`, `searchByMarcaModelo(marca, modelo)`
- Seed inicial con ~3 clientes, ~3 motos, ~2 recomendados (Bajaj NS200, Honda CB190) con datos realistas

---

## Navegación

`App.tsx` maneja vistas con `useState<View>`. Vistas:

```
dashboard | clientes-list | cliente-new | cliente-detail | cliente-edit |
motos-list | moto-new | moto-detail | moto-edit |
recomendados | recomendado-detail
```

Params de navegación: `{ view, clienteId?, motoId?, recomendadoId? }`

---

## Pantallas clave

### Dashboard
- 3 stat cards: Clientes registrados / Motos registradas / Modelos recomendados
- Búsqueda global (filtra clientes por nombre/tel y motos por marca/modelo)
- 5 botones de acción rápida

### Clientes (list)
- Tabla: Nombre | Teléfono | Moto | Acciones (Ver / Editar / Eliminar)
- Buscador por nombre o teléfono en tiempo real

### Cliente (create/edit)
- Campos: Nombre, Teléfono
- Tras crear → opción "Agregar motocicleta"

### Cliente (detail)
- Card con nombre + teléfono
- Sección moto asociada (marca, modelo, año) con botón "Ver motocicleta"
- Botones editar / eliminar cliente

### Motos (list)
- Tabla: Marca | Modelo | Año | Cliente | Completitud | Acciones
- Completitud: `"32/120 piezas"` + barra de progreso

### Moto (create/edit)
- Sección info base: marca, modelo, año, cilindraje, tipo motor, refrigeración, combustible
- 13 acordeones colapsados con campos de texto libres
- Campos no son obligatorios
- Botones: Guardar | Guardar y continuar después

### Moto (detail)
- Header: marca modelo, año, cilindraje
- 13 acordeones; cada uno muestra `"X/Y campos completos"` con mini progress bar
- Solo muestra campos con valor (oculta nulls)
- Botón Editar

### Recomendados (search)
- Dropdowns Marca / Modelo (o input libre)
- Resultados: tabla por categoría con columnas Pieza | Valor recomendado | Posible adaptación
- Campos null ocultos o `"Sin información"`

---

## Estilos (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
@import 'tailwindcss';

@theme inline {
  --color-background: #0f1117;
  --color-foreground: #e8eaf0;
  --color-card: #16191f;
  --color-border: #2a2d35;
  --color-primary: #f97316;        /* naranja-ámbar */
  --color-primary-foreground: #fff;
  --color-muted: #1e2128;
  --color-muted-foreground: #8b909e;
  --font-display: 'Barlow Condensed', sans-serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Verificación

1. App carga en preview con sidebar + dashboard visible
2. Crear cliente → se guarda y aparece en lista
3. Agregar moto al cliente → expandir acordeones, guardar campos parciales
4. Editar moto → valores persisten en localStorage
5. Eliminar cliente → modal de confirmación → se elimina
6. Buscar recomendado por Bajaj NS200 → muestra tabla con pieza/recomendado/adaptación
7. Búsqueda global desde dashboard devuelve resultados de clientes y motos
8. Reload de página → datos persisten (localStorage)
