let prevMouseX, prevMouseY, mouseRightPressed, mouseRightPressedPos;
let cameraPos;

let locomotive;
let allWagons = [];

let locomotiveData = {};
let wagonData = {};
let mapData;
let tracksData = {};
let buildingsData = {};
let citiesData = {};
let hudData = {};

let trWagonData = {};
let tileChangesData;

let worldMap;
let worldMapObjects = {};
let NCOLS, NROWS;

let mainCanvas, hudCanvas;

let hud;

let events = {
  //7: "",
  //29: ""
};

let currentTime = new Date(1549312452 * 1000);

let ts;

let fullImage;



function preload() {
  // citiesData = loadJSON("cities.json");

  loadJSON("hud.json", jsonData => {    
    for (const [key, val] of Object.entries(jsonData)) {
      hudData[key] = loadImage(`resources/hud/${val}`);
    }
  });

  loadJSON("tracks.json", jsonData => {    
    for (const [key, val] of Object.entries(jsonData)) {
      tracksData[key] = {"imgs": []};
      tracksData[key].imgs.push(loadImage(`resources/tracks/${val}_zi4.png`));
      tracksData[key].imgs.push(loadImage(`resources/tracks/${val}_zi4.png`));
      tracksData[key].imgs.push(loadImage(`resources/tracks/${val}_zi4.png`));
    }
  });

  loadJSON("buildings.json", jsonData => {    
    for (const [key, val] of Object.entries(jsonData)) {
      buildingsData[key] = {"imgs": [
        loadImage(`resources/buildings/${val}_normal.png`),
        loadImage(`resources/buildings/${val}_zi2.png`),
        loadImage(`resources/buildings/${val}_zi4.png`)
      ]};
    }
  });

  tileChangesData = loadJSON("tileChanges.json");

  mapData = loadStrings('transarctica_rails.txt');

  loadJSON("resources/locomotive/sprites.json", jsonData => {
    for (const [key, val] of Object.entries(jsonData)) {
      locomotiveData[key] = {
        "imgList": [],
        "offset": val.offset
      };
      for (let filename of val.fileList) {
        locomotiveData[key].imgList.push(loadImage("resources/locomotive/" + filename));
      }
    }
  });

  loadJSON("resources/wagons/sprites.json", jsonData => {
    for (const [key, val] of Object.entries(jsonData)) {
      wagonData[key] = {
        "imgList": [],
        "offset": val.offset
      };
      for (let filename of val.fileList) {
        wagonData[key].imgList.push(loadImage("resources/wagons/" + filename));
      }
    }
  });

  loadJSON("resources/tr_wagons.json", jsonData => {
    trWagonData = jsonData;
    for (const [key, val] of Object.entries(jsonData)) {      
      trWagonData[key] = {
        "img": loadImage(val.file),
        "dimensions": val.dimensions,
        "offsety": val.offsety
      }
    }
  });
}

function initialize() {
  // disable right click menu
  for (let element of document.getElementsByClassName("p5Canvas"))
    element.addEventListener("contextmenu", (e) => e.preventDefault());

  mouseRightPressedPos = createVector(0, 0);
  cameraPos = createVector(0, 0, 0);

  hudCanvas.imageMode(CENTER);
  hudCanvas.textAlign(CENTER, CENTER);
  hudCanvas.background(100);
  hudCanvas.textSize(28);
  hudCanvas.fill(200);
  hudCanvas.noStroke();
}



function setup() {  
  //noLoop();

  createCanvas(1900, 900);
  mainCanvas = createGraphics(1900, 840);
  hudCanvas = createGraphics(1900, 60);
  

  //hudCanvas.frameRate(1)
  mainCanvas.imageMode(CENTER)
  
  initialize();  

  hud = new Hud(hudData);
  
  mainCanvas.background(0);
  hud.show(hudCanvas);

  
  //let scncitytrade = new ScnCityTrade(tracksData, trWagonData);
  //scncitytrade.show();
  //return;
  
  worldMap = new WorldMap(mapData, tracksData, buildingsData, citiesData);
  let aux = worldMap.map2screen(4,55,2);
  cameraPos.set(0, 0, 2);

  locomotive = new Locomotive(createVector(2, 0), locomotiveData); 
  locomotive.addWagon("locomotive");
  locomotive.addWagon("tender");

  locomotive.addWagon("cannon");
  locomotive.addWagon("livestock");

  let scnwagontrade = new ScnWagonTrade(tracksData, trWagonData);
  scnwagontrade.show(locomotive);
  noLoop();
  return;

  worldMap.show(mainCanvas, cameraPos);
  locomotive.show(mainCanvas, cameraPos, locomotiveData, worldMap);

  //ts = new TradeScreen();
  //ts.show();

  image(mainCanvas, 0, 0);
  image(hudCanvas, 0, 840);
  
}

function redrawMap() {
  mainCanvas.background(0);
  worldMap.show(mainCanvas, cameraPos);
  //ts.show();
}

function draw() {  
  hud.tick();
  hud.show(hudCanvas);
  locomotive.update(worldMap);

  hud.update(locomotive.gear, locomotive.gold, round(locomotive.fuel), round(locomotive.velocity.mag()*10000));

  //worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x);
  if (locomotive.orientation == 90 || locomotive.orientation == 270) {
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y-1, locomotive.currentTile.x);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y+1, locomotive.currentTile.x);
  } else if (locomotive.orientation == 0 || locomotive.orientation == 180) {
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x+1);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x-1);
  } else {
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x+1);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x-1);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y, locomotive.currentTile.x);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y+1, locomotive.currentTile.x);
    worldMap.drawTile(mainCanvas, locomotive.currentTile.y-1, locomotive.currentTile.x);
  }
  
  if (locomotive.enteredNewTile()) {
    locomotive.newOrientation(worldMap);
    if (worldMap.map2idx(locomotive.currentTile) in events) {
      console.log("Collision");
      locomotive.stop();
    }
  }
  locomotive.show(mainCanvas, cameraPos, locomotiveData, worldMap);

  stroke(255)
  // line(0,-height/2,0,height/2)
  // line(-width/2,0,width/2,0)
  // mainCanvas.line(0,mainCanvas.height/2,mainCanvas.width,mainCanvas.height/2)
  // mainCanvas.line(mainCanvas.width/2,0,mainCanvas.width/2,mainCanvas.height)

  image(mainCanvas, 0, 0);
  image(hudCanvas, 0, 840);
}

function mousePressed() {
  if ((mouseButton === RIGHT) && (mouseRightPressed == false)) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseRightPressed = true;
    mouseRightPressedPos.set(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (mouseButton === RIGHT)
    mouseRightPressed = false;  
}

function mouseDragged() {
  if (mouseRightPressed) {
    cameraPos.x -= (mouseX - prevMouseX)*(5-cameraPos.z),
    cameraPos.y -= (mouseY - prevMouseY)*(5-cameraPos.z);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    redrawMap();
    redraw();
  }
}

function mouseWheel(event) {
  // zoom in 
  // if (event.delta < 0) {
  //   if (cameraPos.z == 2)
  //     return;
  //   else if (cameraPos.z == 1)
  //     cameraPos.z = 2;
  //   else if (cameraPos.z == 0)
  //     cameraPos.z = 1;
  // }  
  // else {  // zoom out
  //   if (cameraPos.z == 0)
  //     return;
  //   else if (cameraPos.z == 1)
  //     cameraPos.z = 0;
  //   else if (cameraPos.z == 2)
  //     cameraPos.z = 1;
  // }
  // console.log(`Camera zoom: ${cameraPos.z}`);
  // redraw();
}

function keyPressed() {
  if (keyCode == CONTROL) {
    locomotive.startStop();
  }
  if (keyCode == SHIFT) {
    locomotive.turn180(worldMap);
  }
}

function mouseClicked() {
  worldMap.processClick(mouseX-width/2, mouseY-height/2, cameraPos);
  redrawMap();  //Todo: only redraw clicked tile
}
