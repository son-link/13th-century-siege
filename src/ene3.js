import { Enemy } from './enemy'
import Ene3Sprite from './assets/ene3.png'

class Ene3 extends Enemy {
  constructor(x, y) {
    const options = {
      x: x,
      y: y,
      sprite: Ene3Sprite,
      life: 70,
      coins: 25,
      speed: .8
    }
    super(options)
    this.options = options
  }
}

export { Ene3 }