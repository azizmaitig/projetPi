#include <WiFi.h>
#include <ESP32Servo.h>
#include <esp_now.h>

// === WIFI ===
const char *ssid = "NAURA";
const char *password = "12345678";
WiFiServer server(80);

// === Servomoteur ===
Servo myServo;

// === Broches ===
int ledPin = 14;          // LED générale
int ledVerte = 27;        // LED verte
int ledRouge = 26;        // LED rouge

// === ESP-NOW ===
typedef struct struct_message {
  int place_change;
} struct_message;

int places_occupees = 0;
const int total_places = 5;

// === Afficheur 7 segments ===
const int segmentPins[7] = { 2, 4, 5, 18, 19, 16, 17 };
const byte digits[10][7] = {
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}, // 1
  {1,1,0,1,1,0,1}, // 2
  {1,1,1,1,0,0,1}, // 3
  {0,1,1,0,0,1,1}, // 4
  {1,0,1,1,0,1,1}, // 5
  {1,0,1,1,1,1,1}, // 6
  {1,1,1,0,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,0,1,1}  // 9
};

void setup() {
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  pinMode(ledVerte, OUTPUT);
  pinMode(ledRouge, OUTPUT);
  digitalWrite(ledPin, LOW);
  digitalWrite(ledVerte, LOW);
  digitalWrite(ledRouge, HIGH); // LED rouge ON par défaut

  myServo.attach(13);
  myServo.write(0); // Barrière fermée

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP address: ");
  Serial.println(WiFi.localIP());

  if (esp_now_init() != ESP_OK) {
    Serial.println("Erreur init ESP-NOW");
    return;
  }

  esp_now_register_recv_cb(onReceiveData);
  server.begin();

  for (int i = 0; i < 7; i++) {
    pinMode(segmentPins[i], OUTPUT);
    digitalWrite(segmentPins[i], LOW);
  }

  afficherChiffre(total_places - places_occupees);
}

void loop() {
  WiFiClient client = server.available();

  if (client) {
    Serial.println("New Client.");
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        if (c == '\n') {
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.print("Click <a href=\"/open\">Ouvrir Barrière</a><br>");
            client.println();
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }

        if (currentLine.endsWith("GET /open")) {
          ouvrirBarriereAvecCountdown();
        }
      }
    }
    client.stop();
    Serial.println("Client Disconnected.");
  }
}

void onReceiveData(const esp_now_recv_info_t *recvInfo, const uint8_t *incomingData, int len) {
  struct_message receivedData;
  memcpy(&receivedData, incomingData, sizeof(receivedData));

  places_occupees += receivedData.place_change;
  if (places_occupees < 0) places_occupees = 0;
  if (places_occupees > total_places) places_occupees = total_places;

  Serial.print("Places occupees: ");
  Serial.println(places_occupees);
  afficherChiffre(total_places - places_occupees);
}

void afficherChiffre(int n) {
  if (n < 0 || n > 9) return;
  for (int i = 0; i < 7; i++) {
    digitalWrite(segmentPins[i], digits[n][i]);
  }
}

void ouvrirBarriereAvecCountdown() {
  Serial.println("Ouverture avec countdown...");

  myServo.write(90); // Ouvrir barrière
  digitalWrite(ledRouge, LOW); // Éteindre LED rouge
  digitalWrite(ledVerte, HIGH); // Allumer LED verte

  for (int i = 10; i >= 0; i--) {
    afficherChiffre(i % 10);
    delay(1000);
  }

  myServo.write(0); // Fermer barrière
  digitalWrite(ledVerte, LOW); // Éteindre LED verte
  digitalWrite(ledRouge, HIGH); // Allumer LED rouge

  delay(5000); // Laisser la LED rouge 5 secondes
}

void ouvrirBarriere() {
  myServo.write(90);
  delay(3000);
  myServo.write(0);
}