function Industry(name, pos, industryData) {
  console.log(name);
  console.log(industryData);

  this.name = name;
  this.resourceType = industryData.resourceType;
  this.img = industryData.img;
  this.pos = pos;
  this.offsety = industryData.offsety;
  this.minQty = industryData.minQty;
  this.price = industryData.price;

  this.isClicked = (x, y) => {
    return (x > (this.pos.x-300) && x < (this.pos.x+300) && y > (this.pos.y-180) && y < (this.pos.y+180));
  }

  this.show = (canvas) => {
    canvas.image(this.img, this.pos.x, this.pos.y+this.offsety);
  }
}