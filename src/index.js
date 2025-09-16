// Game assets
import './style.scss'
import map from '/assets/map.png'
import tower from '/assets/tower.png'
import tower2 from '/assets/tower2.png'

// Game classes and variables
import { Ene1 } from './ene1.js'
import { Ene2 } from './ene2.js'
import { Ene3 } from './ene3.js'
import waypoints from './waypoints.js'
import { Towers } from "./towers.js";
import builds_pos from "./builds_pos.js";
import { hit } from './sounds'

// Global variables
window.$ = (selector) => document.querySelector(selector)
window.waypoints = waypoints
window.scale = 1
window.enemies = []
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
const offsetY = 26
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

/**
 * This function runs every browser frame and contains the necessary
 * to update enemy positions, projectile positions, drawing, etc.
 */
const update = () => {

  // When changing the screen resolution, the canvas scale must be changed.
  if (scaleCanvas) {
    ctx.save()
    ctx.scale(scale, scale)
  }

  // Map image
  ctx.drawImage(imagen, 0, 0, 640, 384);

  if (gameStatus == 2) {
    // Update towers and proyectiles
    towers.forEach( (tower) => {
      tower.update()
      for (let i = tower.proyectiles.length - 1; i >= 0; i--) {
        const projectile = tower.proyectiles[i]
    
        const ene = projectile.target
        const xDiff = ene.center.x - projectile.position.x
        const yDiff = ene.center.y - projectile.position.y
        const distance = Math.hypot(xDiff, yDiff)

        // We check to see if the projectile hits the enemy assigned to it.
        // If so, the life is subtracted.
        if (distance < ene.radius + projectile.radius) {
          projectile.target.life -= (tower.type == 1) ? 20 : 30
          tower.proyectiles.splice(i, 1)
          hit()
        }

        // We check if the projectile reached the maximum distance.
        // If so, it is deleted
        const projectDistance = Math.hypot(
          projectile.position.x - tower.center.x,
          projectile.position.y - tower.center.y
        )
        if (projectDistance >= tower.radius + 6) tower.proyectiles.splice(i, 1)
      }
    })

    if (startWave) {
      //We update the enemies
      enemies.forEach(ene => ene.update());

      const lastWaypoint = waypoints[waypoints.length - 1]

      for(let i = enemies.length -1; i >= 0; i--) {

        // If the enemy's life reached zero, remove it from the array and add the coins to the total.
        if (enemies[i].life <= 0) {
          coins += enemies[i].coins
          enemies.splice(i, 1)
          updateGui = true
          enemiesKilled++
        } else if (
          Math.round(enemies[i].center.x) >= lastWaypoint.x &&
          Math.round(enemies[i].center.y) >= lastWaypoint.y
        ) {

          //If the enemy reached the end, we subtract one life.
          enemies.splice(i, 1)
          lifes -= 1
          updateGui = true

          // If we have no lives left, we show the Game Over.
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
    }
  }

  // If necessary, we update the game interface. This is to avoid doing it on every frame.
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

  //This function is what causes update() to autofill every frame.
  requestAnimationFrame(update)
}

/**
 * This function is in charge of generating each wave.
 */
const newWave = () => {
  enemies = []

  const _enes = []
  for (let i = 1; i <= wave && i < 20; i++) {
    [...Array(5)].forEach( () => {
      if ((i >= 3 && i % 3 == 0) || (i >= 10 && i % 2 == 0)) _enes.push(2)
      else if ((i >= 5 && i % 5 == 0) || (i >= 12 && i % 3 == 0)) _enes.push(3)
      else _enes.push(1)
    })
  }

  let _offset = enemiesOffset
  
  _enes.forEach( (ene, i) => {
    _offset += (wave >= 4 && wave <= 20) ? Math.floor(enemiesOffset - (wave / 2)) : enemiesOffset
    if (i > 0 && i % 5 == 0) _offset += enemiesOffset
    if (ene == 1) enemies.push(new Ene1(waypoints[0].x - _offset, waypoints[0].y - 8))
    else if (ene == 2) enemies.push(new Ene2(waypoints[0].x - _offset, waypoints[0].y - 8))
    else enemies.push(new Ene3(waypoints[0].x - _offset, waypoints[0].y - 8))    
  })
}

/**
 * This function resets various game variables
 */
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

/**
 * This function is called every time the screen size or orientation changes
 */
const onResize = () => {
  const gameStyle = window.getComputedStyle($('#game'))
  const winHeight = window.innerHeight
  
  scale = gameStyle.height.replace('px', '') / (412)
  scale = parseFloat(scale.toFixed(2))

  $('#game').style.width = (winHeight < 420) ? `${640 * scale}px` : '100%'
  scaleCanvas = true

  const gameOffset = canvas.getBoundingClientRect()
  offsetX = gameOffset.left

  // (Re)Load builds positions
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

const observer = new ResizeObserver( () => onResize())
observer.observe($('#game'));

$('#vel').addEventListener('click', () => {
  if (speedMulti < 3) speedMulti++
  else speedMulti = 1
  updateGui = true
})

$('#show_howto').addEventListener('click', () => $('#howto').style.display = 'flex')
$('#close_howto').addEventListener('click', () => $('#howto').style.display = 'none')