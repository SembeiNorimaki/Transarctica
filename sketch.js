let prevMouseX, prevMouseY, mouseRightPressed, mouseRightPressedPos;
let cameraPos;


// data from json files
let locomotiveData = {};
let mapData;
let tracksData = {};
let roadsData = {};
let buildingsData = {};
let citiesData = {};
let hudData = {};
let trWagonData = {};
let industryData = {};
let miscData = {};
let tileChangesData;


let locomotive;
let worldMap;

let mainCanvas, hudCanvas;
let hud;

let currentTime = new Date(1549312452 * 1000);
let currentCity, currentScene;


let backgroundImg, combatImg;


//let scenes = ("Navigation", "CityTrade", "WagonTrade", "Combat");

let events = {
  "13,16": 11,  // mine  
  "9,22": 64,   // Taoudeni
  "5,10": 65    // Marrakesh
  
};

function preload() {
  loadJSON("allResources.json", jsonData => {

    citiesData = jsonData.cities;
    miscData.comrad = loadImage('resources/comrad.png');
    tileChangesData = jsonData.tileChanges;
    mapData = loadStrings('map_small.txt');

    // - HUD
    for (const [key, val] of Object.entries(jsonData.hud)) {
      hudData[key] = loadImage(`resources/hud/${val}`);
    }

    // - Industries
    for (const [key, val] of Object.entries(jsonData.industries)) {
      industryData[key] = val;
      industryData[key].img = loadImage(`resources/industries/${val.file}`);
      industryData[key].imgs = [];
      for (let aux of val.files) {
        industryData[key].imgs.push(loadImage(`resources/industries/${aux}`));
      }
    }

    // - Tracks
    for (const [key, val] of Object.entries(jsonData.tracks)) {
      tracksData[key] = {"img": loadImage(`resources/tracks/${val}_zi4.png`)};
    }
  
    // - Roads
    for (const [key, val] of Object.entries(jsonData.roads)) {
      roadsData[key] = {"img": loadImage(`resources/roads/${val}_zi4.png`)};
    }

    // - Buildings
    for (const [key, val] of Object.entries(jsonData.buildings)) {
      buildingsData[key] = {"img": loadImage(`resources/buildings/${val}_zi4.png`)};
    }
    
    // - Locomotive
    for (const [key, val] of Object.entries(jsonData.locomotive)) {
      locomotiveData[key] = {
        "imgList": [],
        "offset": val.offset
      };
      for (let filename of val.fileList) {
        locomotiveData[key].imgList.push(loadImage("resources/locomotive/" + filename));
      }
    }

    // - Wagons
    trWagonData = jsonData.wagons;
    for (const [key, val] of Object.entries(jsonData.wagons)) {
      trWagonData[key] = val;
      trWagonData[key].img = [];
      for (let filename of val.files) {
        trWagonData[key].img.push(loadImage(filename));
      }
    }

  });
}

function populateBackgroundImages() {
  backgroundImg = createGraphics(1900, 900);
  combatImg = createGraphics(1900, 900);
  for (let row=0; row<16; row++) {
    for (let col=0; col<9; col++) {
      x = col*128*2 + (128 * (row%2)+1) -128
      y = row*64 -64;
      backgroundImg.image(tracksData["0"].img, x, y);
      combatImg.image(tracksData["0"].img, x, y);
    }
  }
  for (let i=-1;i<15;i++) {
    if (i%2) {
      backgroundImg.image(tracksData["H1"].img, i*128, 825);
      // backgroundImg.image(tracksData["H1"].img, i*128, 825-90);
      combatImg.image(tracksData["H1"].img, i*128, 825);
    }
    else {
      backgroundImg.image(tracksData["H2"].img, i*128, 825);
      // backgroundImg.image(tracksData["H2"].img, i*128, 825-90);
      combatImg.image(tracksData["H2"].img, i*128, 825);
    }
  }

  // for (let i=0; i<7; i++) {
  //   backgroundImg.image(tracksData["BC"].img, 256*2+i*128, 600-i*64);
  // }
  
  for (let i=-1;i<15;i++) {
    if (i%2)
      combatImg.image(tracksData["H1"].img, i*128, 100);
    else
      combatImg.image(tracksData["H2"].img, i*128, 100);
  }
}

function initialize() {
  // disable right click menu
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  mouseRightPressedPos = createVector(0, 0);
  cameraPos = createVector(0, 0);

  hudCanvas.imageMode(CENTER);
  hudCanvas.textAlign(CENTER, CENTER);
  hudCanvas.background(100);
  hudCanvas.textSize(28);
  hudCanvas.fill(200);
  hudCanvas.noStroke();

  mainCanvas.rectMode(CENTER);
  mainCanvas.imageMode(CENTER);
  mainCanvas.background(0);

  populateBackgroundImages();
}

function setup() {  
  // noLoop();
  createCanvas(1900, 900);
  mainCanvas = createGraphics(1900, 840);
  hudCanvas = createGraphics(1900, 60);  
  initialize();  
  background(100);
  
  hud = new Hud(hudData);
  worldMap = new WorldMap(mapData, tracksData, buildingsData, citiesData, industryData);
  let aux = worldMap.map2screen(12, 17);
  cameraPos.set(aux.x, aux.y);

  locomotive = new Locomotive(createVector(12, 17), 0.0, trWagonData); 
  locomotive.addWagon("Locomotive");
  locomotive.addWagon("Tender");
  locomotive.addWagon("Cannon");
  locomotive.addWagon("Livestock");
  locomotive.addWagon("Oil");
  locomotive.addWagon("Iron");
  locomotive.addWagon("Wood");
  locomotive.addWagon("Container");
  locomotive.addWagon("Drill");
  

  // currentScene = "Navigation";
  currentScene = "CityTrade";
  currentCity = new ScnCityTrade(citiesData[65], industryData, roadsData, buildingsData, backgroundImg);
  // currentScene = "Combat";
  // currentCity = new ScnCombat(combatImg);
  // currentScene = "WagonTrade";
  // currentCity = new ScnWagonTrade(tracksData, trWagonData, backgroundImg);

  switch(currentScene) {
    case("Navigation"):
      worldMap.show(mainCanvas, cameraPos);
      locomotive.show(mainCanvas, cameraPos, locomotiveData, worldMap);
      hud.show(hudCanvas);
    break;
    case("CityTrade"):
      currentCity.show(mainCanvas, locomotive);
    break;
    case("WagonTrade"):
      currentCity.show(mainCanvas, locomotive);
    break;
    case("Combat"):
      currentCity.show(mainCanvas, locomotive);
    break;
  };

  image(mainCanvas, 0, 0);
  image(hudCanvas, 0, 840);
}

function redrawMap() {
  mainCanvas.background(0);
  worldMap.show(mainCanvas, cameraPos);
}

function draw() {  
  hud.tick();
  hud.update(locomotive.gear, locomotive.gold, round(locomotive.fuel), round(locomotive.velocity.mag()*10000));
  
  switch(currentScene) {
    case("Navigation"):
      locomotive.update(worldMap);
      //let aux = worldMap.map2screen(locomotive.position.x, locomotive.position.y, 2);
      //cameraPos.set(aux.x, aux.y)
      
      if (locomotive.enteredNewTile()) {
        locomotive.newOrientation(worldMap);
        let tileString = String(locomotive.currentTile.x) + "," + String(locomotive.currentTile.y);
        
        if (tileString in events) {
          console.log("Arrived to a city");
          //locomotive.stop();          
          //currentCity = new ScnCityTrade(citiesData[events[tileIdx]], industryData, roadsData, buildingsData, backgroundImg);
          //currentScene = "CityTrade";
        }
      }
      worldMap.show(mainCanvas, cameraPos);
      locomotive.show(mainCanvas, cameraPos, locomotiveData, worldMap);
      
    break;
    case("CityTrade"):
      currentCity.update(locomotive);  
      currentCity.show(mainCanvas, locomotive);
    break;
    case("WagonTrade"):
      currentCity.update();
      currentCity.show(mainCanvas, locomotive);
    break;
    case("Combat"):
      currentCity.update();
      currentCity.show(mainCanvas, locomotive);
    break;
  };

  hud.show(hudCanvas);

  // Comrad text
  // mainCanvas.fill(0,0,0,50)
  // mainCanvas.rect(mainCanvas.width/2,mainCanvas.height-100,mainCanvas.width,200);
  mainCanvas.image(miscData.comrad,75,mainCanvas.height-94)
  // mainCanvas.noStroke()
  // mainCanvas.fill(0)
  // mainCanvas.textSize(30)
  // mainCanvas.text("Welcome on board, comrad.", 80,mainCanvas.height-150);
  // mainCanvas.text("I'm Igor, your second in command of the Transarctica.", 80,mainCanvas.height-100);
  // mainCanvas.text("You can click me anytime to review your objectives", 80,mainCanvas.height-50);
  
  
  image(mainCanvas, 0, 0);
  image(hudCanvas, 0, 840);
}

function mousePressed() {
  if ((mouseButton === RIGHT) && (!mouseRightPressed)) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseRightPressed = true;
    mouseRightPressedPos.set(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (mouseButton === RIGHT) {
    mouseRightPressed = false;
  }  
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
  switch(currentScene) {
    case("Navigation"):
      if (keyCode == CONTROL) {
        locomotive.startStop();
      }
      if (keyCode == SHIFT) {
        locomotive.turn180(worldMap);
      }
    break;

    case("CityTrade"):
      currentCity.processKey(keyCode);
    break;
    
    case("WagonTrade"):
      currentCity.processKey(keyCode);
    break;
  }
}

function mouseClicked() {
  let action;
  switch(currentScene) {
    case("Navigation"):
      worldMap.processClick(mouseX-width/2, mouseY-height/2, cameraPos);
      redrawMap();  //Todo: only redraw clicked tile  
    break;

    case("CityTrade"):
      action = currentCity.processClick(mouseX, mouseY, locomotive);
      if (action == 1)
        currentScene = "Navigation";
        redrawMap();
    break;
    
    case("WagonTrade"):
    break;
  }  
}
