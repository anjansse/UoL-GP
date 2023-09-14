class BulletSystem {

  constructor(enemy=false) {
    // ================ I wrote this code ================
    this.velocity = new createVector(0, -5);
    if (enemy) {
      this.velocity = new createVector(0, 3);
    }
    // ================ End of what I wrote ================
    this.bullets = [];
    this.diam = 10;
  }

  run() {
    this.move();
    this.draw();
    this.edges();
  }

  fire(x, y) {
    this.bullets.push(createVector(x, y));
  }

  //draws all bullets
  draw() {
    fill(255);
    for (var i = 0; i < this.bullets.length; i++) {
      ellipse(this.bullets[i].x, this.bullets[i].y, this.diam, this.diam);
    }
  }

  //updates the location of all bullets
  move() {
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].y += this.velocity.y;
    }
  }

  //check if bullets leave the screen and remove them from the array
  edges() {
    // ================ I wrote this code ================
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, 1);
      }
    }
    // ================ End of code I wrote ================
  }

}
