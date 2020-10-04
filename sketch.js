var w;
var h;
var board;
var pieces = [];
var piece;
var x;
var y;
var momentX;
var momentY;
var initialX;
var initialY;
var pressed;
var visited = [];
var threes = [];
var clusters = [];
var components = [];
var dissolved = [];
var rowCount = [];
var effects = [];
var dissolving = false;
var prevInPlace = true;
var exploding = false;
var falling = false;
var milliseconds = 0;
var leaderImg;
var cnt;

function setup() {
  //var cnv = (windowHeight / windowWidth > 2) ? createCanvas(windowWidth, 2 * windowWidth) : createCanvas(windowHeight / 2, windowHeight); // 1 by 2
  var cnv = createCanvas(360, 720);
  w = width;
  h = height;
  cnv.position((windowWidth - w) / 2, (windowHeight - h) / 2);
  board = new Board();
  time = new Time();
  for (var i = 0; i < 6; i++) {
    pieces[i] = [];
    for (var j = 0; j < 5; j++) {
      pieces[i][j] = new Piece(i * (width / 6) + (width / 12), j * (width / 6) + (13 * width / 12), floor(random(6)));
    }
  }
  for (var i = 0; i < 6; i++) {
    threes[i] = [];
    for (var j = 0; j < 5; j++) {
      threes[i][j] = [];
    }
  }
}

function draw() {
  background(150);
  board.display();
  time.display();
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 5; j++) {
      pieces[i][j].update();
      if ((i != x || j != y) && !dissolving && !falling) { 
        if (pieces[i][j].supposedX != i * (w / 6) + (w / 12)) {
          pieces[i][j].snapX(i * (w / 6) + (w / 12));
        }
        if (pieces[i][j].supposedY != j * (w / 6) + (13 * w / 12)) {
          pieces[i][j].snapY(j * (w / 6) + (13 * w / 12));
        }
        if (pieces[i][j].supposedX != pieces[i][j].x && !pieces[i][j].snapping) {
          pieces[i][j].x = i * (w / 6) + (w / 12);
        }
        if (pieces[i][j].supposedY != pieces[i][j].y && !pieces[i][j].snapping) {
          pieces[i][j].y = j * (w / 6) + (13 * w / 12);
        }
      }
      if (falling) {
        if (pieces[i][j].supposedY != j * (w / 6) + (13 * w / 12)) {
          pieces[i][j].fall(j * (w / 6) + (13 * w / 12));
        }
      }
      pieces[i][j].display();
    }
  }
  for (var i = 0; i < cnt; i++) {
    for (var j = 0; j < effects[i].length; j++) {
      effects[i][j].display();
      effects[i][j].explode();
      effects[i][j].update();
    }
  }
  if (mouseIsPressed && pressed && time.start) {
    if (mouseX <= 1) mouseX = 1;
    if (mouseX >= w - 1) mouseX = w - 1;
    if (mouseY <= w + 1) mouseY = w + 1;
    if (mouseY >= 11 * w / 6 - 1) mouseY = 11 * w / 6 - 1;
    piece.display();
    piece.opacity = 100;
    piece.x = mouseX;
    piece.y = mouseY;
    x = floor(mouseX / (w / 6));
    y = floor((mouseY - w) / (w / 6));
    if (x != initialX || y != initialY) {
      pieces[initialX][initialY] = pieces[x][y];
      initialX = x;
      initialY = y;
      if (time.velW == 0) {
        time.decrease();
      }
    }
  }
  if (inPlace() && prevInPlace) {
    falling = false;
  }
  if (components.length > 0) {
    exploding = true;
    if (millis() - milliseconds > 250) {
      for (var i = 0; i < components[0].length; i++) {
        var tmpX = floor((components[0][i].x - (w / 12)) / (w / 6));
        var tmpY = floor((components[0][i].y - (13 * w / 12)) / (w / 6));
        pieces[tmpX][tmpY].opacity = 0;
        effects[cnt][i] = new Effect(components[0][i].x, components[0][i].y, components[0][i].color);
      }
      milliseconds = millis();
      components.splice(0, 1);
      cnt++;
    }
  } else {
    exploding = false;
  }
  if (dissolved.length > 0 && !exploding) {
    falling = true;
    if (millis() - milliseconds > 350) {
      dissolving = true;
      for (var i = 0; i < 6; i++) {
        for (var j = 4; j >= 0; j--) {
          pieces[i][j] = findStack(i, j, j);
        }
      }
      dissolved = [];
    }
  }
  if (components.length == 0 && dissolving) {
    dissolving = false;
  }
  if (inPlace() && !prevInPlace) {
    milliseconds = millis();
    checkComponents();
  }
  prevInPlace = inPlace();
  time.update();
}

function mousePressed() {
  if (mouseX > 0 && mouseX < w && mouseY > w && mouseY < 11 * w / 6 && !exploding && !dissolving && !falling) {
    var i = floor(mouseX / (w / 6));
    var j = floor((mouseY - w) / (w / 6));
    initialX = i;
    initialY = j;
    piece = pieces[i][j];
    pressed = true;
    falling = false;
    time.start = true;
  }
}

function mouseReleased() {
  if (pressed) {
    pieces[x][y] = piece;
    pieces[x][y].supposedX = x * (w / 6) + (w / 12);
    pieces[x][y].supposedY = y * (w / 6) + (13 * w / 12);
    pieces[x][y].x = x * (w / 6) + (w / 12);
    pieces[x][y].y = y * (w / 6) + (13 * w / 12);
    piece.opacity = 255;
    x = -1;
    y = -1;
    pressed = false;
    if (time.velW == 0) {
      prevInPlace = true;
    }
    time.reset();
  }
}

function mouseClicked() {
  time.reset();
}

function checkComponents() {
  visited = [];
  components = [];
  dissolved = [];
  effects = [];
  exploding = true;
  cnt = 0;
  for (var i = 0; i < 6; i++) {
    rowCount[i] = 0;
    visited[i] = [];
  }
  for (var i=0; i<6; i++) {
    for (var j=0; j<5; j++) {
      if (!visited[i][j]) {
        var arr = [];
        arr.push(pieces[i][j]);
        visited[i][j] = 1;
        components.push(traverse(i, j, arr));
      }
    }
  }
  var tmpLen = components.length;
  for (var i=0; i<tmpLen; i++) {
    var filtered = new Set();
    if (components[0].length >= 3) {
      for (var j=0; j<6; j++) {
        for (var k=0; k<3; k++) {
          var three = [pieces[j][k], pieces[j][k+1], pieces[j][k+2]];
          if (three.every(p => components[0].includes(p))) {
            three.forEach(p => filtered.add(p));
          }
        }
      }
      for (var j=0; j<4; j++) {
        for (var k=0; k<5; k++) {
          var three = [pieces[j][k], pieces[j+1][k], pieces[j+2][k]];
          if (three.every(p => components[0].includes(p))) {
            three.forEach(p => filtered.add(p));
          }
        }
      }
    }
    components.shift();
    if (filtered.size > 0) {
      components.push(Array.from(filtered));
    }
  }
  
  console.log(components);
  for (var i = 0; i < components.length; i++) {
    effects[i] = [];
    for (var j = 0; j < components[i].length; j++) {
      dissolved.push(components[i][j]);
      rowCount[floor((components[i][j].x - (w / 12)) / (w / 6))]++;
    }
  }
}

function traverse(i, j, arr) {
  if (i-1 >= 0 && !visited[i-1][j] && pieces[i][j].t == pieces[i-1][j].t) {
    arr.push(pieces[i-1][j]);
    visited[i-1][j] = 1;
    arr = traverse(i-1, j, arr);
  }
  if (j-1 >= 0 && !visited[i][j-1] && pieces[i][j].t == pieces[i][j-1].t) {
    arr.push(pieces[i][j-1]);
    visited[i][j-1] = 1;
    arr = traverse(i, j-1, arr);
  }
  if (i+1 < 6 && !visited[i+1][j] && pieces[i][j].t == pieces[i+1][j].t) {
    arr.push(pieces[i+1][j]);
    visited[i+1][j] = 1;
    arr = traverse(i+1, j, arr);
  }
  if (j+1 < 5 && !visited[i][j+1] && pieces[i][j].t == pieces[i][j+1].t) {
    arr.push(pieces[i][j+1]);
    visited[i][j+1] = 1;
    arr = traverse(i, j+1, arr);
  }
  return arr;
}

function findStack(i, j, k) {
  if (j == -1) {
    return new Piece(i * (w / 6) + (w / 12), (13 * w / 12) + (w / 6) * (k - rowCount[i]), floor(random(6)));
  }
  if (dissolved.includes(pieces[i][j])) {
    return findStack(i, j - 1, k);
  } else {
    dissolved.push(pieces[i][j]);
    return pieces[i][j];
  }
}

function inPlace() {
  var ret = true;
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 5; j++) {
      if (pieces[i][j].x != i * (w / 6) + (w / 12) || pieces[i][j].y != j * (w / 6) + (13 * w / 12)) {
        ret = false;
      }
    }
  }
  return ret;
}

function disableScrolling(){
  var x=window.scrollX;
  var y=window.scrollY;
  window.onscroll=function(){window.scrollTo(x, y);};
}
