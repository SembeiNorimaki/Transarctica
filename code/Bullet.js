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

class Bullet {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.spriteIdx = 0;
    this.spriteSpeed = 0.1;
    this.hasExploded = false;
  }

  
  update() {
    if (!this.hasExploded) {
      let aa = worldMap.combatScreen2map(this.pos.x, this.pos.y);
      console.log(aa.array())
      try {
        if(combatBoard[aa.y][aa.x] == 1) {
          this.hasExploded = true;
        }
      } catch (err){}
      
      if (this.pos.y <= 90) {
        this.hasExploded = true;
      } else {
        this.pos.add(this.vel);
      }
    } else {
      this.spriteIdx += this.spriteSpeed;
    }
    
  }
  show(canvas) {
    if (this.spriteIdx == 0) {
      canvas.image(miscData.cannonball, this.pos.x, this.pos.y);
    } else {
      canvas.image(combatData.explosion[int(this.spriteIdx)], this.pos.x, this.pos.y);
    }
  }
}