function Hud(hudData) {
  this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  this.hudData = hudData;
  this.currentTime = new Date(3102441200 * 1000);
  this.fuel = 1000;
  this.speed = 0;
  this.gold = 500;
  this.gear = "N";

  
  this.buttons = [
    new ClickableRegion(createVector(80, 30), [this.hudData.frame, this.hudData.button_find]),
    new ClickableRegion(createVector(80+140, 30), [this.hudData.frame, this.hudData.button_book]),
    new ClickableRegion(createVector(80+2*140, 30), [this.hudData.frame, this.hudData.button_map])
  ]
  
  
  this.show = (canvas) => {
    for (let button of this.buttons) {
      button.show(canvas);
    }

    let x = canvas.width-80;
    let y = canvas.height-30;

    canvas.image(this.hudData.frame, x, y);
    canvas.text(`${this.speed} Km/h`, x, y)
    x-=140
    canvas.image(this.hudData.fuel, x, y);
    canvas.text(`${this.fuel}`, x, y)
    x-=140
    canvas.image(this.hudData.gold, x, y);
    canvas.text(`${this.gold}`, x, y)
    x-=140
    canvas.image(this.hudData.frame, x, y);
    canvas.text(`${this.gear}`, x, y)

    x=canvas.width/2
    
    canvas.fill(100)
    canvas.rect(x-150,0,300,60)
    canvas.fill(255)
    canvas.text(`${this.currentTime.getDay()} ${this.months[this.currentTime.getMonth()-1]} ${this.currentTime.getFullYear()} ${this.currentTime.getHours()}h`,x,y)    
  }

  this.update = (gear, gold, fuel, speed) => {
    this.gear = gear;
    this.gold = gold;
    this.fuel = fuel;
    this.speed = speed;
  }

  this.processClick = (x, y) => {
    let idx = 1;
    for (let button of this.buttons) {
      if (button.gotClicked(x, y)) {
        console.log(`Pressed button ${idx}`)
      }
      idx++;
    }
  }

  this.tick = () => {
    this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);
  }  
}