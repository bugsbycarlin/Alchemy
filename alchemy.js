var canvas;
var context;

var initialized = false;

var boardLeft = 165;
var boardTop = 38;

var bottle_left = 10;
var bottle_top = 300;


var Background = new Image();
Background.src = "Art/Scroll.jpg";

var TitleScreen = []
TitleScreen[0] = new Image();
TitleScreen[0].src = "Art/TitleScreen0.png";
TitleScreen[1] = new Image();
TitleScreen[1].src = "Art/TitleScreen1.png";

var GameOverScreen = new Image();
GameOverScreen.src = "Art/GameOverScreen.png";

var GoldBars = new Image();
GoldBars.src = "Art/GoldBars.png";
var Credits = new Image();
Credits.src = "Art/Credits.png";

var StoneSprite = new Image();
StoneSprite.src = "Art/Stone.png";
var GoldSprite = new Image();
GoldSprite.src = "Art/Gold.png";
var WhiteSquare = new Image();
WhiteSquare.src = "Art/WhiteSquare.png";
var PinkSquare = new Image();
PinkSquare.src = "Art/PinkSquare.png";
var WhiteRuneMask = new Image();
WhiteRuneMask.src = "Art/WhiteRuneMask.png";

var all_symbols = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
var all_colors = ["Red", "Blue", "Green", "Yellow", "Pink", "Orange", "Teal", "Grey"];

var TileSprite = [];
for(var i = 0; i < all_symbols.length; i++) {
  symbol = all_symbols[i];
  TileSprite[symbol] = [];
  for(var j = 0; j < all_colors.length; j++) {
    color = all_colors[j];
    TileSprite[symbol][color] = new Image();
    TileSprite[symbol][color].src = "Art/" + symbol + color + ".png";
  }
}

TileSprite["Stone"] = []
TileSprite["Stone"][""] = StoneSprite;

var BottleSprite = []
for(var i = 0; i < 4; i++) {
  BottleSprite[i] = new Image();
  BottleSprite[i].src = "Art/Bottle" + i + ".png";
}

var EdgeMask = []
for(var i = 1; i < 4; i++) {
  EdgeMask[i] = new Image();
  EdgeMask[i].src = "Art/EdgeMask" + i + ".png";
}

var NumSprite = []
for(var i = 1; i <= 4; i++) {
  NumSprite[i] = new Image();
  NumSprite[i].src = "Art/" + i + ".png";
}

var LevelTextSprite = new Image();
LevelTextSprite.src = "Art/Level.png";

var ShineSprite = [];
for(var i = 0; i < all_symbols.length; i++) {
  symbol = all_symbols[i];
  ShineSprite[symbol] = new Image();
  ShineSprite[symbol].src = "Art/" + symbol + "Shine.png";
}

var mode = "Title";
var title_page = 0;

var symbols = all_symbols;
var colors = all_colors;

var current_item = null;
var current_x = 0;
var current_y = 0;

var bottle_level = 0;

var gameover_fall_y = -600;
var gameover_fall_speed = 0;

var level = 4;

var selection_x = -1;
var selection_y = -1;

var last_play_x = -1;
var last_play_y = -1;
var last_play_count = 0;

var animation_count = 0;

var animate_rune_clearing = false;

var Board = [];

var AnimatedBoard = [];

function initialize() {
  $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
  canvas = document.getElementById('canvas');

  canvas.width = 800;
  canvas.height = 600;
  var pos = findPos(canvas);
  canvas.left = pos[0];
  canvas.top = pos[1];

  context = canvas.getContext('2d');

  window.onclick = Click;
  window.onmousemove = MouseMove;

  initializeGame();

  setInterval(draw,40);

  canvas.style.visibility = 'visible';
  var loadingdiv = document.getElementById('loadingdiv');
  loadingdiv.style.visibility = 'hidden';
}

function initializeGame() {
  setColorsAndSymbols();

  for(var i = 0; i < 9; i++) {
    Board[i] = [];
    for(var j = 0; j < 8; j++) {
      Board[i][j] = [0];
    }
  }

  pickCurrent();

  bottle_level = 0;

  selection_y = -1;
  selection_x = -1;

  gameover_fall_y = -600;
  gameover_fall_speed = 0;

  initialized = true;
}

function setColorsAndSymbols() {
  if(level == 4) {
    symbols = all_symbols.slice(0,5);
    colors = all_colors.slice(0,5);
  }
  else if(level == 3) {
    symbols = all_symbols.slice(0,7);
    colors = all_colors.slice(0,6);
  }
  else if(level == 2) {
    symbols = all_symbols.slice(0,9);
    colors = all_colors.slice(0,7);
  }
  else {
    symbols = all_symbols;
    colors = all_colors;
  }

  console.log(colors);
  console.log(symbols);
}

function pickCurrent() {
  current_item = pickRandomTile();
}

function pickRandomTile() {
  if(boardEmpty()) {
    return [1, "Stone", ""];
  }
  else {
    if(Math.random() < 1.0 / (1.0 + symbols.length * colors.length)) {
      return [1, "Stone", ""];
    }
    else {
      symbol = symbols[Math.floor(Math.random() * symbols.length)];
      color = colors[Math.floor(Math.random() * colors.length)];
      return [1, symbol, color];
    }
  }
}

function boardEmpty() {
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 8; j++) {
      if(Board[i][j].length > 1) {
        return false;
      }
    }
  }

  return true;
}

function clearFullRowsAndColumns() {
  clearCols = [];
  for(var i = 0; i < 9; i++) {
    col_clear = true;
    for(var j = 0; j < 8; j++) {
      if(Board[i][j].length == 1) {
        col_clear = false;
      }
    }
    if(col_clear) {
      clearCols.push(i);
    }
  }

  clearRows = [];
  for(var j = 0; j < 8; j++) {
    row_clear = true;
    for(var i = 0; i < 9; i++) {
      if(Board[i][j].length == 1) {
        row_clear = false;
      }
    }
    if(row_clear) {
      clearRows.push(j);
    }
  }

  for(var i = 0; i < 9; i++) {
    AnimatedBoard[i] = [];
    for(var j = 0; j < 8; j++) {
      AnimatedBoard[i][j] = [0];
    }
  }
  animate_rune_clearing = false;

  for(var x = 0; x < clearCols.length; x++) {
    for(var j = 0; j < 8; j++) {
      lowerBottle();
      AnimatedBoard[clearCols[x]][j] = Board[clearCols[x]][j];
      Board[clearCols[x]][j] = [1];
      animate_rune_clearing = true;
    }
  }

  for(var x = 0; x < clearRows.length; x++) {
    for(var i = 0; i < 9; i++) {
      lowerBottle();
      AnimatedBoard[i][clearRows[x]] = Board[i][clearRows[x]];
      Board[i][clearRows[x]] = [1];
      animate_rune_clearing = true;
    }
  }
}

function lowerBottle() {
  bottle_level -= 1;
  if(bottle_level < 0) {
    bottle_level = 0;
  }
}

function raiseBottle() {
  bottle_level += 1;
  if(bottle_level > 3) {
    bottle_level = 3;
    mode = "GameOver";
    last_play_count = animation_count;
  }
}

function checkBoardFinished() {
  boardFinished = true;

  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 8; j++) {
      if(Board[i][j][0] != 1) {
        boardFinished = false;
      }
    }
  }

  if(boardFinished) {
    mode = "ClearBoard";
  }
}

function checkSquare(x,y) {
  empty = true;

  if(x > 0) {
    if(!tilesMatch(current_item, Board[x-1][y])) return false;
    if(Board[x-1][y].length != 1) empty = false;
  }

  if(x < 8) {
    if(!tilesMatch(current_item, Board[x+1][y])) return false;
    if(Board[x+1][y].length != 1) empty = false;
  }

  if(y > 0) {
    if(!tilesMatch(current_item, Board[x][y-1])) return false;
    if(Board[x][y-1].length != 1) empty = false;
  }

  if(y < 7) {
    if(!tilesMatch(current_item, Board[x][y+1])) return false;
    if(Board[x][y+1].length != 1) empty = false;
  }

  if(current_item[1] != "Stone" && empty) return false;

  return true;
}

function tilesMatch(tile1, tile2) {
  if(tile1.length == 1 || tile2.length == 1) {
    return true;
  }

  if(tile1[1] == "Stone" || tile2[1] == "Stone") {
    return true;
  }

  if(tile1[1] == tile2[1] || tile1[2] == tile2[2]) {
    return true;
  }

  return false;
}

function calculateSelection(x,y) {
  if(x < boardLeft || x > boardLeft + 9 * 66 || y < boardTop || y > boardTop + 66 * 8) {
    return [-1,-1];
  }
  else {
    s_x = Math.floor((x - boardLeft) / 66.0);
    if(s_x > 8) {
      s_x = 8;
    }
    s_y = Math.floor((y - boardTop) / 66.0);
    if(s_y > 7) {
      s_y = 7;
    }
    return [s_x, s_y];
  }
}

function advanceLevel() {
  level -= 1;

  if(level > 0) {
    initializeGame();

    mode = "Game";
  }
  else {
    mode = "End";
    last_play_count = animation_count;
  }
}

function draw() {
  animation_count += 1;

  if(level > 1) {
    if(mode == "ClearBoard" && animation_count > last_play_count + 60) {
      advanceLevel();
    }
  }
  else if(level == 1) {
    if(mode == "ClearBoard" && animation_count > last_play_count + 20) {
      advanceLevel();
    }
  }

  // clear the screen
  context.fillStyle = "#000000"
  context.clearRect(0,0,canvas.width,canvas.height);

  if(mode == "Title") {
    drawTitle();
  }
  else if(mode == "Game" || mode == "ClearBoard") {
    drawGame();
  }
  else if(mode == "GameOver") {
    drawGameOver();
  }
  else if(mode == "End") {
    drawEnd();
  }
}

function drawEnd() {
  // draw the scroll background
  context.drawImage(Background, 0, 0);

  if(animation_count > last_play_count + 20) {
    // draw the scroll background
    context.drawImage(Background, 0, 0);

    if(animation_count <= last_play_count + 80) {
      context.globalAlpha = (animation_count - last_play_count - 20) / 60.0;
    }

    // draw the gold bars
    context.drawImage(GoldBars, 213, 153);

    // draw the credits
    context.drawImage(Credits, 0, 0);
    context.globalAlpha = 1.0;
  }
}

function drawGameOver() {
  if(animation_count <= last_play_count + 40) {
    drawGame();
    gameover_fall_y += gameover_fall_speed;
    gameover_fall_speed += 0.75;
    context.drawImage(GameOverScreen, 0, gameover_fall_y);
  }
  else {
    context.drawImage(GameOverScreen, 0, 0);
  }
}

function drawTitle() {
  // draw the scroll background
  context.drawImage(Background, 0, 0);

  // draw the title screen
  context.drawImage(TitleScreen[title_page], 0, 0);
}

function drawGame() {
  // draw the scroll background
  context.drawImage(Background, 0, 0);

  // draw the board outline
  drawBoardLines();

  if(mode == "ClearBoard") {
    if(animation_count <= last_play_count + 20) {
      context.globalAlpha = (20 + last_play_count - animation_count) / 20.0;
    }
    else {
      context.globalAlpha = 0.0;
    }
  }
  // draw tiles
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 8; j++) {
      if(Board[i][j][0] == 1) {
        context.drawImage(GoldSprite, boardLeft + 1 + 66 * i, boardTop + 1 + 66 * j);
      }
      if(Board[i][j].length > 1) {
        symbol = Board[i][j][1];
        color = Board[i][j][2];
        context.drawImage(TileSprite[symbol][color], boardLeft + 1 + 66 * i, boardTop + 1 + 66 * j);
      }
    }
  }
  context.globalAlpha = 1.0;

  if(animation_count <= last_play_count + 10 &&
     last_play_x != -1 &&
     Board[last_play_x][last_play_y].length > 1 &&
     Board[last_play_x][last_play_y][1] != "Stone" &&
     mode != "GameOver") {
    context.globalAlpha = (10 + last_play_count - animation_count) / 10.0;
    symbol = Board[last_play_x][last_play_y][1];
    context.drawImage(ShineSprite[symbol], boardLeft + 1 + 66 * last_play_x, boardTop + 1 + 66 * last_play_y);
    context.globalAlpha = 1.0;
  }

  if(animate_rune_clearing && animation_count <= last_play_count + 10) {
    // draw white mask over cleared runes
    context.globalAlpha = (10 + last_play_count - animation_count) / 10.0;
    for(var i = 0; i < 9; i++) {
      for(var j = 0; j < 8; j++) {
        if(AnimatedBoard[i][j].length > 1) {
          symbol = AnimatedBoard[i][j][1];
          color = AnimatedBoard[i][j][2];
          context.drawImage(TileSprite[symbol][color], boardLeft + 1 + 66 * i, boardTop + 1 + 66 * j);
        }
      }
    }

    context.globalAlpha = 1.0;
  }

  if(selection_x != -1 && selection_y != -1 && mode == "Game") {
    if(Board[selection_x][selection_y].length == 1) {
      context.globalAlpha = 0.25;
      if(checkSquare(selection_x,selection_y)) {
        context.drawImage(WhiteSquare, boardLeft + 66 * selection_x + 1, boardTop + 66 * selection_y + 1);
      }
      else {
        context.drawImage(PinkSquare, boardLeft + 66 * selection_x + 1, boardTop + 66 * selection_y + 1);
      }
      context.globalAlpha = 1.0;
    }
  }

  context.globalAlpha = 0.8;
  context.drawImage(LevelTextSprite, 10, 50);
  if(mode == "Game") {
    context.drawImage(NumSprite[level], 10, 110);
  }
  context.globalAlpha = 1.0;

  if(bottle_level > 0) {
    context.globalAlpha = 0.5;
    context.drawImage(BottleSprite[bottle_level], bottle_left, bottle_top);
    context.globalAlpha = 1.0;
  }
  context.drawImage(BottleSprite[0], bottle_left, bottle_top);

  if(mode == "Game") {
    context.drawImage(TileSprite[current_item[1]][current_item[2]], current_x - 32, current_y - 32);
  }

  // draw the edge mask
  if(bottle_level > 0) {
    context.drawImage(EdgeMask[bottle_level], 0, 0);
  }
}


function drawBoardLines() {
  context.strokeStyle = "#000000"
  context.lineWidth = 2;

  context.globalAlpha = 0.2;

  // vertical
  for(var i = 0; i < 10; i++) {
    context.beginPath();
    context.moveTo(boardLeft + 66 * i,boardTop);  
    context.lineTo(boardLeft + 66 * i,boardTop + 66 * 8);  
    context.stroke();
  }

  // horizontal
  for(var i = 0; i < 10; i++) {
    context.beginPath();
    context.moveTo(boardLeft,boardTop + 66 * i);  
    context.lineTo(boardLeft + 66 * 9,boardTop + 66 * i);  
    context.stroke();
  }

  context.globalAlpha = 1.0;
}

function findPos(element) {
  var curLeft = 0;
  var curTop = 0;
  if(element.offsetParent) {
    do {
      curLeft += element.offsetLeft;
      curTop += element.offsetTop;
    } while(element = element.offsetParent);
  }
  
  return [curLeft, curTop];
}

function MouseMove(ev) {
  if(!initialized) return;

  ev.preventDefault();
  current_x = ev.pageX - canvas.left;
  current_y = ev.pageY - canvas.top;

  if(mode == "Game") {
    result = calculateSelection(current_x,current_y);
    selection_x = result[0];
    selection_y = result[1];
    drawGame();
  }
}

function Click(ev)
{
  if(!initialized) return;

  ev.preventDefault();
  current_x = ev.pageX - canvas.left;
  current_y = ev.pageY - canvas.top;

  if(mode == "Title") {
    if(current_x > 700 && current_y > 500) {
      console.log("title click");
    
      if(title_page == 0) {
        title_page = 1;
      }
      else {
        mode = "Game";
      }
    }
  }
  else if(mode == "Game") { 
    result = calculateSelection(current_x,current_y);
    selection_x = result[0];
    selection_y = result[1];

    if(selection_x != -1 && selection_y != -1) {
      if(Board[selection_x][selection_y].length == 1 && checkSquare(selection_x, selection_y)) {
        Board[selection_x][selection_y] = current_item;
        last_play_count = animation_count;
        last_play_x = selection_x;
        last_play_y = selection_y;
        lowerBottle();
        clearFullRowsAndColumns();
        checkBoardFinished();
        pickCurrent();
      }
    }
    else if(current_x > bottle_left && current_x < bottle_left + 128 && current_y > bottle_top && current_y < bottle_top + 256) {
      raiseBottle();
      pickCurrent();
    }

    drawGame();
  }
  else if(mode == "GameOver" && animation_count > last_play_count + 20) {
    if(current_x > 300 && current_x < 550 && current_y > 450 && current_y < 520) {
      initializeGame();
      mode = "Game";
    }
  }
}
