function Industry(pos, industryData) {
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
    if (this.name == "OilRig") {
      this.showOilRig(canvas)
    } else {
      canvas.image(this.img, this.pos.x, this.pos.y+this.offsety);
    }
  }

  this.showOilRig = (canvas) => {
    
    canvas.image(this.imgs[int(frameCount/20 % this.imgs.length)], this.pos.x, this.pos.y+this.offsety-this.offsets[int(frameCount/20 % this.imgs.length)]);
    // canvas.image(this.imgs[int((frameCount+10)/10 % this.imgs.length)], this.pos.x-128, this.pos.y+this.offsety-64);
    // canvas.image(this.imgs[int((frameCount+20)/10 % this.imgs.length)], this.pos.x+128, this.pos.y+this.offsety+64);
    // canvas.image(this.imgs[int((frameCount+30)/10 % this.imgs.length)], this.pos.x-128, this.pos.y+this.offsety+64);
    // canvas.image(this.imgs[int((frameCount+40)/10 % this.imgs.length)], this.pos.x+128, this.pos.y+this.offsety-64);
    // canvas.image(this.imgs[int((frameCount+50)/10 % this.imgs.length)], this.pos.x, this.pos.y+this.offsety-128);
    // canvas.image(this.imgs[int((frameCount+60)/10 % this.imgs.length)], this.pos.x, this.pos.y+this.offsety+128);
    // canvas.image(this.imgs[int((frameCount+70)/10 % this.imgs.length)], this.pos.x-256, this.pos.y+this.offsety);
    // canvas.image(this.imgs[int((frameCount+80)/10 % this.imgs.length)], this.pos.x+256, this.pos.y+this.offsety);
    
    
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