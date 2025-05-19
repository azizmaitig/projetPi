# 🚗 ParkEase – Intelligent Parking System

ParkEase is an academic project . It provides a **smart, connected parking solution** that integrates **mobile and web applications**, **embedded systems**, **AI-based detection**, and **workflow automation** using **n8n** to enhance urban mobility and parking management.

## 📌 Project Overview

**ParkEase** is designed to:
- Reduce traffic congestion
- Automate the management of parking spaces
- Improve safety and user experience

It combines:
- Online reservation (via web & mobile)
- Real-time space detection using AI
- Embedded devices for access control and environment monitoring
- Automated workflows using n8n

---

## 🧠 Problem Statement

How can we create a **complete and intelligent parking management system** that:
- Allows remote reservation of parking spots
- Detects real-time availability
- Enhances safety (accident detection, secure access)
- Provides a smooth and secure user experience

---

## 🚀 Solution Features

- 📱 **Mobile App** (Flutter): Book, monitor, and receive notifications
- 🖥️ **Web Platform**: Admin dashboard for live monitoring and system management
- 📡 **Embedded System** (ESP32, sensors, servos): Real-time detection and access control
- 🤖 **AI Integration**: Video-based accident detection using YOLO/CNN
- 🔄 **Automation**: Workflow orchestration using **n8n** (e.g., automated email alerts, logging, admin notifications)

---

## ⚙️ Tech Stack

### 🧩 Mobile App
- **Framework**: ***********
- **Notifications**: *******
- **Auth**: ******
- **API Communication**: ******

### 🌐 Web Platform
- **Frontend**: React.js / Vue.js
- **Backend**: Node.js (Express.js)
- **Database**: Mysql
- **Auth**: ********
- 
### 🤖 Artificial Intelligence
- **Frameworks**: TensorFlow, PyTorch, OpenCV
- **Model**: YOLOv5, CNN
- **Detection**: Accidents, intrusions, abnormal behavior

### 🔌 Embedded System
- **Microcontrollers**: ESP32, ESP32-CAM
- **Sensors**: Ultrasonic, flame, motion, temperature (DHT11)
- **Actuators**: Servos for barrier control
- **Displays**: LCD, 7-segment
- **Communication**: Wi-Fi (HTTP/MQTT)

### ⚙️ Automation & Workflow
- **Tool**: [n8n] (Self-hosted automation platform)
- **Use Cases**:
  - Automated alerting (incident → admin notification)
  - Scheduled maintenance reminders
  - Integration with third-party services (email, messaging, logging)

---

## 📱 Mobile App Features

- 🔐 User registration & login
- 📅 Real-time reservation & availability
- 🔔 Push notifications for alerts
- 🗺️ Interactive map & status display
- 🧾 Reservation history

---

## 🖥️ Web Dashboard (Admin)

- 📊 Parking stats & live occupancy
- 🔍 AI incident alerts
- 👥 User & system management
- 📂 Incident logs & reservation history

---

## 📡 Embedded System Capabilities

- 🟢 Detection of car presence per space
- 🔐 QR code-based gate control
- 🌡️ Environmental monitoring (flame, motion, temperature)
- 📷 Real-time video for anomaly detection
- 💡 LED indicators & display outputs

---

## 🔄 System Architecture

- **Modular design** (frontend, backend, embedded, AI, automation)
- **MVC & RESTful APIs**
- **Real-time synchronization** via Firebase or MQTT
- **Workflow orchestration using n8n** to automate routine tasks and alert flows
- **Scrum methodology** with 5 sprints covering feature blocks:
  - Sprint 1: Auth & Reservation
  - Sprint 2: AI Detection
  - Sprint 3: Notification System
  - Sprint 4: Access Control (QR)
  - Sprint 5: Optimization, Testing & Documentation

---

## Getting Started

Clone the repository

git clone https://github.com/your-org/ParkEase.git

Set up backend

Install dependencies and configure .env for database and auth

Launch frontend (web and mobile)

Start the web dashboard (React/Vue)

Run the Flutter app on emulator or device

Deploy AI models

Ensure models are trained and placed under ai_module/

Flash embedded systems

Upload firmware to ESP32 microcontrollers

Launch n8n

Start n8n locally or via Docker with defined workflows

## Acknowledgments

👨‍🏫 Academic Mentors and Project Supervisors

🛠 Open-source tools and libraries used across AI, web, and embedded systems

🌍 Community contributions to frameworks like Flutter, TensorFlow, and n8n

## 🧪 Testing & Deployment

- ✅ Unit tests for web and mobile features
- 🧪 Real-time embedded testing on ESP32
- 🧠 AI model trained on synthetic video datasets
- 🌐 Web & mobile apps deployed on test environments
- 🔄 Automated processes integrated with n8n

---

## 📸 Screenshots & Demo

> (Add here demo links or screenshots in the `/docs` folder when available)

---
