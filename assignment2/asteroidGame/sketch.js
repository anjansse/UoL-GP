/*
 * ===========================================================
 * I decided to implement my extention for the Asteroid Game,
 * simply because it's the game I enjoy playing the most.
 * 
 * My extention is actually multiple small extentions, 
 * rather than one single large one. I chose to do this
 * because I thought the original game was missing a lot
 * of cool features, and rather than focusing on adding one big
 * thing, I thought the end game would be more enjoyable
 * if I implemented many smaller cool missing features.
 * 
 * Here's a list of all the features I added:
 * 
 * Gameplay:
 * - Added enemy spaceships. Enemy spaceships move
 *   semi-randomly withing boundaries and shoot at you.
 *   You gain health when killing them.
 * - Fuel for the spaceship, accelerating consumes fuel.
 *   Once you're out of fuel, you won't be able to accelerate.
 *   You re-gain fuel by destroying asteroids.
 * - Health bars (for spaceship, asteroid & enemy), larger
 *   asteroids have more health than smaller ones.
 *   Enemy spaceships have the most amount of health.
 * - Score board (keep track of highest score)
 * - New harder mode called nightmare.
 *   It's fast paced, more enemies/asteroids, less health/fuel
 *   and contains some different graphics.
 * - New Restart button
 * - Game over with a proper message
 * Visuals:
 * - Textures for the earth (normal/nightmare), asteroids,
 *   enemies and the spaceship
 * ===========================================================
*/

var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

// ================ I wrote this code ================
var restartButton;
var difficultyButton;

var nightmareMode;

var highestScore;

let minAsteroidSize = 30;
let maxAsteroidSize = 160;

let earthImg;
let earthDoomImg;
let meteorImg = [];
let enemyImg;
let spaceshipImg;

let enemyBulletDmg = 2;

// load texture assets
function preload() {
  earthImg = loadImage('assets/earth.png');
  earthDoomImg = loadImage('assets/earthDoom.png');

  meteorImg.push(loadImage('assets/meteor1.png'))
  meteorImg.push(loadImage('assets/meteor2.png'))
  meteorImg.push(loadImage('assets/meteor3.png'))
  meteorImg.push(loadImage('assets/meteor4.png'))

  enemyImg = loadImage('assets/enemy.png');
  spaceshipImg = loadImage('assets/spaceship.png');
}
// ================ End of code I wrote ==============

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200, 800);
  // ================ I wrote this code ================
  nightmareMode = false;
  highestScore = 0;

  initObjects();
  // ================ End of code I wrote ==============
}

// ================ I wrote/modified this code ================
//////////////////////////////////////////////////
// Function that initialise all objects
function initObjects() {
  var asteroidDifficulty = nightmareMode ? 0.015 : 0.005;
  var enemiesDifficulty = {
    spawnRate: nightmareMode ? 0.001 : 0.0005,
    maxEnemies: nightmareMode ? 5 : 2
  };
  var spaceshipMaxFuel = nightmareMode ? 200 : 400;
  var spaceshipMaxHP = nightmareMode ? 10 : 20;
  var spaceshipSpeed = nightmareMode ? 0.3 : 0.2;
  var spaceshipMaxSpeed = nightmareMode ? 10 : 5;

  spaceship = new Spaceship(spaceshipMaxFuel, spaceshipSpeed, spaceshipMaxSpeed, spaceshipMaxHP);
  asteroids = new AsteroidSystem(minAsteroidSize, maxAsteroidSize, asteroidDifficulty);
  enemies = new Enemies(enemiesDifficulty.spawnRate, enemiesDifficulty.maxEnemies);

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width / 2, height * 2.9);
  atmosphereSize = new createVector(width * 3, width * 3);
  earthLoc = new createVector(width / 2, height * 3);
  earthSize = new createVector(width * 3, width * 3);
  score = 0;
}
// ================ End of code I wrote ==============

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();
  // ================ I wrote this code ================
  enemies.run();
  // ================ End of code I wrote ==============

  drawEarth();
  // ================ I wrote this code ================
  drawFuelGauge();
  drawHealthBar();
  drawGameInfos();
  // ================ End of code I wrote ==============

  checkCollisions(spaceship, asteroids, enemies); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth() {
  // ================ I wrote this code ================
  atmosphereColor = nightmareMode ? color(255, 150, 0, 50) : color(0, 0, 255, 50);
  strokeColor = nightmareMode ? color(80, 15, 0) : color(0, 0, 60);
  img = nightmareMode ? earthDoomImg : earthImg;
  // earthColor = nightmareMode ? color(190, 65, 0, 255) : color(0, 0, 255, 255);
  push();
  // ================ End of change ================
  noStroke();
  //draw atmosphere
  fill(atmosphereColor);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x, atmosphereSize.y);
  pop();
  //draw earth
  // ================ I changed this code ================
  push();
  imageMode(CENTER);
  image(img, earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
  fill(0, 0, 0, 0);
  strokeWeight(10);
  stroke(strokeColor);
  ellipse(earthLoc.x, earthLoc.y + 53, earthSize.x, earthSize.y);
  // ================ End of change ================
  pop();
}

// ================ I wrote this code ================
//////////////////////////////////////////////////
//draws fuel gauge
function drawFuelGauge() {
  // Draw the fuel gauge at a fixed position
  let gaugeWidth = 200;
  let gaugeHeight = 20;
  let x = 20;
  let y = height - 40;

  // Draw the background of the gauge
  push();
  fill(255);
  rect(x, y, gaugeWidth, gaugeHeight);

  // Draw the fill of the gauge, with color interpolated between red and green
  let fuelColor = lerpColor(color(255, 0, 0), color(0, 255, 0), spaceship.currFuel / spaceship.totalFuel);
  fill(fuelColor);
  rect(x, y, gaugeWidth * (spaceship.currFuel / spaceship.totalFuel), gaugeHeight);
  pop();

  // Draw fuel amount remaining
  push();
  fill(0);
  textSize(18);
  textAlign(CENTER);
  text("Fuel: " + int(spaceship.currFuel) + "/" + spaceship.totalFuel, x + (gaugeWidth/2), y + gaugeHeight-5);
  pop();
}

//////////////////////////////////////////////////
//draws health gauge
function drawHealthBar() {
  // Draw the health gauge at a fixed position
  let gaugeWidth = 200;
  let gaugeHeight = 20;
  let x = 20;
  let y = height - 40 - 30; // 30px above fuel gauge

  // Draw the background of the gauge
  push();
  fill(255);
  rect(x, y, gaugeWidth, gaugeHeight);

  // Draw the fill of the gauge, with color interpolated between purple and red
  let fuelColor = lerpColor(color(255, 0, 0), color(255, 0, 150), spaceship.currHealth / spaceship.totalHealth);
  fill(fuelColor);
  rect(x, y, gaugeWidth * (spaceship.currHealth / spaceship.totalHealth), gaugeHeight);
  pop();

  // Draw health amount remaining
  push();
  fill(0);
  textSize(18);
  textAlign(CENTER);
  text("Health: " + int(spaceship.currHealth) + "/" + spaceship.totalHealth, x + (gaugeWidth/2), y + gaugeHeight-5);
  pop();
}

//////////////////////////////////////////////////
//draws score count
function drawGameInfos() {
  // display score
  push();
  fill(255);
  textSize(25);
  textAlign(CENTER);
  text("Score: " + score, 60, 40);
  pop();

  // display highest score
  push();
  fill(205);
  textSize(20);
  textAlign(CENTER);
  text("Highest score: " + highestScore, 85, 80);
  pop();

  // display nighmare
  push();
  fill(205);
  textSize(20);
  textAlign(CENTER);
  var nightmareText = nightmareMode ? "IT'S ON 🔥" : "Peace and quiet.. 🌳";
  var nightmareTextWidth = nightmareMode ? 60 : 105;
  text(nightmareText, nightmareTextWidth, 120);
  pop();
}
// ================ End of code I wrote ==============

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids, enemies) {
  // ================ I wrote/modified this code ================
  //spaceship-2-earth
  if (isInside(spaceship.location, spaceship.size, earthLoc, earthSize.x - 100)) {
    gameOver("THE SPACESHIP CRASHED INTO EARTH");
  }

  //spaceship-2-atmosphere
  if (isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.x)) {
    spaceship.setNearEarth();
  }

  // check collision between asteroid and spaceship/earth
  hamdleAsteroidCollisions(spaceship, asteroids);

  // check  collisions between spaceship's bullet and asteroids/enemies
  handleSpaceshipBullets(spaceship, asteroids, enemies);

  // check collisions between enemies and spaceship
  handleEnemiesCollision(spaceship, enemies);
  // ================ End of code I wrote ===============
}

// ================ I wrote this code ================
//////////////////////////////////////////////////
// collision help functions to reduce size
function hamdleAsteroidCollisions(spaceship, asteroids) {
  for (let i = asteroids.locations.length - 1; i >= 0; i--) {
    //spaceship-2-asteroid collisions
    if (isInside(spaceship.location, spaceship.size, asteroids.locations[i], asteroids.diams[i] * 0.7)) {
      var asteroidDmg = map(asteroids.diams[i], minAsteroidSize, maxAsteroidSize, 2, 10);
      if ((spaceship.currHealth - asteroidDmg) > 0) {
        spaceship.currHealth -= asteroidDmg;
        asteroids.destroy(i); // destroy asteroid
        var newShipDirection = createVector(-spaceship.velocity.x, -spaceship.velocity.x);
        spaceship.velocity = newShipDirection; // send ship in other direction
        break;
      }
      else {
        gameOver("AN ASTEROID DESTROYED THE SPACESHIP");
      }
    }
    //asteroid-2-earth collisions
    if (isInside(earthLoc, earthSize.x, asteroids.locations[i], asteroids.diams[i])) {
      gameOver("AN ASTEROID DESTROYED THE EARTH");
    }
  }
}

function handleSpaceshipBullets(spaceship, asteroids, enemies) {
  for (let i = spaceship.bulletSys.bullets.length - 1; i >= 0; i--) {
    let bulletValid = true; // A flag to check if the bullet is still valid
    // bullet collision with asteroid
    for (let j = asteroids.locations.length - 1; j >= 0 && bulletValid; j--) {
      if (isInside(spaceship.bulletSys.bullets[i], spaceship.bulletSys.diam, asteroids.locations[j], asteroids.diams[j])) {
        if (asteroids.health[j] <= 1) {
          fuelAmount = int(map(asteroids.diams[j], minAsteroidSize, maxAsteroidSize, 4, 20)); // calculate fuel gained from destruction
          spaceship.replenishFuel(fuelAmount); // add more fuel when you hit an asteroid
          score += asteroids.startingHealth[j]; // add original health of asteroid to score
          asteroids.destroy(j); // using destroy method to handle destruction
        }
        else {
          asteroids.health[j] -= 1; // reduce amount of health by 1
        }
        spaceship.bulletSys.bullets.splice(i, 1); // Remove the bullet that hit
        bulletValid = false; // Set the bullet as invalid
      }
    }

    // bullet collision with enemy ship
    for (let k = enemies.enemies.length - 1; k >= 0 && bulletValid; k--) {
      if (isInside(spaceship.bulletSys.bullets[i], spaceship.bulletSys.diam, enemies.enemies[k].location, enemies.enemies[k].size)) {
        if (enemies.enemies[k].health <= 1) {
          spaceship.replenishFuel(spaceship.totalFuel); // refuel ship completely
          spaceship.replenishHealth(5); // give 5 hp back on enemy kill
          enemies.enemies.splice(k, 1); // destroy enemy ship if without health
        }
        else {
          enemies.enemies[k].health -= 1; // reduce the enemy ship by 1
        }
        spaceship.bulletSys.bullets.splice(i, 1);
        bulletValid = false; // Set the bullet as invalid
      }
    }
  }
}

function handleEnemiesCollision(spaceship, enemies) {
  // enemies collision (bullet + ship)
  for (let i = enemies.enemies.length - 1; i >= 0; i--) {
    if (isInside(enemies.enemies[i].location, enemies.enemies[i].size, spaceship.location, spaceship.size)) {
      spaceship.currHealth = 0;
      gameOver("THE SPACESHIP CRASHED INTO ANOTHER SPACESHIP")
    }
    for (let j = enemies.enemies[i].bulletSys.bullets.length - 1; j >= 0; j--) {
      if (isInside(enemies.enemies[i].bulletSys.bullets[j], enemies.enemies[i].bulletSys.diam, spaceship.location, spaceship.size)) {
        if ((spaceship.currHealth - enemyBulletDmg) > 0) {
          spaceship.currHealth -= enemyBulletDmg;
          enemies.enemies[i].bulletSys.bullets.splice(j, 1); // destroy bullet
          break;
        }
        else {
          gameOver("THE SPACESHIP GOT SHOT DOWN");
        }
      }
    }
  }
}
// ================ End of code I wrote ===============

//////////////////////////////////////////////////
//helper function checking if there's collision between two ellipses
function isInside(locA, diamA, locB, diamB) {
  // ================ I wrote this code ================
  var distance = dist(locA.x, locA.y, locB.x, locB.y);
  return (distance <= (diamA / 2) + (diamB / 2));
  // ================ End of code I wrote ================
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
  // ================ I wrote this code ================
  textSize(20);
  text(reason, (width / 2), (height / 2) + 50);
  if (score > highestScore) {
    highestScore = score;
  }
  // ================ End of code I wrote ================
  noLoop();

  // ================ I wrote this code ================
  // Create a restart button
  restartButton = createButton('Restart Game');
  restartButton.position((width / 2) - 175, (height / 2) + 100);
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

  // Create Nightmare button (difficulty)
  var nightmareText = nightmareMode ? "Peaceful Mode 🌳" : "Nightmare Mode 🔥";
  var nightmareColor = nightmareMode ? "#00FF00" : "#FF0000";

  difficultyButton = createButton(nightmareText);
  difficultyButton.position((width / 2), (height / 2) + 100);
  difficultyButton.mousePressed(setNightmareMode);

  // CSS styling for the button
  difficultyButton.style('padding', '15px');
  difficultyButton.style('background-color', nightmareColor);
  difficultyButton.style('color', '#FFFFFF');
  difficultyButton.style('font-size', '20px');
  difficultyButton.style('border', 'none');
  difficultyButton.style('cursor', 'pointer');
  difficultyButton.style('text-align', 'center');
  difficultyButton.style('text-decoration', 'none');
  difficultyButton.style('display', 'inline-block');
  difficultyButton.style('font-style', 'bold');
  difficultyButton.style('border-radius', '5px');
  difficultyButton.style('transition-duration', '0.4s');
  difficultyButton.style(':hover', 'background-color: #4CAF50');
  difficultyButton.style(':hover', 'color: white');
  // ================ End of code I wrote ================
}

// ================ I wrote this code ================
//////////////////////////////////////////////////
// Function that restarts the game
function restartGame() {
  restartButton.remove();
  difficultyButton.remove();
  initObjects();
  loop();
}

function setNightmareMode() {
  if (nightmareMode) {
    nightmareMode = false;
  }
  else {
    nightmareMode = true;
  }
  restartGame();
}
// ================ End of code I wrote ==============

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
