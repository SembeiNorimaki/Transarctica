function ScnCityTrade(cityData, industryData, roadsData, buildingsData, backgroundImg) {
  console.log(cityData)
  this.cityData = cityData;
  this.roadsData = roadsData;
  this.buildingsData = buildingsData;
  this.industryType = cityData.industry;  
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

  this.industry = new Industry(cityData.industry, this.industryPos, industryData[cityData.industry]);

  this.buttons = [];
  this.buttons.push(new ClickableRegion(createVector(1600, 600), [80, 30], [], "Buy"));
  this.buttons.push(new ClickableRegion(createVector(1800, 600), [80, 30], [], "Exit"));


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
    let xmin, xmax;
    if (y > 750 && y < 805) {  // train region
      xmin = this.trainXpos;
      for(let i=1; i<train.wagons.length; i++) {
        xmax = xmin;
        xmin -= train.wagons[i].dimensions[0];  
        console.log(xmin, xmax)      
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
      for (let button of this.buttons) {
        if (button.isClicked(x, y)) {
          switch(button.text) {
            case("Buy"):
              console.log("Buy button clicked");
              let result = train.addResource(this.industry.resourceType, this.industry.minQty, this.industry.price);
              switch(result) {
                case(1):
                  this.errorMsg = "Not enough gold!"
                break;
                case(2):
                  this.errorMsg = "Not enough storage!"
                break;
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
    }
  }

  this.buy = () => {

  }

  this.sell = () => {
    
  }

  this.show = (canvas, train) => {
    let x = 128;
    let y = 546-128;
    
    canvas.image(this.backgroundImg, canvas.width/2, canvas.height/2);

    //canvas.image(this.industryImgs[this.industryType].img, 200, 200);
    
    //canvas.image(this.roadsData["AD"].img, x-128, y-64);
    //canvas.image(this.roadsData["AD"].img, x, y);
    //canvas.image(this.roadsData["AD"].img, x+128, y+64);
    
    
    //canvas.image(this.roadsData["BC"].img, x-128, y+7*64);
    //canvas.image(this.roadsData["BC"].img, x, y+6*64);
    //canvas.image(this.roadsData["BC"].img, x+128, y+5*64);
    canvas.image(this.roadsData["Bc"].img, x+2*128, y+4*64);
    canvas.image(this.roadsData["BC"].img, x+3*128, y+3*64);
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
    canvas.image(this.buildingsData["8"].img, x+4*128, y+4*64);
    canvas.image(this.buildingsData["9"].img, x+5*128, y-3*64);
    canvas.image(this.buildingsData["9"].img, x+9*128, y-64);
    canvas.image(this.buildingsData["9"].img, x+6*128, y+2*64);
    canvas.image(this.buildingsData["8"].img, x+8*128, y);
    canvas.image(this.buildingsData["8"].img, x+8*128, y-4*64);
    //canvas.image(this.buildingsData["9"].img, x+7*128, y-3*64);
    canvas.image(this.buildingsData["8"].img, x+6*128, y-2*64);

    train.showHorizontalTrain(canvas, this.trainXpos);
    
    
    
    if (this.selectedObject !== null) {
      
      canvas.push();
      canvas.fill(255,255,255,100);
      canvas.rect(canvas.width-200, canvas.height/2-100, 400, canvas.height-200);
      canvas.noFill()
      canvas.textSize(20);
      canvas.fill(0);

      if (this.selectedObjectType == "wagon") {
        canvas.image(this.selectedObject.img, width-200, 90)
        canvas.text(`Name: ${this.selectedObject.name}`,width-380, 200);
        canvas.text(`Capacity: ${this.selectedObject.capacity} ${this.selectedObject.cargo}`, width-380, 250);  
        canvas.text(`Tare Weight: ${this.selectedObject.weight} Ton`, width-380, 300);
        canvas.text(`Content: ${this.selectedObject.content}`,width-380, 350)
      } else {
        canvas.image(this.selectedObject.img, width-200, 100,this.selectedObject.img.width/3,this.selectedObject.img.height/3)
        canvas.text(`Name: ${this.selectedObject.name}`,width-380, 250);
        canvas.text(`Production: ${this.selectedObject.resourceType}`, width-380, 300);
        canvas.text(`Available: 20`, width-380, 350);
        canvas.text(`Unit Price: 10`, width-380, 400);
        canvas.text(`Train capacity: ${train.cargo[this.selectedObject.resourceType]} / ${train.capacity[this.selectedObject.resourceType]}`, width-380, 450);
        canvas.fill(255,0,0);
        canvas.text(this.errorMsg, width-380, 500);
        canvas.fill(0);
      }

      // Buy, Exit buttons
      for (let button of this.buttons) {
        button.showText(canvas);
      }
      canvas.pop();
    }
  }
}