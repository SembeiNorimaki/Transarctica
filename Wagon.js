function Wagon(id, name, wagonData) {
  this.id = id;
  this.name = name;
  this.img = wagonData.img;
  this.dimensions = wagonData.dimensions;
  this.offsety = wagonData.offsety;
  this.capacity = wagonData.capacity;
  this.cargo = wagonData.cargo;
  this.weight = wagonData.weight;
  this.content = 0;

  this.vel = createVector(0.0, 0.0);
  
  this.setVel = (newVel) => {
    this.vel.set(newVel);
  }

  this.showHorizontal = (canvas, pos) => {
    canvas.image(this.img, pos.x, pos.y);
  }

  this.update = () => {  
    this.pos.add(this.vel);  
  } 
}