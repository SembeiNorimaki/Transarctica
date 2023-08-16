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

class Soldier {
  constructor(pos, player) { 
    this.pos = pos;
    this.vel = createVector(0.0, 0.0);
    if (player == 0)
      this.ori = -90;    // 0 is right, 90 is down
    else
      this.ori = 90;    // 0 is right, 90 is down
    this.spriteIdx = 0;
    this.nSprites = 3;
    this.spriteSpeed = 10;
    this.size = [60, 60];
    this.speedCount = this.spriteSpeed;
    this.targetLoc = createVector(-1.0, -1.0);
    this.speed = 0.5;
    this.lives = 100;
    this.player = player;   // 0 human, 1 enemy
    this.action = "idle"
    this.selected = false;
    this.targetSoldier = NaN;
  }

  inRange(targetPos) {
    return dist(this.pos.x, this.pos.y, targetPos.x, targetPos.y) < 250;
  }
  setTargetLoc(x, y) {
    this.targetLoc.set(x, y);
  }

  isClicked(x, y) {
    let xmin = this.pos.x - this.size[0] / 2;
    let xmax = xmin + this.size[0];
    let ymin = this.pos.y - this.size[1] / 2;
    let ymax = ymin + this.size[1];
    return ((x >= xmin) && (x <= xmax) && (y >= ymin) && (y <= ymax));
  }

  shootAtSoldier(targetSoldier) {
    targetSoldier.lives -= 5;
  }

  update() {
    this.speedCount -= 1;
    if (this.speedCount == 0) {
      this.spriteIdx += 1;
      if (this.spriteIdx == this.nSprites-1)
        this.spriteIdx = 0;
      this.speedCount = this.spriteSpeed;
    }
    // 0 is right, 90 is down
    if (this.targetLoc.x == -1)
      return;
    if (this.targetLoc.x - this.pos.x > 2) {
      if (this.targetLoc.y - this.pos.y > 2) {
        this.ori = 45;    // SE 
        this.vel.set(this.speed, this.speed);
      }
      else if (this.targetLoc.y - this.pos.y < -2) {
        this.ori = -45;    // NE
        this.vel.set(this.speed, -this.speed);
      }
      else {
        this.ori = 0;   // E
        this.vel.set(this.speed, 0.0);
      }
    }
    else if (this.targetLoc.x - this.pos.x < -2) {
      if (this.targetLoc.y - this.pos.y > 2) {
        this.ori = 90+45;  //SW
        this.vel.set(-this.speed, this.speed);
      }
      else if (this.targetLoc.y - this.pos.y < -2) {
        this.ori = -90-45;  //NW
        this.vel.set(-this.speed, -this.speed);
      }
      else {
        this.ori = 180;   //W
        this.vel.set(-this.speed, 0.0);
      }
    }
    else if (this.targetLoc.y - this.pos.y < -2) {
      this.ori = -90;   //N
      this.vel.set(0.0, -this.speed);
    }
    else if (this.targetLoc.y - this.pos.y > 2) {
      this.ori = 90;  //S
      this.vel.set(0.0, this.speed);
    }
    else {
      this.vel.set(0.0, 0.0);
      // if (this.player == 0)
      //   this.ori = -90;
      // else
      //   this.ori = 90;
    }

    this.pos.add(this.vel);
  }

  show(canvas) {
    let img = soldierData[this.action][this.spriteIdx];
    img.resize(this.size[0], this.size[1]);
    canvas.push();                
    canvas.translate(this.pos.x, this.pos.y);
    canvas.rotate(radians(this.ori));
    //canvas.image(img, - this.size[0] / 2, - this.size[1] / 2);
    canvas.image(img, 0, 0);
    if (this.action == "shoot" && this.spriteIdx == 1 ) {
      canvas.image(soldierData.fire,36,15,20,20);
      if (this.speedCount == this.spriteSpeed)
        this.shootAtSoldier(this.targetSoldier);
    }
    
    //image(img, this.pos.x - this.size[0] / 2, this.pos.y - this.size[1] / 2);
    if (this.selected) {
      
      //canvas.rect(0, 0, this.size[0],this.size[1])
      //canvas.circle(0,0,500)
    }
    canvas.pop();
    canvas.text(this.lives, this.pos.x- this.size[0] / 2, this.pos.y + this.size[1] / 2 + 5);   
    
    
  }
}