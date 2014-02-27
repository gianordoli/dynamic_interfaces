#include <CapacitiveSensor.h>

/*
 * CapitiveSense Library Demo Sketch
 * Paul Badger 2008
 * Uses a high value resistor e.g. 10M between send pin and receive pin
 * Resistor effects sensitivity, experiment with values, 50K - 50M. Larger resistor values yield larger sensor values.
 * Receive pin is the sensor pin - try different amounts of foil/metal on this pin
 */

//should be used with the read_serial_processing sketch
//sending only one axys

CapacitiveSensor   cs_4_2 = CapacitiveSensor(4,2);        // 10M resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor   cs_4_6 = CapacitiveSensor(4,6);        // 10M resistor between pins 4 & 6, pin 6 is sensor pin, add a wire and or foil
//CapacitiveSensor   cs_4_8 = CapacitiveSensor(4,8);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil
//CapacitiveSensor   cs_4_10 = CapacitiveSensor(4,10);        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and or foil

void setup()                    
{
   cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
   Serial.begin(9600);
}

void loop()                    
{
    long start = millis();
    long total1 =  cs_4_2.capacitiveSensor(30);
    long total2 =  cs_4_6.capacitiveSensor(30);
//    long total3 =  cs_4_8.capacitiveSensor(30);
//    long total4 =  cs_4_10.capacitiveSensor(30);    

//    Serial.print(millis() - start);        // check on performance in milliseconds
//    Serial.print("\t");                    // tab character for debug windown spacing

//    Serial.print("t1: ");
//    Serial.print(total1);
//    Serial.print("\t");
////
//    Serial.print("t2: ");
//    Serial.print(total2);
//    Serial.print("\t");

//    Serial.print("X: ");
    Serial.print(total1 - total2);
//    Serial.print("\t");

//    Serial.print("t3: ");
//    Serial.print(total3);
//    Serial.print("\t");
//
//    Serial.print("t4: ");
//    Serial.print(total4);
//    Serial.print("\t");

//    Serial.print("Y: ");
//    Serial.print(total4 - total3);
//    Serial.print("\t");

    Serial.println();    // print sensor output 3    

    delay(10);                             // arbitrary delay to limit data to serial port 
}
