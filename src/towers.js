import { Proyectile } from "./proyectile.js";

class Towers {
	constructor(x, y, sprite, radius, type=1) {
    this.position = {
      x: x,
      y: y
    }

    this.image = new Image()
    this.image.src = sprite
    this.center = {
      x: x + 16,
      y: y + 16
    }
    this.radius = radius
    this.frames = 0

    this.targets = []
    this.proyectiles = []
    this.type = type
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, 32, 32)
    this.proyectiles.forEach(projectile => projectile.update())
  }

  update() {
    if (this.frames % Math.floor(60 / speedMulti) == 0) {
      for(let i = 0; i < enemies.length; i++) {
        const ene = enemies[i]
        let xDistance = ene.position.x - this.position.x
        let yDistance = ene.position.y - this.position.y
        const distance = Math.hypot(yDistance, xDistance)

        if (distance < ene.radius + this.radius) {
          this.proyectiles.push(new Proyectile({
            position: {
              x: this.center.x,
              y: this.center.y
            },
            target: ene
          }))
          break
        }
      }
    }

    this.frames++
    this.draw()
  }
}

export { Towers }