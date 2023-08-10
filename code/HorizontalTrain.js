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

class HorizontalTrain {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.wagons = [];
  }

  show(canvas) {
    this.wagons[0].setPos(this.pos);
    this.wagons[0].showHorizontal(canvas);
      
    for (let i=1; i<this.wagons.length; i++) {
      xpos -= this.wagons[i].halfSize[0]*2+5;
      this.wagons[i].setPos(createVector(xpos, ypos));
      this.wagons[i].showHorizontal(canvas);
      canvas.textAlign(CENTER, CENTER);
      canvas.text(`${this.wagons[i].usedSpace} / ${this.wagons[i].capacity}`, xpos+this.wagons[i].halfSize[0], ypos + 30);   
      canvas.textAlign(LEFT);
    }
  }
}