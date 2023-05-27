
function setup()
{
    createCanvas(500, 500);
    background(255);
}

function draw()
{
    background(255);

    var noOfDots = 20;
    var size = width/noOfDots;

    for (var x = 0; x < noOfDots; x++)
    {
      for (var y = 0; y < noOfDots; y++)
      {
        // your code here
        
        wave(params); // replace params with the necessary parameters
        
      }
    }
}


function wave(params) // replace params with the necessary parameters
{
 // your code here
}
