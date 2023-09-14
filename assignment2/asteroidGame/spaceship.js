class Spaceship {

  constructor(maxFuel=100, speed=0.2, maxSpeed=5, maxHealth=20) {
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width / 2, height / 2);
    this.acceleration = new createVector(0, 0);
    this.size = 50;
    // ================ I wrote this code ================
    this.accelerationMultiplier = speed;
    this.maxVelocity = maxSpeed;
    this.bulletSys = new BulletSystem();
    this.totalFuel = maxFuel;
    this.currFuel = maxFuel;
    this.totalHealth = maxHealth;
    this.currHealth = maxHealth;
    // ================ End of code I wrote ================
  }

  run() {
    this.bulletSys.run();
    this.move();
    this.edges();
    this.interaction();
    this.draw();
  }

  draw() {
    // ================ I wrote/modified this code ================
    push();
    imageMode(CENTER);
    image(spaceshipImg, this.location.x, this.location.y, this.size * 1.8, this.size * 2);
    pop();
    // ================ End of code I wrote ================
  }

  move() {
    // ================ I wrote this code ================
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    // ================ End of code I wrote ================
  }


  applyForce(f) {
    // ================ I wrote this code ================
    // Consume fuel when applying a force
    if (this.currFuel > 0) {
      this.currFuel -= 0.2;
    }
    if (this.currFuel < 0) {
      this.currFuel = 0;
    }
    // ================ End of code I wrote ================
    this.acceleration.add(f);
  }

  // ================ I wrote this code ================
  replenishFuel(fuelAmount) {
    // Increase fuel by 5% on call
    if (this.currFuel < this.totalFuel) {
      this.currFuel += fuelAmount;
    }
    if (this.currFuel > this.totalFuel) {
      this.currFuel = this.totalFuel;
    }
  }

  replenishHealth(healthAmount) {
    // Increase fuel by 5% on call
    if (this.currHealth < this.totalHealth) {
      this.currHealth += healthAmount;
    }
    if (this.currHealth > this.totalHealth) {
      this.currHealth = this.totalHealth;
    }
  }
  // ================ End of code I wrote ================

  interaction() {
    // ================ I wrote parts of this code (see HERE tags) ================
    if (this.currFuel != 0) {
      if (keyIsDown(LEFT_ARROW)) {
        this.applyForce(createVector(-this.accelerationMultiplier, 0));
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.applyForce(createVector(this.accelerationMultiplier, 0)); // HERE
      }
      if (keyIsDown(UP_ARROW)) {
        this.applyForce(createVector(0, -this.accelerationMultiplier)); // HERE
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.applyForce(createVector(0, this.accelerationMultiplier)); // HERE
      }
    }
    // ================ End of code I wrote ================
  }

  fire() {
    this.bulletSys.fire(this.location.x, this.location.y);
  }

  edges() {
    if (this.location.x < 0) this.location.x = width;
    else if (this.location.x > width) this.location.x = 0;
    else if (this.location.y < 0) this.location.y = height;
    else if (this.location.y > height) this.location.y = 0;
  }

  setNearEarth() {
    // ================ I wrote this code ================
    let gravity = createVector(0, 0.05);  // Earth's gravity
    let friction = this.velocity.copy();  // Friction is based on the spaceship's current velocity
    friction.mult(-1);                    // It acts in the opposite direction
    friction.normalize();
    friction.div(30);                     // It is 30 times smaller than the spaceship's velocity

    this.applyForce(gravity);
    this.applyForce(friction);
    // ================ End of code I wrote ================
  }

}
