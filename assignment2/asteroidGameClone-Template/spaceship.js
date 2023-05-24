class Spaceship {

  constructor() {
    this.velocity = new createVector(0, 0);
    this.location = new createVector(width / 2, height / 2);
    this.acceleration = new createVector(0, 0);
    this.maxVelocity = 5;
    this.bulletSys = new BulletSystem();
    this.size = 50;
    this.fuel = 100; // Fuel percentage, start at 100%
  }

  run() {
    this.bulletSys.run();
    this.draw();
    this.move();
    this.edges();
    this.interaction();
  }

  draw() {
    fill(125);
    triangle(this.location.x - this.size / 2, this.location.y + this.size / 2,
      this.location.x + this.size / 2, this.location.y + this.size / 2,
      this.location.x, this.location.y - this.size / 2);
  }

  move() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }


  applyForce(f) {
    // Consume fuel when applying a force
    if (this.fuel > 0) {
      this.fuel -= 0.2;
    }
    if (this.fuel < 0) {
      this.fuel = 0;
    }
    this.acceleration.add(f);
  }

  replenishFuel() {
    // Increase fuel by 5% on call
    if (this.fuel < 100) {
      this.fuel += 5;
    }
    if (this.fuel > 100) {
      this.fuel = 100;
    }
  }

  interaction() {
    if (this.fuel != 0) {
      print(this.fuel);
      if (keyIsDown(LEFT_ARROW)) {
        this.applyForce(createVector(-0.1, 0));
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.applyForce(createVector(0.1, 0));
      }
      if (keyIsDown(UP_ARROW)) {
        this.applyForce(createVector(0, -0.1));
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.applyForce(createVector(0, 0.1));
      }
    }
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
    let gravity = createVector(0, 0.05);  // Earth's gravity
    let friction = this.velocity.copy();  // Friction is based on the spaceship's current velocity
    friction.mult(-1);                    // It acts in the opposite direction
    friction.normalize();
    friction.div(30);                     // It is 30 times smaller than the spaceship's velocity

    this.applyForce(gravity);
    this.applyForce(friction);
  }

}
