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
window.speedMulti = 1

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
let offsetX = 0;
window.scale = 1
let scaleCanvas = true
const first_wp = waypoints[0]
const swBtn = $('#start_wave')
swBtn.style.left = `${first_wp.x + offsetX}px`
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

const imagen = new Image()

imagen.onload = () => {
  onResize()
  update()
}

imagen.src = map

const update = () => {
  if (scaleCanvas) {
    ctx.save()
    ctx.scale(scale, scale)
  }

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
        if (projectDistance >= tower.radius + 8) tower.proyectiles.splice(i, 1)
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
    $('#vel').innerText = `X${speedMulti}`
    updateGui = false
  }
  
  if (scaleCanvas) {
    ctx.restore()
    scaleCanvas = false
  }

  requestAnimationFrame(update)
}

const newWave = () => {
  enemies = []

  const _enes = []
  for (let i = 1; i <= wave; i++) {
    [...Array(5)].forEach( () => {
      if (i >= 3 && i % 3 == 0) _enes.push(2)
      else if (i >= 5 && i % 5 == 0) _enes.push(3)
      else _enes.push(1)
    })
  }

  let _offset = enemiesOffset
  
  _enes.forEach( (ene, i) => {
    _offset += (wave >= 4 && wave % 2 == 0) ? Math.floor(enemiesOffset - (wave / 2)) : enemiesOffset
    if (i > 0 && i % 5 == 0) _offset += enemiesOffset
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
  speedMulti = 1
}

const onResize = () => {
  const gameStyle = window.getComputedStyle($('#game'))
  const winHeight = window.innerHeight
  
  scale = gameStyle.height.replace('px', '') / (412)
  scale = parseFloat(scale.toFixed(2))

  $('#game').style.width = (winHeight < 420) ? `${640 * scale}px` : '100%'
  scaleCanvas = true

  const gameOffset = canvas.getBoundingClientRect()
  offsetX = gameOffset.left

  // Load builds positions
  const oldPlaces = buildsPlaces;
  buildsPlaces = []
  builds_pos.forEach( (row, y) => {
    row.forEach( (tile, x) => {
      if (tile == 343) {
        buildsPlaces.push({
          x: Math.floor(x * (32 * scale)),
          y: Math.floor(y * (32 * scale)),
        })
      }
    })
  })

  if (!!oldPlaces) {
    buildsPlaces.forEach( (place, i) => {
      if (!!oldPlaces[i] && oldPlaces[i].isOccupied) buildsPlaces[i].isOccupied = true
    })
  }

  swBtn.style.left = '0'
  swBtn.style.top = `${Math.floor((first_wp.y + offsetY - 16) * scale)}px`
  swBtn.style.width = `${32 * scale}px`
  swBtn.style.height = `${32 * scale}px`
}

canvas.addEventListener('click', e => {
  e.stopPropagation()
  const mouseX = Math.round(e.clientX) - offsetX
  const mouseY = Math.round(e.clientY) - offsetY

  for(let i = 0; i < buildsPlaces.length; i++) {
    const place = buildsPlaces[i]

    if (
      (mouseX >= place.x && mouseX <= place.x + 32) &&
      (mouseY >= place.y && mouseY <= place.y + 32) &&
      !place.isOccupied
    ) {
      towerSelect.style.top = `${(place.y + 16)}px`
      towerSelect.style.left = `${place.x - 16}px`
      towerSelect.style.display = 'flex'
      towerPosSel = {
        x: place.x / scale,
        y: place.y / scale,
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
      towers.push(new Towers(towerPosSel.x, towerPosSel.y, tSprite, 46, type))
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

//window.addEventListener('resize', onResize)
const observer = new ResizeObserver( () => onResize())
observer.observe($('#game'));

$('#vel').addEventListener('click', () => {
  if (speedMulti < 3) speedMulti++
  else speedMulti = 1
  updateGui = true
})


$('#show_howto').addEventListener('click', () => $('#howto').style.display = 'flex')
$('#close_howto').addEventListener('click', () => $('#howto').style.display = 'none')