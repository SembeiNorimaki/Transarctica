function Locomotive(pos, orientation, wagonsData) {
  // position of the locomotive in a 2d map, with decimals
  this.position = pos;
  this.prevPosition = pos.copy();
  // orientation in a 2d map, in degrees, from 0 to 360
  this.orientation = orientation;
  this.prevOrientation = 0.0;
  this.wagonsData = wagonsData;

  this.frontSensor = createVector(0.4, 0).setHeading(radians(this.orientation)).add(this.position);

  this.screenPos = createVector(0, 0);
  this.currentTile = this.position.copy();
  this.prevTile = this.currentTile.copy();

  this.currentTileFrontSensor = createVector(round(this.frontSensor.x), round(this.frontSensor.y));
  
  this.acceleration = createVector(0.001, 0).setHeading(radians(this.orientation));
  this.braking = createVector(0.001, 0);  
  this.velocity = createVector(0.0, 0.0);
  this.spriteIdx = 0;
  this.running = false;
  this.spriteSpeed = 6;
  this.bg;

  this.wagons = [];

  this.maxVelocity = 0.03;

  this.gear = "N";  // Neutral, Direct
  this.gold = 5000;
  this.fuel = 1000;

  this.capacity = {
    "Coal": 0,
    "Iron": 0,
    "Oil": 0,
    "Livestock": 0,
    "Wood": 0,
    "Container": 0
  }

  this.usedSpace = {
    "Coal": 0,
    "Iron": 0,
    "Oil": 0,
    "Livestock": 0,
    "Wood": 0,
    "Container": 0
  }
  

  this.addWagon = (wagonType) => {    
    let newWagon = new Wagon(1, wagonType, this.wagonsData[wagonType]);
    this.wagons.push(newWagon);
    // update train capacities
    this.capacity[wagonType] += newWagon.capacity;
  } 
 
  this.buyResource = (resourceName, qty, price) => {
    if (price > this.gold) {
      throw("Not enough gold");
    }

    // Search for a wagon that can store the resource
    for (let wagon of this.wagons) {
      if (wagon.resourceName == resourceName) {
        try {
          wagon.addResource(qty);
        } catch (err) {
          continue;
        }
        this.usedSpace[resourceName] += qty;
        this.gold -= price;
        return;
      }
    }
    throw("No available space in train");
  }

  this.sellResource = (wagon, qty, price) => {
    try {
      wagon.removeResource(qty);
    } catch (err) {
      throw(err);
    }    
    this.gold += price;
  }

  this.showHorizontalTrain = (canvas, xpos) => {
    let ypos = 800; 
    for (let wagon of this.wagons) {
      xpos -= wagon.halfSize[0];
      wagon.showHorizontal(canvas, createVector(xpos, ypos));
      canvas.circle(xpos, ypos,5)
      
      xpos -= wagon.halfSize[0]+10;
    }
  }

  this.show = (canvas, cameraPos, imgData, worldMap) => {    
    this.screenPos = worldMap.map2screen(this.position.x, this.position.y, cameraPos.z);
    this.screenPos.add(-cameraPos.x,  -cameraPos.y);
    this.screenPos.add(canvas.width/2, canvas.height/2);
    this.screenPos.add([
      imgData[this.orientation].offset[0],
      imgData[this.orientation].offset[1] 
    ]);
    

    canvas.image(imgData[this.orientation.toString()].imgList[this.spriteIdx], this.screenPos.x, this.screenPos.y);
    //canvas.circle(this.screenPos.x, this.screenPos.y, 5);

    //this.screenPos = worldMap.map2screen(this.frontSensor.x, this.frontSensor.y, cameraPos.z);
    //this.screenPos.add(-cameraPos.x,  -cameraPos.y);
    //this.screenPos.add(canvas.width/2, canvas.height/2);

    //canvas.circle(this.screenPos.x, this.screenPos.y, 5);

  }

  this.start = () => {
    this.gear = "D";
  }

  this.stop = () => {
    this.gear = "N";
  }

  this.startStop = () => {
    if (this.gear == "N") {
      this.start();
    } else {
      this.stop();
    }    
  }

  this.turn180 = (worldMap) => {
    if (this.velocity.mag() == 0) {
      this.orientation =  (this.orientation + 180) % 360;
      this.acceleration.setHeading(radians(this.orientation));
      this.update(worldMap);
    }
  }

  this.checkFrontSensor = (worldMap) => {
    let deltaX = this.currentTileFrontSensor.x - this.currentTile.x;
    let deltaY = this.currentTileFrontSensor.y - this.currentTile.y;
    let tileName = worldMap.tileIdx2name[worldMap.board[this.currentTileFrontSensor.y][this.currentTileFrontSensor.x]];

    if ((deltaX == 1 && !tileName.includes("A")) ||
        (deltaX == -1 && !tileName.includes("D")) ||
        (deltaY == 1 && !tileName.includes("B")) ||
        (deltaY == -1 && !tileName.includes("C"))) {
          this.stop();
          this.velocity.setMag(0.0);
    }
  }

  this.newOrientation = (worldMap) => {
    //console.log(worldMap.tileIdx2name[worldMap.board[this.currentTile.y][this.currentTile.x]]);
    // stations make the train stop
    // if ([0x81, 0x82].includes(worldMap.board[this.currentTile.y][this.currentTile.x])) {
    //   this.stop();
    //   this.braking.setMag(this.velocity.mag()*this.velocity.mag()/1.2);
    //   console.log(this.braking.mag())
    //   return;
    // }

    console.log(this.currentTile.x, this.currentTile.y,worldMap.map2idx(createVector(this.currentTile.x, this.currentTile.y)))
    switch(worldMap.tileIdx2name[worldMap.board[this.currentTile.y][this.currentTile.x]]) {
      case("AB"):
      case("ABc"):
      case("ABd"):
        if (this.velocity.y > 0) {    
          this.orientation = 135;
          this.position = createVector(this.currentTile.x, this.currentTile.y - 0.5);
        } else {
          this.orientation = 315;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y);
        }
      break;
      case("AC"):
      case("ACb"):
      case("ACd"):
        if (this.velocity.x > 0) {
          this.orientation = 45;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y );
        } else {
          this.orientation = 225;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        }
      break;
      case("AD"):
      case("ADb"):
      case("ADc"):
        if (this.velocity.x > 0) {
          this.orientation = 0;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y);
        } else {
          this.orientation = 180;
          this.position = createVector(this.currentTile.x + 0.5, this.currentTile.y);
        }
      break;
      case("BC"):
      case("BCa"):
      case("BCd"):
        if (this.velocity.y > 0) {
          this.orientation = 90;
          this.position = createVector(this.currentTile.x, this.currentTile.y - 0.5);
        } else {
          this.orientation = 270;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        }
      break;
      case("BD"):
      case("BDa"):
      case("BDc"):
        if (this.velocity.x < 0) {
          this.orientation = 225;
          this.position = createVector(this.currentTile.x+0.5, this.currentTile.y);
        } else {
          this.orientation = 45;
          this.position = createVector(this.currentTile.x, this.currentTile.y-0.5);
        }
      break;
      case("CD"):
      case("CDa"):
      case("CDb"):
        if (this.velocity.y < 0) {
          this.orientation = 315;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        } else {
          this.orientation = 135;
          this.position = createVector(this.currentTile.x + 0.5, this.currentTile.y);
        }
      break;
    }
    this.frontSensor = createVector(0.4, 0).setHeading(radians(this.orientation)).add(this.position);
    this.velocity.setHeading(radians(this.orientation));
    this.acceleration.setHeading(radians(this.orientation));

  }

  this.enteredNewTile = () => {
    return !this.currentTile.equals(this.prevTile);
  }

  this.update = (worldMap) => {
    if (this.gear == "D") {
      this.velocity.add(this.acceleration);      
      if (this.velocity.mag() > this.maxVelocity)
        this.velocity.setMag(this.maxVelocity)
    } else {
      this.braking.setHeading(radians(this.orientation));
      this.velocity.sub(this.braking);
      if (this.velocity.mag() < 0.01)
        this.velocity.setMag(0.0);
    }
    this.prevPosition = this.position.copy();
    this.position.add(this.velocity);  
    this.fuel -= this.velocity.mag();

    this.frontSensor = createVector(0.4, 0).setHeading(radians(this.orientation)).add(this.position);

    this.prevTile = this.currentTile.copy();
    this.currentTile.set(round(this.position.x), round(this.position.y));

    this.currentTileFrontSensor.set(round(this.frontSensor.x), round(this.frontSensor.y));

    this.checkFrontSensor(worldMap);

    

    // update wagons
    // for (let wagon of this.wagons) {
    //   if (wagon.enteredNewTile()) {
    //     console.log(wagon.currentTile.array(), wagon.prevTile.array())
    //     console.log("new tile")
    //     wagon.newOrientation(worldMap);
    //   }
    //   wagon.setVelocityMag(this.velocity.mag());
    //   wagon.update();
    // }

    // update sprite
    if (this.gear == "D") {
      if (frameCount % this.spriteSpeed == 0)
        this.spriteIdx++;
      if (this.spriteIdx >= 4)
        this.spriteIdx = 0;    
    }
  }  
}
