function ScnCombat(backgroundImg) {
  this.backgroundImg = backgroundImg;
  this.trainXpos = 1600;

  this.update = () => {

  }
  this.show = (canvas, train) => {
    canvas.image(this.backgroundImg, canvas.width/2, canvas.height/2);  
    train.showHorizontalTrain(canvas, this.trainXpos);
  }
}