import processing.serial.*;

Serial myPort;  // The serial port

PVector pos;
PVector dir;
PVector averageData;

int nReadings;
ArrayList<PVector> allReadings;

void setup() {
  size(800, 600);
  
//  allReadings
  
  averageData = new PVector();
  pos = new PVector(0, 0);
  dir = new PVector(0, 0);
  
  // List all the available serial ports
  println(Serial.list());
  // Open the port you are using at the rate you want:
  myPort = new Serial(this, Serial.list()[Serial.list().length - 1], 9600);
  myPort.bufferUntil('\n');
}

void draw() {
  background(0);
//  pos.x += dir.x * 10;
//  pos.y += dir.y * 10;
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
     println("raw: " + rawData);     
     addRawData(rawData);
   }
  } 
}


void addRawData(PVector rawData){
   averageData.add(rawData);
   nReadings ++;
   if(nReadings >= 5){
     averageReadings();
   }
}

void averageReadings(){
   
   averageData.div(nReadings);
   nReadings = 0;
   println(averageData);
   mapToScreen();
}

void mapToScreen(){
   PVector tempPos = new PVector();
//   tempPos.x = map(averageData.x, 40, -10, 0, width);
//   tempPos.y = map(averageData.y, -80, 20, 0, height);
//   tempPos.x = constrain(pos.x, 0, width);
//   tempPos.y = constrain(pos.y, 0, height);
//   println(tempPos);
   
//   getDirection(tempPos);

   pos.x = map(averageData.x, 40, -10, 0, width);
   pos.y = map(averageData.y, -80, 20, 0, height);
   pos.x = constrain(pos.x, 0, width);
   pos.y = constrain(pos.y, 0, height);
   println(pos);
}

void getDirection(PVector tempPos){
  dir.x = tempPos.x - pos.x;
  dir.y = tempPos.y - pos.y;
  dir.normalize();
}

//void mouseReleased(){
//  PVector tempPos = new PVector(mouseX, mouseY);
//  getDirection(tempPos);
//}
