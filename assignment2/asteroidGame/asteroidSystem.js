class AsteroidSystem {

  //creates arrays to store each asteroid's data
  constructor(
    minAsteroidDiams=15,
    maxAsteroidDiams=100,
    spawnRate=0.005
  ) {
    // ================ I wrote this code ================
    this.minAsteroidDiams = minAsteroidDiams;
    this.maxAsteroidDiams = maxAsteroidDiams;

    this.spawnRate = spawnRate;
    // ================ End of what I wrote ================
    this.locations = [];
    this.velocities = [];
    this.accelerations = [];
    this.diams = [];
    // ================ I wrote this code ================
    this.rotation = [];
    this.health = [];
    this.startingHealth = [];
    this.texture = [];
    // ================ End of what I wrote ================
  }

  run(){
      this.spawn();
      this.move();
      this.draw();
  }

  // spawns asteroid at random intervals
  spawn(){
    // ================ I modified/wrote this code ================
    if (random(1)<this.spawnRate){
      this.accelerations.push(new createVector(0,random(0.1,1)));
      this.velocities.push(new createVector(0, 0));
      this.locations.push(new createVector(random(width), 0));

      var size = random(minAsteroidSize, maxAsteroidSize);
      var health = int(map(size, minAsteroidSize, maxAsteroidSize, 1, 4));
      print(health);

      this.diams.push(size);
      this.rotation.push(random(-0.05, 0.05));
      this.startingHealth.push(health);
      this.health.push(health);
      this.texture.push(meteorImg[int(random(3))]);
    }
    // ================ End of modification ================
  }

  //moves all asteroids
  move(){
    for (var i=0; i<this.locations.length; i++){
      this.velocities[i].add(this.accelerations[i]);
      this.locations[i].add(this.velocities[i]);
      this.accelerations[i].mult(0);
    }
  }

  applyForce(f){
    for (var i=0; i<this.locations.length; i++){
      this.accelerations[i].add(f);
    }
  }

  //draws all asteroids
  draw(){
    noStroke();
    for (var i=0; i<this.locations.length; i++) {
      // ================ I wrote this code ================
      this.drawMeteorite(
        this.locations[i].x,
        this.locations[i].y,
        this.diams[i],
        this.texture[i],
        this.rotation[i]
      );
      if (this.health[i] != this.startingHealth[i]) {
        this.drawHealthBar(
          this.locations[i].x,
          this.locations[i].y,
          this.diams[i],
          this.health[i],
          this.startingHealth[i]
        );
      }
      // ================ End of what I wrote ================
    }
  }

  // ================ I wrote this code ================
  drawMeteorite(x, y, size, texture, rotationRate) {
    push();
    translate(x, y);
    rotate(frameCount * rotationRate);
    imageMode(CENTER);
    image(texture, 0, 0, size, size);
    pop();
  }

  //////////////////////////////////////////////////
  //draws health bar for asteroid
  drawHealthBar(x, y, size, health, startingHealth) {
    // Draw the fuel gauge at a fixed position
    let gaugeWidth = map(size, minAsteroidSize, maxAsteroidSize, 25, 140);
    let gaugeHeight = map(size, minAsteroidSize, maxAsteroidSize, 5, 10);

    // Draw the background of the gauge
    push();
    fill(255);
    rect(x - (gaugeWidth/2), y - (size * 0.7), gaugeWidth, gaugeHeight);
    fill(215, 0, 0);
    rect(x - (gaugeWidth/2), y - (size * 0.7), gaugeWidth * (health / startingHealth), gaugeHeight);
    pop();
  }
  // ================ End of code I wrote ==============

  //function that calculates effect of gravity on each asteroid and accelerates it
  calcGravity(centerOfMass){
    for (var i=0; i<this.locations.length; i++){
      var gravity = p5.Vector.sub(centerOfMass, this.locations[i]);
      gravity.normalize();
      gravity.mult(.001);
      this.applyForce(gravity);
    }
  }

  //destroys all data associated with each asteroid
  destroy(index){
    this.locations.splice(index,1);
    this.velocities.splice(index,1);
    this.accelerations.splice(index,1);
    this.diams.splice(index,1);
    // ================ I wrote this code ================
    this.health.splice(index,1);
    this.startingHealth.splice(index,1);
    this.texture.splice(index, 1);
    this.rotation.splice(index, 1);
    // ================ End of what I wrote ================
  }
}