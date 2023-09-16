// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

var sepiaEnabled = true;
var darkCornersEnabled = true;
var radialBlurEnabled = true;
var borderEnabled = true;

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}

function keyPressed() {
  if (key === '1') {
    sepiaEnabled = !sepiaEnabled;
  }
  if (key === '2') {
    darkCornersEnabled = !darkCornersEnabled;
  }
  if (key === '3') {
    radialBlurEnabled = !radialBlurEnabled;
  }
  if (key === '4') {
    borderEnabled = !borderEnabled;
  }
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  if (sepiaEnabled) {
    resultImg = sepiaFilter(imgIn);
  }
  if (darkCornersEnabled) {
    resultImg = darkCorners(resultImg);
  }
  if (radialBlurEnabled) {
    resultImg = radialBlurFilter(resultImg);
  }
  if (borderEnabled) {
    resultImg = borderFilter(resultImg);
  }
  return resultImg;
}

function sepiaFilter(img) {
  var resultImg = createImage(img.width, img.height);

  img.loadPixels();
  resultImg.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (x + y * img.width) * 4;

      var oldRed = img.pixels[index];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];
      
      var newRed = (oldRed * 0.393) + (oldGreen * 0.769) + (oldBlue * 0.189);
      var newGreen = (oldRed * 0.349) + (oldGreen * 0.686) + (oldBlue * 0.168);
      var newBlue = (oldRed * 0.272) + (oldGreen * 0.534) + (oldBlue * 0.131);
      
      resultImg.pixels[index] = newRed;
      resultImg.pixels[index + 1] = newGreen;
      resultImg.pixels[index + 2] = newBlue;
      resultImg.pixels[index + 3] = 255;  
    }
  }
  
  resultImg.updatePixels();
  return resultImg;
}

function darkCorners(img) {
  var resultImg = createImage(img.width, img.height);
  img.loadPixels();
  resultImg.loadPixels();

  var centerX = img.width / 2;
  var centerY = img.height / 2;
  
  var maxDistance = sqrt(centerX * centerX + centerY * centerY);

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (x + y * img.width) * 4;
      
      var oldRed = img.pixels[index];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];
      
      var distance = dist(x, y, centerX, centerY);
      
      var dynLum;
      if (distance <= 300) {
        dynLum = 1;
      } else if (distance > 300 && distance <= 450) {
        dynLum = map(distance, 300, 450, 1, 0.4);
      } else {
        dynLum = map(distance, 450, maxDistance, 0.4, 0);
      }
      
      var newRed = oldRed * dynLum;
      var newGreen = oldGreen * dynLum;
      var newBlue = oldBlue * dynLum;
      
      resultImg.pixels[index] = newRed;
      resultImg.pixels[index + 1] = newGreen;
      resultImg.pixels[index + 2] = newBlue;
      resultImg.pixels[index + 3] = 255; 
    }
  }
  
  resultImg.updatePixels();
  return resultImg;
}

function radialBlurFilter(img) {
  console.log("radialBlurFilter");
  console.log(mouseX, mouseY);
  var resultImg = createImage(img.width, img.height);
  img.loadPixels();
  resultImg.loadPixels();

  var matrixSize = 8; 

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (x + y * img.width) * 4;
      
      var c = convolution(x, y, matrix, matrixSize, img);
      
      var distance = dist(x, y, mouseX, mouseY);
      var dynBlur = map(distance, 100, 300, 0, 1);
      dynBlur = constrain(dynBlur, 0, 1);
      
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];
      
      resultImg.pixels[index + 0] = c[0] * dynBlur + r * (1 - dynBlur);
      resultImg.pixels[index + 1] = c[1] * dynBlur + g * (1 - dynBlur);
      resultImg.pixels[index + 2] = c[2] * dynBlur + b * (1 - dynBlur);
      resultImg.pixels[index + 3] = 255;
    }
  }
  
  resultImg.updatePixels();
  return resultImg;
}


function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize / 2);

  for (var i=0; i<matrixSize; i++) {
    for (var j=0; j<matrixSize; j++) {
      
      var xloc = x + i - offset;
      var yloc = y + j - offset;
      var index = (img.width * yloc + xloc) * 4;

      index = constrain(index, 0, img.pixels.length - 1);

      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1] * matrix[i][j];
      totalBlue += img.pixels[index + 2] * matrix[i][j];
    }
  }
  return [totalRed, totalGreen, totalBlue];
}

function borderFilter(img) {
  var buffer = createGraphics(img.width, img.height);

  buffer.image(img, 0, 0);
  buffer.noFill();
  buffer.stroke(255);  
  buffer.strokeWeight(20);  

  buffer.rect(10, 10, img.width - 20, img.height - 20, 20);
  buffer.rect(10, 10, img.width - 20, img.height - 20);

  return buffer;
}

