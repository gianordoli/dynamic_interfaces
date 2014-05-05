import processing.serial.*;

Serial myPort;  // The serial port

int sampleRate;

PVector pos;
PVector dir;
PVector averageData;

float minX, maxX, minY, maxY;

int nReadings;

void setup() {
  size(800, 600);
  
  sampleRate = 50;
  
  minX = 0;
  maxX = 0;
  minY = 0;
  maxY = 0;

  
  averageData = new PVector();
  pos = new PVector(0, 0);
  dir = new PVector(0, 0);
  
  // List all the available serial ports
//  println(Serial.list());
  // Open the port you are using at the rate you want:
  myPort = new Serial(this, Serial.list()[Serial.list().length - 1], 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
  ellipse(pos.x, pos.y, 40, 40);
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
     PVector rawData = new PVector();
     rawData.x = float(myVars[0]);
     rawData.y = float(myVars[1]);
//     println("raw: " + rawData);     
     addRawData(rawData);
     
   }
  } 
}

void addRawData(PVector rawData){
   averageData.add(rawData);
   nReadings ++;
   if(nReadings >= sampleRate){
     averageReadings();
   }
}

void averageReadings(){
   
   averageData.div(sampleRate);
   if(keyPressed){
     calibrate(averageData);
   }
   
   nReadings = 0;
//   println(averageData);
   mapToScreen();
}

void mapToScreen(){
   pos.x = map(averageData.x, minX, maxX, 0, width);
   pos.y = map(averageData.y, minY, maxY, 0, height);
   pos.x = constrain(pos.x, 0, width);
   pos.y = constrain(pos.y, 0, height);
//   println(pos);
}

void calibrate(PVector myData){
  //TOP LEFT
  if(key == 'q'){
    minX = myData.x;
    minY = myData.y;
    println("minX: " + minX + "minY: " + minY);
  }

  //BOTTOM RIGHT
  if(key == 's'){
    maxX = myData.x;
    maxY = myData.y;
    println("maxX: " + maxX + "maxY: " + maxY);
  }  
}
