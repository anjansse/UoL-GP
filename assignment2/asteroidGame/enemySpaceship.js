// ================ I wrote this code ================
class Enemies {
    constructor(chanceOfSpawning=0.001, maxEnemies=2) {
        this.chanceOfSpawning = chanceOfSpawning;
        this.maxEnemies = maxEnemies;
        this.enemyArea = {
            x: 50, 
            y: 50,
            width: width - 100,
            height: 200
        };
        this.enemies = [];
    }

    spawn() {
        if (random(1) < this.chanceOfSpawning && this.enemies.length < this.maxEnemies) {
            this.enemies.push(new EnemySpaceShip(this.enemyArea));
        }
    }

    run() {
        this.spawn();
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].run();
        }
    }
}

class EnemySpaceShip {
    constructor(area) {
        this.enemyArea = area;
        this.health = 10;
        this.startingHealth = 10;
        this.shipColor = color(random(0, 255), random(0, 255), random(0, 255));
        this.bulletSys = new BulletSystem(true);
        this.direction = new createVector(1, 1);
        this.speed = random(0.75, 2);
        this.size = 50;
        this.location = new createVector(
            random(this.enemyArea.x, this.enemyArea.x + this.enemyArea.width),
            random(this.enemyArea.y, this.enemyArea.y + this.enemyArea.height)
        );
        this.rateOfFire = 0.01;
    }

    run() {
        this.bulletSys.run();
        this.fire();
        this.move();
        this.draw();
        if (this.health != this.startingHealth) {
            this.drawHealthBar(this.location.x, this.location.y, this.size, this.health, this.startingHealth);
          }
    }

    draw() {
        push();
        imageMode(CENTER);
        image(enemyImg, this.location.x, this.location.y, this.size * 2, this.size * 1.8);
        pop();
    }

    // ================ I wrote this code ================
    //////////////////////////////////////////////////
    //draws health bar for asteroid
    drawHealthBar(x, y, size, health, startingHealth) {
        // Draw the fuel gauge at a fixed position
        let gaugeWidth = 160;
        let gaugeHeight = 12;

        // Draw the background of the gauge
        push();
        fill(255);
        rect(x - (gaugeWidth/2), y - (size * 0.85), gaugeWidth, gaugeHeight);
        fill(215, 0, 135);
        rect(x - (gaugeWidth/2), y - (size * 0.85), gaugeWidth * (health / startingHealth), gaugeHeight);
        pop();
    }
    // ================ End of code I wrote ==============

    move() {
        // Move the ship
        this.location.x += this.direction.x * this.speed;
        this.location.y += this.direction.y * this.speed;
        // Reflect if hit the this.enemyArea
        if (this.location.x - this.size / 2 < this.enemyArea.x || this.location.x + this.size / 2 > this.enemyArea.x + this.enemyArea.width) {
            this.direction.x *= -1;
        }
        if (this.location.y - this.size / 2 < this.enemyArea.y || this.location.y + this.size / 2 > this.enemyArea.y + this.enemyArea.height) {
            this.direction.y *= -1;
        }
    }

    fire() {
        if (random(1)<this.rateOfFire) {
            this.bulletSys.fire(this.location.x, this.location.y + this.size / 2);
        }
    }
}
// ================ End of what I wrote ================