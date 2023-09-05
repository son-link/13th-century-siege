import { Enemy } from './enemy'
import sprite from '/assets/ene2.png'

class Ene2 extends Enemy {
  constructor(x, y) {
    const options = {
      x: x,
      y: y,
      sprite: sprite,
      life: 140,
      coins: 10,
      speed: 0.35
    }
    super(options)
    this.options = options
  }
}

export { Ene2 }