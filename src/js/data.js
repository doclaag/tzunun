const ROUTE_LOOPS = 4;
const LATER_LOOP_STRETCH = 1.15;

const STOP_TABLE = [
  ['Huehuetenango', 'Soloma está a unos 76 km de la cabecera. El camino sube a la Sierra de los Cuchumatanes pasando por Chiantla.', 'town', 3600, 0],
  ['Chiantla', 'En la colonia fue doctrina mercedaria de Nuestra Señora de la Candelaria, igual que San Pedro de Solomá.', 'church', 4400, 0],
  ['Mirador Juan Diéguez Olaverri', 'Punto de referencia de la ruta 9N, en lo alto de los Cuchumatanes. Aquí arriba la neblina puede tapar el camino de repente.', 'mirador', 4800, 1],
  ['Llamas de Todos Santos', 'Cerca del camino a Todos Santos Cuchumatán hay llamas y alpacas. Todos Santos es famoso por su traje: pantalón de rayas rojas y blancas, camisa de cuello bordado y sombrero de paja.', 'llamas', 4800, 1],
  ['La Capellanía', 'En la planicie de los Cuchumatanes: tierra de papa, queso y rebaños de ovejas.', 'farm', 5000, 1],
  ["Piedras de Kab'Tzin", "Dos piedras enormes, paradas a unos 3,300 msnm en la entrada de San Juan Ixcoy. Kab' significa «dos» en q'anjob'al. La leyenda dice que son la princesa Xinabajul y Akik Balam, convertidos en piedra.", 'rocks', 5200, 1],
  ['San Juan Ixcoy', 'Desde aquí faltan unos 22 km, cerca de una hora, para llegar a Soloma.', 'town', 5400, 0],
  ['San Pedro Soloma', "«Un diamante engarzado en el corazón de los Cuchumatanes»: el Valle del Ensueño, a 2,270 msnm. Su nombre viene de Tz'ulum'a, «árbol junto al agua».", 'soloma', 4200, 0],
  ['La laguna perdida', 'Se cuenta que en el centro del valle hubo una laguna. Desapareció con el terremoto de Santa Marta de 1773 y dejó suelo firme donde hoy está el pueblo.', 'lake', 4600, 0],
  ['Parroquia de Soloma', 'En 1695 el historiador Fuentes y Guzmán la describió con lámpara de plata, un muy buen órgano y tres campanas en la torre.', 'church', 4800, 0],
  ['Mercado y parque central', 'Mercado desde 1911 y parque desde 1940. El traje solomero: ellos, capixay negro de lana sobre ropa blanca y sombrero con cinta roja; ellas, huipil blanco con cuello de franjas de colores y corte rojo.', 'soloma', 5000, 0],
  ['Cascada Pajaj', 'Cae desde unos 100 metros. Es una de las cataratas más altas de Guatemala, junto al casco de Soloma.', 'falls', 5400, 0],
  ['Santa Eulalia', "A unos 8 km de Soloma. Se fundó en el siglo XVI como reducción q'anjob'al.", 'church', 5600, 0],
  ['Río Quisil', 'A unos 11 km de Soloma, entre bosques de pinos y cipreses.', 'river', 5800, 0],
  ['Laguna Encantada', 'A unos 12 km de Soloma.', 'lake', 6000, 0],
  ['Cascada de Pepajau', 'A unos 14 km de Soloma: otra caída de agua para conocer en la región.', 'falls', 6600, 0],
];
const stops = STOP_TABLE.map(([name, fact, landmark, stretch, fog]) => ({ name, fact, landmark, stretch, fog }));
const STOP_COUNT = stops.length;

const KM_SIGNS = { 0: 'Soloma 76 km', 6: 'Soloma 22 km' };

const DEATH_TEXT = {
  ground: 'Caíste',
  noNectar: 'Sin néctar',
  hawk: 'Te atrapó un gavilán',
  pine: 'Chocaste con un pino',
  stone: 'Chocaste con una piedra',
  cloud: 'Te mojó la lluvia',
};

const stopStartX = [0];
for (let k = 1; k < STOP_COUNT * ROUTE_LOOPS; k++) {
  stopStartX[k] = stopStartX[k - 1] + stops[(k - 1) % STOP_COUNT].stretch * (k > STOP_COUNT ? LATER_LOOP_STRETCH : 1);
}

const stopAt = index => stops[index % STOP_COUNT];

const stopIndexAt = x => {
  let k = 0;
  while (k + 1 < stopStartX.length && stopStartX[k + 1] <= x) k++;
  return k;
};
