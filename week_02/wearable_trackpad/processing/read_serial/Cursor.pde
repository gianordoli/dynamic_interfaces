class Cursor{
  PVector size;
  PVector pos;
  PVector dir;
  float speed;
  Cursor(){
    size = new PVector(50, 50);
    pos = new PVector(width/2, height/2);
    dir = new PVector(0, 0);
    speed = 5;
  }
  
  void update(){
//    dir = median;
//    dir.x = average.x - zero.x;
//    dir.y = average.y - zero.y;
    dir.x = average.x;
    dir.y = average.y;
    pos.x += dir.x * speed;
    pos.y += dir.y * speed;
    pos.add(dir);
    if(pos.x + size.x/2 >= width){
      pos.x = width - size.x/2;
    }
    if(pos.x - size.x/2 <= 0){
      pos.x = size.x/2;
    }    
    if(pos.y + size.x/2 >= height){
      pos.y = height - size.y/2;
    }
    if(pos.y - size.x/2 <= 0){
      pos.y = size.y/2;
    }
  }
  
  void display(){
    ellipse(pos.x, pos.y, size.x, size.y);
  }
}
