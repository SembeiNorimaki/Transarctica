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

class TrafficLight {
  constructor(pos, images, halfSize) {
    this.pos = pos;
    this.redImage = images[0];
    this.greenImage = images[1];
    this.halfSize = createVector(halfSize.x, halfSize.y); 
    this.currentColor = 0;
    this.currentImage = this.redImage;
  }

  isClicked(x, y) {
    console.log(int(x),int(y),this.pos.array())
    return ((x > this.pos.x - this.halfSize.x) &&
            (x < this.pos.x + this.halfSize.x) &&
            (y > this.pos.y - this.halfSize.y) &&
            (y < this.pos.y + this.halfSize.y));
  }  

  onClick() {
    if (this.currentColor == 0) {
      this.currentColor = 1;
      this.currentImage = this.greenImage;
    } else {
      this.currentColor = 0;
      this.currentImage = this.redImage;
    } 
  }

  show(canvas) {
    canvas.image(this.currentImage, this.pos.x, this.pos.y);
  }
}
