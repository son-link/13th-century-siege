import { Enemy } from './enemy'
import Ene3Sprite from './assets/ene3.png'

class Ene3 extends Enemy {
  constructor(x, y) {
    const options = {
      x: x,
      y: y,
      sprite: Ene3Sprite,
      life: 70,
      coins: 10,
      speed: .80
    }
    super(options)
    this.options = options
  }
}

export { Ene3 }