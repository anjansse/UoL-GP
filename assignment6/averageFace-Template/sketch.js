var imgs = [];
var avgImg;
var numOfImages = 30;
var currentImageIndex = 0;

//////////////////////////////////////////////////////////
function preload() {
    for (var i = 0; i < numOfImages; i++) {
        let filename = "assets/" + i + ".jpg";
        imgs[i] = loadImage(filename);
    }
}

//////////////////////////////////////////////////////////
function setup() {
    const imgWidth = imgs[0].width;
    const imgHeight = imgs[0].height;
    createCanvas(2 * imgWidth, imgHeight);
    pixelDensity(1);
    avgImg = createGraphics(imgWidth, imgHeight);
}

//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[currentImageIndex], 0, 0); 

    for (let img of imgs) {
        img.loadPixels();
    }
    avgImg.loadPixels();

    for (let y = 0; y < avgImg.height; y++) {
        for (let x = 0; x < avgImg.width; x++) {
            let index = (x + y * avgImg.width) * 4;

            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            for (let img of imgs) {
                let r = img.pixels[index];
                let g = img.pixels[index + 1];
                let b = img.pixels[index + 2];
                sumR += r;
                sumG += g;
                sumB += b;
            }

            let avgR = sumR / numOfImages;
            let avgG = sumG / numOfImages;
            let avgB = sumB / numOfImages;

            avgImg.pixels[index] = avgR;
            avgImg.pixels[index + 1] = avgG;
            avgImg.pixels[index + 2] = avgB;
            avgImg.pixels[index + 3] = 255;
        }
    }

    avgImg.updatePixels();
    image(avgImg, avgImg.width, 0);

    noLoop();
}


//////////////////////////////////////////////////////////
// New function to handle key presses
function keyPressed() {
    currentImageIndex = int(random(numOfImages)); // Update the index with a new random value
    loop(); // Redraw the canvas
}