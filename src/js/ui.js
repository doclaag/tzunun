const GAME_URL = 'https://doclaag.github.io/tzunun/';
const LOW_NECTAR_HUD = 25;

function updateHud() {
  const nextStop = currentStop + 1;
  $('hudStop').textContent = stopAt(nextStop).name;
  $('hudProgress').style.width = (Math.min(1, (cameraX - stopStartX[currentStop]) / (stopStartX[nextStop] - stopStartX[currentStop])) * 100).toFixed(1) + '%';
  $('hudDistance').textContent = formatNumber(metersFlown()) + ' m';
  $('hudNectar').style.width = nectar.toFixed(1) + '%';
  $('hudNectarBar').className = 'bar' + (nectar < LOW_NECTAR_HUD ? ' low' : '');
}

const albumProgress = () => albumStops.length + '/' + STOP_COUNT;

function showOverScreen(meters) {
  $('overReason').textContent = deathReason;
  $('overPlace').textContent = 'Llegaste hasta ' + stopAt(currentStop).name;
  $('overRoute').innerHTML = tripStops.map((stopNumber, i) => '<div' + (i == tripStops.length - 1 ? ' class="here"' : '') + '><b>' + stops[stopNumber].name + '</b><span>' + stops[stopNumber].fact + '</span></div>').join('')
    + '<div class="next"><b>Siguiente: ' + stopAt(currentStop + 1).name + '</b><span>Vuela más lejos para descubrir esta postal.</span></div>';
  $('overStats').innerHTML = 'Volaste <b>' + formatNumber(meters) + ' m</b>. Récord: ' + formatNumber(bestMeters) + ' m. Álbum: ' + albumProgress() + '.';
  $('msg').textContent = '';
  $('over').hidden = false;
  const route = $('overRoute');
  route.scrollTop = route.scrollHeight;
  $('again').focus();
}

function showAlbum() {
  $('albumTitle').textContent = albumStops.length + ' de ' + STOP_COUNT + ' lugares';
  $('albumList').innerHTML = stops.map((stop, i) => albumStops.includes(i)
    ? '<div><b>' + stop.name + '</b><span>' + stop.fact + '</span></div>'
    : '<div class="lk"><b>Parada ' + (i + 1) + '</b><span>Vuela hasta aquí para desbloquearla.</span></div>').join('');
  $('album').hidden = false;
  $('albumClose').focus();
}

function closeAlbum() {
  $('album').hidden = true;
  $('albumCount').textContent = albumProgress();
}

function shareResult() {
  const text = 'Mi tz\'unun voló hasta ' + stopAt(currentStop).name + ' (' + metersFlown() + ' m) rumbo a Soloma 🐦 ¿Hasta dónde llegas tú? ' + GAME_URL;
  const showText = () => {
    $('msg').textContent = text;
  };
  try {
    navigator.clipboard.writeText(text).then(() => {
      $('msg').textContent = 'Copiado. Pégalo en WhatsApp o donde quieras.';
    }, showText);
  } catch (e) {
    showText();
  }
}

function setupScreens() {
  $('albumCount').textContent = albumProgress();
  $('go').onclick = startGame;
  $('again').onclick = startGame;
  $('menuAlbum').onclick = showAlbum;
  $('overAlbum').onclick = showAlbum;
  $('albumClose').onclick = closeAlbum;
  $('share').onclick = shareResult;
}
