#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// ======= Wi-Fi du PC (partage de connexion) =======
const char* ssid = "NAURA";            // Remplace par ton SSID
const char* password = "12345678";    // Remplace par ton mot de passe

// ======= Adresse IP du PC (serveur MQTT) =======
const char* mqttServer = "192.168.137.100";     // IP de ton PC (passerelle)
const int mqttPort = 1883;
const char* mqttClientID = "ESP32Client";

// MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// ======= Capteurs et actionneurs =======
#define DHTPIN 17
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Mouvement
const int pinPIR1 = 25;
const int pinPIR2 = 26;
const int buzzerMouvement = 27;
const int ledPIR1 = 14;
const int ledPIR2 = 13;

// Flamme
const int DO_PIN_FLAMME = 5;
const int buzzerFlamme = 33;

// Température
const int buzzerTemp = 15;

// Lumière
const int ldrPin = 34;

void setup() {
  Serial.begin(115200);

  // Connexion au Wi-Fi en mode STATION
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("🔌 Connexion au WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("✅ Connecté !");
  Serial.print("Adresse IP locale ESP32 : ");
  Serial.println(WiFi.localIP());

  // MQTT
  client.setServer(mqttServer, mqttPort);

  // Initialisation capteurs
  dht.begin();
  pinMode(pinPIR1, INPUT);
  pinMode(pinPIR2, INPUT);
  pinMode(DO_PIN_FLAMME, INPUT);
  pinMode(ldrPin, INPUT);

  // Initialisation LED
  pinMode(ledPIR1, OUTPUT);
  pinMode(ledPIR2, OUTPUT);

  // Initialisation buzzers
  pinMode(buzzerMouvement, OUTPUT);
  pinMode(buzzerFlamme, OUTPUT);
  pinMode(buzzerTemp, OUTPUT);

  // Éteindre tous les éléments au départ
  digitalWrite(ledPIR1, LOW);
  digitalWrite(ledPIR2, LOW);
  digitalWrite(buzzerMouvement, LOW);
  digitalWrite(buzzerFlamme, LOW);
  digitalWrite(buzzerTemp, LOW);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔌 Connexion MQTT...");
    if (client.connect(mqttClientID)) {
      Serial.println("✅ Connecté !");
    } else {
      Serial.print("⛔ Échec (code ");
      Serial.print(client.state());
      Serial.println("), nouvel essai dans 2s...");
      delay(2000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int mouvement1 = digitalRead(pinPIR1);
  int mouvement2 = digitalRead(pinPIR2);
  int flamme = digitalRead(DO_PIN_FLAMME);
  float temperature = dht.readTemperature();
  int lumiere = analogRead(ldrPin);

  digitalWrite(ledPIR1, mouvement1);
  digitalWrite(ledPIR2, mouvement2);
  digitalWrite(buzzerMouvement, (mouvement1 || mouvement2) ? HIGH : LOW);
  digitalWrite(buzzerFlamme, (flamme == LOW) ? HIGH : LOW);
  digitalWrite(buzzerTemp, (!isnan(temperature) && temperature > 30) ? HIGH : LOW);

  Serial.print("PIR1: "); Serial.print(mouvement1);
  Serial.print(" | PIR2: "); Serial.print(mouvement2);
  Serial.print(" | Flamme: "); Serial.print(flamme == LOW ? "🔥 OUI" : "❌ NON");
  Serial.print(" | Température: ");
  if (isnan(temperature)) Serial.print("Erreur");
  else Serial.print(temperature);
  Serial.print("°C | Lumière: "); Serial.println(lumiere);

  client.publish("capteur/mouvement1", String(mouvement1).c_str());
  client.publish("capteur/mouvement2", String(mouvement2).c_str());
  client.publish("capteur/flamme", String(flamme).c_str());
  if (!isnan(temperature))
    client.publish("capteur/temperature", String(temperature).c_str());
  client.publish("capteur/lumiere", String(lumiere).c_str());

  delay(3000);
}
