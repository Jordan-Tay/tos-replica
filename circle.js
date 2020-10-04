class Circle {
  
  constructor(centerX,centerY,rLow,rBig, num, strokeWidth, color){
    this.rLow = rLow;
    this.rBig = rBig;
    this.r = [];
    this.rgoal = rLow;
    this.num = num;
    this.cX = centerX;
    this.cY = centerY;
    this.speed = [];
    this.active = [];
    this.locX = [];
    this.locY = [];
    this.strokeWidth = strokeWidth;
    this.magic = 0;
    this.color = color;
    for(var i=0; i<num;i++) {
      this.active[i] = false;
      this.r[i] = this.rLow;
      this.locX[i] = this.cX + cos((360*i)/this.num)*this.rLow;
      this.locY[i] = this.cY + sin((360*i)/this.num)*this.rLow;
      this.magic += 0.05;
    }
  }
  
  move(){
    for(var i = 0; i<this.num; i++){
      if (this.active[i]){
        this.r[i] += (this.rgoal-this.r[i])/this.speed[i]; // update radius
        if ((this.r[i] > this.rBig)||(this.r[i] < this.rLow)){ // Check if in the boundaries
          this.r[i] = this.rgoal;
          this.active[i] = false;
        }
        this.locX[i] = this.cX + cos((360*i)/this.num)*this.r[i]; 
        this.locY[i] = this.cY + sin((360*i)/this.num)*this.r[i]; // Update location
      }
    }
  }
  
  isActive(){
			for(var i = 0; i<this.num; i++){
        if(this.active[i]){
          return true;
        }
      }
    	return false;
  } 
  
  activate(){
    if (this.rgoal == this.rLow){ 
      this.rgoal = this.rBig;
    } else {
      this.rgoal = this.rLow;
    } 
    for(var i = 0; i<this.num; i++){ 
      this.active[i] = true;
      this.speed[i] = random(10,50);
    }
  }
  
  display() {
    if (this.strokeWidth > 0) {
      strokeWeight(this.strokeWidth);
      stroke(this.color);
      if (this.isActive()) {
        this.move();
      }
      for (var i = 0; i < this.num; i++) {
        point(this.locX[i], this.locY[i]);
      }
    }
  }
}