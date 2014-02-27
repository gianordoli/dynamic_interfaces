#include <SPI.h>
#include <WiFly.h>

// Edit credentials.h to provide your own credentials
#include "Credentials.h"

// Using Pachube API V2
WiFlyClient client;

void setup() {
  // lots of time for the WiFly to start up and also in case I need to stop the transmit
  delay(10000);
  Serial.begin(115200);  // nice and fast
  Serial.println("Wifly begin");
  
  WiFly.begin();    // startup the WiFly
  
  Serial.println("Wifly join");
  
  // Join the WiFi network
  if (!WiFly.join(ssid, passphrase)) {
    Serial.println("Association failed.");
    while (1) {
      // Hang on failure.
    }
  }  

}

void loop() {
    if (client.connected()) {
      Serial.println("disconnecting.");
      client.stop();
      Serial.println("disconnected.");
    }
}


