////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(255, 50, 0);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true,
    angle: angle
  });
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
  push();
  Matter.Body.setAngle(propeller, angle);
  Matter.Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  fill(255);
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
  var bird = Bodies.circle(mouseX, mouseY, 20, {
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(bird, bird.mass * 10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
  push();
  for (var i = 0; i < birds.length; i++) {
    fill(0, 255, 210);
    drawVertices(birds[i].vertices);
    if (isOffScreen(birds[i])) {
      // Remove from world
      removeFromWorld(birds[i]);
      // Remove from array
      birds.splice(i, 1);
      i--;
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 3; j++) {
      var box = Bodies.rectangle(800 + j * 80, 500 - i * 80, 80, 80);
      boxes.push(box);
      var colour = color(80, random(100, 255), 80);
      colors.push(colour);
      World.add(engine.world, [box]);
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  for (var i = 0; i < boxes.length; i++) {
    fill(colors[i]);
    drawVertices(boxes[i].vertices);
  }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
  // Create a slingshot bird
  slingshotBird = Bodies.circle(225, 195, 20, {
    friction: 0,
    restitution: 0.95
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);
  World.add(engine.world, [slingshotBird]);

  // Create a slingshot constraint
  slingshotConstraint = Constraint.create({
    pointA: { x: 225, y: 175 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001
  });
  World.add(engine.world, slingshotConstraint);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
  push();
  fill(0, 130, 255); // Color of the slingshot bird
  drawVertices(slingshotBird.vertices); // Draw the bird
  drawConstraint(slingshotConstraint); // Draw the constraint
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}

////////////////////////////////////////////////////////////////
function setupObstacles() {
  // Initialize the rectangles at random positions
  var nObstacles = random(1, 3);
  for (i=0; i < nObstacles; i++) {
    obstacles.push(Bodies.rectangle(random(300, 500), random(200, 400), random(3, 40), random(150, 250), {
      isStatic: true,
      angle: random(0, 1)
    }));
    World.add(engine.world, [obstacles[i]]);
  }
}

////////////////////////////////////////////////////////////////
function drawObstacles() {
  // Draw the rectangles
  push();
  fill(50);
  for (i=0; i < obstacles.length; i++) {
    drawVertices(obstacles[i].vertices);
  }
  pop();
}