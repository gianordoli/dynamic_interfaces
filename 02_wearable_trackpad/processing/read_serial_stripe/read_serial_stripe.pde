import processing.serial.*;

Serial myPort;  // The serial port

ArrayList<PVector> data;  //list of PVectors with latest readings
int maxSize;       //size of the list
//PVector median;  //normalized PVector based on MEDIAN
PVector average;   //normalized PVector based on AVERAGE

//PVector zero;      //Stores the "non-touching" value
int threshold;     //Minimun value to add to data

Cursor myCursor;

void setup() {
  size(800, 600);
  
  data = new ArrayList<PVector>();
  maxSize = 60;
//  median = new PVector(0, 0);
  average = new PVector(0, 0);
//  zero = new PVector(0, 0);
  threshold = 200;
  
  myCursor = new Cursor();
  
  // List all the available serial ports
  println(Serial.list());
  // Open the port you are using at the rate you want:
  myPort = new Serial(this, Serial.list()[Serial.list().length - 1], 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
  debug();
  myCursor.update();
  myCursor.display();
}

void debug(){
  fill(255); 
  textAlign(RIGHT);
  
//  //Median
//  text("median x: ", 80, 20);
//  text(nf(median.x, 0, 2), 120, 20);
//  text("median y: ", 80, 40);
//  text(nf(median.y, 0, 2), 120, 40);

  //Mean average
  text("average x: ", 80, 60);
  text(nf(average.x, 0, 2), 120, 60);
  text("average y: ", 80, 80);
  text(nf(average.y, 0, 2), 120, 80);
  
//  //Zero
//  text("zero x: ", 80, 100);
//  text(nf(zero.x, 0, 2), 120, 100);
//  text("zero y: ", 80, 120);
//  text(nf(zero.y, 0, 2), 120, 120);

  fill(255, 0, 0);  
  //Direction
  text("dir x: ", 80, height - 60);
  text(nf(myCursor.dir.x, 0, 2), 120, height - 60);
  text("dir y: ", 80, height - 40);
  text(nf(myCursor.dir.y, 0, 2), 120, height - 40);  
}

void serialEvent (Serial myPort) {
  // get the ASCII string from each Serial line
  String inString = myPort.readStringUntil('\n');
 
  //If there's data...
  if (inString != null) {
   // trim off any whitespace:
   inString = trim(inString);
//   println(inString);
   
     PVector currentReading = new PVector();
     currentReading.x = float(inString);
     currentReading.y = 0;
//     println(currentReading.x); 
       addData(currentReading);        
  } 
}

void addData(PVector currentReading){  

  if(data.size() >= maxSize){
    data.remove(0);
  }
  if(abs(currentReading.x) >= threshold){
    currentReading.normalize();    
    data.add(currentReading);
  }else{
    PVector neutral = new PVector(0, 0);
    data.add(neutral);
  }
//  println(data.size());

//  getMedian();
  getAverage();
}

//void getMedian(){
//  if(data.size() >= maxSize){
//    PVector vector1 = data.get(data.size()/2 - 1);
//    PVector vector2 = data.get(data.size()/2);
//    median = vector1;
//    median.add(vector2);
//    median.div(2);
//  }
//}

void getAverage(){
  for(int i = 0; i < data.size(); i++){
    average.add(data.get(i));
  }
  average.div(data.size());
}

//void keyPressed(){
//  if(key == ' '){
//    println("Set zero");
//    for(int i = 0; i < data.size(); i++){
//      zero.add(data.get(i));
//    }
//    zero.div(data.size());
//  }
//}
