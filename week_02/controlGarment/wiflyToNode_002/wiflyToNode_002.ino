#include <SPI.h>
#include <WiFly.h>
#include <CapacitiveSensor.h>

//
CapacitiveSensor   cs_4_2 = CapacitiveSensor(4,2);        // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor   cs_4_6 = CapacitiveSensor(4,6);        // 10M resistor between pins 4 & 6, pin 6 is sensor pin, add a wire and or foil
CapacitiveSensor   cs_4_8 = CapacitiveSensor(4,8);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil
CapacitiveSensor   cs_4_10 = CapacitiveSensor(4,10);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil
//

char* ssid = "AP0N"; //enter your SSID here, replace all spaces with $ (ex. "my ssid lol" = "my$ssid$lol")
char* pass = ""; //enter your wifi passphrase here

char* serverAddress = "192.168.1.110"; //enter the IP of your node.js server
int serverPort = 8000; //enter the port your node.js server is running on, by default it is 1337

WiFlyClient client;

void setup() {
  Serial.begin(9600);
  cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
  WiFly.setUart(&Serial);
  WiFly.begin();
  WiFly.join(ssid, pass, true);
  client.connect(serverAddress,serverPort);
}

void loop() {
  
  long start = millis();
  long total1 =  cs_4_2.capacitiveSensor(30);
  long total2 =  cs_4_6.capacitiveSensor(30);
//  long total3 =  cs_4_8.capacitiveSensor(30);
//  long total4 =  cs_4_10.capacitiveSensor(30);   
  Serial.print(total1 - total2);
  Serial.print("\t");
  Serial.println();

  delay(100);
}
