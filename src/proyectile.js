class Proyectile {
	constructor(options = {position: {x: 0, y: 0}, target: {}}) {
    this.position = options.position
    this.target = options.target
    this.velocity = {
      x: 0,
      y: 0
    }
    this.radius = 2
  }

  draw() {
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fill();
  }

  update() {
    this.draw()
    const xDistance = this.target.center.x - this.position.x
    const yDistance = this.target.center.y - this.position.y
    const angle = Math.atan2(yDistance, xDistance)
    this.velocity.x = Math.cos(angle) * speedMulti
    this.velocity.y = Math.sin(angle) * speedMulti
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

export { Proyectile }