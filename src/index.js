// Game assets
import css from './assets/style.css'
import map from './assets/map.png'
import tower from './assets/tower.png'

import { Ene1 } from './ene1.js'
import { Ene2 } from './ene2.js'
import waypoints from './waypoints.js'
import { Towers } from "./towers.js";
import builds_pos from "./builds_pos.js";

// Global variables
window.$ = (selector) => document.querySelector(selector)
window.waypoints = waypoints
window.scale = 1
window.enemies = []

// Local variables
let coins = 150
let lifes = 5
let updateGui = true
let enemiesKilled = true
let wave = 1
let waveEnemies = 0
let towers = []
let buildsPlaces = []
let startWave = false
let enemiesOffset = 28
let timestampStart = null
const offsetY = 26 // Lo que ocupa la barra de información del juego

// 1: Start screen, 2: In game, 3: Game Over
let gameStatus = 1

const canvas = $('#canvas')
canvas.width = 640
canvas.height = 384
window.ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

// Load builds positions
builds_pos.forEach( (row, y) => {
  row.forEach( (tile, x) => {
    if (tile == 343) {
      buildsPlaces.push({
        x: x * 32,
        y: y * 32,
        isOccupied: false
      })
    }
  })
})

const imagen = new Image()

imagen.onload = () => {
  update()
}

imagen.src = map

const update = (timestamp) => {
  ctx.drawImage(imagen, 0, 0, 640, 384);

  if (gameStatus == 2) {
    towers.forEach( (tower) => {
      tower.update()
      for (let i = tower.proyectiles.length - 1; i >= 0; i--) {
        const projectile = tower.proyectiles[i]
    
        const ene = projectile.target
        const xDiff = ene.center.x - projectile.position.x
        const yDiff = ene.center.y - projectile.position.y
        const distance = Math.hypot(xDiff, yDiff)
        if (distance < ene.radius + projectile.radius) {
          projectile.target.life -= 20
          tower.proyectiles.splice(i, 1)
        }
      }
    })

    if (startWave) {
      enemies.forEach(ene => ene.update());

      const lastWaypoint = waypoints[waypoints.length - 1]

      for(let i = enemies.length -1; i >= 0; i--) {
        if (enemies[i].life <= 0) {
          coins += enemies[i].coins
          enemies.splice(i, 1)
          updateGui = true
          enemiesKilled++
        } else if (
          Math.round(enemies[i].center.x) >= lastWaypoint.x &&
          Math.round(enemies[i].center.y) >= lastWaypoint.y
        ) {
          enemies.splice(i, 1)
          lifes -= 1
          updateGui = true

          if (lifes == 0) {
            gameStatus = 3
            $('#screens').style.display = 'block'
            $('#game_over').style.display = 'block'
            $('#killed > span').innerText = enemiesKilled
          }
        }
      }
    }

    // Wait 5 seconds before next wave
    if (enemies.length == 0 && startWave) {
      //enemiesOffset -= 4
      wave++
      startWave = false
      setTimeout( () => {
        newWave(5)
        startWave = true
      }, 5000)
    }
  }

  if (updateGui) {
    $('#coins').innerText = coins
    $('#lifes').innerHTML = ''
    for (let i = 1; i <= 5; i++) {
      const cssClass = (i <= lifes) ? 'heart' : 'heart_empty'
      $('#lifes').innerHTML +=  `<span class="${cssClass}" /></span>`
    }
    updateGui = false
  }
  
  requestAnimationFrame(update)
}

const newWave = (enemiesCount) => {
  waveEnemies += enemiesCount
  enemies = []

  const _enes = []
  for (let i = 0; i < waveEnemies; i++)
    (wave >= 3 && i >= Math.floor(waveEnemies / 3)) ? _enes.push(2) : _enes.push(1)

  _enes.sort( () => Math.random() - 0.5)
  _enes.forEach( (ene, i) => {
    const offset = enemiesOffset * (i+1)
    if (ene == 1) enemies.push(new Ene1(waypoints[0].x - offset, waypoints[0].y - 8))
    else enemies.push(new Ene2(waypoints[0].x - offset, waypoints[0].y - 8))    
  })
}

const reset = () => {
  enemies = []
  towers = []
  coins = 150
  enemiesKilled = 0
  lifes = 5
  wave = 1
  waveEnemies = 0
  startWave = false
  updateGui = true
}

canvas.addEventListener('click', e => {
  const mouseX = Math.round(e.clientX)
  const mouseY = Math.round(e.clientY) - offsetY

  for(let i = 0; i < buildsPlaces.length; i++) {
    const place = buildsPlaces[i]

    if (
      (mouseX >= place.x && mouseX <= place.x + 32) &&
      (mouseY >= place.y && mouseY <= place.y + 32) &&
      !place.isOccupied && coins - 50 >= 0
    ) {
      towers.push(new Towers(place.x, place.y, tower, 48))
      buildsPlaces[i].isOccupied = true
      coins -= 50
      updateGui = true
      break
    }
  }
})

$('#start_game').addEventListener('click', () => {
  reset()
  gameStatus = 2
  newWave(5)
  setTimeout( () => startWave = true, 5000)
  $('#screens').style.display = 'none'
  $('#start_screen').style.display = 'none'
})

$('#goto_start').addEventListener('click', () => {
  gameStatus = 1
  $('#game_over').style.display = 'none'
  $('#start_screen').style.display = 'block'
})