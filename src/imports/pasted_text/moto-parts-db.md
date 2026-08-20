Título: Sistema de gestión de clientes, motos, piezas y recomendaciones

Diseña una aplicación web moderna, profesional y fácil de usar para una tienda/taller de repuestos de motocicletas.

IMPORTANTE:
El sistema utiliza ÚNICAMENTE 3 tablas principales en la base de datos:

1. CLIENTES
2. MOTOS
3. RECOMENDADO

No crear una estructura visual que implique más tablas principales.

============================================================
1. OBJETIVO DEL SISTEMA
============================================================

El objetivo es permitir que el negocio registre clientes y las motocicletas que poseen, almacenando información detallada de las piezas que utiliza cada motocicleta.

El sistema también debe permitir consultar una motocicleta aunque todavía no exista un cliente registrado para ella.

La función de RECOMENDADO sirve como catálogo de referencia para cada marca/modelo de motocicleta.

Ejemplo:

Un cliente llega y dice:

"Mi moto es una Bajaj NS200".

Si el cliente ya existe en la base de datos:
- Buscar al cliente.
- Mostrar su motocicleta.
- Mostrar las piezas registradas para esa motocicleta.

Si el cliente NO existe:
- El usuario puede buscar "Bajaj NS200".
- El sistema consulta la tabla RECOMENDADO.
- Muestra las piezas recomendadas/default de la NS200.
- A la par de cada pieza muestra las posibles adaptaciones.

============================================================
2. TABLA CLIENTES
============================================================

La tabla CLIENTES solamente contiene:

- id_cliente
- nombre
- telefono

No agregar dirección, correo, documento, fecha de nacimiento ni otros datos.

La interfaz de clientes debe permitir:

- Crear cliente
- Buscar cliente
- Editar cliente
- Ver cliente
- Eliminar cliente

La búsqueda debe poder hacerse principalmente por:
- Nombre
- Número de teléfono

============================================================
3. RELACIÓN CLIENTE → MOTO
============================================================

Un cliente puede tener una motocicleta asociada.

La tabla MOTOS contiene un campo id_cliente que relaciona la motocicleta con el cliente.

La interfaz debe mostrar claramente esta relación.

Ejemplo:

CLIENTE
Juan Pérez
9999-9999

MOTO
Bajaj NS200
2022
200cc

Desde el perfil del cliente debe existir una sección "Motocicleta" donde se pueda abrir toda la información de piezas de esa moto.

IMPORTANTE:
El sistema también debe permitir consultar motocicletas sin cliente asociado, porque el usuario puede buscar una moto directamente para consultar recomendaciones.

============================================================
4. TABLA MOTOS
============================================================

La tabla MOTOS contiene:

- id_moto
- id_cliente
- marca
- modelo
- año
- cilindraje
- tipo_motor
- refrigeracion
- sistema_combustible

Además contiene TODOS los campos de piezas de la motocicleta.

Los campos de piezas NO tienen campos de adaptación.

Los campos pueden estar vacíos/NULL porque la información se irá completando poco a poco.

NO obligar al usuario a llenar toda la información de una motocicleta.

Ejemplo:

Una moto recién creada puede tener:

Marca: Bajaj
Modelo: NS200
Año: 2022
Cigüeñal: Original
Bujía: NGK CR8E

Y todos los demás campos pueden estar vacíos.

Posteriormente el usuario podrá editar la moto y completar más piezas.

============================================================
5. CATEGORÍAS DE PIEZAS DE LA TABLA MOTOS
============================================================

Organizar visualmente los campos de piezas en categorías para que la interfaz no sea una lista interminable.

CATEGORÍA 1 — MOTOR

- Bloque/cárter del motor
- Cilindro
- Culata
- Pistón
- Aros/anillos del pistón
- Bulón del pistón
- Biela
- Cigüeñal
- Árbol de levas
- Válvulas de admisión y escape
- Resortes de válvula
- Balancines
- Cadena de distribución
- Tensor de distribución
- Engranajes de distribución
- Bomba de aceite
- Filtro de aceite
- Tapón de drenaje
- Carter de aceite

CATEGORÍA 2 — TRANSMISIÓN

- Embrague
- Discos de embrague
- Separadores del embrague
- Canasta/campana de embrague
- Plato de presión
- Resortes de embrague
- Caja de cambios
- Ejes de transmisión
- Engranajes
- Selector de cambios
- Horquillas selectoras
- Piñón de salida
- Cadena
- Corona trasera
- Tensor/ajustadores de cadena

CATEGORÍA 3 — COMBUSTIBLE

- Tanque de combustible
- Tapa del tanque
- Llave de combustible
- Bomba de gasolina
- Filtro de combustible
- Carburador o inyector
- Cuerpo de aceleración
- Mangueras de combustible
- Regulador de presión
- Inyectores
- Flotador/sensor de nivel

CATEGORÍA 4 — ADMISIÓN Y ESCAPE

- Filtro de aire
- Caja del filtro de aire
- Conductos de admisión
- Múltiple de admisión
- Escape
- Múltiple/colector de escape
- Silenciador
- Catalizador
- Sensor de oxígeno

CATEGORÍA 5 — REFRIGERACIÓN

- Radiador
- Ventilador
- Bomba de agua
- Mangueras
- Termostato
- Depósito de refrigerante
- Sensor de temperatura
- Aletas de refrigeración
- Conductos/deflectores de aire

CATEGORÍA 6 — RUEDAS Y FRENOS

Rueda delantera:
- Llanta/rin
- Neumático
- Cámara
- Eje delantero
- Rodamientos
- Disco de freno

Rueda trasera:
- Llanta/rin
- Neumático
- Cámara
- Eje trasero
- Rodamientos
- Corona
- Disco o tambor de freno

Frenos:
- Maneta de freno
- Bomba de freno
- Depósito de líquido
- Latiguillo/manguera
- Pinza de freno
- Pastillas
- Disco
- Tambor
- Zapatas

CATEGORÍA 7 — CHASIS Y SUSPENSIÓN

- Chasis/bastidor
- Subchasis
- Basculante
- Amortiguador trasero
- Horquilla delantera
- Barras de horquilla
- Botellas de horquilla
- Resortes
- Tijas superior e inferior
- Rodamientos de dirección
- Eje de dirección

CATEGORÍA 8 — DIRECCIÓN Y CONTROLES

- Manillar
- Puños
- Acelerador
- Cable o sensor del acelerador
- Maneta de embrague
- Maneta de freno
- Pedal de cambio
- Pedal de freno
- Estriberas
- Soporte de estriberas
- Caballete lateral
- Caballete central

CATEGORÍA 9 — SISTEMA ELÉCTRICO

- Batería
- Alternador/estator
- Rotor/volante magnético
- Regulador/rectificador
- Motor de arranque
- Relé de arranque
- Solenoide
- ECU/CDI
- Bobina de encendido
- Bujía
- Cableado
- Fusibles
- Relés
- Interruptor de encendido
- Interruptor de luces
- Interruptor de intermitentes
- Claxon
- Sensores

CATEGORÍA 10 — ILUMINACIÓN Y SEÑALIZACIÓN

- Faro delantero
- Luz de posición
- Luz trasera
- Luz de freno
- Intermitentes
- Bombillas o módulos LED
- Luz de matrícula

CATEGORÍA 11 — CARROCERÍA

- Depósito/tanque
- Asiento
- Guardabarros delantero
- Guardabarros trasero
- Carenados
- Paneles laterales
- Colín
- Cúpula/parabrisas
- Parrilla/portaequipaje
- Soporte de matrícula

CATEGORÍA 12 — INSTRUMENTACIÓN

- Velocímetro
- Tacómetro
- Odómetro
- Indicador de combustible
- Indicador de temperatura
- Pantalla/panel de instrumentos
- Testigo de aceite
- Testigo de motor
- Testigo de direccionales
- Testigo de luces altas
- Testigo de neutro

CATEGORÍA 13 — TORNILLERÍA Y PIEZAS PEQUEÑAS

- Tornillos
- Tuercas
- Arandelas
- Pasadores
- Clips
- Seguros
- Abrazaderas
- Retenes
- Juntas
- O-rings
- Rodamientos
- Bujes
- Resortes
- Cables
- Mangueras

============================================================
6. TABLA RECOMENDADO
============================================================

La tabla RECOMENDADO tiene la misma información de una motocicleta, pero agrega una columna de "Posible adaptación" junto a cada pieza.

Ejemplo:

Pieza:
Cigüeñal

Valor:
Original NS200

Posible adaptación:
Cigüeñal XYZ compatible

Visualmente debe mostrarse:

┌─────────────────────┬──────────────────────────┐
│ PIEZA               │ POSIBLE ADAPTACIÓN      │
├─────────────────────┼──────────────────────────┤
│ Cigüeñal            │ Cigüeñal XYZ            │
│ Carburador/Inyector │ Carburador ABC          │
│ Filtro de aire      │ Filtro modelo XYZ       │
│ Bujía               │ NGK equivalente         │
└─────────────────────┴──────────────────────────┘

La adaptación debe aparecer inmediatamente al lado de la pieza correspondiente.

============================================================
7. PANTALLA PRINCIPAL / DASHBOARD
============================================================

Crear un dashboard limpio y profesional.

Mostrar:

- Clientes registrados
- Motos registradas
- Modelos recomendados
- Búsqueda rápida

Agregar acciones principales:

[ + Nuevo cliente ]

[ + Nueva moto ]

[ 🔍 Buscar cliente ]

[ 🔍 Buscar moto ]

[ ⭐ Recomendados ]

La interfaz debe estar pensada para que un empleado de una tienda de repuestos pueda utilizarla rápidamente mientras atiende a un cliente.

============================================================
8. FLUJO: NUEVO CLIENTE
============================================================

Al seleccionar "Nuevo cliente":

Formulario:

Nombre
Teléfono

Botón:

[ Guardar cliente ]

Después de guardar, mostrar la opción:

[ Agregar motocicleta ]

============================================================
9. FLUJO: AGREGAR MOTO A CLIENTE
============================================================

Formulario:

Marca
Modelo
Año
Cilindraje
Tipo de motor
Refrigeración
Sistema de combustible

Después mostrar las categorías de piezas.

Cada categoría debe ser expandible/colapsable.

Ejemplo:

▼ MOTOR
   Bloque/cárter [________________]
   Cilindro      [________________]
   Culata        [________________]
   Pistón        [________________]
   Cigüeñal      [________________]

▼ TRANSMISIÓN

▼ COMBUSTIBLE

▼ ADMISIÓN Y ESCAPE

etc.

No obligar a llenar todos los campos.

Botones:

[ Guardar ]
[ Guardar y continuar después ]

============================================================
10. FLUJO: CLIENTE EXISTENTE
============================================================

Desde el buscador:

Buscar por:

Nombre
Teléfono

Mostrar resultados.

Ejemplo:

Juan Pérez
9999-9999
Bajaj NS200 2022

Al seleccionar al cliente:

Mostrar una tarjeta con:

Nombre
Teléfono
Motocicleta
Marca
Modelo
Año

Botón:

[ Ver motocicleta ]

============================================================
11. PERFIL DE LA MOTOCICLETA
============================================================

Mostrar:

Bajaj NS200
2022
200cc

Y debajo mostrar las categorías de piezas.

Cada categoría debe indicar visualmente cuántos campos están llenos.

Ejemplo:

Motor — 14/19 campos completos
Transmisión — 10/15 campos completos
Combustible — 7/11 campos completos
Frenos — 8/15 campos completos

Esto ayuda al empleado a saber qué información falta.

Agregar:

[ Editar motocicleta ]

============================================================
12. FLUJO DE RECOMENDACIONES
============================================================

Debe existir una opción llamada:

"Buscar recomendación"

El usuario selecciona:

Marca
Modelo

Ejemplo:

Marca: Bajaj
Modelo: NS200

El sistema muestra:

"Recomendaciones para Bajaj NS200"

Presentar todas las piezas disponibles.

Para cada pieza mostrar:

Nombre de pieza
Pieza recomendada
Posible adaptación

Ejemplo:

Cigüeñal
Original NS200
Adaptación: XYZ

Bujía
NGK CR8E
Adaptación: equivalente ABC

Filtro de aire
Referencia XXX
Adaptación: referencia YYY

Los campos que estén NULL/no tengan información no deben mostrarse como "NULL".

Simplemente ocultarlos o mostrar "Sin información".

============================================================
13. BUSCADOR GENERAL
============================================================

Crear un buscador global destacado.

Debe permitir buscar:

- Clientes
- Teléfonos
- Marca de moto
- Modelo de moto

El usuario debe poder encontrar rápidamente un cliente o una motocicleta.

============================================================
14. DISEÑO VISUAL
============================================================

Diseño moderno, profesional y orientado a una tienda de repuestos de motocicletas.

Estilo:

- Dashboard administrativo
- Limpio
- Profesional
- Fácil de leer
- Responsive
- Desktop-first, pero adaptable a tablet y móvil

Usar una navegación lateral.

Menú:

Dashboard
Clientes
Motos
Recomendados

Configuración

No utilizar demasiados colores.

Usar tarjetas, tablas, formularios y acordeones.

Las categorías de piezas deben utilizar acordeones para evitar que la pantalla sea excesivamente larga.

============================================================
15. TABLAS VISUALES
============================================================

En la pantalla de clientes mostrar:

Nombre
Teléfono
Moto
Acciones

Acciones:

Ver
Editar
Eliminar

En la pantalla de motos mostrar:

Marca
Modelo
Año
Cliente
Estado de información
Acciones

En "Estado de información" mostrar algo como:

78% completo

o

32/120 piezas registradas

============================================================
16. IMPORTANTE SOBRE LOS DATOS
============================================================

Los campos de piezas pueden estar vacíos.

No mostrar errores simplemente porque una pieza no tenga información.

No asumir que todas las motocicletas utilizan todas las piezas.

Por ejemplo:

Una moto refrigerada por aire puede no tener:

Radiador
Bomba de agua
Termostato

En esos casos los campos pueden quedar vacíos.

Igualmente una moto de carburador puede no utilizar:

Inyectores
ECU específica

La interfaz debe manejar correctamente estos campos vacíos.

============================================================
17. EXPERIENCIA DE USUARIO
============================================================

La aplicación debe priorizar velocidad y simplicidad.

El empleado debe poder:

1. Buscar cliente.
2. Ver su moto.
3. Buscar una pieza.
4. Ver la pieza registrada.
5. Ver posibles adaptaciones cuando corresponda.
6. Si no existe cliente, buscar directamente el modelo de moto.
7. Consultar las recomendaciones.

El objetivo principal es que el empleado pueda atender rápidamente al cliente y encontrar qué pieza utiliza su motocicleta o qué pieza alternativa podría servir.

============================================================
18. RESULTADO ESPERADO
============================================================

Diseña las siguientes pantallas:

1. Dashboard
2. Lista de clientes
3. Crear cliente
4. Perfil de cliente
5. Crear motocicleta
6. Perfil de motocicleta
7. Editar motocicleta
8. Lista de motos
9. Buscador de recomendaciones
10. Resultado de recomendaciones
11. Vista detallada de recomendaciones
12. Estados vacíos
13. Estados de carga
14. Confirmaciones de eliminación
15. Mensajes de éxito/error

El resultado debe parecer una aplicación real lista para ser utilizada por una tienda profesional de repuestos para motocicletas.

NO diseñar una tienda online ni un carrito de compras.

Este sistema es principalmente una herramienta interna de consulta y gestión de clientes, motocicletas, piezas y recomendaciones.
:::