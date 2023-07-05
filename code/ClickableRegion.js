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

function ClickableRegion(pos, halfSize, image, text) {
  this.pos = pos;
  this.bgImage = image[0];
  this.fgImage = image[1];
  this.halfSize = createVector(halfSize[0], halfSize[1]);
  this.text = text;

  this.isClicked = (x, y) => {
    return ((x > pos.x - this.halfSize.x) &&
            (x < pos.x + this.halfSize.x) &&
            (y > pos.y - this.halfSize.y) &&
            (y < pos.y + this.halfSize.y));
  }     
  
  this.show = (canvas) => {
    canvas.image(this.bgImage, this.pos.x, this.pos.y);
    canvas.image(this.fgImage, this.pos.x, this.pos.y);

    
  }
  this.showText = (canvas) => {
    canvas.push();
    canvas.textAlign(CENTER, CENTER);
    canvas.fill(255);
    canvas.rect(this.pos.x, this.pos.y, this.halfSize.x*2, this.halfSize.y*2);
    canvas.fill(0);
    canvas.text(this.text, this.pos.x, this.pos.y);
    canvas.pop();
  }
}