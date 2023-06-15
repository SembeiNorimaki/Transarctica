function ScnWagonTrade(tracksData, wagonsData) {
  this.wagonsData = wagonsData;
  this.tracksData = tracksData;
  
  this.wagons = ["liquid1","cannon","livestock","diamonds","ore1","barracks","metal", "fenced","command","tender","locomotive"];

  this.row1 = ["ore1", "cannon", "ore2", "ore3", "fenced"];
  this.row2 = ["liquid1", "liquid2", "water", "liquid3", "liquid4"];
  this.row3 = ["plattform1", "metal", "barracks", "diamonds", "passengers","mail"];

  this.show = (train) => {
    let x, y;
    let h = 64
    let w = 128;
    console.log(this.tracksData)
    for (let row=-1; row<15; row++) {
      for (let col=-1; col<8; col++) {
        x = col*w*2 + (w * (row%2)+1)
        y = row*h;
        if (row == 1 && col<5) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 2 && col<5) {
          image(this.tracksData["AB"].imgs[0],x,y)
        }

        else if (row == 4 && col<5) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 5 && col<5) {
          image(this.tracksData["AB"].imgs[0],x,y)
        }

        else if (row == 7 && col<5) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 8 && col<5) {
          image(this.tracksData["AB"].imgs[0],x,y)
        }


        else if (row == 10) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 11 ) {
          image(this.tracksData["AB"].imgs[0],x,y)
        }
        

        else if (row == 12) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 13) {
          image(this.tracksData["AB"].imgs[0],x,y)
        }
        else {
          image(this.tracksData["0"].imgs[0],x,y)
        }

      }  
    }
    let xpos = 100;

    for (let wagon of this.row1) {
      image(this.wagonsData[wagon].img, xpos, 
        96+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }
    xpos = 100;
    for (let wagon of this.row2) {
      image(this.wagonsData[wagon].img, xpos, 
        290+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }
    xpos = 100;
    for (let wagon of this.row3) {
      image(this.wagonsData[wagon].img, xpos, 
        475+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }

    xpos = 200
    //for (let wagon of train.wagons) {
    train.wagons.slice().reverse().forEach((wagon) => {
      image(this.wagonsData[wagon].img, xpos, 
        800+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0];
    });
      
    

    
    push();
    //fill(0,0,0,100);
    fill(255,255,255,100);
    //noStroke();
    rect(width-400,0,400,height-200);
    
    //fill(255)
    //noStroke()
    noFill()
    rectMode(CENTER)
    rect(width-200,90, 220,80)
    imageMode(CENTER)
    image(this.wagonsData["liquid2"].img, width-200, 90);
    pop();
    textSize(20)
    text("Name: Tank Wagon",width-380, 200)
    text("Capacity: 10.000L of liquid",width-380, 250)
    text("Tare Weight: 100 Ton ",width-380, 300)
    text("Price: 500 bak ",width-380, 350)

    rect(width-380, 650, 150, 50)
    rect(width-180, 650, 150, 50)
    text("Buy", width-380+40, 680)
    text("Exit", width-180+40, 680)
  }
}