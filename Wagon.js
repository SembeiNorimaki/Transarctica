function Wagon(id, name, wagonData) {
  this.id = id;
  this.name = name;
  this.img = wagonData.img;
  this.halfSize = [wagonData.img[0].width/2, wagonData.img[0].height/2];
  this.units = wagonData.units;
  this.offsety = wagonData.offsety;
  this.capacity = wagonData.capacity;
  this.resourceName = wagonData.cargo;
  this.weight = wagonData.weight;
  this.usedSpace = 0;
  this.availableSpace = this.capacity;
  this.spriteId = 0;
  this.hitpointsLeft = 50;
  this.hitpoints = 150;
  this.pos = createVector(0, 800);
  this.vel = createVector(0.0, 0.0);
  
  this.setVel = (newVel) => {
    this.vel.set(newVel);
  }

  this.setPos = (newPos) => {
    this.pos.set(newPos);
  }

  this.recalculateSpriteId = () => {
    if (this.usedSpace == 0) {
      this.spriteId = 0;
    } else if (this.availableSpace == 0) {
      this.spriteId = 2;
    } else {
      this.spriteId = 1;
    }
  }

  this.addResource = (qty) => {
    if (qty > this.availableSpace) {
      throw "Not enough space";
    }
    this.usedSpace += qty;
    this.availableSpace -= qty; 
    this.recalculateSpriteId();
  }
  
  this.removeResource = (qty) => {
    if (qty > this.usedSpace) {
      throw "Not enough resources";
    }
    this.usedSpace -= qty;
    this.availableSpace += qty;
    this.recalculateSpriteId(); 
  }

  this.showHorizontal = (canvas) => {
    this.showHorizontal2(canvas, this.pos)
    // canvas.imageMode(CORNER)
    // canvas.image(this.img[this.spriteId], this.pos.x, this.pos.y - this.offsety[this.spriteId]);
    // //canvas.rect(pos.x, pos.y+20, this.halfSize[0]*2, 3);
    // canvas.textAlign(CENTER, CENTER);
    // canvas.text(`${this.usedSpace} / ${this.capacity}`, this.pos.x, this.pos.y + 30);   
    // canvas.textAlign(LEFT);
    // canvas.imageMode(CENTER)  
  }

  this.showHorizontal2 = (canvas, pos) => {
    canvas.imageMode(CORNER)
    canvas.image(this.img[this.spriteId], pos.x, pos.y - this.offsety[this.spriteId]);
    canvas.imageMode(CENTER)  
  }

  this.update = () => {  
    this.pos.add(this.vel);  
  } 
}