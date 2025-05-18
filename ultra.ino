#include <WiFi.h>
#include <PubSubClient.h>

// --- Broches des capteurs ultrasons ---
#define TRIG_PIN1 22
#define ECHO_PIN1 35
#define TRIG_PIN2 23
#define ECHO_PIN2 34
#define TRIG_PIN3 25
#define ECHO_PIN3 33
#define TRIG_PIN4 18
#define ECHO_PIN4 32
#define TRIG_PIN5 19
#define ECHO_PIN5 16

// --- Broches des LEDs ---
#define RED_PIN1    12
#define GREEN_PIN1  13
#define RED_PIN2    27
#define GREEN_PIN2  26
#define RED_PIN3    15
#define GREEN_PIN3  4
#define RED_PIN4    17
#define GREEN_PIN4  14
#define RED_PIN5    21
#define GREEN_PIN5  5

// --- Informations de ton réseau Wi-Fi domestique ---
const char* ssid = "NAURA";         // 🔁 remplace par le nom de ton Wi-Fi
const char* password = "12345678"; // 🔁 remplace par ton mot de passe Wi-Fi

// --- MQTT ---
const char* mqttServer = "192.168.137.100";   // 🔁 remplace par l'IP locale de ton PC
const int mqttPort = 1883;
const char* mqttClientID = "UltrasonicESP32";

WiFiClient espClient;
PubSubClient client(espClient);

void setupWiFi() {
  Serial.print("Connexion au Wi-Fi : ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA); // Important !  
  WiFi.begin(ssid, password);

 

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnecté au Wi-Fi !");
  Serial.print("Adresse IP ESP32 : ");
  Serial.println(WiFi.localIP());
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connexion au broker MQTT...");
    if (client.connect(mqttClientID)) {
      Serial.println("Connecté !");
    } else {
      Serial.print("Échec, code : ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Initialisation ESP32...");

  setupWiFi();
  client.setServer(mqttServer, mqttPort);

  // Initialisation capteurs et LEDs
  pinMode(TRIG_PIN1, OUTPUT); pinMode(ECHO_PIN1, INPUT);
  pinMode(TRIG_PIN2, OUTPUT); pinMode(ECHO_PIN2, INPUT);
  pinMode(TRIG_PIN3, OUTPUT); pinMode(ECHO_PIN3, INPUT);
  pinMode(TRIG_PIN4, OUTPUT); pinMode(ECHO_PIN4, INPUT);
  pinMode(TRIG_PIN5, OUTPUT); pinMode(ECHO_PIN5, INPUT);

  pinMode(RED_PIN1, OUTPUT); pinMode(GREEN_PIN1, OUTPUT);
  pinMode(RED_PIN2, OUTPUT); pinMode(GREEN_PIN2, OUTPUT);
  pinMode(RED_PIN3, OUTPUT); pinMode(GREEN_PIN3, OUTPUT);
  pinMode(RED_PIN4, OUTPUT); pinMode(GREEN_PIN4, OUTPUT);
  pinMode(RED_PIN5, OUTPUT); pinMode(GREEN_PIN5, OUTPUT);
}

long mesurerDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duree = pulseIn(echoPin, HIGH, 30000);
  return (duree == 0) ? -1 : duree * 0.034 / 2;
}

void changerCouleurLED(long distance, int redPin, int greenPin) {
  if (distance > 5 || distance == -1) {
    digitalWrite(redPin, LOW);
    digitalWrite(greenPin, HIGH);
  } else {
    digitalWrite(redPin, HIGH);
    digitalWrite(greenPin, LOW);
  }
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  long d1 = mesurerDistance(TRIG_PIN1, ECHO_PIN1);
  long d2 = mesurerDistance(TRIG_PIN2, ECHO_PIN2);
  long d3 = mesurerDistance(TRIG_PIN3, ECHO_PIN3);
  long d4 = mesurerDistance(TRIG_PIN4, ECHO_PIN4);
  long d5 = mesurerDistance(TRIG_PIN5, ECHO_PIN5);

  changerCouleurLED(d1, RED_PIN1, GREEN_PIN1);
  changerCouleurLED(d2, RED_PIN2, GREEN_PIN2);
  changerCouleurLED(d3, RED_PIN3, GREEN_PIN3);
  changerCouleurLED(d4, RED_PIN4, GREEN_PIN4);
  changerCouleurLED(d5, RED_PIN5, GREEN_PIN5);

  client.publish("place/101", (d1 != -1 && d1 < 5) ? "1" : "0");
  client.publish("place/102", (d2 != -1 && d2 < 5) ? "1" : "0");
  client.publish("place/103", (d3 != -1 && d3 < 5) ? "1" : "0");
  client.publish("place/201", (d4 != -1 && d4 < 5) ? "1" : "0");
  client.publish("place/202", (d5 != -1 && d5 < 5) ? "1" : "0");

  Serial.println("Distances mesurées et publiées via MQTT.");
  delay(2000);
}
