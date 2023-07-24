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

class ScnCityTrade {
  constructor(cityData, industryData, roadsData, buildingsData, backgroundImg) {
    this.cityData = cityData;
    this.roadsData = roadsData;
    this.buildingsData = buildingsData;
    this.industryType = cityData.industry;
    this.industryAvailableQty = cityData.availableQty;
    this.needs = cityData.needs;
    this.fulfilled = {}
    for(const [key, val] of Object.entries(this.needs)) {
      this.fulfilled[key] = 0;
    }
    this.goods = cityData.goods;
    this.backgroundImg = backgroundImg;
    this.industryPos = createVector(384, 412);
    this.maxVel = 10.0;
    this.vel = this.maxVel;  
    this.acc = 0;
    this.gear = "N";
    this.direction = 1;  // -1 backward
    this.trainXpos = 0;

    this.rewardUnlocked = false;

    this.selectedObject = null;
    this.selectedWagon = null;
    this.selectedObjectType = null;
    this.errorMsg = "";

    this.industry = new Industry(this.industryPos, industryData[cityData.industry]);

    this.buttons = {};
    this.buttons.buy = new ClickableRegion(createVector(1600, 700), [80, 30], [], "Buy");
    this.buttons.sell = new ClickableRegion(createVector(1600, 700), [80, 30], [], "Sell");
    this.buttons.close = new ClickableRegion(createVector(1800, 700), [80, 30], [], "Close");

    this.activeButtons = [];
    // this.trafficLightImg = this.buildingsData["10"].img;
    // this.trafficLightState = 0;
    this.exitSequence = false;
    this.enterSequence = true;
    // this.buttons.sell = new ClickableRegion(createVector(1600, 600), [80, 30], [], "Sell");
    

    this.trafficLight = new TrafficLight(createVector(canvas.width-50, 
      canvas.height-220), 
      [this.buildingsData["10"].img, this.buildingsData["11"].img], 
      createVector(60, 100));

    this.houses = [];
    //this.houses.push(new House(createVector(128+4*128, 418-4*64), this.buildingsData["8"].img));
    //this.houses.push(new House(createVector(128+6*128, 418-4*64), this.buildingsData["9"].img));
    this.houses.push(new House(createVector(128+5*128, 418-3*64+30), this.buildingsData["8"].img));
    
    this.houses.push(new House(createVector(128+9*128, 418-64+30), this.buildingsData["9"].img));
    this.houses.push(new House(createVector(128+6*128, 418+2*64+30), this.buildingsData["9"].img));
    this.houses.push(new House(createVector(128+8*128, 418+30), this.buildingsData["8"].img));
    this.houses.push(new House(createVector(128+8*128, 418-4*64+30), this.buildingsData["9"].img));
    
    this.houses.push(new House(createVector(128+7*128, 418-3*64+30), this.buildingsData["8"].img));
    this.houses.push(new House(createVector(128+6*128, 418-2*64+30), this.buildingsData["9"].img));
  }  

  processKey(keyCode) {
    if (keyCode == LEFT_ARROW) {
      if (this.vel == 1.5) 
        this.vel = 0.0;
      else if (this.vel == 0.0)
        this.vel = -1.5;      
    } else if (keyCode == RIGHT_ARROW) {
      if (this.vel == -1.5) 
        this.vel = 0.0;
      else if (this.vel == 0.0)
        this.vel = 1.5;      
    }
  }
  
  update(train) {
    if (this.enterSequence && this.trainXpos > 1100) {
      if (this.vel > 0)
        this.acc = -0.1;
      else {
        this.acc = 0;
        this.vel = 0;
        this.enterSequence = false;
      }
    }

    if (this.exitSequence && this.trainXpos > 4000) {
      currentScene = "Navigation";
      //cameraPosition = 
    }

    this.vel += this.acc;
    if (this.vel > this.maxVel) {
      this.vel = this.maxVel;
      this.acc = 0;
    }
    this.trainXpos += this.vel;

    if (this.selectedWagon !== null) {
      this.selectedObject = train.wagons[this.selectedWagon];
      this.selectedWagon = null;
      this.selectedObjectType = "wagon";
    }
  }

  processClick(x, y, train) {
    console.log(`Clicked: ${round(x)}, ${round(y)}`);
    this.errorMsg = "";

    // traffic light
    if (this.trafficLight.isClicked(x, y)) {
      this.trafficLight.onClick();
      this.acc = 0.1;
      this.exitSequence = true;
    
    // train region
    } else if (y > 900 && y < 980) {
      let idx = train.clickHorizontalTrain(this.trainXpos, x, y);
      this.selectedWagon = idx;

    } else if (this.industry.isClicked(x, y)) {
      this.selectedObject = this.industry;
      this.selectedObjectType = "industry";
    } else {
      for (let button of this.activeButtons) {
        if (button.isClicked(x, y)) {
          switch(button.text) {
            case("Buy"):
              try {
                train.buyResource(this.industry.resourceName, this.industry.minQty, resourceData[this.industry.resourceName].price);
                this.industryAvailableQty -= this.industry.minQty;
              } catch (err) {
                this.errorMsg = err;
              }
            break;
            case("Sell"):
              //TODO: I need the minQty for al resources here
              try {
                train.sellResource(this.selectedObject, resourceData[this.selectedObject.resourceName].minQty, this.calculateSellingPrice(this.selectedObject.resourceName));
                this.fulfilled[this.selectedObject.resourceName] += resourceData[this.selectedObject.resourceName].minQty;
              } catch (err) {
                this.errorMsg = err;
              }
            break;
            case("Close"):
              this.selectedObject = null
              // return 1;
            break;
          }
          break;
        }
      }

      for (let house of this.houses) {
        if (house.isClicked(x, y)) {
          console.log("Clicked House");
          this.selectedObjectType = "house";
          this.selectedObject = house;
          break;
        }
      }
    }
  }

  buy() {

  }

  sell() {
    
  }

  calculateSellingPrice(resourceName) {
      if (resourceName in this.needs) {
        //console.log("The city needs this resource");
        return(int(resourceData[resourceName].price * 2));
      } else if (resourceName === this.industry.resourceName) {
        //console.log("The city produces this resource");
        return(int(resourceData[resourceName].price * 0.5));        
      } else {
         return(int(resourceData[resourceName].price * 1.1));          
      }
  }


  showTradeWindow(canvas, train) {
    let texty = 220;
    canvas.push();
    canvas.fill(255,255,255,100);
    canvas.rect(canvas.width-200, canvas.height/2-125, 400, canvas.height-250);
    canvas.noFill()
    canvas.textSize(20);
    canvas.fill(0);

    if (this.selectedObjectType == "wagon") {
      this.selectedObject.showHorizontal2(canvas, createVector(canvas.width-200-this.selectedObject.halfSize[0], 90));
      canvas.text(`Name: ${this.selectedObject.name}`, canvas.width-380, texty);
      texty += 50;
      canvas.text(`Resource: ${this.selectedObject.resourceName}`, canvas.width-380, texty);
      texty += 50;
      //canvas.text(`Capacity: ${this.selectedObject.capacity} ${this.selectedObject.units}`, width-380, 250);  
      //canvas.text(`Tare Weight: ${this.selectedObject.weight} tons`, width-380, 300);
      canvas.text(`Quantity: ${this.selectedObject.usedSpace} / ${this.selectedObject.capacity} ${this.selectedObject.units}`,width-380, texty);
      texty += 50;

      // Selling price:
      // If the city needs it: double price
      // If the city produces it: half price
      // Otherwise: 110% of normal price
      let sellingPrice = this.calculateSellingPrice(this.selectedObject.resourceName);
      // if (this.selectedObject.resourceName in this.needs) {
      //   console.log("The city needs this resource");
      //   sellingPrice = int(resourceData[this.selectedObject.resourceName].price * 2);
      // } else if (this.selectedObject.resourceName === this.industry.resourceName) {
      //   console.log("The city produces this resource");
      //   sellingPrice = int(resourceData[this.selectedObject.resourceName].price * 0.5);        
      // } else {
      //   sellingPrice = int(resourceData[this.selectedObject.resourceName].price * 1.1);          
      // }

      canvas.text(`Selling Price: ${sellingPrice}`,width-380, texty);
      texty += 50;
      this.activeButtons = [this.buttons.sell, this.buttons.close];
    } else if (this.selectedObjectType == "industry") {
      canvas.image(this.selectedObject.img, width-200, 120, this.selectedObject.img.width/3, this.selectedObject.img.height/3);
      canvas.textAlign(CENTER, CENTER);
      //canvas.textSize(26)
      canvas.text(`${this.selectedObject.industryName}`,width-200, texty);
      texty += 50;
      canvas.textAlign(LEFT, CENTER);
      canvas.text(`Production: ${this.selectedObject.resourceName}`, width-380, texty);
      texty += 50;
      canvas.text(`Available: ${this.industryAvailableQty} ${this.industry.units}`, width-380, texty);
      texty += 50;
      canvas.text(`Min qty: ${this.industry.minQty} ${this.industry.units}`, width-380, texty);
      texty += 50;
      canvas.text(`Unit Price: ${resourceData[this.selectedObject.resourceName].price}`, width-380, texty);
      texty += 50;
      canvas.text(`Train capacity: ${train.usedSpace[this.selectedObject.resourceName]} / ${train.capacity[this.selectedObject.resourceName]}`, width-380, texty);
      texty += 50;
      this.activeButtons = [this.buttons.buy, this.buttons.close];
    } else if (this.selectedObjectType == "house") {
      canvas.image(this.selectedObject.img, width-200, 100);  
      canvas.textAlign(CENTER, CENTER);
      //canvas.textSize(26)
      canvas.text(`${this.cityData.name}`,width-200, texty);
      texty += 50;
      canvas.textAlign(LEFT, CENTER);
      canvas.text(`City needs:`, width-380, texty);
      texty += 30;
      for(const [key, val] of Object.entries(this.needs)) {
        if (this.fulfilled[key] >= val)
          canvas.fill("green");
        else
          canvas.fill("black");
        
        canvas.text(`    ${key}: ${this.fulfilled[key]} / ${val}`, width-380, texty);
        texty += 30;  
      }
      texty += 20;  
      
      //canvas.text(`Reward: ${this.cityData.reward}`, width-380, texty);
      
      this.activeButtons = [this.buttons.close];
      
    }
    canvas.fill(255,0,0);
    canvas.text(this.errorMsg, width-380, texty);
    canvas.fill(0);

    for (let button of this.activeButtons) {
      button.showText(canvas);
    }
    canvas.pop();

  }

  show(canvas, train) {
    let x = 128;
    let y = 546-128;
    
    canvas.image(this.backgroundImg, canvas.width/2, canvas.height/2);

    
    //canvas.image(this.roadsData["AD"].img, x-128, y-64);
    //canvas.image(this.roadsData["AD"].img, x, y);
    //canvas.image(this.roadsData["AD"].img, x+128, y+64);
    //canvas.image(this.roadsData["BC"].img, x-128, y+7*64);
    //canvas.image(this.roadsData["BC"].img, x, y+6*64);
    //canvas.image(this.roadsData["BC"].img, x+128, y+5*64);
    canvas.image(this.roadsData["Bc"].img, x+3*128, y+3*64+30);
    //canvas.image(this.roadsData["BC"].img, x+3*128, y+3*64);
    
    canvas.image(this.roadsData["BC"].img, x+4*128, y+2*64+30);
    canvas.image(this.roadsData["BC"].img, x+5*128, y+64+30);
    canvas.image(this.roadsData["BC"].img, x+6*128, y+30);
    canvas.image(this.roadsData["BC"].img, x+7*128, y-64+30);
    canvas.image(this.roadsData["BC"].img, x+8*128, y-2*64+30);
    canvas.image(this.roadsData["BC"].img, x+9*128, y-3*64+30);
    canvas.image(this.roadsData["Cb"].img, x+10*128, y-4*64+30);
    
    
    //canvas.image(this.roadsData["BC"].img, x+11*128, y-5*64);
    //canvas.image(this.roadsData["BC"].img, x+12*128, y-6*64);
    //canvas.image(this.roadsData["BC"].img, x+13*128, y-7*64);

    canvas.image(this.roadsData["ABC"].img, x+6*128, y+30);
    canvas.image(this.roadsData["AD"].img, x+5*128, y-64+30);
    canvas.image(this.roadsData["AD"].img, x+4*128, y-2*64+30);
    canvas.image(this.roadsData["Da"].img, x+3*128, y-3*64+30);

    this.trafficLight.show(canvas);
    // canvas.image(this.trafficLightImg, canvas.width-50, canvas.height-150)
    
    //canvas.image(this.roadsData["Da"].img, x+2*128, y-4*64);
    //canvas.image(this.roadsData["AD"].img, x+128, y-5*64);
    //canvas.image(this.roadsData["AD"].img, x, y-6*64);
    //canvas.image(this.roadsData["AD"].img, x-128, y-7*64);

    this.industry.show(canvas, this.industryPos);
    for (let house of this.houses) {
      house.show(canvas)
    }

    train.showHorizontalTrain(canvas, this.trainXpos, canvas.height-50);
    

    // selected objects can be: "Wagon", "Industry", "House", null
    if (this.selectedObject !== null) {
      this.showTradeWindow(canvas, train);
    }
    
  }
}