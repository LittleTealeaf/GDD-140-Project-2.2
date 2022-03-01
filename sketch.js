/// <reference path="./libraries/p5.global-mode.d.ts" />

/**
 * Rate at which rectangles are interpolated at
 */
var INTERPOLATE_RATE = 0.05;
/**
 * Max build depth of the layout
 */
var MAX_DEPTH = 7;
/**
 * How wide to start the base nodes at
 * Gradually decreased at lower depths
 */
var NODE_WIDTH = 60;
/**
 * How wide to start the connectors at
 * Gradually decreased at lower depths
 */
var CONNECTION_WIDTH = 40;
/**
 * How long to start the connectors at
 * Gradually decreased at lower depths
 */
var CONNECTION_LENGTH = 60;
/**
 * % chance to make a new branch in a given direction, starting value
 * Gradually decreased at lower depths
 */
var BRANCH_CHANCE = 0.9;

/*
These are the current values of the rendered rectangles
*/
var x_currents = [];
var y_currents = [];
var w_currents = [];
var h_currents = [];
var c_currents = [];
var currentCount = 0;
/*
These are the goal values of the rendered rectangles
*/
var x_goals = [];
var y_goals = [];
var w_goals = [];
var h_goals = [];
var c_goals = [];
var goalCount = 0;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  newLayout();
}

/**
 * Order of calling functions
 */
function draw() {
  background("#19224f");
  updateListLengths();
  updateRects();
  drawRects();
}

/**
 * Creates a new layout whenever the mouse is clicked
 */
 function mouseClicked() {
  newLayout();
}


/**
 * Updates the attributes of the current rects to move towards their goal positions
 */
function updateRects() {
  for(var i = 0; i < currentCount; i++) {
    var goalI = int(i % goalCount);
    x_currents[i] = interpolate(x_currents[i],x_goals[goalI]);
    y_currents[i] = interpolate(y_currents[i],y_goals[goalI]);
    w_currents[i] = interpolate(w_currents[i],w_goals[goalI]);
    h_currents[i] = interpolate(h_currents[i],h_goals[goalI]);
    c_currents[i] = interpolate(c_currents[i],c_goals[goalI]);
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
    fill(int(c_currents[i]));
    rect(x_currents[i], y_currents[i], w_currents[i], h_currents[i]);
  }
}


/**
 * Updates the arrays in currents to match the lengths of the goals
 */
function updateListLengths() {
  while(currentCount < goalCount) {
    x_currents.push(width/2);
    y_currents.push(height/2);
    h_currents.push(0);
    w_currents.push(0);
    c_currents.push(0);
    currentCount++;
  }
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

/**
 * Clears the entire board and makes a new layout starting at the central node
 */
function newLayout() {
  clearGoals();
  newNode(width/2,height/2,MAX_DEPTH)
}

/**
 * Creates a new node, randomly recursively branches off until depth is depleted
 * @param {float} x 
 * @param {float} y 
 * @param {int} depth 
 */
function newNode(x,y,depth) {
  var c = int(depth / MAX_DEPTH * 255);
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
            addGoal(x + dx * length, y + dy * length, (length - width)* dx + width, (length - width) * dy + width,c);
            newNode(x + dx * length * 2, y + dy * length * 2, depth - 1);
          }
        }
      }
    }
  }
}