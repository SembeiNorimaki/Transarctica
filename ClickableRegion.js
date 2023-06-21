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