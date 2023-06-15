function ScnCityTrade(tracksData, wagonsData) {
  this.wagonsData = wagonsData;
  this.tracksData = tracksData;
  
  this.wagons = ["liquid1","cannon","livestock","diamonds","ore1","barracks","metal", "fenced","command","tender","locomotive"];

  
  this.show = () => {
    let x,y;
    let h=64
    let w=128;
    console.log(this.tracksData)
    for (let row=-1; row<15; row++) {
      for (let col=-1; col<8; col++) {
         x = col*w*2 + (w * (row%2)+1)
         y = row*h;
        // if (row == 1 && col<5) {
        //   image(this.tracksData["CD"].imgs[0],x,y)
        // } else if (row == 2 && col<5) {
        //   image(this.tracksData["AB"].imgs[0],x,y)
        // }

        // else if (row == 4 && col<5) {
        //   image(this.tracksData["CD"].imgs[0],x,y)
        // } else if (row == 5 && col<5) {
        //   image(this.tracksData["AB"].imgs[0],x,y)
        // }

        
        if (row == 12) {
          image(this.tracksData["CD"].imgs[0],x,y)
        } else if (row == 13) {
          image(this.tracksData["AB"].imgs[0],x,y)
        } else if ((row+col*2)==12) {
           image(this.tracksData["BC"].imgs[0],x,y)
        } else if ((row+col*2) == 11) {
           image(this.tracksData["BC"].imgs[0],x,y)
        } else {
          image(this.tracksData["0"].imgs[0],x,y)
        }

      }  
    }
    let xpos = 100;

    // for (let wagon of this.row1) {
    //   image(this.wagonsData[wagon].img, xpos, 
    //     96+this.wagonsData[wagon].offsety);
    //   xpos += this.wagonsData[wagon].dimensions[0] + 50;
    // }
    // xpos = 100;
    // for (let wagon of this.row2) {
    //   image(this.wagonsData[wagon].img, xpos, 
    //     290+this.wagonsData[wagon].offsety);
    //   xpos += this.wagonsData[wagon].dimensions[0] + 50;
    // }
    // xpos = 100;
    // for (let wagon of this.row3) {
    //   image(this.wagonsData[wagon].img, xpos, 
    //     475+this.wagonsData[wagon].offsety);
    //   xpos += this.wagonsData[wagon].dimensions[0] + 50;
    // }
    xpos = 200
    for (let wagon of this.wagons) {
      image(this.wagonsData[wagon].img, xpos, 
        800+this.wagonsData[wagon].offsety);
      xpos += this.wagonsData[wagon].dimensions[0];
    }

    
    
  }
}