# 📌 Device Fingerprinting – Research & Demo Website
[![Device Fingerprinting Demo Login](https://raw.githubusercontent.com/RIO6IX/Device-Fingerprinting-Website/main/Device-Fingerprinting%20Demo-Login.png)](https://github.com/RIO6IX/Device-Fingerprinting-Website/blob/main/Device-Fingerprinting%20Demo-Login.png)


**Author:** 🔗 [G. Chanuka Isuru Sampath](https://www.linkedin.com/in/chanuka-isuru-sampath)
**Repository:** https://github.com/RIO6IX/Device-Fingerprinting-Website

A complete web-based **Device Fingerprinting System** designed to detect abnormal devices, identify proxies/bots, prevent session hijacking, and strengthen login authentication.  
This repository includes a working demo website, source code, and a full research report.

---

## 📹 Demo Video  
Watch the full demonstration of the Device Fingerprinting Web System here:  
👉 **[Click to view the demo video](https://github.com/RIO6IX/Device-Fingerprinting-Website/blob/main/Device-Fringerprinting-Web-DEMO_CHANUKA.mp4)**

---

## 📄 Research Report  
Read the complete research and implementation details in the official PDF report:  
👉 **[Download the Research Report (PDF)](https://github.com/RIO6IX/Device-Fingerprinting-Website/blob/main/Device_Fingerprinting_Research%26Demo_CHANUKA.pdf)**

---

## 🧪 Key Features of the Demo

### 🔐 1. Login Device Fingerprinting
When the login page loads, the browser generates a fingerprint using:
- User-Agent  
- Screen resolution  
- Timezone  
- Canvas fingerprint hash  
- WebGL info  
- Browser features (cookies enabled, language, platform)  
- OS & device hints  

A SHA-256 fingerprint hash is sent with login credentials.

---

### 🛡️ 2. Session Binding
After authentication:
- The server binds: **user_id + session_id + fingerprint_id**  
- Every request must present the same fingerprint  
- If fingerprint changes → session is invalidated  
- Protects against cookie theft & session hijacking  

---

### 🚨 3. Abnormal Device Detection
The system blocks or flags logins when:
- Correct credentials but **different device fingerprint**  
- Same fingerprint attempts multiple accounts  
- Bots or proxies (Burp Suite, scripts) are detected  
- Suspicious timing patterns indicate automation  

---

### 👀 4. Dashboard
The dashboard displays:
- Fingerprint ID  
- IP address  
- Login time  
- Full device/browser payload (attributes used for fingerprinting)  

---

### 📝 5. Logs Page
Logs contain:
- Fingerprint mismatch alerts  
- Attacker IP address  
- Username attempted  
- Timestamp  

---

## 🏗️ How It Works (Technical Overview)

### Browser-Side Fingerprinting
JavaScript collects:
- Canvas render hash  
- WebGL GPU vendor & renderer  
- Screen metrics  
- Timezone  
- OS / Browser metadata  

### Network-Level Fingerprinting
Server compares:
- TLS/JA3 fingerprint  
- HTTP header order  
- User-Agent consistency  
- Proxy/VPN indicators  

Cross-matching both layers increases accuracy and identifies spoofing.

---

## 📈 Evaluation Results
- **Uniqueness:** ~80–85% fingerprint uniqueness  
- **Stability:** Remains consistent across sessions unless major device changes occur  
- **Security:** Prevents cookie theft, bot activity, proxy abuse  
- **Performance:** Fingerprint generation time: 1–2 seconds  

---

## ⚖️ Privacy & Compliance
- No PII collected  
- Only hashed fingerprint stored  
- Designed to follow GDPR guidelines  
- Used strictly for security, not tracking  

---

## 🚀 Future Improvements
- ML-based anomaly detection  
- Improved anti-evasion techniques  
- Mobile fingerprinting support  
- Scalable backend / caching  
- PCF (Privacy-preserving Client Fingerprinting) model  

---

## 👤 Author & Links
**G. Chanuka Isuru Sampath**  
- LinkedIn: https://www.linkedin.com/in/chanuka-isuru-sampath  
- GitHub: https://github.com/RIO6IX  
- Medium: https://medium.com/@chanuka1  
- Portfolio: https://rio6ix.github.io/chanuka  

---
