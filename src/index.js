import assets from './assets.js'
import map from './assets/map.png'
import tower from './assets/tower.png'
import { Ene1 } from './ene1.js'
import waypoints from './paths.js'
import { Towers } from "./towers.js";
import builds_pos from "./builds_pos.js";

window.$ = (selector) => document.querySelector(selector)
window.waypoints = waypoints
window.buildsPlaces = []
window.enemies = []
window.towers = []
window.proyectiles = []
window.scale = 2
window.coins = 100
window.lifes = 4
window.updateGui = true
window.wave = 0

const canvas = $('#canvas')
canvas.width = 640
canvas.height = 384
let startGame = false

// Load builds positions
builds_pos.forEach( (row, y) => {
  row.forEach( (tile, x) => {
    if (tile == 343) {
      buildsPlaces.push({
        x: x * 16,
        y: y * 16,
        isOccupied: false
      })
    }
  })
})

window.ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.scale(window.scale, window.scale);

const imagen = new Image()

imagen.onload = () => {
  newWave(3)
  update()
  setTimeout( () => startGame = true, 5000)
}

imagen.src = map

const update = () => {
  ctx.drawImage(imagen, 0, 0, 320, 192);

  towers.forEach( (tower) => {
    tower.update()
    for (let i = tower.proyectiles.length - 1; i >= 0; i--) {
      const projectile = tower.proyectiles[i]
  
      const ene = projectile.target
      const xDiff = ene.center.x - projectile.position.x
      const yDiff = ene.center.y - projectile.position.y
      const distance = Math.hypot(xDiff, yDiff)
      if (distance < ene.radius + projectile.radius) {
        projectile.target.life -= 10
        tower.proyectiles.splice(i, 1)
      }
    }
  })

  if (startGame) {
    enemies.forEach(ene => ene.update());
    proyectiles.forEach(pro => pro.update());

    for(let i = enemies.length -1; i >= 0; i--) {
      if (enemies[i].life == 0) {
        enemies.splice(i, 1)
        coins += 20
        updateGui = true
      }
    }
  }

  if (updateGui) {
    $('#coins').innerText = coins
    $('#lifes').innerHTML = ''
    for (let i = 0; i < lifes; i++) $('#lifes').innerHTML += '<img src="assets/heart.png" />'
    updateGui = false
  }

  // Wait 5 seconds before next wave
  if (enemies.length == 0 && startGame) {
    startGame = false
    setTimeout( () => {
      newWave(2)
      startGame = true
    }, 5000)
  }
  console.log(enemies.length)
  
  requestAnimationFrame(update)
}

const newWave = (enemiesCount) => {
  wave += enemiesCount
  enemies = []
  let x = -48
  for (let i = 0; i < wave; i++) {
    enemies.push(new Ene1(x, 104))
    x -= 48
  }
}

canvas.addEventListener('click', e => {
  const mouseX = Math.round(e.clientX / scale)
  const mouseY = Math.round(e.clientY / scale)

  for(let i = 0; i < buildsPlaces.length -1; i++) {
    const place = buildsPlaces[i]
    if (
      (mouseX >= place.x && mouseX <= place.x + (16 * scale)) &&
      (mouseY >= place.y && mouseY <= place.y + (16 * scale)) &&
      !place.isOccupied && coins - 50 >= 0
    ) {
      console.log(place)
      towers.push(new Towers(place.x, place.y, tower, 22))
      buildsPlaces[i].isOccupied = true
      coins -= 50
      updateGui = true
      break
    }
  }
})