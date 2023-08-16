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

class WorldMap {
  
  constructor() {
    this.TILE_WIDTH_HALF = 128;
    this.TILE_HEIGHT_HALF = 64;  

    this.tileChanges = mapData2.tileChanges;

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

      "tunnelA": 0x2B,
      "tunnelB": 0x2C,
      "tunnelC": 0x2D,
      "tunnelD": 0x2E,

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

      "sAD": 0x80,
      "sBC": 0x81,
      "sBC2": 0x82,
      "sBC3": 0x83,
      
      "tree1": 60,
      "tree2": 61,
      "tree3": 62
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
      0x83: "sBC2",

      60: "tree1",
      61: "tree2",
      62: "tree3"
    };

    this.NCOLS = split(mapData[0], ',').length;
    this.NROWS = mapData.length;

    this.tracks = tracksData;
    this.buildings = buildingsData;
    this.cities = citiesData;
    this.industries = industryData;
    this.trees = miscData;

    this.board = Array.from(Array(this.NROWS), () => new Array(this.NCOLS));
    this.heightmap = Array.from(Array(this.NROWS), () => new Array(this.NCOLS));

    //this.fullImage = [];
    //this.fullImage.push(createGraphics((this.NCOLS+this.NROWS) * TILE_WIDTH_HALF[0], 
    //  (this.NCOLS+this.NROWS) * TILE_HEIGHT_HALF[0]));
    // this.fullImage.push(createGraphics((this.NCOLS+this.NROWS) * TILE_WIDTH_HALF[1], 
    //   (this.NCOLS+this.NROWS) * TILE_HEIGHT_HALF[1]));
    
    // populate map
    for (const [row, txtLine] of mapData.entries()) {
      for (const [col, elem] of split(txtLine, ',').entries()) {
        this.board[row][col] = Number("0x" + elem);
      }
    }
    // populate heightmap
    for (const [row, txtLine] of heightData.entries()) {
      for (const [col, elem] of split(txtLine, ',').entries()) {
        this.heightmap[row][col] = Number("0x" + elem);
      }
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

  screen2map(x, y) {
    return createVector(
      (x / this.TILE_WIDTH_HALF + y / this.TILE_HEIGHT_HALF) / 2, 
      (y / this.TILE_HEIGHT_HALF - x / this.TILE_WIDTH_HALF) / 2
    );
  }
  
  map2screen(x, y, z) {
    return createVector(
      (x - y) * this.TILE_WIDTH_HALF,
      (x + y) * this.TILE_HEIGHT_HALF - z*32
    );
  }

  idx2map(idx) {
    return createVector(floor(idx / this.NCOLS), idx % this.NCOLS);
  }
  
  map2idx(pos) {
    return pos.y * this.NCOLS + pos.x;
  }

  combatScreen2map(x, y) {
    let tileDim = [70, 70];
    let offset = [40, 120];
    let xx = (x-offset[0])/tileDim[0];
    let yy = (y-offset[1])/tileDim[1];
    return createVector(int(xx), int(yy));
  }

  changeTile(row, col) {
    let tileName = this.tileIdx2name[this.board[row][col]];
    if (tileName in this.tileChanges) {
      let val = this.tileName2idx[this.tileChanges[tileName]];
      this.board[row][col] = val;
      return true;
    }
    return false;    
  }

  drawTileHeightMap(canvas, row, col, cameraPos) {
    let currentHeight = int(this.heightmap[row][col] / 0x10);
    let screenPos = this.map2screen(col, row, currentHeight);
    screenPos.sub(cameraPos);
    screenPos.add(canvas.width/2, canvas.height/2);

    if (screenPos.x < -this.TILE_WIDTH_HALF ||
        screenPos.y < -this.TILE_HEIGHT_HALF || 
        screenPos.x > canvas.width + this.TILE_WIDTH_HALF || 
        screenPos.y > canvas.height + this.TILE_HEIGHT_HALF) {
      return;
    }
    try {  
      let heightTile = this.heightmap[row][col] % 0x10;

      
      if (heightTile == 0x00) {
        if (currentHeight == 0) {
          canvas.image(this.tracks["water"].img, screenPos.x, screenPos.y);
          //return
        } else {
          canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        }
      } else if (heightTile == 0x01) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterN"].img, screenPos.x, screenPos.y-16);
        else
          canvas.image(this.tracks["wxyZ"].img, screenPos.x, screenPos.y-16);
      } else if (heightTile == 0x08) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterS"].img, screenPos.x, screenPos.y-16);
        else
          canvas.image(this.tracks["Wxyz"].img, screenPos.x, screenPos.y-16);
      } else if (heightTile == 0x03) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterE"].img, screenPos.x, screenPos.y);
        else
          canvas.image(this.tracks["wXyz"].img, screenPos.x, screenPos.y);
      } else if (heightTile == 0x06) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterW"].img, screenPos.x, screenPos.y);
        else
          canvas.image(this.tracks["wxYz"].img, screenPos.x, screenPos.y);
      } else if (heightTile == 0x02) {
        canvas.image(this.tracks["wXyZ"].img, screenPos.x, screenPos.y-16);
      } else if (heightTile == 0x04) {
        canvas.image(this.tracks["wxYZ"].img, screenPos.x, screenPos.y-16);
      } else if (heightTile == 0x05) {
        canvas.image(this.tracks["WXyz"].img, screenPos.x, screenPos.y-16);
      } else if (heightTile == 0x07) {
        canvas.image(this.tracks["WxYz"].img, screenPos.x, screenPos.y-16); //
      } else if (heightTile == 0x09) {
        canvas.image(this.tracks["wXYZ"].img, screenPos.x, screenPos.y+16);
      } else if (heightTile == 0x0A) {
        canvas.image(this.tracks["WXyZ"].img, screenPos.x, screenPos.y);
      } else if (heightTile == 0x0B) {
        canvas.image(this.tracks["WxYZ"].img, screenPos.x, screenPos.y);
      } else if (heightTile == 0x0C) {
        canvas.image(this.tracks["WXYz"].img, screenPos.x, screenPos.y+16);
      } 
    } catch (error) {
      //console.log(error)
      return;
    }
  }

  drawTile(canvas, row, col, cameraPos) {
    let screenPos = this.map2screen(col, row);
    screenPos.sub(cameraPos);
    screenPos.add(canvas.width/2, canvas.height/2);

    if (screenPos.x < -this.TILE_WIDTH_HALF ||
        screenPos.y < -this.TILE_HEIGHT_HALF || 
        screenPos.x > canvas.width + this.TILE_WIDTH_HALF || 
        screenPos.y > canvas.height + this.TILE_HEIGHT_HALF) {
      return;
    }

    

    try {  
      // if (this.board[row][col] == 0x00 ) {
      //   canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
      //   canvas.image(this.trees["tree1"], screenPos.x, screenPos.y);
      // } 

      let heightTile = this.heightmap[row][col] % 0x10;
      let currentHeight = int(this.heightmap[row][col] / 0x10);

      if (heightTile == 0x00) {
        if (currentHeight == 0) {
          canvas.image(this.tracks["water"].img, screenPos.x, screenPos.y);
          //return
        } else {
          canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y-currentHeight*32);
        }
      } else if (heightTile == 0x01) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterN"].img, screenPos.x, screenPos.y-16-currentHeight*32);
        else
          canvas.image(this.tracks["wxyZ"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x08) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterS"].img, screenPos.x, screenPos.y-16-currentHeight*32);
        else
          canvas.image(this.tracks["Wxyz"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x03) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterE"].img, screenPos.x, screenPos.y-currentHeight*32);
        else
          canvas.image(this.tracks["wXyz"].img, screenPos.x, screenPos.y-currentHeight*32);
      } else if (heightTile == 0x06) {
        if (currentHeight == 0)
          canvas.image(this.tracks["waterW"].img, screenPos.x, screenPos.y-currentHeight*32);
        else
          canvas.image(this.tracks["wxYz"].img, screenPos.x, screenPos.y-currentHeight*32);
      } else if (heightTile == 0x02) {
        canvas.image(this.tracks["wXyZ"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x04) {
        canvas.image(this.tracks["wxYZ"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x05) {
        canvas.image(this.tracks["WXyz"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x07) {
        canvas.image(this.tracks["WxYz"].img, screenPos.x, screenPos.y-16-currentHeight*32);
      } else if (heightTile == 0x09) {
        canvas.image(this.tracks["wXYZ"].img, screenPos.x, screenPos.y+16-currentHeight*32);
      } else if (heightTile == 0x0A) {
        canvas.image(this.tracks["WXyZ"].img, screenPos.x, screenPos.y-currentHeight*32);
      } else if (heightTile == 0x0B) {
        canvas.image(this.tracks["WxYZ"].img, screenPos.x, screenPos.y-currentHeight*32);
      } else if (heightTile == 0x0C) {
        canvas.image(this.tracks["WXYz"].img, screenPos.x, screenPos.y+16-currentHeight*32);
      } 
      // return;

      // else if (this.heightmap[row][col] == 0x10) {
      //     canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y-32);
      //     return;
      // }

      if (this.board[row][col] == 0x01) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - currentHeight*32);
      } else if (this.board[row][col] == 0x02) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - currentHeight*32);
      } else if (this.board[row][col] == 0x03) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - 32-currentHeight*32);
      } else if (this.board[row][col] == 0x04) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y+32-currentHeight*32);
      } else if (this.board[row][col] == 0x05) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x-64, screenPos.y - currentHeight*32);
      } else if (this.board[row][col] == 0x06) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x+64, screenPos.y - currentHeight*32);
      } else if (this.board[row][col] >= 0x07 && this.board[row][col] <= 0x12) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - currentHeight-32);
      }      
      else if (this.board[row][col] == 0x2D) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - 14-currentHeight*32);
      }



      else if (this.board[row][col] == 0x60) {
        canvas.image(this.trees["tree1"], screenPos.x-50, screenPos.y-50-currentHeight*32);  
      } else if (this.board[row][col] == 0x61) {        
        canvas.image(this.trees["tree2"], screenPos.x-50, screenPos.y-90 - currentHeight*32);
      } else if (this.board[row][col] == 0x62) {
        canvas.image(this.tracks["0"].img, screenPos.x, screenPos.y);
        canvas.image(this.trees["tree3"], screenPos.x-50, screenPos.y-80);
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
        canvas.image(this.buildings[(this.board[row][col]-0x40).toString()].img, screenPos.x, screenPos.y - 32 * currentHeight); 
      } else if ([0x31, 0x32, 0x35, 0x37, 0x38, 0x3B, 0x2D].includes(this.board[row][col])) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y-16);
      } else if (this.board[row][col] == 0x2F) {
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y-32);
      } else if (this.board[row][col] != 0x00){
        canvas.image(this.tracks[this.tileIdx2name[this.board[row][col]]].img, screenPos.x, screenPos.y - currentHeight);
      }
    } catch (error) {
      //console.log(error)
      return;
    }

    //canvas.text(`${col}, ${row}`, screenPos.x, screenPos.y)
  }

  showHeightMap(canvas, cameraPos) {

  }
  show(canvas, cameraPos) {
    // for(let row=0; row<this.NROWS; row++) {
    //   for(let col=0; col<this.NCOLS; col++) {
    //     this.drawTile(canvas, row, col, cameraPos);
    //   }
    // }

    //console.log(this.NCOLS, this.NROWS)
    let aux = this.screen2map(cameraPos.x, cameraPos.y)
    let xx = 8;
    let yy = 8;
    let rowmin = Math.max(aux.y-yy, 0);
    let rowmax = Math.min(aux.y+yy, this.NROWS-1);
    let colmin = Math.max(aux.x-xx, 0);
    let colmax = Math.min(aux.x+xx, this.NCOLS-1);

    for(let row=rowmin; row<=rowmax; row++) {
      for(let col=colmin; col<=colmax; col++) {
        this.drawTileHeightMap(canvas, int(row), int(col), cameraPos);
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

  processClick(mouseX, mouseY, cameraPos) {
    
    let aux = this.screen2map(mouseX+cameraPos.x, mouseY+cameraPos.y, cameraPos.z);
    console.log(round(aux.x), round(aux.y))
    //console.log(this.cities[Number(this.board[round(aux.y)][round(aux.x)])])
    
    this.changeTile(round(aux.y), round(aux.x))
    //console.log(this.tileIdx2name[this.board[round(aux.y)][round(aux.x)]])  
     
  }
}