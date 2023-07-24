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

class House {
  constructor(pos, img) {
    this.pos = pos;
    this.img = img;
    this.halfSize = createVector(64, 64);
  }

  isClicked(x, y) {
    return ((x > this.pos.x - this.halfSize.x) &&
            (x < this.pos.x + this.halfSize.x) &&
            (y > this.pos.y - this.halfSize.y) &&
            (y < this.pos.y + this.halfSize.y));
  }
  
  show(canvas) {
    canvas.image(this.img, this.pos.x, this.pos.y);
  }
}