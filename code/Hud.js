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

class Hud {
  constructor() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentTime = new Date(3102441200 * 1000);
    // this.fuel = 1000;
    // this.speed = 0;
    // this.gold = 500;
    // this.gear = "N";
    this.status = "normal";

    
    this.buttons = [
      new ClickableRegion(createVector(80, 30), [100, 40], [hudData.frame, hudData.button_find], ""),
      new ClickableRegion(createVector(80+140, 30), [100, 40], [hudData.frame, hudData.button_book], ""),
      new ClickableRegion(createVector(80+2*140, 30), [100, 40], [hudData.frame, hudData.button_map], "")
    ]
  }
  
  showMine() {
    this.status = "mine";
  }

  show(canvas) {
    if (this.status == "mine") {
      canvas.text("hello", canvas.width, canvas.height-30);
      return;
    }

    for (let button of this.buttons) {
      button.show(canvas);
    }

    let x = canvas.width-80;
    let y = canvas.height-30;

    canvas.image(hudData.frame, x, y);
    canvas.text(`${int(locomotive.velocity.mag()*300/9*300)} Km/h`, x, y);
    x-=140;
    canvas.image(hudData.fuel, x, y);
    canvas.text(`${int(locomotive.fuel)}`, x, y);
    x-=140;
    canvas.image(hudData.gold, x, y);
    canvas.text(`${locomotive.gold}`, x, y);
    x-=140;
    canvas.image(hudData.frame, x, y);
    canvas.text(`${locomotive.gear}`, x, y);

    x = canvas.width/2;
    
    canvas.fill(100);
    canvas.rect(x-150,0,300,60);
    canvas.fill(255);
    canvas.text(`${this.currentTime.getDay()} ${this.months[this.currentTime.getMonth()-1]} ${this.currentTime.getFullYear()} ${this.currentTime.getHours()}h`,x,y)    
  }

  // this.update = (gear, gold, fuel, speed) => {
  //   this.gear = gear;
  //   this.gold = gold;
  //   this.fuel = fuel;
  //   this.speed = speed;
  // }

  processClick(x, y) {
    let idx = 1;
    for (let button of this.buttons) {
      if (button.gotClicked(x, y)) {
        console.log(`Pressed button ${idx}`)
      }
      idx++;
    }
  }

  tick() {
    this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);
  }  
}