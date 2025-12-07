# 📌 Device Fingerprinting – Research & Demo Website

**Author:** G. Chanuka Isuru Sampath  
**Repository:** https://github.com/RIO6IX/Device-Fingerprinting-Website

A complete web-based **Device Fingerprinting System** designed to detect abnormal devices, identify proxies/bots, prevent session hijacking, and strengthen login authentication.  
This repository includes a working demo website and a full research report.

---

## 📹 Demo Video  
👉 *(Add your demo video link here)*  
Upload to YouTube or GitHub Releases and paste the link above.

---

## 📄 Research Report  
**Device Fingerprinting Research & Demo v1 (PDF)**  
File included in this repo:  
`Device_Fingerprinting_Research&Demo_CHANUKA.pdf`

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
- Prevents cookie theft & session hijacking

---

### 🚨 3. Abnormal Device Detection
The system blocks logins when:
- Correct credentials but **different fingerprint**  
- Same fingerprint attempts multiple accounts  
- Bots or proxies (Burp Suite, scripts) trigger signature alerts  
- Suspicious timing patterns indicate automation  

---

### 👀 4. Dashboard
Shows:
- Fingerprint ID  
- IP address  
- Login time  
- Collected payload (device/browser attributes)  

---

### 📝 5. Logs Page
Tracks:
- Fingerprint mismatch alerts  
- IP address of attacker  
- Username attempted  
- Timestamp  

---

## 🏗️ How It Works (Technical Overview)

### Browser-Side Fingerprinting
Uses JavaScript to gather:
- Canvas render hash  
- WebGL GPU vendor & renderer  
- Screen metrics  
- Timezone  
- OS & browser metadata  

### Network-Level Fingerprinting
Server compares:
- TLS/JA3 fingerprint  
- Header order  
- User-Agent consistency  
- Proxy indicators  

Cross-matching both layers improves detection accuracy.

---

## 📈 Evaluation Results
- **Uniqueness:** ~80–85% fingerprint uniqueness  
- **Stability:** Remains consistent across sessions unless system changes  
- **Security:** Blocks cookie theft, bot activity, proxy abuse  
- **Performance:** Fingerprint generation takes 1–2 seconds  

---

## ⚖️ Privacy & Compliance
- No PII collected  
- Fingerprints are hashed  
- Follows GDPR recommendations  
- Used only for security, not tracking  

---

## 🚀 Future Improvements
- ML-based anomaly detection  
- Better evasion resistance  
- Mobile fingerprinting support  
- Scalable database and caching  
- PCF (Privacy-preserving Client Fingerprinting) implementation  

---

## 👤 Author & Links
**Chanuka Isuru Sampath**  
- LinkedIn: https://www.linkedin.com/in/chanuka-isuru-sampath  
- GitHub: https://github.com/RIO6IX  
- Medium: https://medium.com/@chanuka1  
- Portfolio: https://rio6ix.github.io/chanuka  

---

