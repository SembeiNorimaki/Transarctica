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

  this.vel = createVector(0.0, 0.0);
  
  this.setVel = (newVel) => {
    this.vel.set(newVel);
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

  this.showHorizontal = (canvas, pos) => {
    canvas.image(this.img[this.spriteId], pos.x, pos.y - this.offsety[this.spriteId]);
    canvas.textAlign(CENTER, CENTER);
    canvas.text(`${this.usedSpace} / ${this.capacity}`, pos.x, pos.y + 30);   
    canvas.textAlign(LEFT);  
  }

  this.update = () => {  
    this.pos.add(this.vel);  
  } 
}