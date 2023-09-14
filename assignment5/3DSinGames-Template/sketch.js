let confLocs = [];
let confTheta = [];

function setup() {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);

    for (let i = 0; i < 200; i++) {
        let x = random(-500, 500);
        let y = random(-800, 0);
        let z = random(-500, 500);
        let theta = random(0, 360);

        confLocs.push(createVector(x, y, z));
        confTheta.push(theta);
    }
}

function draw() {
    // Changed the background to black
    background(0);
    ambientLight(10, 10, 20);
    const boxSize = 50;
    let distance = 0;

    // Add lights pointing at the disco ball
    pointLight(255, 0, 255, 50, -250, 50);
    pointLight(255, 0, 0, -50, -250, 50);
    pointLight(0, 0, 255, 50, -250, -50);
    pointLight(0, 255, 0, -50, -250, -50);

    // Create a disco ball at the top of the grid
    push();
    translate(0, -400, 0);
    specularMaterial(255);
    sphere(70);
    pop();

    const radius = 1000;
    let angle = (frameCount / 2) % 360;
    let x = radius * cos(angle);
    let z = radius * sin(angle);

    camera(x, -600, z, 0, 0, 0, 0, 1, 0);

    // Below is step 2 of the assignment
    // ==================================
    // normalMaterial();
    // stroke(0);
    // ==================================

    for (let i = -400; i < 400; i += boxSize) {
        for (let j = -400; j < 400; j += boxSize) {
            distance = dist(0, 0, 0, i, 0, j);
            distance += frameCount;
            let length = map(sin(distance), -1, 1, 100, 300);
            push();
            translate(i, 0, j);
            box(boxSize, length, boxSize);
            pop();
        }
    }

    confetti();
}

// Function to draw confetti
function confetti() {
    for (let i = 0; i < confLocs.length; i++) {
        confLocs[i].y += 1;
        confTheta[i] += 10;

        if (confLocs[i].y > 0) {
            confLocs[i].y = -800;
        }

        push();
        noStroke();
        translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
        rotateX(confTheta[i]);
        rotateY(confTheta[i]);
        rotateZ(confTheta[i]);
        plane(15, 15);
        pop();
    }
}