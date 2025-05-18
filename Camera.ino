#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "aziz";
const char* password = "244466666";





// IP de ton PC avec Flask
const char* serverUrl = "http://192.168.42.22:5000/upload";


void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = 5;
  config.pin_d1 = 18;
  config.pin_d2 = 19;
  config.pin_d3 = 21;
  config.pin_d4 = 36;
  config.pin_d5 = 39;
  config.pin_d6 = 34;
  config.pin_d7 = 35;
  config.pin_xclk = 0;
  config.pin_pclk = 22;
  config.pin_vsync = 25;
  config.pin_href = 23;
  config.pin_sscb_sda = 26;
  config.pin_sscb_scl = 27;
  config.pin_pwdn = 32;
  config.pin_reset = -1;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // Init caméra
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Erreur initialisation caméra : 0x%x", err);
    return;
  }
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connexion Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connecté !");
}

void sendPhoto() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Erreur de capture");
    return;
  }

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "image/jpeg");
    int httpResponseCode = http.POST(fb->buf, fb->len);

    Serial.printf("Photo envoyée, réponse : %d\n", httpResponseCode);
    http.end();
  } else {
    Serial.println("Wi-Fi non connecté !");
  }

  esp_camera_fb_return(fb); // Libère la mémoire
}

void setup() {
  Serial.begin(115200);
  connectWiFi();
  setupCamera();
}

void loop() {
  sendPhoto();         // Prendre et envoyer la photo
  delay(10000);        // Attendre 10 secondes
}