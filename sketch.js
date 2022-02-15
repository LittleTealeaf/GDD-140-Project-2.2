/// <reference path="./libraries/p5.d.ts" />

//The initial chance to create a branch
var chance = 1;
//The length of each rectangle between nodes
var length = 20;
//The size of each node
var size = 7;
//The max depth allocated to generating
var maxDepth = 10;

function setup() {
  createCanvas(600, 600);
  ellipseMode(CENTER);
  rectMode(CENTER);
  drawImage();
}

function mouseClicked() {
  drawImage();
}

function drawImage() {
  //Fills background
  background("#19224f");
  noStroke();
  drawNode(width/2,height/2,maxDepth);
  
}

function drawNode(x,y,depth) {
  //Create Node Ellipse
  fill((depth + 1) / maxDepth * 255);
  ellipse(x,y,size * 2,size * 2);
  if(depth > 0) {
    //As long as the depth is positive, iterate between dx = -1 to 1, and dy = -1 to 1
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        //Only iterate if either dx == 0 or dy == 0
        if(dx == 0 ^ dy == 0) {
          //Check if random is below the threshold. This threshold will reduce over-time
          if(Math.random() < chance * depth / maxDepth) {
            //Update fill, do this so it keeps consistent
            fill(depth / maxDepth * 255);
            //Draw the fconnecting rectangle
            rect(x + dx * length, y + dy * length,dx * length * 2 + size, dy * length * 2 + size);
            //Recursively draw a new node at the end
            drawNode(x + dx * length * 2, y + dy * length * 2, depth - 1);
          }
        }
      }
    }
  }
}
