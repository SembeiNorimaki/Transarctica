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

class ScnCombat {
  constructor(backgroundImg) {
    this.board = [
      [0,0,0,0]
      [0,0,0,0]
      [0,0,0,0]
    ];

    this.maskImage = createGraphics(backgroundImg.width,backgroundImg.height);
    //this.maskImage.fill(255);
    this.sourceImage = createGraphics(backgroundImg.width,backgroundImg.height);
    this.backgroundImg = backgroundImg;
    this.trainXpos = 1600;
    this.enemyTrainXpos = 1000;

    this.soldiers = [];
    this.enemies = [];

    this.soldiers.push(new Soldier(createVector(830, 870), 0));
    this.soldiers.push(new Soldier(createVector(900, 870), 0));
    this.soldiers.push(new Soldier(createVector(970, 870), 0));
    
    this.enemies.push(new Soldier(createVector(900, 120), 1));
    this.enemies[0].setTargetLoc(900,500)
    // this.soldiers[0].setTargetLoc(800,200)

    this.selectedSoldier = NaN;
  }
  
  update() {

  }

  processClick(x, y, button) {
    // if (button == 1) {   // left button
    //   for (let soldier of this.soldiers) {
    //     this.selectedSoldier = NaN;
    //     if (soldier.isClicked(x,y)) {
    //       soldier.selected = true;
    //       this.selectedSoldier = soldier;
    //     } else {
    //       soldier.selected = false;
    //     }
    //   }
    // } 
    if (button == 2) {  // right button
      this.selectedSoldier.setTargetLoc(x,y)
    }
  }

  processKey(keyCode) {
    if (keyCode == 49) {  // number 1
      this.selectedSoldier = this.soldiers[0];
      this.soldiers[0].selected = true;
      this.soldiers[1].selected = false;
      this.soldiers[2].selected = false;
    } else if (keyCode == 50) {
      this.selectedSoldier = this.soldiers[1];
      this.soldiers[0].selected = false;
      this.soldiers[1].selected = true;
      this.soldiers[2].selected = false;
    } else if (keyCode == 51) {
      this.selectedSoldier = this.soldiers[2];
      this.soldiers[0].selected = false;
      this.soldiers[1].selected = false;
      this.soldiers[2].selected = true;
    }
  }

  update() {
    for (let soldier of this.soldiers) {
      for (let enemy of this.enemies) {
        if (soldier.inRange(enemy.pos)) {
          soldier.targetSoldier = enemy;
          soldier.action = "shoot";
          soldier.setTargetLoc(-1.0, -1.0);
          soldier.ori = degrees(p5.Vector.sub(enemy.pos, soldier.pos).heading());
        } else {
          soldier.action = "idle";
        }

      }
    }
  }


  show(canvas, train, enemy) {
    let maskImage = createGraphics(backgroundImg.width,backgroundImg.height);
    
    
    this.sourceImage.background(255);
    
    maskImage.background(0,0,0,150);
    //this.maskImage.fill(0,0,0,100);   
    
    this.sourceImage.image(this.backgroundImg, this.backgroundImg.width/2, this.backgroundImg.height/2);
   

    
    
    train.showHorizontalTrain(this.sourceImage, this.trainXpos, canvas.height-50);
    enemy.showHorizontalTrain(this.sourceImage, this.enemyTrainXpos, 30);

    //canvas.fill(0,0,0,80)
    //canvas.noStroke();
    //canvas.rect(canvas.width/2,canvas.height/2-100,canvas.width,canvas.height-200);
    
    maskImage.rect(0, canvas.height-200, canvas.width, 200);
    //canvas.fill(255,255,255,100)
    for (let soldier of this.soldiers) {
      //canvas.circle(soldier.pos.x,soldier.pos.y,500)
      maskImage.circle(soldier.pos.x, soldier.pos.y, 300);
    }
    // canvas.image(miscData.wall, 900,800);
    // canvas.image(miscData.wall, 960,800);
    for (let soldier of this.soldiers) {
      soldier.update();
      soldier.show(this.sourceImage);
    }
    for (let enemy of this.enemies) {
      //enemy.update();
      //enemy.show(this.sourceImage);
    }

    let masked = this.sourceImage.get();
    masked.mask(maskImage);
  
    canvas.image(masked, canvas.width/2, canvas.height/2);


    // canvas.push();
    // canvas.translate(800,850)
    // canvas.rotate(-3.14/2)
    // canvas.image(soldierData.idle[0],0,0,70,70);
    // canvas.image(soldierData.idle[0],0,100,70,70);
    // canvas.image(soldierData.idle[0],0,200,70,70);
    // canvas.pop();
  }
}