function ScnWagonTrade(tracksData, wagonsData) {
  this.wagonsData = wagonsData;
  this.tracksData = tracksData;
  
  this.wagons = ["liquid1","cannon","livestock","diamonds","ore1","barracks","metal", "fenced","command","tender","locomotive"];

  this.row1 = ["ore1", "cannon", "ore2", "ore3", "fenced"];
  this.row2 = ["liquid1", "liquid2", "water", "liquid3", "liquid4"];
  this.row3 = ["plattform1", "metal", "barracks", "diamonds", "passengers","mail"];

  this.show = (canvas, train) => {
    let x, y;
    let h = 64
    let w = 128;
    
    for (let row=-1; row<15; row++) {
      for (let col=-1; col<8; col++) {
        x = col*w*2 + (w * (row%2)+1)
        y = row*h;
        if (row == 1 && col<5) {
          canvas.image(this.tracksData["CD"].img,x,y)
        } else if (row == 2 && col<5) {
          canvas.image(this.tracksData["AB"].img,x,y)
        }

        else if (row == 4 && col<5) {
          canvas.image(this.tracksData["CD"].img,x,y)
        } else if (row == 5 && col<5) {
          canvas.image(this.tracksData["AB"].img,x,y)
        }

        else if (row == 7 && col<5) {
          canvas.image(this.tracksData["CD"].img,x,y)
        } else if (row == 8 && col<5) {
          canvas.image(this.tracksData["AB"].img,x,y)
        }


        else if (row == 10) {
          canvas.image(this.tracksData["CD"].img,x,y)
        } else if (row == 11 ) {
          canvas.image(this.tracksData["AB"].img,x,y)
        }
        

        else if (row == 12) {
          canvas.image(this.tracksData["CD"].img,x,y)
        } else if (row == 13) {
          canvas.image(this.tracksData["AB"].img,x,y)
        }
        else {
          canvas.image(this.tracksData["0"].img,x,y)
        }

      }  
    }
    let xpos = 100;

    for (let wagon of this.row1) {
      canvas.image(this.wagonsData[wagon].img, xpos, 
        66+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }
    xpos = 100;
    for (let wagon of this.row2) {
      canvas.image(this.wagonsData[wagon].img, xpos, 
        260+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }
    xpos = 100;
    for (let wagon of this.row3) {
      canvas.image(this.wagonsData[wagon].img, xpos, 
        445+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0] + 50;
    }

    xpos = 1200
    //for (let wagon of train.wagons) {
    train.wagons.slice().reverse().forEach((wagon) => {
      canvas.image(this.wagonsData[wagon].img, xpos, 
        800+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0];
    });
      
    

    
    canvas.push();
    //fill(0,0,0,100);
    canvas.fill(255,255,255,100);
    //noStroke();
    canvas.rect(width-400,0,400,height-200);
    
    //fill(255)
    //noStroke()
    canvas.noFill()
    canvas.rectMode(CENTER)
    canvas.rect(width-200,90, 220,80)
    canvas.imageMode(CENTER)
    canvas.image(this.wagonsData["liquid2"].img, width-200, 90);
    canvas.pop();
    canvas.textSize(20)
    canvas.text("Name: Tank Wagon",width-380, 200)
    canvas.text("Capacity: 10.000L of liquid",width-380, 250)
    canvas.text("Tare Weight: 100 Ton ",width-380, 300)
    canvas.text("Price: 500 bak ",width-380, 350)

    canvas.rect(width-380, 650, 150, 50)
    canvas.rect(width-180, 650, 150, 50)
    canvas.text("Buy", width-380+40, 680)
    canvas.text("Exit", width-180+40, 680)
  }
}