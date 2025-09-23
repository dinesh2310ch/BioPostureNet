# BioPostureNet - IoT-Based Smart Posture Monitoring System

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status: In Progress](https://img.shields.io/badge/status-in%20progress-blue.svg)

BioPostureNet is a smart, non-intrusive IoT system designed to combat the negative health effects of poor sitting posture. By providing real-time feedback and historical data, it empowers users to develop healthier habits and prevent chronic back pain.

## ✨ Key Features

-   **Live Posture Monitoring:** Get instant feedback on your sitting posture (e.g., "Good", "Bad").
-   **Real-time Sensor Data:** View a live stream of sensor data, including distance, pitch, and roll.
-   **Instant Alerts:** Receive notifications on your phone when poor posture is detected for a prolonged period.
-   **Session History & Analytics:** Track your posture over time with detailed session summaries and performance graphs.
-   **Goal Setting:** Set and track personal goals to encourage consistent improvement.
-   **User Customization:** Includes user authentication, profiles, and settings like Dark Mode.

## ⚙️ How It Works

The system architecture is composed of two main parts that work together seamlessly:

1.  **IoT Sensor Unit:** A compact device mounted on the user's chair contains an **ESP8266**, **MPU6050** (gyroscope/accelerometer), and a **VL53L0X** (distance) sensor. It measures the user's back angle and position, sending the data over Wi-Fi.
2.  **Mobile Application:** A cross-platform mobile app receives the data from Firebase in real-time. It visualizes the user's posture, sends alerts, and stores historical data for analysis.

**Data Flow:** `IoT Device` -> `Wi-Fi` -> `Firebase Realtime Database` -> `Mobile App`

## 🛠️ Technology Stack

| Component         | Technology / Hardware                               |
| :---------------- | :-------------------------------------------------- |
| **IoT Device**    | C++ / Arduino Core, ESP8266, MPU6050, VL53L0X       |
| **Mobile App**    | React, Capacitor, JavaScript, HTML/CSS              |
| **Database**      | Firebase Realtime Database                          |
| **Authentication**| Firebase Authentication                             |

## 📂 Repository Structure

This is a monorepo containing the code for both the IoT device and the mobile application.

BioPostureNet-Project/
├── app/          \# Source code for the React + Capacitor mobile app
└── iot/          \# Source code for the ESP8266 firmware (Arduino)

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/)
-   A Firebase project with Realtime Database and Authentication enabled.

### 1. IoT Device Setup

1.  Navigate to the `iot` directory:

    cd iot

2.  Create a `secrets.h` file in the `iot/` directory. You can copy `secrets.h.example` to get started.

    // secrets.h
    #define WIFI_SSID "YOUR_WIFI_SSID"
    #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
    #define API_KEY "YOUR_FIREBASE_API_KEY"
    #define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"
    #define USER_EMAIL "YOUR_FIREBASE_AUTH_EMAIL"
    #define USER_PASSWORD "YOUR_FIREBASE_AUTH_PASSWORD"

3.  Open the `.ino` file in the Arduino IDE, install the required libraries (e.g., Adafruit MPU6050, Firebase ESP8266 Client), and flash the firmware to your ESP8266.

### 2. Mobile App Setup

1.  Navigate to the `app` directory:

    cd app

2.  Create a `.env` file in the `app/` directory by copying the example.
    ```env
    # .env
    # Copy your web app's Firebase configuration here
    REACT_APP_FIREBASE_API_KEY="AIza..."
    REACT_APP_FIREBASE_AUTH_DOMAIN="..."
    REACT_APP_FIREBASE_DATABASE_URL="..."
    REACT_APP_FIREBASE_PROJECT_ID="..."
    REACT_APP_FIREBASE_STORAGE_BUCKET="..."
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="..."
    REACT_APP_FIREBASE_APP_ID="..."

3.  Install the required dependencies:

    npm install

4.  Run the app in your browser for testing:

    npm start

5.  To build and run on a mobile device, use the Capacitor CLI:

    # Sync your web code with the native platforms
    npx cap sync

    # Open the native IDE (Android Studio or Xcode)
    npx cap open android
    npx cap open ios


## 📱 App Screenshots
<img width="1200" height="630" alt="kl1" src="https://github.com/user-attachments/assets/0a1aa708-c56d-4126-b1fd-45e420fbd695" />
<img width="1211" height="837" alt="kl2" src="https://github.com/user-attachments/assets/b0ec2c6a-7591-4a01-a73e-7903656ead26" />
<img width="1206" height="645" alt="kl3" src="https://github.com/user-attachments/assets/90505c17-e28d-4204-8efd-d9249d24877d" />
<img width="1021" height="847" alt="kl4" src="https://github.com/user-attachments/assets/ac3d07c0-d930-4706-b4d6-8abf2014f746" />


## 🔮 Future Scope

-   **AI/ML Integration:** Develop a model to analyze historical posture data and predict the user's risk of developing back pain.
-   **Gamification:** Introduce a points and rewards system to encourage user engagement and consistent good posture.
-   **Multi-Sensor Support:** Allow for a network of sensors (e.g., on the seat) for more comprehensive posture analysis.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

