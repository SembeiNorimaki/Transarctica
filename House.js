function House(pos, img) {
  this.pos = pos;
  this.img = img;
  this.halfSize = createVector(64, 64);

  this.isClicked = (x, y) => {
    return ((x > this.pos.x - this.halfSize.x) &&
            (x < this.pos.x + this.halfSize.x) &&
            (y > this.pos.y - this.halfSize.y) &&
            (y < this.pos.y + this.halfSize.y));
  }
  
  this.show = (canvas) => {
    canvas.image(this.img, pos.x, pos.y);
  }
}