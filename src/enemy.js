class Enemy {
	constructor(options = {x: 0, y: 0, sprite: '', life: 100, coins: 10}) {
		this.position = {
      x: options.x,
      y: options.y
    }
    this.image = new Image();
    this.center = {
      x: options.x + 7,
      y: options.y + 7
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.radius = 10
    this.image.src = options.sprite
    this.wpIndex = 0
    this.life = options.life
    this.lifeOri = options.life
    this.coins = options.coins
	}

  draw() {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,0,0,.5)'
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    
    // Life bar
    ctx.fillStyle = '#e6482e'
    ctx.fillRect(this.position.x, this.position.y + 18, 16, 6)
    
    ctx.fillStyle = '#38d973'
    ctx.fillRect(this.position.x + 1, this.position.y + 19, (14 * this.percentLife) / 100, 4);

    ctx.drawImage(this.image, this.position.x, this.position.y, 16, 16);
  }

  update() {
    this.draw()
    const waypoint = waypoints[this.wpIndex]
    const xDistance = waypoint.x - this.center.x
    const yDistance = waypoint.y - this.center.y
    const angle = Math.atan2(yDistance, xDistance)

    this.velocity.x = Math.cos(angle) * .40
    this.velocity.y = Math.sin(angle) * .40
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

    this.percentLife = (100 * this.life) / this.lifeOri
  }
}

export { Enemy }