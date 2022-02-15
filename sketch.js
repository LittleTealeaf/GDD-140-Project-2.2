/// <reference path="./libraries/p5.d.ts" />

var INTERPOLATE_RATE = 0.1;
var MAX_DEPTH = 6;
var NODE_WIDTH = 17;
var CONNECTION_WIDTH = 50;
var CONNECTION_LENGTH = 100;
var BRANCH_CHANCE = 1;

var x_currents = [];
var y_currents = [];
var w_currents = [];
var h_currents = [];
var c_currents = [];
var currentCount = 0;
var x_goals = [];
var y_goals = [];
var w_goals = [];
var h_goals = [];
var c_goals = [];
var goalCount = 0;

function setup() {
  createCanvas(600, 600);
  initializeVariables();
  rectMode(CENTER);
  newLayout();
}

function initializeVariables() {
  x_currents = [];
  y_currents = [];
  w_currents = [];
  h_currents = [];
  c_currents = [];
  currentCount = 0;
  x_goals = [];
  y_goals = [];
  h_goals = [];
  w_goals = [];
  c_goals = [];
  goalCount = 0;
}

function draw() {
  background("#19224f");
  updateListLengths();
  updateRects();
  drawRects();
}

/**
 * Updates the attributes of the current rects to move towards their goal positions
 */
function updateRects() {
  for(var i = 0; i < currentCount; i++) {
    x_currents[i] = interpolate(x_currents[i],x_goals[i]);
    y_currents[i] = interpolate(y_currents[i],y_goals[i]);
    w_currents[i] = interpolate(w_currents[i],w_goals[i]);
    h_currents[i] = interpolate(h_currents[i],h_goals[i]);
    c_currents[i] = interpolate(c_currents[i],c_goals[i]);
  }
}

/**
 * Interpolates between two values using INTERPOLATE_RATE
 * @param {float} current 
 * @param {float} goal 
 * @returns Interpolated value between current and goal
 */
function interpolate(current,goal) {
  return current + (goal - current) * INTERPOLATE_RATE;
}

/**
 * Renders all of the rectangles in the currents categories
 */
function drawRects() {
  for(var i = 0; i < currentCount; i++) {
    fill(c_currents[i]);
    rect(x_currents[i],y_currents[i],w_currents[i],h_currents[i]);
  }
}


/**
 * Updates the arrays in currents to match the lengths of the goals
 */
function updateListLengths() {
  while(currentCount > goalCount) {
    x_currents.pop();
    y_currents.pop();
    h_currents.pop();
    w_currents.pop();
    c_currents.pop();
    currentCount--;
  }
  while(currentCount < goalCount) {
    x_currents.push(width/2);
    y_currents.push(height/2);
    h_currents.push(0);
    w_currents.push(0);
    c_currents.push(0);
    currentCount++;
  }
}

function mouseClicked() {
  newLayout();
}

function clearGoals() {
  goalCount = 0;
  x_goals = [];
  y_goals = [];
  w_goals = [];
  h_goals = [];
  c_goals = [];
}

/**
 * Adds a new goal to the goal list
 * @param {float} x Goal x of the square
 * @param {float} y Goal y of the square
 * @param {float} w Goal width of the square
 * @param {float} h Goal height of the square
 * @param {float} c Color value between 0 and 255 (Black - White)
 */
function addGoal(x,y,w,h,c) {
  x_goals.push(x);
  y_goals.push(y);
  w_goals.push(w);
  h_goals.push(h);
  c_goals.push(c);
  goalCount++;
}

function newLayout() {
  clearGoals();
  newNode(width/2,height/2,MAX_DEPTH)
}

function newNode(x,y,depth) {
  var c = depth / MAX_DEPTH * 255;
  addGoal(x,y,NODE_WIDTH * depth / MAX_DEPTH,NODE_WIDTH * depth / MAX_DEPTH,c);
  if(depth > 0) {
    //As long as the depth is positive, iterate between dx = -1 to 1, and dy = -1 to 1
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        //Only iterate if either dx == 0 or dy == 0
        if(dx == 0 ^ dy == 0) {
          //Check if random is below the threshold. This threshold will reduce over-time
          if(Math.random() < BRANCH_CHANCE * depth / MAX_DEPTH) {
            var length = CONNECTION_LENGTH * depth / MAX_DEPTH;
            var width = CONNECTION_WIDTH * depth / MAX_DEPTH;
            addGoal(x + dx * length, y + dy * length, (length - width)* dx + width, (length - width) * dy + width );
            newNode(x + dx * length * 2, y + dy * width * 2, depth - 1);
          }
        }
      }
    }
  }
}