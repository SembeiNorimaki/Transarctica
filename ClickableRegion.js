function ClickableRegion(pos, image) {
  this.pos = pos;
  this.bgImage = image[0];
  this.fgImage = image[1];
  this.halfSize = createVector(this.bgImage.width / 2, this.bgImage.height / 2);

  this.gotClicked = (x, y) => {
    return ((x > pos.x - this.halfSize.x) &&
            (x < pos.x + this.halfSize.x) &&
            (y > pos.y - this.halfSize.x) &&
            (y < pos.y + this.halfSize.x));
  }     
  
  this.show = (canvas) => {
    canvas.image(this.bgImage, this.pos.x, this.pos.y);
    canvas.image(this.fgImage, this.pos.x, this.pos.y);
  }
}