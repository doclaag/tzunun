# Tz'unun

Un colibrí vuela por los Cuchumatanes hasta San Pedro Soloma, Guatemala. Bebe néctar en el aire, esquiva gavilanes y desbloquea postales de la historia, los trajes y los paisajes de cada lugar.

Juega en https://doclaag.github.io/tzunun/

Todo el juego cabe en un solo `index.html` de menos de 32 KB: sin bibliotecas ni archivos externos. Los dibujos salen de canvas y los sonidos de Web Audio.

## Cómo se juega
- Mantén presionado (toque o Espacio) para subir; suelta para bajar.
- Quédate frente a una flor para beber: el camino se detiene, pero los gavilanes siguen avanzando.
- Cuidado con los pinos, la lluvia y el viento. Si pierdes, verás la ruta con las postales del viaje.

## Cómo compilar
```
pnpm install
pnpm run build
```
Esto une `src/` en el `index.html` minificado de la raíz, que es el archivo que publica GitHub Pages. No lo edites a mano: cambia `src/` y vuelve a compilar. La compilación falla si el archivo pasa de 32 KB.

## Mapa del código
```
src/
  index.html     estructura de la página y favicon en línea
  style.css      estilos del HUD y las pantallas
  js/
    data.js      tabla de paradas, distancias y textos
    state.js     lienzo, guardado local y variables de la partida
    audio.js     zumbido de alas y efectos con Web Audio
    input.js     teclado y toque
    world.js     generación de obstáculos, flores y animales
    physics.js   vuelo, néctar, choques y beber de las flores
    render.js    dibujo: cielo, paisajes, gente, animales y colibrí
    ui.js        HUD, ruta final y álbum
    main.js      arranque y bucle del juego
build.mjs        une y minifica todo en index.html
```
Los archivos de `js/` no son módulos: `build.mjs` los concatena en un orden fijo dentro de una sola función, así que comparten sus variables.

## Datos
Historia «Fundación de San Pedro Soloma», Wikipedia y GuateValley.

## Licencia
MIT
