var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

var restartButton;

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);

  initObjects();
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  drawEarth();
  drawFuelGauge();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth() {
  noStroke();
  //draw atmosphere
  fill(0, 0, 255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
  //draw earth
  fill(0, 0, 255, 255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//draws fuel gauge
function drawFuelGauge() {
  // Draw the fuel gauge at a fixed position
  let gaugeWidth = 200;
  let gaugeHeight = 20;
  let x = 20;
  let y = height - 40;

  // Draw the background of the gauge
  fill(255);
  rect(x, y, gaugeWidth, gaugeHeight);

  // Draw the fill of the gauge, with color interpolated between red and green
  let fuelColor = lerpColor(color(255, 0, 0), color(0, 255, 0), spaceship.fuel / 100);
  fill(fuelColor);
  rect(x, y, gaugeWidth * (spaceship.fuel / 100), gaugeHeight);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {

  //spaceship-2-asteroid collisions
  for (let i = asteroids.locations.length - 1; i >= 0; i--) {
    if (isInside(spaceship.location, spaceship.size, asteroids.locations[i], asteroids.diams[i])) {
      print("spaceship-2-asteroid collisions");
      gameOver("AN ASTEROID DESTROYED THE SPACESHIP");
      break;
    }
  }

  //asteroid-2-earth collisions
  for (let i = asteroids.locations.length - 1; i >= 0; i--) {
    if (isInside(earthLoc, earthSize.x, asteroids.locations[i], asteroids.diams[i])) {
      print("asteroid-2-earth collisions");
      gameOver("AN ASTEROID DESTROYED THE EARTH");
      break;
    }
  }

  //spaceship-2-earth
  if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x)) {
    print("spaceship-2-earth");
    gameOver("THE SPACESHIP CRASHED INTO EARTH");
  }

  //spaceship-2-atmosphere
  if (isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.x)) {
    print("spaceship-2-atmosphere");
    spaceship.setNearEarth();
  }

  //bullet collisions
  for (let i = spaceship.bulletSys.bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.locations.length - 1; j >= 0; j--) {
      if (isInside(spaceship.bulletSys.bullets[i], spaceship.bulletSys.diam, asteroids.locations[j], asteroids.diams[j])) {
        spaceship.replenishFuel(); // add more fuel when you hit an asteroid
        asteroids.destroy(j); // using destroy method to handle destruction
        spaceship.bulletSys.bullets.splice(i, 1); // Remove the bullet that hit
        break;  // No need to check this bullet against other asteroids
      }
    }
  }
}


//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, diamA, locB, diamB) {
  var distance = dist(locA.x, locA.y, locB.x, locB.y);
  return (distance <= (diamA / 2) + (diamB / 2));
}

//////////////////////////////////////////////////
function keyPressed() {
  if (keyIsPressed && keyCode === 32) { // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(reason) {
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);
  textSize(20);
  text(reason, (width / 2), (height / 2) + 50);
  noLoop();

  // Create a restart button
  restartButton = createButton('Restart Game');
  restartButton.position((width / 2) - 75, (height / 2) + 100);
  restartButton.mousePressed(restartGame);

  // CSS styling for the button
  restartButton.style('padding', '15px');
  restartButton.style('background-color', '#0095DD');
  restartButton.style('color', '#FFFFFF');
  restartButton.style('font-size', '20px');
  restartButton.style('border', 'none');
  restartButton.style('cursor', 'pointer');
  restartButton.style('text-align', 'center');
  restartButton.style('text-decoration', 'none');
  restartButton.style('display', 'inline-block');
  restartButton.style('font-style', 'bold');
  restartButton.style('border-radius', '5px');
  restartButton.style('transition-duration', '0.4s');
  restartButton.style(':hover', 'background-color: #4CAF50');
  restartButton.style(':hover', 'color: white');
}

//////////////////////////////////////////////////
// Function that restarts the game
function restartGame() {
  restartButton.remove();
  initObjects();
  loop();
}

//////////////////////////////////////////////////
// Function that initialise all objects
function initObjects() {
  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width / 2, height * 2.9);
  atmosphereSize = new createVector(width * 3, width * 3);
  earthLoc = new createVector(width / 2, height * 3.1);
  earthSize = new createVector(width * 3, width * 3);
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
  push();
  while (starLocs.length < 300) {
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i = 0; i < starLocs.length; i++) {
    rect(starLocs[i].x, starLocs[i].y, 2, 2);
  }

  if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
  pop();
}
