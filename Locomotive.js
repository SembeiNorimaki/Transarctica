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
    "Wood": 0
  }

  this.cargo = {
    "Coal": 0,
    "Iron": 0,
    "Oil": 0,
    "Livestock": 0,
    "Wood": 0
  }
  

  
  // We start the train with a locomotive, tender, command, barracks

  this.addWagon = (wagonType) => {
    console.log(wagonType, this.wagonsData[wagonType])
    let newWagon = new Wagon(1, wagonType, this.wagonsData[wagonType]);
    this.wagons.push(newWagon);
    // update train capacities and weight
    this.capacity[wagonType] += newWagon.capacity;
  } 
  // returns:
  // 0: No error, resource added successfully
  // 1: not enough gold
  // 2: no enough storage 
  this.addResource = (resourceType, qty, price) => {
    if (price > this.gold) {
      console.log("Not enough gold");
      return 1;
    }
    for (let i=0; i<this.wagons.length; i++) {
      if (this.wagons[i].cargo == resourceType) {
        console.log(`Wagon ${i} can transport ${resourceType}`);
        if (this.wagons[i].capacity - this.wagons[i].content < qty) {
          console.log(`Wagon ${i} does not have enough room for ${resourceType}`);
          continue;
        }
        this.wagons[i].content += qty;
        this.cargo[resourceType] += qty;
        this.gold -= price;
        return 0;
      }
    }
    return 2;
  }

  this.showHorizontalTrain = (canvas, xpos) => {
    canvas.imageMode(CORNER);
    canvas.image(this.wagons[0].img[0], xpos, 740 + this.wagons[0].offsety);
    xpos -= this.wagons[1].dimensions[0]+10;
    for (let i=0; i< this.wagons.length-1; i++) {
      if (this.wagons[i].content == 0) {
        canvas.image(this.wagons[i].img[0], xpos, 740 + this.wagons[i].offsety);
      }
      else if (this.wagons[i].content == this.wagons[i].capacity) {
        canvas.image(this.wagons[i].img[this.wagons[i].img.length-1], xpos, 740 + this.wagons[i].offsety);
      }
      //canvas.rect(xpos-this.wagons[i+1].dimensions[0]/2, 830, 120,5);
      //canvas.rect(xpos-this.wagons[i+1].dimensions[0]/2-10, 825, 100,5);
      canvas.text(`${this.wagons[i].content} / ${this.wagons[i].capacity}`,
        xpos+this.wagons[i].dimensions[0]/2-30, 835);
      xpos -= this.wagons[i+1].dimensions[0]+10;
    }
    if (this.wagons[this.wagons.length-1].content == 0) {
      canvas.image(this.wagons[this.wagons.length-1].img[0], xpos, 740 + this.wagons[this.wagons.length-1].offsety);
    }
    else if (this.wagons[this.wagons.length-1].content == this.wagons[this.wagons.length-1].capacity) {
      canvas.image(this.wagons[this.wagons.length-1].img[this.wagons[this.wagons.length-1].img.length-1], xpos, 740 + this.wagons[this.wagons.length-1].offsety);
    }
    else if (this.wagons[this.wagons.length-1].img.length > 1) {
      canvas.image(this.wagons[this.wagons.length-1].img[1], xpos, 740 + this.wagons[this.wagons.length-1].offsety);
    }

    
    canvas.text(`${this.wagons[this.wagons.length-1].content} / ${this.wagons[this.wagons.length-1].capacity}`,
        xpos+this.wagons[this.wagons.length-1].dimensions[0]/2-30, 835);

    // for (let wagon of this.wagons) {
    //   canvas.image(wagon.img, xpos, 740 + wagon.offsety);
    //   xpos -= 132;
    // }
    canvas.imageMode(CENTER);
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
    canvas.circle(this.screenPos.x, this.screenPos.y, 5);

    this.screenPos = worldMap.map2screen(this.frontSensor.x, this.frontSensor.y, cameraPos.z);
    this.screenPos.add(-cameraPos.x,  -cameraPos.y);
    this.screenPos.add(canvas.width/2, canvas.height/2);
    // this.screenPos.add([
    //   imgData[this.orientation].offset[0],
    //   imgData[this.orientation].offset[1] 
    // ]);
    canvas.circle(this.screenPos.x, this.screenPos.y, 5);

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
