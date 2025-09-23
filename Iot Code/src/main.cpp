#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <MPU6050_light.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <time.h>

// ===== WiFi credentials =====
const char* WIFI_SSID = "vivo Y27";
const char* WIFI_PASSWORD = "mkmkmkmk";

// ===== Firebase credentials =====
#define API_KEY "AIzaSyBKlkfBqYONPO1N-mvi6S-VAxbOAiXncvo"
#define DATABASE_URL "https://fir-realtimeapp-3a162-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "pieceone2u@gmail.com"
#define USER_PASSWORD "12345@2310"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ===== Sensors =====
Adafruit_VL53L0X lox = Adafruit_VL53L0X();
MPU6050 mpu(Wire);

// ===== I2C pins =====
#define SDA_PIN D2
#define SCL_PIN D1

// ===== Timing =====
unsigned long lastRead = 0;
const unsigned long READ_INTERVAL = 500; // 500 ms
unsigned long lastStatusCheck = 0;
const unsigned long STATUS_CHECK_INTERVAL = 2000; // 2s

// ===== Dynamic User Management =====
String currentUserName = ""; // Will hold the name of the currently logged-in user
unsigned long lastUserCheck = 0;
const unsigned long USER_CHECK_INTERVAL = 30000; // Check for active user every 30 seconds

// ===== Session management =====
String currentStatus = "";
String previousStatus = "";
unsigned long sessionStartTime = 0;
int goodCount = 0;
int moderateCount = 0;
int badCount = 0;
float totalDistance = 0;
float totalPitch = 0;
float totalRoll = 0;
int readingCount = 0;

// Consecutive bad readings
int consecutiveBadCount = 0;
const int BAD_THRESHOLD = 10;

// ===== Calibration values =====
float calibDistance = 0;
float calibPitch = 0;
float calibRoll = 0;

// ===== NTP settings =====
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;  // IST
const int daylightOffset_sec = 0;

// ===== History save flag =====
bool historySaved = false;

// ===== FUNCTION PROTOTYPE =====
void getCalibrationValues(String userName);

// ===== Helpers =====
String getFormattedTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "00-00 00:00:00";
  char buffer[20];
  sprintf(buffer, "%02d-%02d %02d:%02d:%02d",
          timeinfo.tm_mon + 1, timeinfo.tm_mday,
          timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  return String(buffer);
}

String getISOTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) return "2025-01-01T00:00:00Z";
  char buffer[25];
  sprintf(buffer, "%04d-%02d-%02dT%02d:%02d:%02dZ",
          timeinfo.tm_year + 1900, timeinfo.tm_mon + 1, timeinfo.tm_mday,
          timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  return String(buffer);
}

// ===== WiFi & Firebase =====
void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");
}

void connectFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("✅ Firebase connected");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("⏱️ NTP time configured");
}

// ===== Get Active User =====
void getActiveUser() {
  Serial.println("🔎 Checking for active user...");
  if (Firebase.RTDB.getJSON(&fbdo, "/loginchecking")) {
    FirebaseJson *json = fbdo.jsonObjectPtr();
    String key, value;
    int type;
    String bestUser = "";
    double maxLoginTime = 0;

    size_t count = json->iteratorBegin();
    for (size_t i = 0; i < count; i++) {
      json->iteratorGet(i, type, key, value);
      FirebaseJson user_data;
      user_data.setJsonData(value);
      FirebaseJsonData login_time_data;
      if (user_data.get(login_time_data, "loginTime")) {
         if (login_time_data.type == "double" || login_time_data.type == "int") {
            double currentLoginTime = login_time_data.doubleValue;
            if (currentLoginTime > maxLoginTime) {
                maxLoginTime = currentLoginTime;
                bestUser = key;
            }
         }
      }
    }

    if (bestUser != "" && currentUserName != bestUser) {
        Serial.println("👤 New active user found: " + bestUser);
        currentUserName = bestUser;
        getCalibrationValues(currentUserName);
    } else if (bestUser != "") {
        Serial.println("👤 Active user remains: " + currentUserName);
    } 
    else {
      Serial.println("⚠️ No active user found in /loginchecking. Waiting...");
      currentUserName = "";
    }
  } else {
    Serial.println("❌ Failed to get /loginchecking: " + fbdo.errorReason());
  }
}

// ===== Save session history =====
void saveSessionHistory(String userName) {
  if (readingCount == 0 || userName == "") return;
  float avgDistance = totalDistance / readingCount;
  float avgPitch = totalPitch / readingCount;
  float avgRoll = totalRoll / readingCount;
  unsigned long sessionDuration = (millis() - sessionStartTime) / 1000;
  String historyPath = "/history/" + userName;
  FirebaseJson json;
  json.set("averageDistance", avgDistance);
  json.set("averagePitch", avgPitch);
  json.set("averageRoll", avgRoll);
  json.set("goodCount", goodCount);
  json.set("moderateCount", moderateCount);
  json.set("badCount", badCount);
  json.set("durationSeconds", sessionDuration);
  json.set("sessionEndTime", getISOTimestamp());
  if (Firebase.RTDB.pushJSON(&fbdo, historyPath.c_str(), &json)) {
    Serial.println("✅ Session history saved for " + userName);
    historySaved = true;
  } else {
    Serial.println("❌ Failed to save session history: " + fbdo.errorReason());
  }
}

// ===== Get calibration =====
void getCalibrationValues(String userName) {
  if (userName == "") return;
  String calibPath = "/calibration/" + userName;
  if (Firebase.RTDB.getJSON(&fbdo, calibPath.c_str())) {
    FirebaseJson *json = fbdo.jsonObjectPtr();
    FirebaseJsonData result;
    if (json->get(result, "distance")) calibDistance = result.doubleValue;
    if (json->get(result, "pitch")) calibPitch = result.doubleValue;
    if (json->get(result, "roll")) calibRoll = result.doubleValue;
    Serial.println("✅ Calibration loaded for " + userName + ": " + String(calibDistance) + "cm");
  } else {
    Serial.println("❌ No calibration found for " + userName + ", using default values.");
    calibDistance = 4;
    calibPitch = 1.5;
    calibRoll = -77.0;
  }
}

// ===== Handle calibration request =====
void checkCalibration(String userName) {
  if (userName == "") return;
  String requestPath = "/calibrationRequest/" + userName + "/request";
  bool calibrationRequested = false;
  if (Firebase.RTDB.getBool(&fbdo, requestPath)) calibrationRequested = fbdo.boolData();
  else return;

  if (calibrationRequested) {
    Serial.println("🔧 Calibration requested for " + userName);
    VL53L0X_RangingMeasurementData_t measure;
    lox.rangingTest(&measure, false);
    long distance = -1;
    if (measure.RangeStatus != 4) distance = measure.RangeMilliMeter / 10;
    mpu.update();
    float pitch = mpu.getAngleX();
    float roll  = mpu.getAngleY();
    String posture = "good";
    if (distance == -1 || distance > calibDistance + 10) posture = "bad";
    else if (distance > calibDistance + 5) posture = "moderate";
    String timestamp = getFormattedTimestamp();
    String calibPath = "/calibration/" + userName;
    FirebaseJson json;
    json.set("distance", distance);
    json.set("pitch", pitch);
    json.set("roll", roll);
    json.set("posture", posture);
    json.set("timestamp", timestamp);
    Firebase.RTDB.setJSON(&fbdo, calibPath.c_str(), &json);
    calibDistance = distance;
    calibPitch = pitch;
    calibRoll = roll;
    Firebase.RTDB.setBool(&fbdo, requestPath.c_str(), false);
  }
}

// ===== Determine posture =====
String determinePosture(long distance) {
  if (distance == -1) return "bad";
  long diff = abs(distance - calibDistance);
  if (diff > 10) return "bad";
  else if (diff > 5) return "moderate";
  return "good";
}


// ===== Send notification =====
void sendNotification(String userName, String message) {
  if (userName == "") return;
  String notifyPath = "/notifications/" + userName;
  FirebaseJson notify;
  notify.set("message", message);
  notify.set("timestamp", getFormattedTimestamp());
  notify.set("read", false);
  Firebase.RTDB.pushJSON(&fbdo, notifyPath.c_str(), &notify);
}

// ===== Check sensor status =====
void checkSensorStatus(String userName) {
  if (userName == "") return;
  String statusPath = "/sensorStatus/" + userName + "/status";
  if (Firebase.RTDB.getString(&fbdo, statusPath.c_str())) {
    String newStatus = fbdo.stringData();
    if (newStatus != previousStatus) {
      Serial.println("🔄 Status changed for " + userName + ": " + previousStatus + " → " + newStatus);
      if (newStatus == "active") {
        sessionStartTime = millis();
        goodCount = moderateCount = badCount = 0;
        totalDistance = totalPitch = totalRoll = 0;
        readingCount = 0;
        consecutiveBadCount = 0;
        historySaved = false;
        Firebase.RTDB.setString(&fbdo, ("/sensorStatus/" + userName + "/startTime").c_str(), getISOTimestamp());
      }
      else if (previousStatus == "active" && newStatus == "completed") {
        if (!historySaved) saveSessionHistory(userName);
      }
      previousStatus = newStatus;
      currentStatus = newStatus;
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  connectWiFi();
  connectFirebase();
  Wire.begin(SDA_PIN, SCL_PIN);

  if (!lox.begin()) { Serial.println(F("❌ VL53L0X not found")); while(1); }
  lox.configSensor(Adafruit_VL53L0X::VL53L0X_SENSE_LONG_RANGE);
  
  byte status = mpu.begin();
  if (status != 0) { Serial.println(F("❌ MPU6050 failed")); while(1); }
  
  Serial.println("⏳ Calibrating MPU6050... Keep it flat and still!");
  mpu.calcOffsets();
  Serial.println("✅ Calibration done!");

  // ===== CORRECTED FUNCTION NAME =====
  // Lower value = less drift, more stable. Default is 0.98.
  mpu.setFilterGyroCoef(0.92);

  // Get the initial user on startup
  getActiveUser();
}

void loop() {
  unsigned long now = millis();

  // Periodically check who is the active user
  if (now - lastUserCheck >= USER_CHECK_INTERVAL) {
    lastUserCheck = now;
    getActiveUser();
  }
  
  if (currentUserName == "") {
    delay(1000);
    return;
  }

  // ===== Check for status updates and calibration requests =====
  if (now - lastStatusCheck >= STATUS_CHECK_INTERVAL) {
    lastStatusCheck = now;
    checkSensorStatus(currentUserName);
    checkCalibration(currentUserName);
  }

  // ===== Read sensors only if session is active =====
  if (currentStatus == "active" && now - lastRead >= READ_INTERVAL) {
    lastRead = now;

    VL53L0X_RangingMeasurementData_t measure;
    lox.rangingTest(&measure, false);
    long distance = -1;
    if (measure.RangeStatus != 4) distance = measure.RangeMilliMeter / 10;

    mpu.update();
    float pitch = mpu.getAngleX();
    float roll  = mpu.getAngleY();

    String posture = determinePosture(distance);

    // ===== Update counters =====
    readingCount++;
    if (posture == "good") {
      goodCount++;
      consecutiveBadCount = 0;
    } else if (posture == "moderate") {
      moderateCount++;
      consecutiveBadCount = 0;
    } else { // bad
      badCount++;
      consecutiveBadCount++;

      if (consecutiveBadCount % BAD_THRESHOLD == 0) {
        sendNotification(currentUserName, "⚠️ Bad posture detected! Please adjust your position.");
      }
    }

    // Accumulate totals
    if (distance != -1) {
      totalDistance += distance;
      totalPitch += pitch;
      totalRoll += roll;
    }

    Serial.printf("User: %s | Distance: %ld cm | Pitch: %.2f | Roll: %.2f | Posture: %s\n",
                  currentUserName.c_str(), distance, pitch, roll, posture.c_str());

    String timestamp = getFormattedTimestamp();

    // ===== Upload posture reading =====
    String path = "/posture/" + currentUserName;
    FirebaseJson json;
    json.set("distance", distance);
    json.set("pitch", pitch);
    json.set("roll", roll);
    json.set("posture", posture);
    json.set("timestamp", timestamp);
    Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json);

    // ===== Update session time =====
    unsigned long elapsedTime = (millis() - sessionStartTime) / 1000;
    Firebase.RTDB.setInt(&fbdo, ("/sensorStatus/" + currentUserName + "/sessionTime").c_str(), elapsedTime);
  }
}