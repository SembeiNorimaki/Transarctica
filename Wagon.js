function Wagon(id, pos, imgData) {
  this.id = id;
  this.orientation = 270.0;
  this.position = pos;
  this.currentTile = createVector(round(this.position.x), round(this.position.y));
  this.prevTile = this.currentTile.copy();
  this.imgData = imgData;    
  this.velocity = createVector(0.0, 0.0);

  this.show = (cameraPos, worldMap) => {
    let screenPos = worldMap.map2screen(this.position.x, this.position.y, cameraPos.z);
    screenPos.add(cameraPos);
    image(this.imgData[this.orientation.toString()].imgList[0], 
      (screenPos.x - this.imgData[this.orientation].imgList[0].width/2 + this.imgData[this.orientation].offset[0]), 
      (screenPos.y - this.imgData[this.orientation].imgList[0].height/2 + this.imgData[this.orientation].offset[1]));
    circle(screenPos.x, screenPos.y, 5);
  }

  this.setVelocityMag = (val) => {
    if (this.velocity.equals(0,0))
      this.velocity.set(1,0);  
    this.velocity.setMag(val);
    this.velocity.setHeading(radians(this.orientation));
  }

  this.update = () => {  
    //console.log(this.id, this.position.array())       
    this.position.add(this.velocity);  
    this.prevTile = this.currentTile.copy();
    this.currentTile.set(round(this.position.x), round(this.position.y));
  }

  this.newOrientation = (worldMap) => {
    switch(worldMap.tileIdx2name[worldMap.board[this.currentTile.y][this.currentTile.x]]) {      
      case("AB"):
        if (this.velocity.y > 0) {    
          this.orientation = 135;
          this.position = createVector(this.currentTile.x, this.currentTile.y - 0.5);
        } else {
          this.orientation = 315;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y);
        }
      break;
      case("AC"):
        if (this.velocity.x > 0) {
          this.orientation = 45;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y );
        } else {
          this.orientation = 225;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        }
      break;
      case("AD"):
        if (this.velocity.x > 0) {
          this.orientation = 0;
          this.position = createVector(this.currentTile.x - 0.5, this.currentTile.y);
        } else {
          this.orientation = 180;
          this.position = createVector(this.currentTile.x + 0.5, this.currentTile.y);
        }
      break;
      case("BC"):
        if (this.velocity.y > 0) {
          this.orientation = 90;
          this.position = createVector(this.currentTile.x, this.currentTile.y - 0.5);
        } else {
          this.orientation = 270;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        }
      break;
      case("BD"):
        if (this.velocity.x < 0) {
          this.orientation = 225;
          this.position = createVector(this.currentTile.x+0.5, this.currentTile.y);
        } else {
          this.orientation = 45;
          this.position = createVector(this.currentTile.x, this.currentTile.y-0.5);
        }
      break;
      case("CD"):
        if (this.velocity.y < 0) {
          this.orientation = 315;
          this.position = createVector(this.currentTile.x, this.currentTile.y + 0.5);
        } else {
          this.orientation = 135;
          this.position = createVector(this.currentTile.x + 0.5, this.currentTile.y);
        }
      break;
    }

    this.velocity.setHeading(radians(this.orientation));
    //this.acceleration.setHeading(radians(this.orientation));
  }

  this.enteredNewTile = () => {
    return !this.currentTile.equals(this.prevTile);
  }
}