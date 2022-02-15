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
  drawNode(width/2,height/2,maxDepth);
}

function drawNode(x,y,depth) {
  
  
  noStroke();
  if(depth > 0) {
    fill(depth / maxDepth * 255);
    ellipse(x,y,size * 4/3,size * 4/3);
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        if(dx == 0 ^ dy == 0) {
          if(Math.random() < chance * depth / maxDepth) {
            fill(depth / maxDepth * 255);
            rect(x + dx * length, y + dy * length,dx * length * 2 + size, dy * length * 2 + size);
            drawNode(x + dx * length * 2, y + dy * length * 2, depth - 1);
          }
        }
      }
    }
  }
}
