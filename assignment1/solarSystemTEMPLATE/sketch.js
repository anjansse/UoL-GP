var speed;

function setup() {
    createCanvas(900, 700);
}

function draw() {
    background(0);
    speed = frameCount;

    // Initial push to make all objects relative to center.
    push();
    translate(width / 2, height / 2); // TRANSFORM TO CENTER

    // SUN
    push();
    rotate(radians(speed / 3)); // Step 5: Sun rotation
    celestialObj(color(255, 150, 0), 200); // Draw Sun
    pop();

    // Additional celestial body. Adding Mercury (to keep the same canvas size).
    push();
    rotate(radians(speed * 1.75)); // Mercury rotation around Sun
    translate(175, 0); // Mercury's orbit
    push();
    rotate(radians(speed)); // Mercury's spin
    celestialObj(color(185, 185, 185), 40); // Draw Mercury (Mercury is light grey, apparently)
    pop();

    pop();

    // EARTH
    push();
    rotate(radians(speed)); // Earth rotation around Sun
    translate(300, 0); // Earth's orbit
    push();
    rotate(radians(speed)); // Earth's spin
    celestialObj(color(0, 0, 255), 80); // Draw Earth
    pop();

    // MOON
    push();
    rotate(radians(-speed * 2)); // Moon rotation around Earth
    translate(100, 0); // Moon's orbit
    celestialObj(color(255, 255, 255), 30); // Draw Moon
    pop();

    // Final pop to restore sttings
    pop();
}

function celestialObj(c, size) {
    strokeWeight(5);
    fill(c);
    stroke(0);
    ellipse(0, 0, size, size);
    line(0, 0, size / 2, 0);
}
