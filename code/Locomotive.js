// Copyright (C) 2023  Sembei Norimaki

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

class Locomotive {
  constructor(pos, orientation) {
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
    this.prevTileFrontSensor = createVector(round(this.frontSensor.x), round(this.frontSensor.y));
    
    this.acceleration = createVector(0.0002, 0).setHeading(radians(this.orientation));
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
      "Copper": 0,
      "Oil": 0,
      "Livestock": 0,
      "Wood": 0,
      "Container": 0
    }

    this.usedSpace = {
      "Coal": 0,
      "Iron": 0,
      "Copper": 0,
      "Oil": 0,
      "Livestock": 0,
      "Wood": 0,
      "Container": 0
    }

    this.defaultInitialization();
  }
  
  defaultInitialization() {
    this.addWagon("Locomotive");  // 0
    this.addWagon("Tender");      // 1
    this.addWagon("Livestock");   // 2
    this.addWagon("Oil");         // 3
    this.addWagon("Iron");        // 4
    this.addWagon("Copper");      // 5
    this.addWagon("Wood");        // 6
    this.addWagon("Container");   // 7
    this.addWagon("Drill");       // 8

    this.wagons[3].addResource(100);
    this.wagons[4].addResource(1500);
    this.wagons[5].addResource(1500);
    this.wagons[6].addResource(100);
    this.wagons[7].addResource(2);    
  }

  addWagon(wagonType) {    
    let newWagon = new Wagon(1, wagonType, this.wagonsData[wagonType]);
    this.wagons.push(newWagon);
    // update train capacities
    this.capacity[wagonType] += newWagon.capacity;
  } 
 
  buyResource(resourceName, qty, price) {
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

  sellResource(wagon, qty, price) {
    try {
      wagon.removeResource(qty);
    } catch (err) {
      throw(err);
    }    
    this.gold += price;
  }

  showHorizontalTrain(canvas, xpos, ypos) {
    this.wagons[0].setPos(createVector(xpos, ypos));
    this.wagons[0].showHorizontal(canvas);
      
    for (let i=1; i<this.wagons.length; i++) {
      xpos -= this.wagons[i].halfSize[0]*2+5;
      this.wagons[i].setPos(createVector(xpos, ypos));
      this.wagons[i].showHorizontal(canvas);
      canvas.textAlign(CENTER, CENTER);
      canvas.text(`${this.wagons[i].usedSpace} / ${this.wagons[i].capacity}`, xpos+this.wagons[i].halfSize[0], ypos + 30);   
      canvas.textAlign(LEFT);
    }
  }

  clickHorizontalTrain(currentX, x, y) {
    let idx = 0;
    if (x > currentX) { 
      return idx;
    }
    for (let i=1; i<this.wagons.length; i++) {
      idx +=1;
      currentX -= (this.wagons[i].halfSize[0]*2+5);
      if (x > currentX) { 
        return idx;
      }      
    }
    return -1;
  }

  show(canvas, cameraPos) { 
    this.screenPos = worldMap.map2screen(this.position.x, this.position.y);
    this.screenPos.add(-cameraPos.x,  -cameraPos.y);
    this.screenPos.add(canvas.width/2, canvas.height/2);
    this.screenPos.add([
      locomotiveData[this.orientation].offset[0],
      locomotiveData[this.orientation].offset[1] 
    ]);
    

    canvas.image(locomotiveData[this.orientation.toString()].imgList[this.spriteIdx], this.screenPos.x, this.screenPos.y);
    //canvas.circle(this.screenPos.x, this.screenPos.y, 5);

    //this.screenPos = worldMap.map2screen(this.frontSensor.x, this.frontSensor.y, cameraPos.z);
    //this.screenPos.add(-cameraPos.x,  -cameraPos.y);
    //this.screenPos.add(canvas.width/2, canvas.height/2);

    //canvas.circle(this.screenPos.x, this.screenPos.y, 5);

  }

  start() {
    this.gear = "D";
  }

  stop() {
    this.gear = "N";
  }
  inmediateStop() {
    this.gear = "N";
    this.velocity.setMag(0.0);
  }

  startStop() {
    if (this.gear == "N") {
      this.start();
    } else {
      this.stop();
    }    
  }

  turn180() {
    if (this.velocity.mag() == 0) {
      this.orientation =  (this.orientation + 180) % 360;
      this.acceleration.setHeading(radians(this.orientation));
      this.update();
    }
  }
  
  checkFrontSensor() {
    let deltaX = this.currentTileFrontSensor.x - this.prevTileFrontSensor.x;
    let deltaY = this.currentTileFrontSensor.y - this.prevTileFrontSensor.y;
    let tileName = "";
    // try {
      tileName = worldMap.tileIdx2name[worldMap.board[this.currentTileFrontSensor.y][this.currentTileFrontSensor.x]];
    // } catch {
    //   console.log("dsdfsdf")
    //   this.stop();
    //   this.velocity.setMag(0.0);
    //   return;
    // }

    if ((deltaX == 1 && !tileName.includes("A")) ||
        (deltaX == -1 && !tileName.includes("D")) ||
        (deltaY == 1 && !tileName.includes("B")) ||
        (deltaY == -1 && !tileName.includes("C"))) {
          this.stop();
          this.velocity.setMag(0.0);
    }
  }

  newOrientation() {
    //console.log(worldMap.tileIdx2name[worldMap.board[this.currentTile.y][this.currentTile.x]]);
    // stations make the train stop
    // if ([0x81, 0x82].includes(worldMap.board[this.currentTile.y][this.currentTile.x])) {
    //   this.stop();
    //   this.braking.setMag(this.velocity.mag()*this.velocity.mag()/1.2);
    //   console.log(this.braking.mag())
    //   return;
    // }

    //console.log(this.currentTile.x, this.currentTile.y,worldMap.map2idx(createVector(this.currentTile.x, this.currentTile.y)))
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

  enteredNewTile(sensorId) {
    if (sensorId == 1)  { // center sensor
      return !this.currentTile.equals(this.prevTile);
    } else if (sensorId == 2) {
      return !this.currentTileFrontSensor.equals(this.prevTileFrontSensor);
    }
  }

  update() {
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

    
    this.prevTileFrontSensor = this.currentTileFrontSensor.copy();
    this.currentTileFrontSensor.set(round(this.frontSensor.x), round(this.frontSensor.y));

    //this.checkFrontSensor(worldMap);

    

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
