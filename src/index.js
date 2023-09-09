// Game assets
import './style.scss'
import map from '/assets/map.png'
import tower from '/assets/tower.png'
import tower2 from '/assets/tower2.png'

import { Ene1 } from './ene1.js'
import { Ene2 } from './ene2.js'
import { Ene3 } from './ene3.js'
import waypoints from './waypoints.js'
import { Towers } from "./towers.js";
import builds_pos from "./builds_pos.js";

// Global variables
window.$ = (selector) => document.querySelector(selector)
window.waypoints = waypoints
window.scale = 1
window.enemies = []
window.debug = (import.meta.env.MODE == 'development')

// Local variables
let coins = 300
let lifes = 5
let updateGui = true
let enemiesKilled = true
let wave = 1
let towers = []
let buildsPlaces = []
let startWave = false
let enemiesOffset = 26
const offsetY = 26 // Lo que ocupa la barra de información del juego
const first_wp = waypoints[0]
const swBtn = $('#start_wave')
swBtn.style.left = `${first_wp.x}px`
swBtn.style.top = `${first_wp.y + offsetY - 16}px`

const towerSelect = $('#tower_select')
let towerPosSel = {}

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

const update = () => {
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
          projectile.target.life -= (tower.type == 1) ? 20 : 30
          tower.proyectiles.splice(i, 1)
        }

        const projectDistance = Math.hypot(
          projectile.position.x - tower.center.x,
          projectile.position.y - tower.center.y
        )
        if (projectDistance >= tower.radius + 2) tower.proyectiles.splice(i, 1)
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
    } else {
      swBtn.style.display = 'block'
    }

    // Wait 5 seconds before next wave
    if (enemies.length == 0 && startWave) {
      wave++
      startWave = false
      /*
      setTimeout( () => {
        newWave()
        startWave = true
      }, 5000)
      */
    }
  }

  if (updateGui) {
    $('#coins').innerText = coins
    $('#lifes').innerHTML = ''
    for (let i = 1; i <= 5; i++) {
      const cssClass = (i <= lifes) ? 'heart' : 'heart_empty'
      $('#lifes').innerHTML +=  `<span class="${cssClass}" /></span>`
    }
    $('#wave').innerText = `Wave: ${wave}`
    updateGui = false
  }
  
  requestAnimationFrame(update)
}

const newWave = () => {
  enemies = []

  const _enes = []
  for (let i = 1; i <= wave; i++) {
    [...Array(4)].forEach( () => {
      if (i >= 3 && i % 3 == 0) _enes.push(2)
      else if (i >= 5 && i % 5 == 0) _enes.push(3)
      else _enes.push(1)
    })
  }

  let _offset = enemiesOffset
  
  _enes.forEach( (ene, i) => {
    _offset += (wave >= 3 && wave % 3 == 0) ? enemiesOffset - (wave / 3) : enemiesOffset
    if (i > 0 && i % 4 == 0) _offset += enemiesOffset
    if (ene == 1) enemies.push(new Ene1(waypoints[0].x - _offset, waypoints[0].y - 8))
    else if (ene == 2) enemies.push(new Ene2(waypoints[0].x - _offset, waypoints[0].y - 8))
    else enemies.push(new Ene3(waypoints[0].x - _offset, waypoints[0].y - 8))    
  })
}

const reset = () => {
  enemies = []
  towers = []
  coins = 300
  enemiesKilled = 0
  lifes = 5
  wave = 1
  startWave = false
  updateGui = true
}

canvas.addEventListener('click', e => {
  e.stopPropagation()
  const mouseX = Math.round(e.clientX)
  const mouseY = Math.round(e.clientY) - offsetY

  for(let i = 0; i < buildsPlaces.length; i++) {
    const place = buildsPlaces[i]

    /*
    if (
      (mouseX >= place.x && mouseX <= place.x + 32) &&
      (mouseY >= place.y && mouseY <= place.y + 32) &&
      !place.isOccupied && coins - 100 >= 0
    ) {
      //towers.push(new Towers(place.x, place.y, tower, 49))
      towers.push(new Towers(place.x, place.y, tower, 49, 1))
      buildsPlaces[i].isOccupied = true
      coins -= 100
      updateGui = true
      break
    }*/
    if (
      (mouseX >= place.x && mouseX <= place.x + 32) &&
      (mouseY >= place.y && mouseY <= place.y + 32) &&
      !place.isOccupied
    ) {
      towerSelect.style.top = `${place.y + 16}px`
      towerSelect.style.left = `${place.x - 16}px`
      towerSelect.style.display = 'flex'
      towerPosSel = {
        x: place.x,
        y: place.y,
        index: i
      }
      break
    } else {
      towerSelect.style.display = 'none'
    }
  }
})

$('#start_game').addEventListener('click', () => {
  reset()
  gameStatus = 2
  newWave()
  //setTimeout( () => startWave = true, 5000)
  $('#screens').style.display = 'none'
  $('#start_screen').style.display = 'none'
})

$('#goto_start').addEventListener('click', () => {
  gameStatus = 1
  $('#game_over').style.display = 'none'
  $('#start_screen').style.display = 'block'
})

document.querySelectorAll('.tower_btn').forEach( ele => {
  ele.addEventListener('click', function(e) {
    if (e.detail > 1) return; // Prevent more than click
    const type = this.getAttribute('data-tower')
    const reduceCoins = (type == 1) ? 100 : 150
    const tSprite =(type == 1) ? tower : tower2

    if (coins - reduceCoins >= 0) {
      towers.push(new Towers(towerPosSel.x, towerPosSel.y, tSprite, 49, type))
      buildsPlaces[towerPosSel.index].isOccupied = true
      coins -= reduceCoins
      updateGui = true
    }
      
    towerSelect.style.display = 'none'
  })
})

swBtn.addEventListener('click', () => {
  newWave()
  startWave = true
  swBtn.style.display = 'none'
})

window.addEventListener('click', (e) => {
  towerSelect.style.display = 'none'
})
