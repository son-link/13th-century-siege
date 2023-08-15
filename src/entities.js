class Entity {
	constructor(options = {x: 0, y: 0, sprite: ''}) {
		this.position = {
      x: options.x,
      y: options.y
    }
    this.image = new Image();
    this.center = {
      x: options.x ,
      y: options.y
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.radius = 9
    this.image.src = options.sprite
    this.wpIndex = 0
    this.life = 100
	}

  draw() {
    // Life bar
    ctx.fillStyle = '#3cacd7'
    ctx.fillRect(this.position.x, this.position.y + 16, 16, 4)
    
    ctx.fillStyle = '#38d973'
    ctx.fillRect(this.position.x + 1, this.position.y + 17, (14 * this.life) / 100, 2);

    ctx.drawImage(this.image, this.position.x, this.position.y, 16, 16);
  }

  update() {
    this.draw()
    const waypoint = waypoints[this.wpIndex]
    const xDistance = waypoint.x - this.center.x
    const yDistance = waypoint.y - this.center.y
    const angle = Math.atan2(yDistance, xDistance)

    this.velocity.x = Math.cos(angle) * .25
    this.velocity.y = Math.sin(angle) * .25
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.center.x = this.position.x + 8
    this.center.y = this.position.y + 8

    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
      this.wpIndex < waypoints.length - 1
    ) {
      this.wpIndex++
    }
  }
}

export { Entity }