import { Enemy } from './enemy'
import Ene1Sprite from './assets/ene1.png'

class Ene1 extends Enemy {
  constructor(x, y) {
    const options = {
      x: x,
      y: y,
      sprite: Ene1Sprite,
      life: 80,
      coins: 10
    }
    super(options)
    this.options = options
  }
}

export { Ene1 }