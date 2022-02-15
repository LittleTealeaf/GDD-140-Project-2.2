/// <reference path="./libraries/p5.d.ts" />

var chance = 0.4;
var length = 40;
var size = 30;
var maxDepth = 4;

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
  ellipse(x,y,50,50);
  fill(255);
  noStroke();
  if(depth > 0) {
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        if(dx == 0 ^ dy == 0) {
          if(Math.random() < chance) {
            rect(x + dx * length, y + dy * length,dx * length * 2 + 10, dy * length * 2 + 10);
            drawNode(x + dx * length * 2, y + dy * length * 2, depth - 1);
          }
        }
      }
    }
  }
}
