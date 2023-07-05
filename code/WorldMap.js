// Copyright (C) 2023  Sembei Norimaki

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

function WorldMap(data, tracks, buildings, cities, industries) {
  const TILE_WIDTH_HALF = 128;
  const TILE_HEIGHT_HALF = 64;

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

    "wXyz": 0x30,
    "t2": 0x31,
    "t3": 0x32,
    "t4": 0x33,
    "t5": 0x34,
    "t6": 0x35,
    "t7": 0x36,
    "t8": 0x37,
    "t9": 0x38,
    "t10": 0x39,
    "t11": 0x3A,
    "t12": 0x3B,
    "t13": 0x3C,
    "t14": 0x3D,
    "t15": 0x3E,
    "t16": 0x3F,
    "t17": 0x40,
    "t18": 0x41,
    "t19": 0x2F,

    "tA": 0x2B,
    "tB": 0x2C,
    "tC": 0x2D,
    "tD": 0x2E,

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

    0x30: "wXyz",
    0x31: "wxyZ",
    0x32: "wXyZ",
    0x33: "wxYz",
    0x34: "t5",
    0x35: "wxYZ",
    0x36: "t7",
    0x37: "Wxyz",
    0x38: "WXyz",
    0x39: "t10",
    0x3A: "t11",
    0x3B: "WxYz",
    0x3C: "t13",
    0x3D: "t14",
    0x3E: "t15",
    0x3F: "t16",
    0x40: "t17",
    0x41: "t18",
    0x2F: "wxyz",

    0x2B: "tunnelA",
    0x2C: "tunnelB",
    0x2D: "tunnelC",
    0x2E: "tunnelD",

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
  this.industries = industries;

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

  // this.preloadMap = () => {   
  //   for(let row=0; row<this.NROWS; row++) {
  //     for(let col=0; col<this.NCOLS; col++) {
  //       for (let zoom=0; zoom<=0; zoom++) {
  //         screenPos = this.map2screen(col, row, zoom);
  //         screenPos.add(createVector(this.NROWS * TILE_WIDTH_HALF[zoom], 0))
  //         try {  
  //           this.fullImage[zoom].image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, 
  //             screenPos.x, 
  //             screenPos.y);
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     }
  //   }
  //   //image(this.fullImage[1],-width/2,-height/2)   
  // }

  this.screen2map = (screenX, screenY) => {
    return createVector(
      (screenX / TILE_WIDTH_HALF + screenY / TILE_HEIGHT_HALF) / 2, 
      (screenY / TILE_HEIGHT_HALF - screenX / TILE_WIDTH_HALF) / 2
    );
  }
  
  this.map2screen = (x, y) => {
    return createVector(
      (x - y) * TILE_WIDTH_HALF,
      (x + y) * TILE_HEIGHT_HALF
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

  this.drawTile = (canvas, row, col, cameraPos) => {
    screenPos = this.map2screen(col, row);
    screenPos.sub(cameraPos);
    screenPos.add(canvas.width/2, canvas.height/2);
    if (screenPos.x < -TILE_WIDTH_HALF ||
        screenPos.y < -TILE_HEIGHT_HALF || 
        screenPos.x > canvas.width + TILE_WIDTH_HALF || 
        screenPos.y > canvas.height + TILE_HEIGHT_HALF) {
      return;
    }

    try {  
      if (this.board[row][col] == 0x90) {
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        canvas.image(this.tracks["tree"].img, screenPos.x, screenPos.y-30);
        
      } else if (this.board[row][col] == 0x81) {  // stations BC
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        //canvas.image(this.tracks["sBC1"].img, screenPos.x-25, screenPos.y-56);
        canvas.image(this.tracks["sBC1"].img, screenPos.x+40, screenPos.y-22);
      } else if (this.board[row][col] == 0x82) {    // stations AD
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        canvas.image(this.tracks["sAD"].img, screenPos.x-28, screenPos.y); 
      } else if (this.board[row][col] == 0x98) {    // industry
        console.log("Industry")
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        canvas.image(this.industries["q"].img, screenPos.x, screenPos.y-15); 
      } else if (this.board[row][col] >= 0x40) {    // stations AD
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        canvas.image(this.buildings[(this.board[row][col]-0x40).toString()].img, screenPos.x-28, screenPos.y-15); 
      } else if ([0x31, 0x32, 0x35, 0x37, 0x38, 0x3B, 0x2D].includes(this.board[row][col])) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y-16);
      } else if (this.board[row][col] == 0x2F) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y-32);
      } else {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y);
      }
    } catch (error) {
      //console.log(error)
      return;
    }

    //canvas.text(`${col}, ${row}`, screenPos.x, screenPos.y)
  }

  this.show = (canvas, cameraPos) => {
    // for(let row=0; row<this.NROWS; row++) {
    //   for(let col=0; col<this.NCOLS; col++) {
    //     this.drawTile(canvas, row, col, cameraPos);
    //   }
    // }

    let aux = this.screen2map(cameraPos.x, cameraPos.y)
    let xx = 8;
    let yy = 8;
    for(let row=aux.y-yy; row<=aux.y+yy; row++) {
      for(let col=aux.x-xx; col<=aux.x+xx; col++) {
        this.drawTile(canvas, int(row), int(col), cameraPos);
      }
    }

    // let aux = this.screen2map(cameraPos.x, cameraPos.y)
    // let idx = 0;
    // for (let x=0; x<6; x++) {
    //   for (let y=0; y<7; y++) {  //
    //     let aux2 = this.map2screen(int(aux.x - x+y), int(aux.y+6-y-x))
    //     aux2.sub(cameraPos);
    //     aux2.add(950, 420);
    //     this.drawTile(canvas, int(aux.x - x+y), int(aux.y+6-y-x), cameraPos);
    //     // canvas.image(this.tracks["0"].img, aux2.x, aux2.y)
    //     canvas.text(`${int(aux.x - x+y)}, ${int(aux.y+6-y-x)}`, aux2.x, aux2.y);
    //     idx +=1
    //   }
    //   for (let y=0; y<7; y++) {  //
    //     let aux2 = this.map2screen(int(aux.x-1 - x+y), int(aux.y+6-y-x))
    //     aux2.sub(cameraPos);
    //     aux2.add(950, 420);
    //     this.drawTile(canvas, int(aux.x-1 - x+y), int(aux.y+6-y-x), cameraPos);
    //     // canvas.image(this.tracks["0"].img, aux2.x, aux2.y)
    //     // canvas.text(idx, aux2.x, aux2.y);
    //     idx +=1
    //   }
      
    // }


    // canvas.stroke(255,0,0)
    // canvas.line(0, canvas.height/2, canvas.width, canvas.height/2)
    // canvas.line(canvas.width/2, 0, canvas.width/2, canvas.height);
  }

  this.processClick = (mouseX, mouseY, cameraPos) => {
    
    let aux = this.screen2map(mouseX+cameraPos.x, mouseY+cameraPos.y, cameraPos.z);
    console.log(round(aux.x), round(aux.y))
    //console.log(this.cities[Number(this.board[round(aux.y)][round(aux.x)])])
    
    this.changeTile(round(aux.y), round(aux.x))
    //console.log(this.tileIdx2name[this.board[round(aux.y)][round(aux.x)]])  
     
  }
}