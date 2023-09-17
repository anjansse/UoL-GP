var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;

// ================= I wrote this =================
// Load all the key notes assets
var noteDo;
var noteRe;
var noteMi;
var noteFa;
var noteSol;
var noteLa;

function preload() {
  noteDo = loadSound("assets/do.mp3");
  noteRe = loadSound("assets/re.mp3");
  noteMi = loadSound("assets/mi.mp3");
  noteFa = loadSound("assets/fa.mp3");
  noteSol = loadSound("assets/sol.mp3");
  noteLa = loadSound("assets/la.mp3");
}
// ==================================================

function setup() {
  createCanvas(640 * 2, 480);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.hide();

  thresholdSlider = createSlider(0, 255, 50);
  thresholdSlider.position((width / 2) - 200, (height) - 40);
  threshold = thresholdSlider.value();

  // ============== I wrote this code =================
  grid = new Grid(640,480);
  // ==================================================
}

// ================= I modified this =================
function draw() {
  background(0);
  image(video, 0, 0);

  currImg = createImage(video.width, video.height);
  currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

  diffImg = createImage(video.width, video.height);
  diffImg.loadPixels();

  threshold = thresholdSlider.value();

  if (typeof prevImg !== "undefined") {
    prevImg.loadPixels();
    currImg.loadPixels();
    for (var x = 0; x < currImg.width; x++) {
      for (var y = 0; y < currImg.height; y++) {

        var index = (x + y * currImg.width) * 4;

        var prevRed = prevImg.pixels[index + 0];
        var prevGreen = prevImg.pixels[index + 1];
        var prevBlue = prevImg.pixels[index + 2];

        var currRed = currImg.pixels[index + 0];
        var currGreen = currImg.pixels[index + 1];
        var currBlue = currImg.pixels[index + 2];

        var d = dist(currRed, currGreen, currBlue, prevRed, prevGreen, prevBlue);

        // ============== I modified this code =================
        // used to show black and white image for movement
        diffImg.pixels[index + 0] = d > threshold ? 0 : 255;
        diffImg.pixels[index + 1] = d > threshold ? 0 : 255;
        diffImg.pixels[index + 2] = d > threshold ? 0 : 255;
        diffImg.pixels[index + 3] = 255;
        // ==================================================
      }
    }
  }

  diffImg.updatePixels();
  image(diffImg, 640, 0);

  push();
  noFill();
  stroke(255);
  text(threshold, 160, 35);
  pop();

  // ============== I wrote this code =================
  prevImg = createImage(currImg.width, currImg.height);
  prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
  // ==================================================

  grid.run(diffImg);
}
// ==================================================

