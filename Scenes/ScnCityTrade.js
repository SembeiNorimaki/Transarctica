function ScnCityTrade(cityData, industryData, roadsData, buildingsData, backgroundImg) {
  console.log(cityData)
  this.cityData = cityData;
  this.roadsData = roadsData;
  this.buildingsData = buildingsData;
  this.industryType = cityData.industry;
  this.industrySellPrice = cityData.sellPrice;
  this.industryAvailableQty = cityData.availableQty;
  this.goods = cityData.goods;
  this.backgroundImg = backgroundImg;
  this.industryPos = createVector(384, 412);
  this.vel = 0.0;
  this.gear = "N";
  this.direction = 1;  // -1 backward
  this.trainXpos = 1600;

  this.selectedObject = null;
  this.selectedWagon = null;
  this.selectedObjectType = null;
  this.errorMsg = "";

  this.industry = new Industry(this.industryPos, industryData[cityData.industry]);

  this.buttons = {};
  this.buttons.buy = new ClickableRegion(createVector(1600, 600), [80, 30], [], "Buy");
  this.buttons.sell = new ClickableRegion(createVector(1600, 600), [80, 30], [], "Sell");
  this.buttons.exit = new ClickableRegion(createVector(1800, 600), [80, 30], [], "Exit");

  this.activeButtons = [];
  // this.buttons.sell = new ClickableRegion(createVector(1600, 600), [80, 30], [], "Sell");
  

  this.houses = [];
  //this.houses.push(new House(createVector(128+4*128, 418-4*64), this.buildingsData["8"].img));
  this.houses.push(new House(createVector(128+6*128, 418-4*64), this.buildingsData["9"].img));
  this.houses.push(new House(createVector(128+5*128, 418-3*64), this.buildingsData["8"].img));
  
  // this.houses.push(new House(createVector(128+9*128, 418-64), this.buildingsData["9"].img));
  // this.houses.push(new House(createVector(128+6*128, 418+2*64), this.buildingsData["9"].img));
  // this.houses.push(new House(createVector(128+8*128, 418), this.buildingsData["8"].img));
  //this.houses.push(new House(createVector(128+8*128, 418-4*64), this.buildingsData["9"].img));
  
  this.houses.push(new House(createVector(128+7*128, 418-3*64), this.buildingsData["8"].img));
  this.houses.push(new House(createVector(128+6*128, 418-2*64), this.buildingsData["9"].img));
  
  this.processKey = (keyCode) => {
    if (keyCode == LEFT_ARROW) {
      if (this.vel == 0.5) 
        this.vel = 0.0;
      else if (this.vel == 0.0)
        this.vel = -0.5;      
    } else if (keyCode == RIGHT_ARROW) {
      if (this.vel == -0.5) 
        this.vel = 0.0;
      else if (this.vel == 0.0)
        this.vel = 0.5;      
    }
  }
  
  this.update = (train) => {
    this.trainXpos += this.vel;
    if (this.trainXPos >= 1600) {
      this.trainXPos = 1500;
    }

    if (this.selectedWagon !== null) {
      this.selectedObject = train.wagons[this.selectedWagon];
      this.selectedWagon = null;
      this.selectedObjectType = "wagon";
    }
  }

  this.processClick = (x, y, train) => {
    console.log(x, y);

    let xmin, xmax, result;

    // train region
    if (y > 750 && y < 805) {  
      xmin = this.trainXpos;
      for(let i=1; i<train.wagons.length; i++) {
        xmax = xmin;
        xmin -= train.wagons[i].halfSize[0]*2;  
        if (x < xmax && x > xmin) {
        //if (x < this.trainXpos - 128*i && x > this.trainXpos - 128*(i+1)) {
          console.log("clicked wagon", i);
          this.selectedWagon = i;
        }
      }
    } else if (this.industry.isClicked(x, y)) {
        console.log("Farm clicked");
        this.selectedObject = this.industry;
        this.selectedObjectType = "industry";
    } else {
      for (let button of this.activeButtons) {
        if (button.isClicked(x, y)) {
          switch(button.text) {
            case("Buy"):
              try {
                train.buyResource(this.industry.resourceName, this.industry.minQty, this.industrySellPrice);
                this.industryAvailableQty -= this.industry.minQty;
              } catch (err) {
                this.errorMsg = err;
              }
            break;
            case("Sell"):
              //TODO: I need the minQty for al resources here
              try {
                train.sellResource(this.selectedObject, 2, this.goods[this.selectedObject.resourceName]);
              } catch (err) {
                console.log("error selling")
                console.log(this.selectedObject)
                console.log(this.goods[this.selectedObject.resourceName])
                this.errorMsg = err;
              }
            break;
            case("Exit"):
              console.log("Exit button clicked");
              return 1;
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

  this.buy = () => {

  }

  this.sell = () => {
    
  }


  this.showTradeWindow = (canvas, train) => {
    let texty = 180;
    canvas.push();
    canvas.fill(255,255,255,100);
    canvas.rect(canvas.width-200, canvas.height/2-100, 400, canvas.height-200);
    canvas.noFill()
    canvas.textSize(20);
    canvas.fill(0);

    if (this.selectedObjectType == "wagon") {
      this.selectedObject.showHorizontal(canvas, createVector(canvas.width-200, 90));
      canvas.text(`Name: ${this.selectedObject.resourceName}`, canvas.width-380, texty);
      texty += 50;
      //canvas.text(`Capacity: ${this.selectedObject.capacity} ${this.selectedObject.units}`, width-380, 250);  
      //canvas.text(`Tare Weight: ${this.selectedObject.weight} tons`, width-380, 300);
      canvas.text(`Quantity: ${this.selectedObject.usedSpace} ${this.selectedObject.units}`,width-380, texty);
      texty += 50;
      canvas.text(`Selling Price: ${this.goods[this.selectedObject.resourceName]}`,width-380, texty);
      texty += 50;
      this.activeButtons = [this.buttons.sell, this.buttons.exit];
    } else if (this.selectedObjectType == "industry") {
      canvas.image(this.selectedObject.img, width-200, 100, this.selectedObject.img.width/3, this.selectedObject.img.height/3);
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
      canvas.text(`Unit Price: ${this.industrySellPrice}`, width-380, texty);
      texty += 50;
      canvas.text(`Train capacity: ${train.usedSpace[this.selectedObject.resourceName]} / ${train.capacity[this.selectedObject.resourceName]}`, width-380, texty);
      texty += 50;
      this.activeButtons = [this.buttons.buy, this.buttons.exit];
    } else if (this.selectedObjectType == "house") {
      canvas.image(this.selectedObject.img, width-200, 100);  
    }
    canvas.fill(255,0,0);
    canvas.text(this.errorMsg, width-380, texty);
    canvas.fill(0);

    // Buy, Exit buttons
    for (let button of this.activeButtons) {
      button.showText(canvas);
    }
    canvas.pop();

  }

  this.show = (canvas, train) => {
    let x = 128;
    let y = 546-128;
    
    canvas.image(this.backgroundImg, canvas.width/2, canvas.height/2);

    
    //canvas.image(this.roadsData["AD"].img, x-128, y-64);
    //canvas.image(this.roadsData["AD"].img, x, y);
    //canvas.image(this.roadsData["AD"].img, x+128, y+64);
    //canvas.image(this.roadsData["BC"].img, x-128, y+7*64);
    //canvas.image(this.roadsData["BC"].img, x, y+6*64);
    //canvas.image(this.roadsData["BC"].img, x+128, y+5*64);
    canvas.image(this.roadsData["Bc"].img, x+3*128, y+3*64);
    //canvas.image(this.roadsData["BC"].img, x+3*128, y+3*64);
    canvas.image(this.roadsData["BC"].img, x+4*128, y+2*64);
    canvas.image(this.roadsData["BC"].img, x+5*128, y+64);
    canvas.image(this.roadsData["BC"].img, x+6*128, y);
    canvas.image(this.roadsData["BC"].img, x+7*128, y-64);
    canvas.image(this.roadsData["BC"].img, x+8*128, y-2*64);
    canvas.image(this.roadsData["BC"].img, x+9*128, y-3*64);
    canvas.image(this.roadsData["Cb"].img, x+10*128, y-4*64);
    //canvas.image(this.roadsData["BC"].img, x+11*128, y-5*64);
    //canvas.image(this.roadsData["BC"].img, x+12*128, y-6*64);
    //canvas.image(this.roadsData["BC"].img, x+13*128, y-7*64);

    canvas.image(this.roadsData["ABC"].img, x+6*128, y);
    canvas.image(this.roadsData["AD"].img, x+5*128, y-64);
    canvas.image(this.roadsData["AD"].img, x+4*128, y-2*64);
    canvas.image(this.roadsData["Da"].img, x+3*128, y-3*64);
    //canvas.image(this.roadsData["Da"].img, x+2*128, y-4*64);
    //canvas.image(this.roadsData["AD"].img, x+128, y-5*64);
    //canvas.image(this.roadsData["AD"].img, x, y-6*64);
    //canvas.image(this.roadsData["AD"].img, x-128, y-7*64);

    this.industry.show(canvas, this.industryPos);
    for (let house of this.houses) {
      house.show(canvas)
    }

    train.showHorizontalTrain(canvas, this.trainXpos);
    

    // selected objects can be: "Wagon", "Industry", "House", null
    if (this.selectedObject !== null) {
      this.showTradeWindow(canvas, train);
    }
  }
}