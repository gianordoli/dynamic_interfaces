class Cursor{
  PVector size;
  PVector pos;
  PVector dir;
  float speed;
  Cursor(){
    size = new PVector(50, 50);
    pos = new PVector(width/2, height/2);
    dir = new PVector(0, 0);
    speed = 2;
  }
  
  void update(){
//    dir = median;
    dir = average;
    pos.x += dir.x * speed;
    pos.y += dir.x * speed;
    pos.add(dir);
  }
  
  void display(){
    ellipse(pos.x, pos.y, size.x, size.y);
  }
}
