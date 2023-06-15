function TradeScreen() {
  this.resources = {
    "metal": {"qty": 10},
    "sulfur": {"qty": 15},
    "meat": {"qty": 20},
  }
  this.show = () => {
    fill(255,255,255,100)
    rect(width/2-400,-height/2,400,height);
    //let x = width/2-300;
    //let y = -height/2+100;
    
    
    //strokeWeight(3)
    //fill(255);
    //circle(0,0,100)
    //fill(0);
    //let _text = createGraphics(100, 100);
    //_text.fill(255);
    //_text.text("hello", 0, 0);
    //texture(_text);

    // for (const [key, val] of Object.entries(this.resources)) {
    //   console.log(key)
    //   //fill(0);
    //   //stroke(0)
    //   //text("hello", 500, 0);
    // }
  }
}