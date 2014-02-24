import processing.serial.*;

Serial myPort;  // The serial port

ArrayList<PVector> data;
int maxSize;
PVector median;
PVector average;

Cursor myCursor;

void setup() {
  size(800, 600);
  
  data = new ArrayList<PVector>();
  maxSize = 40;
  median = new PVector(0, 0);
  average = new PVector(0, 0);
  
  
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
  textAlign(RIGHT);
  
  //Median
  text("median x: ", 80, 20);
  text(nf(median.x, 0, 2), 120, 20);
  text("median y: ", 80, 40);
  text(nf(median.y, 0, 2), 120, 40);

  //Mean average
  text("average x: ", 80, 60);
  text(nf(average.x, 0, 2), 120, 60);
  text("average y: ", 80, 80);
  text(nf(median.y, 0, 2), 120, 80);
}

void serialEvent (Serial myPort) {
  // get the ASCII string from each Serial line
  String inString = myPort.readStringUntil('\n');
 
  //If there's data...
  if (inString != null) {
   // trim off any whitespace:
   inString = trim(inString);
//   println(inString);
   
   //Split the X and Y coordinates
   String[] myVars = split(inString, "\t");
//   printArray(myVars);

   //If we have x AND y...
   if(myVars.length == 2){
     // convert to an int
     PVector currentReading = new PVector();
     currentReading.x = float(myVars[0]);
     currentReading.y = float(myVars[1]);
//     println("raw: " + rawData);     
     addData(currentReading);
     
   }
   
  } 
}

void addData(PVector currentReading){
  currentReading.normalize();
  if(data.size() >= maxSize){
    data.remove(0);
  }
  data.add(currentReading);
//  println(data.size());

  getMedian();
  getAverage();
}

void getMedian(){
  if(data.size() >= maxSize){
    PVector vector1 = data.get(data.size()/2 - 1);
    PVector vector2 = data.get(data.size()/2);
    median = vector1;
    median.add(vector2);
    median.div(2);
  }
}

void getAverage(){
  for(int i = 0; i < data.size(); i++){
    average.add(data.get(i));
  }
  average.div(data.size());
}
