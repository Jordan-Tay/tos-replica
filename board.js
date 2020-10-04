class Board {

  display() {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 5; j++) { 
        ((i + j) % 2 == 0) ? fill("#382311") : fill("#54371E");
        strokeWeight(0);
        rect(i * w / 6, w + j * w / 6, w / 6, w / 6);
      }
    }
  }
  
}