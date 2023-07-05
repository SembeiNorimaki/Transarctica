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

function Industry(pos, industryData) {
  console.log(industryData)
  this.industryName = industryData.industryName;
  this.resourceName = industryData.resourceName;
  this.units = industryData.units;
  this.img = industryData.img;
  this.imgs = industryData.imgs;
  this.pos = pos;
  this.offsety = industryData.offsety;
  this.offsets = industryData.offsets;
  this.minQty = industryData.minQty;

  this.spriteIdx = 0;
  this.spriteSpeed = 0.05;

  this.isClicked = (x, y) => {
    return (x > (this.pos.x - 300) && x < (this.pos.x + 300) && y > (this.pos.y - 180) && y < (this.pos.y + 180));
  }

  this.show = (canvas) => {
    console.log(this.industryName)
    if (this.industryName == "OilRig") {
      this.showOilRig(canvas)
    } else {
      canvas.image(this.img, this.pos.x, this.pos.y+this.offsety);
    }
  }

  this.showOilRig = (canvas) => {
    
    canvas.image(this.imgs[0], this.pos.x, this.pos.y+this.offsety-this.offsets[0]);
    canvas.image(this.imgs[1], this.pos.x+128, this.pos.y-64+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[2], this.pos.x-128, this.pos.y-64+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[3], this.pos.x+128, this.pos.y+64+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[4], this.pos.x-128, this.pos.y+64+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[5], this.pos.x+256, this.pos.y+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[6], this.pos.x-256, this.pos.y+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[7], this.pos.x, this.pos.y+128+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    canvas.image(this.imgs[8], this.pos.x, this.pos.y-128+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    
    
    this.spriteIdx += this.spriteSpeed;
    if (int(this.spriteIdx) >= this.imgs.length) {
      this.spriteIdx = this.imgs.length-1;
      this.spriteSpeed = -0.05;
    } else if (int(this.spriteIdx) < 0) {
      this.spriteIdx = 0;
      this.spriteSpeed = 0.05;
    }
  }
}