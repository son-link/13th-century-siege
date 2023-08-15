import { Entity } from './entities'
import Ene1Sprite from './assets/ene1.png'

class Ene1 extends Entity {
	constructor(x, y) {
		const options = {
			x: x,
			y: y,
			sprite: Ene1Sprite
		}
		super(options)
		this.options = options
	}
}

export { Ene1 }