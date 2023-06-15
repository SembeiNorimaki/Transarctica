function WorldMap(data, tracks, buildings, cities) {
  const TILE_WIDTH_HALF = [32, 64, 128];
  const TILE_HEIGHT_HALF = [16, 32, 64];

  this.tileName2idx = {
    "0": 0x00,
    "AD": 0x01,
    "BC": 0x02,
    "AB": 0x03,
    "CD": 0x04,
    "AC": 0x05,
    "BD": 0x06,
    "ABc": 0x07,
    "ABd": 0x08,
    "ACb": 0x09,
    "ACd": 0x0A,
    "ADb": 0x0B,
    "ADc": 0x0C,
    "BCa": 0x0D,
    "BCd": 0x0E,
    "BDa": 0x0F,
    "BDc": 0x10,
    "CDa": 0x11,
    "CDb": 0x12,
    "Da": 0x13,
    "Cb": 0x14,
    "X": 0x15,
    "tAD": 0x16,
    "tBC": 0x17,
    "tAB": 0x18,
    "tCD": 0x19,
    "tAC": 0x1A,
    "tBD": 0x1B,
    "sAD": 0x80,
    "sBC": 0x81,
    "sBC2": 0x82,
    "sBC3": 0x83,
  };
  
  this.tileIdx2name = {
    0x00: "0",
    0x01: "AD",
    0x02: "BC",
    0x03: "AB",
    0x04: "CD",
    0x05: "AC",
    0x06: "BD",
    0x07: "ABc",
    0x08: "ABd",
    0x09: "ACb",
    0x0A: "ACd",
    0x0B: "ADb",
    0x0C: "ADc",
    0x0D: "BCa",
    0x0E: "BCd",
    0x0F: "BDa",
    0x10: "BDc",
    0x11: "CDa",
    0x12: "CDb",
    0x13: "Da",
    0x14: "Cb",
    0x15: "X",
    0x16: "tAD",
    0x17: "tBC",
    0x18: "tAB",
    0x19: "tCD",
    0x1A: "tAC",
    0x1B: "tBD",
    0x80: "sAD",
    0x81: "sBC",
    0x82: "sBC1",
    0x83: "sBC2"
  };

  this.tileChanges = {
    "ABc":"ACb",
    "ACb":"BCa",
    "BCa":"ABc",
    "ABd":"ADb",
    "ADb":"BDa",
    "BDa":"ABd",
    "ACd":"ADc",
    "ADc":"CDa",
    "CDa":"ACd",
    "BCd":"BDc",
    "BDc":"CDb",
    "CDb":"BCd"    
}

  this.NCOLS = split(data[0], ',').length;
  this.NROWS = data.length;

  this.tracks = tracks;
  this.buildings = buildings;
  this.cities = cities;

  this.board = Array.from(Array(this.NROWS), () => new Array(this.NCOLS));

  //this.fullImage = [];
  //this.fullImage.push(createGraphics((this.NCOLS+this.NROWS) * TILE_WIDTH_HALF[0], 
  //  (this.NCOLS+this.NROWS) * TILE_HEIGHT_HALF[0]));
  // this.fullImage.push(createGraphics((this.NCOLS+this.NROWS) * TILE_WIDTH_HALF[1], 
  //   (this.NCOLS+this.NROWS) * TILE_HEIGHT_HALF[1]));
   
  // populate map
  for (const [row, txtLine] of data.entries()) {
    for (const [col, elem] of split(txtLine, ',').entries()) {
      this.board[row][col] = Number("0x" + elem);
    }
  }

  this.preloadMap = () => {   
    for(let row=0; row<this.NROWS; row++) {
      for(let col=0; col<this.NCOLS; col++) {
        for (let zoom=0; zoom<=0; zoom++) {
          screenPos = this.map2screen(col, row, zoom);
          screenPos.add(createVector(this.NROWS * TILE_WIDTH_HALF[zoom], 0))
          try {  
            this.fullImage[zoom].image(this.tracks[this.tileIdx2name[this.board[row][col]]].imgs[zoom], 
              screenPos.x, 
              screenPos.y);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    //image(this.fullImage[1],-width/2,-height/2)   
  }

  this.screen2map = (screenX, screenY, zoom) => {
    return createVector(
      (screenX / TILE_WIDTH_HALF[zoom] + screenY / TILE_HEIGHT_HALF[zoom]) / 2, 
      (screenY / TILE_HEIGHT_HALF[zoom] - screenX / TILE_WIDTH_HALF[zoom]) / 2
    );
  }
  
  this.map2screen = (x, y, cameraPos) => {
    return createVector(
      (x - y) * TILE_WIDTH_HALF[2],
      (x + y) * TILE_HEIGHT_HALF[2]
    );
  }
  

  this.idx2map = (idx) => {
    return createVector(floor(idx / this.NCOLS), idx % this.NCOLS);
  }
  
  this.map2idx = (pos) => {
    return pos.y * this.NCOLS + pos.x;
  }

  this.changeTile = (row, col) => {
    let tileName = this.tileIdx2name[this.board[row][col]];
    if (tileName in this.tileChanges) {
      let val = this.tileName2idx[this.tileChanges[tileName]];
      this.board[row][col] = val;
      return true;
    }
    return false;
    
  }

  this.drawTile = (canvas, row, col) => {
    screenPos = this.map2screen(col, row, cameraPos.z);
    screenPos.sub(cameraPos);
    screenPos.add(950, 420);
    if (screenPos.x < -TILE_WIDTH_HALF[cameraPos.z] ||
        screenPos.y < -TILE_HEIGHT_HALF[cameraPos.z] || 
        screenPos.x > canvas.width + TILE_WIDTH_HALF[cameraPos.z]|| 
        screenPos.y > canvas.height + TILE_HEIGHT_HALF[cameraPos.z]) {
      return;
    }

    try {  
      if (this.board[row][col] == 0x81) {  // stations BC
        canvas.image(this.tracks["BC"].imgs[cameraPos.z],
          screenPos.x, 
          screenPos.y,
          2*TILE_WIDTH_HALF[cameraPos.z], 2*TILE_HEIGHT_HALF[cameraPos.z]);
        canvas.image(this.tracks["sBC1"].imgs[cameraPos.z], 
          screenPos.x, 
          screenPos.y-82);
        // image(this.tracks["sBC1"].imgs[cameraPos.z], 
        //   screenPos.x+80, 
        //   screenPos.y-42);
      } else if (this.board[row][col] == 0x82) {    // stations AD
        canvas.image(this.tracks["AD"].imgs[cameraPos.z],
          screenPos.x, 
          screenPos.y,
          2*TILE_WIDTH_HALF[cameraPos.z], 2*TILE_HEIGHT_HALF[cameraPos.z]);
        canvas.image(this.tracks["sAD"].imgs[cameraPos.z], 
          screenPos.x+73, 
          screenPos.y-80);
        // image(this.tracks["sBC2"].imgs[cameraPos.z], 
        //   screenPos.x+80, 
        //   screenPos.y-42);
      } else if (this.board[row][col] == 0x00) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].imgs[cameraPos.z], 
          screenPos.x, 
          screenPos.y,
          2*TILE_WIDTH_HALF[cameraPos.z], 2*TILE_HEIGHT_HALF[cameraPos.z]);
        
        // image(this.tracks["trees"].imgs[cameraPos.z], 
        //     screenPos.x+40, 
        //     screenPos.y-40);
        
      } else {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].imgs[cameraPos.z], 
          screenPos.x, 
          screenPos.y,
          2*TILE_WIDTH_HALF[cameraPos.z], 2*TILE_HEIGHT_HALF[cameraPos.z]);
      }
    } catch (error) {
      console.log(row, col)
      return
      if (this.board[row][col] >= 0x40 && this.board[row][col] <=0x6B) {
        canvas.image(this.tracks[this.tileIdx2name[0]].imgs[cameraPos.z],
          screenPos.x, 
          screenPos.y,
          2*TILE_WIDTH_HALF[cameraPos.z], 2*TILE_HEIGHT_HALF[cameraPos.z]);
        canvas.image(this.buildings["7"].imgs[cameraPos.z],
          screenPos.x,
          screenPos.y-90);
      }
    }
  }

  this.show = (canvas, cameraPos) => {
    for(let row=0; row<this.NROWS; row++) {
      for(let col=0; col<this.NCOLS; col++) {
        this.drawTile(canvas, row, col);
      }
    }
  }

  this.processClick = (mouseX, mouseY, cameraPos) => {
    
    let aux = this.screen2map(mouseX+cameraPos.x, mouseY+cameraPos.y, cameraPos.z);
    console.log(aux.array())
    //console.log(this.cities[Number(this.board[round(aux.y)][round(aux.x)])])
    
    this.changeTile(round(aux.y), round(aux.x))
    //console.log(this.tileIdx2name[this.board[round(aux.y)][round(aux.x)]])  
     
  }
}