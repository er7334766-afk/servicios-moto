export interface Cliente {
  id_cliente: number;
  nombre: string;
  telefono: string;
}

export interface Moto {
  id_moto: number;
  id_cliente: number | null;
  marca: string;
  modelo: string;
  anio: number | null;
  cilindraje: string;
  tipo_motor: string;
  refrigeracion: string;
  sistema_combustible: string;
  // 1. Motor
  bloque_carter_motor: string;
  cilindro: string;
  culata: string;
  piston: string;
  aros_piston: string;
  bulon_piston: string;
  biela: string;
  ciguenal: string;
  arbol_levas: string;
  valvulas_admision_escape: string;
  resortes_valvula: string;
  balancines: string;
  cadena_distribucion: string;
  tensor_distribucion: string;
  engranajes_distribucion: string;
  bomba_aceite: string;
  filtro_aceite: string;
  tapon_drenaje: string;
  carter_aceite: string;
  // 2. Transmisión
  embrague: string;
  discos_embrague: string;
  separadores_embrague: string;
  canasta_campana_embrague: string;
  plato_presion: string;
  resortes_embrague: string;
  caja_cambios: string;
  ejes_transmision: string;
  engranajes: string;
  selector_cambios: string;
  horquillas_selectoras: string;
  pinon_salida: string;
  cadena: string;
  corona_trasera: string;
  tensor_ajustadores_cadena: string;
  // 3. Combustible
  tanque_combustible: string;
  tapa_tanque: string;
  llave_combustible: string;
  bomba_gasolina: string;
  filtro_combustible: string;
  carburador_inyector: string;
  cuerpo_aceleracion: string;
  mangueras_combustible: string;
  regulador_presion: string;
  inyectores: string;
  flotador_sensor_nivel: string;
  // 4. Admisión y escape
  filtro_aire: string;
  caja_filtro_aire: string;
  conductos_admision: string;
  multiple_admision: string;
  escape: string;
  multiple_escape: string;
  silenciador: string;
  catalizador: string;
  sensor_oxigeno: string;
  // 5. Refrigeración
  radiador: string;
  ventilador: string;
  bomba_agua: string;
  mangueras_refrigeracion: string;
  termostato: string;
  deposito_refrigerante: string;
  sensor_temperatura: string;
  aletas_refrigeracion: string;
  conductos_deflectores_aire: string;
  // 6. Ruedas y frenos
  rin_delantero: string;
  neumatico_delantero: string;
  camara_delantera: string;
  eje_delantero: string;
  rodamientos_delanteros: string;
  disco_freno_delantero: string;
  rin_trasero: string;
  neumatico_trasero: string;
  camara_trasera: string;
  eje_trasero: string;
  rodamientos_traseros: string;
  corona: string;
  disco_freno_trasero: string;
  tambor_freno_trasero: string;
  maneta_freno: string;
  bomba_freno: string;
  deposito_liquido_freno: string;
  latiguillo_manguera_freno: string;
  pinza_freno: string;
  pastillas_freno: string;
  disco_freno: string;
  tambor: string;
  zapatas: string;
  // 7. Chasis y suspensión
  chasis_bastidor: string;
  subchasis: string;
  basculante: string;
  amortiguador_trasero: string;
  horquilla_delantera: string;
  barras_horquilla: string;
  botellas_horquilla: string;
  resortes_horquilla: string;
  tijas_superior_inferior: string;
  rodamientos_direccion: string;
  eje_direccion: string;
  // 8. Dirección y controles
  manillar: string;
  punos: string;
  acelerador: string;
  cable_sensor_acelerador: string;
  maneta_embrague: string;
  maneta_freno_control: string;
  pedal_cambio: string;
  pedal_freno: string;
  estriberas: string;
  soporte_estriberas: string;
  caballete_lateral: string;
  caballete_central: string;
  // 9. Sistema eléctrico
  bateria: string;
  alternador_estator: string;
  rotor_volante_magnetico: string;
  regulador_rectificador: string;
  motor_arranque: string;
  rele_arranque: string;
  solenoide: string;
  ecu_cdi: string;
  bobina_encendido: string;
  bujia: string;
  cableado: string;
  fusibles: string;
  reles: string;
  interruptor_encendido: string;
  interruptor_luces: string;
  interruptor_intermitentes: string;
  claxon: string;
  sensores: string;
  // 10. Iluminación
  faro_delantero: string;
  luz_posicion: string;
  luz_trasera: string;
  luz_freno: string;
  intermitentes: string;
  bombillas_modulos_led: string;
  luz_matricula: string;
  // 11. Carrocería
  deposito_tanque: string;
  asiento: string;
  guardabarros_delantero: string;
  guardabarros_trasero: string;
  carenados: string;
  paneles_laterales: string;
  colin: string;
  cupula_parabrisas: string;
  parrilla_portaequipaje: string;
  soporte_matricula: string;
  // 12. Instrumentación
  velocimetro: string;
  tacometro: string;
  odometro: string;
  indicador_combustible: string;
  indicador_temperatura: string;
  pantalla_panel_instrumentos: string;
  testigo_aceite: string;
  testigo_motor: string;
  testigo_direccionales: string;
  testigo_luces_altas: string;
  testigo_neutro: string;
  // 13. Tornillería
  tornillos: string;
  tuercas: string;
  arandelas: string;
  pasadores: string;
  clips: string;
  seguros: string;
  abrazaderas: string;
  retenes: string;
  juntas: string;
  o_rings: string;
  rodamientos: string;
  bujes: string;
  resortes: string;
  cables: string;
  mangueras: string;
}

export interface Recomendado {
  id_recomendado: number;
  marca: string;
  modelo: string;
  anio: number | null;
  cilindraje: string;
  tipo_motor: string;
  refrigeracion: string;
  sistema_combustible: string;
  // Each piece field has a companion posible_adaptacion_* field
  [key: string]: string | number | null | undefined;
}

export interface PieceField {
  key: keyof Moto;
  label: string;
}

export interface PieceCategory {
  id: string;
  label: string;
  fields: PieceField[];
}

export const PIECE_CATEGORIES: PieceCategory[] = [
  {
    id: "motor",
    label: "Motor",
    fields: [
      { key: "bloque_carter_motor", label: "Bloque/Cárter del motor" },
      { key: "cilindro", label: "Cilindro" },
      { key: "culata", label: "Culata" },
      { key: "piston", label: "Pistón" },
      { key: "aros_piston", label: "Aros/Anillos del pistón" },
      { key: "bulon_piston", label: "Bulón del pistón" },
      { key: "biela", label: "Biela" },
      { key: "ciguenal", label: "Cigüeñal" },
      { key: "arbol_levas", label: "Árbol de levas" },
      { key: "valvulas_admision_escape", label: "Válvulas de admisión y escape" },
      { key: "resortes_valvula", label: "Resortes de válvula" },
      { key: "balancines", label: "Balancines" },
      { key: "cadena_distribucion", label: "Cadena de distribución" },
      { key: "tensor_distribucion", label: "Tensor de distribución" },
      { key: "engranajes_distribucion", label: "Engranajes de distribución" },
      { key: "bomba_aceite", label: "Bomba de aceite" },
      { key: "filtro_aceite", label: "Filtro de aceite" },
      { key: "tapon_drenaje", label: "Tapón de drenaje" },
      { key: "carter_aceite", label: "Carter de aceite" },
    ],
  },
  {
    id: "transmision",
    label: "Transmisión",
    fields: [
      { key: "embrague", label: "Embrague" },
      { key: "discos_embrague", label: "Discos de embrague" },
      { key: "separadores_embrague", label: "Separadores del embrague" },
      { key: "canasta_campana_embrague", label: "Canasta/Campana de embrague" },
      { key: "plato_presion", label: "Plato de presión" },
      { key: "resortes_embrague", label: "Resortes de embrague" },
      { key: "caja_cambios", label: "Caja de cambios" },
      { key: "ejes_transmision", label: "Ejes de transmisión" },
      { key: "engranajes", label: "Engranajes" },
      { key: "selector_cambios", label: "Selector de cambios" },
      { key: "horquillas_selectoras", label: "Horquillas selectoras" },
      { key: "pinon_salida", label: "Piñón de salida" },
      { key: "cadena", label: "Cadena" },
      { key: "corona_trasera", label: "Corona trasera" },
      { key: "tensor_ajustadores_cadena", label: "Tensor/Ajustadores de cadena" },
    ],
  },
  {
    id: "combustible",
    label: "Combustible",
    fields: [
      { key: "tanque_combustible", label: "Tanque de combustible" },
      { key: "tapa_tanque", label: "Tapa del tanque" },
      { key: "llave_combustible", label: "Llave de combustible" },
      { key: "bomba_gasolina", label: "Bomba de gasolina" },
      { key: "filtro_combustible", label: "Filtro de combustible" },
      { key: "carburador_inyector", label: "Carburador o Inyector" },
      { key: "cuerpo_aceleracion", label: "Cuerpo de aceleración" },
      { key: "mangueras_combustible", label: "Mangueras de combustible" },
      { key: "regulador_presion", label: "Regulador de presión" },
      { key: "inyectores", label: "Inyectores" },
      { key: "flotador_sensor_nivel", label: "Flotador/Sensor de nivel" },
    ],
  },
  {
    id: "admision_escape",
    label: "Admisión y Escape",
    fields: [
      { key: "filtro_aire", label: "Filtro de aire" },
      { key: "caja_filtro_aire", label: "Caja del filtro de aire" },
      { key: "conductos_admision", label: "Conductos de admisión" },
      { key: "multiple_admision", label: "Múltiple de admisión" },
      { key: "escape", label: "Escape" },
      { key: "multiple_escape", label: "Múltiple/Colector de escape" },
      { key: "silenciador", label: "Silenciador" },
      { key: "catalizador", label: "Catalizador" },
      { key: "sensor_oxigeno", label: "Sensor de oxígeno" },
    ],
  },
  {
    id: "refrigeracion",
    label: "Refrigeración",
    fields: [
      { key: "radiador", label: "Radiador" },
      { key: "ventilador", label: "Ventilador" },
      { key: "bomba_agua", label: "Bomba de agua" },
      { key: "mangueras_refrigeracion", label: "Mangueras" },
      { key: "termostato", label: "Termostato" },
      { key: "deposito_refrigerante", label: "Depósito de refrigerante" },
      { key: "sensor_temperatura", label: "Sensor de temperatura" },
      { key: "aletas_refrigeracion", label: "Aletas de refrigeración" },
      { key: "conductos_deflectores_aire", label: "Conductos/Deflectores de aire" },
    ],
  },
  {
    id: "ruedas_frenos",
    label: "Ruedas y Frenos",
    fields: [
      { key: "rin_delantero", label: "Llanta/Rin delantero" },
      { key: "neumatico_delantero", label: "Neumático delantero" },
      { key: "camara_delantera", label: "Cámara delantera" },
      { key: "eje_delantero", label: "Eje delantero" },
      { key: "rodamientos_delanteros", label: "Rodamientos delanteros" },
      { key: "disco_freno_delantero", label: "Disco de freno delantero" },
      { key: "rin_trasero", label: "Llanta/Rin trasero" },
      { key: "neumatico_trasero", label: "Neumático trasero" },
      { key: "camara_trasera", label: "Cámara trasera" },
      { key: "eje_trasero", label: "Eje trasero" },
      { key: "rodamientos_traseros", label: "Rodamientos traseros" },
      { key: "corona", label: "Corona" },
      { key: "disco_freno_trasero", label: "Disco/Tambor de freno trasero" },
      { key: "tambor_freno_trasero", label: "Tambor de freno trasero" },
      { key: "maneta_freno", label: "Maneta de freno" },
      { key: "bomba_freno", label: "Bomba de freno" },
      { key: "deposito_liquido_freno", label: "Depósito de líquido" },
      { key: "latiguillo_manguera_freno", label: "Latiguillo/Manguera de freno" },
      { key: "pinza_freno", label: "Pinza de freno" },
      { key: "pastillas_freno", label: "Pastillas" },
      { key: "disco_freno", label: "Disco de freno" },
      { key: "tambor", label: "Tambor" },
      { key: "zapatas", label: "Zapatas" },
    ],
  },
  {
    id: "chasis_suspension",
    label: "Chasis y Suspensión",
    fields: [
      { key: "chasis_bastidor", label: "Chasis/Bastidor" },
      { key: "subchasis", label: "Subchasis" },
      { key: "basculante", label: "Basculante" },
      { key: "amortiguador_trasero", label: "Amortiguador trasero" },
      { key: "horquilla_delantera", label: "Horquilla delantera" },
      { key: "barras_horquilla", label: "Barras de horquilla" },
      { key: "botellas_horquilla", label: "Botellas de horquilla" },
      { key: "resortes_horquilla", label: "Resortes" },
      { key: "tijas_superior_inferior", label: "Tijas superior e inferior" },
      { key: "rodamientos_direccion", label: "Rodamientos de dirección" },
      { key: "eje_direccion", label: "Eje de dirección" },
    ],
  },
  {
    id: "direccion_controles",
    label: "Dirección y Controles",
    fields: [
      { key: "manillar", label: "Manillar" },
      { key: "punos", label: "Puños" },
      { key: "acelerador", label: "Acelerador" },
      { key: "cable_sensor_acelerador", label: "Cable o sensor del acelerador" },
      { key: "maneta_embrague", label: "Maneta de embrague" },
      { key: "maneta_freno_control", label: "Maneta de freno" },
      { key: "pedal_cambio", label: "Pedal de cambio" },
      { key: "pedal_freno", label: "Pedal de freno" },
      { key: "estriberas", label: "Estriberas" },
      { key: "soporte_estriberas", label: "Soporte de estriberas" },
      { key: "caballete_lateral", label: "Caballete lateral" },
      { key: "caballete_central", label: "Caballete central" },
    ],
  },
  {
    id: "electrico",
    label: "Sistema Eléctrico",
    fields: [
      { key: "bateria", label: "Batería" },
      { key: "alternador_estator", label: "Alternador/Estator" },
      { key: "rotor_volante_magnetico", label: "Rotor/Volante magnético" },
      { key: "regulador_rectificador", label: "Regulador/Rectificador" },
      { key: "motor_arranque", label: "Motor de arranque" },
      { key: "rele_arranque", label: "Relé de arranque" },
      { key: "solenoide", label: "Solenoide" },
      { key: "ecu_cdi", label: "ECU/CDI" },
      { key: "bobina_encendido", label: "Bobina de encendido" },
      { key: "bujia", label: "Bujía" },
      { key: "cableado", label: "Cableado" },
      { key: "fusibles", label: "Fusibles" },
      { key: "reles", label: "Relés" },
      { key: "interruptor_encendido", label: "Interruptor de encendido" },
      { key: "interruptor_luces", label: "Interruptor de luces" },
      { key: "interruptor_intermitentes", label: "Interruptor de intermitentes" },
      { key: "claxon", label: "Claxon" },
      { key: "sensores", label: "Sensores" },
    ],
  },
  {
    id: "iluminacion",
    label: "Iluminación y Señalización",
    fields: [
      { key: "faro_delantero", label: "Faro delantero" },
      { key: "luz_posicion", label: "Luz de posición" },
      { key: "luz_trasera", label: "Luz trasera" },
      { key: "luz_freno", label: "Luz de freno" },
      { key: "intermitentes", label: "Intermitentes" },
      { key: "bombillas_modulos_led", label: "Bombillas o módulos LED" },
      { key: "luz_matricula", label: "Luz de matrícula" },
    ],
  },
  {
    id: "carroceria",
    label: "Carrocería",
    fields: [
      { key: "deposito_tanque", label: "Depósito/Tanque" },
      { key: "asiento", label: "Asiento" },
      { key: "guardabarros_delantero", label: "Guardabarros delantero" },
      { key: "guardabarros_trasero", label: "Guardabarros trasero" },
      { key: "carenados", label: "Carenados" },
      { key: "paneles_laterales", label: "Paneles laterales" },
      { key: "colin", label: "Colín" },
      { key: "cupula_parabrisas", label: "Cúpula/Parabrisas" },
      { key: "parrilla_portaequipaje", label: "Parrilla/Portaequipaje" },
      { key: "soporte_matricula", label: "Soporte de matrícula" },
    ],
  },
  {
    id: "instrumentacion",
    label: "Instrumentación",
    fields: [
      { key: "velocimetro", label: "Velocímetro" },
      { key: "tacometro", label: "Tacómetro" },
      { key: "odometro", label: "Odómetro" },
      { key: "indicador_combustible", label: "Indicador de combustible" },
      { key: "indicador_temperatura", label: "Indicador de temperatura" },
      { key: "pantalla_panel_instrumentos", label: "Pantalla/Panel de instrumentos" },
      { key: "testigo_aceite", label: "Testigo de aceite" },
      { key: "testigo_motor", label: "Testigo de motor" },
      { key: "testigo_direccionales", label: "Testigo de direccionales" },
      { key: "testigo_luces_altas", label: "Testigo de luces altas" },
      { key: "testigo_neutro", label: "Testigo de neutro" },
    ],
  },
  {
    id: "tornilleria",
    label: "Tornillería y Piezas Pequeñas",
    fields: [
      { key: "tornillos", label: "Tornillos" },
      { key: "tuercas", label: "Tuercas" },
      { key: "arandelas", label: "Arandelas" },
      { key: "pasadores", label: "Pasadores" },
      { key: "clips", label: "Clips" },
      { key: "seguros", label: "Seguros" },
      { key: "abrazaderas", label: "Abrazaderas" },
      { key: "retenes", label: "Retenes" },
      { key: "juntas", label: "Juntas" },
      { key: "o_rings", label: "O-rings" },
      { key: "rodamientos", label: "Rodamientos" },
      { key: "bujes", label: "Bujes" },
      { key: "resortes", label: "Resortes" },
      { key: "cables", label: "Cables" },
      { key: "mangueras", label: "Mangueras" },
    ],
  },
];

export function totalPieceFields(): number {
  return PIECE_CATEGORIES.reduce((acc, cat) => acc + cat.fields.length, 0);
}

export function categoryCompletitud(moto: Moto, category: PieceCategory): { filled: number; total: number } {
  let filled = 0;
  for (const field of category.fields) {
    const val = moto[field.key];
    if (val && String(val).trim() !== "") filled++;
  }
  return { filled, total: category.fields.length };
}

export function motoCompletitud(moto: Moto): { filled: number; total: number } {
  let filled = 0;
  const total = totalPieceFields();
  for (const cat of PIECE_CATEGORIES) {
    for (const field of cat.fields) {
      const val = moto[field.key];
      if (val && String(val).trim() !== "") filled++;
    }
  }
  return { filled, total };
}

export function emptyMoto(): Omit<Moto, "id_moto"> {
  const base: Record<string, string | number | null> = {
    id_cliente: null,
    marca: "",
    modelo: "",
    anio: null,
    cilindraje: "",
    tipo_motor: "",
    refrigeracion: "",
    sistema_combustible: "",
  };
  for (const cat of PIECE_CATEGORIES) {
    for (const field of cat.fields) {
      base[field.key as string] = "";
    }
  }
  return base as unknown as Omit<Moto, "id_moto">;
}
