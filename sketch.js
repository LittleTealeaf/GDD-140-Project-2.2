/// <reference path="./libraries/p5.d.ts" />

var chance = 1;
var length = 20;
var size = 20;
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
  background("#19224f");
  fill(255);
  drawNode(width/2,height/2,maxDepth);
}

function drawNode(x,y,depth) {
  ellipse(x,y,size,size);
  
  noStroke();
  if(depth > 0) {
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        if(dx == 0 ^ dy == 0) {
          if(Math.random() < chance * depth / maxDepth) {
            fill(depth / maxDepth * 255);
            rect(x + dx * length, y + dy * length,dx * length * 2 + size/3, dy * length * 2 + size/3);
            drawNode(x + dx * length * 2, y + dy * length * 2, depth - 1);
          }
        }
      }
    }
  }
}
