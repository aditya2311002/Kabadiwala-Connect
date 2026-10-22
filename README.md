# Kabadiwala Connect - Bringing the Informal Collector into the Formal Recycling Chain

[![Deployed App](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kabadiwala-rouge.vercel.app/)
[![Demo Video](https://img.shields.io/badge/YouTube-Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/shorts/kG6QgOCADEs?si=6qk_K_8yX7r2qXm7)

##  Project Overview

**Kabadiwala Connect** is a vernacular, offline-first digital marketplace platform designed to integrate informal e-waste collectors (*Kabadiwalas*) into the formal recycling ecosystem[span_0](start_span)[span_0](end_span). By addressing challenges such as unfair price discovery, lack of transaction records, unsafe handling, and low digital literacy[span_1](start_span)[span_1](end_span), the platform provides transparent pricing, safety guidance, digital handover receipts, and AI-assisted classification[span_2](start_span)[span_2](end_span).

* **Competition**: Hack for Social Cause (MY Bharat)[span_3](start_span)[span_3](end_span)
* **Theme**: Clean and Green Technology / E-Waste Management & Circular Economy[span_4](start_span)[span_4](end_span)
* **Live Deployment**: [https://kabadiwala-rouge.vercel.app/](https://kabadiwala-rouge.vercel.app/)[span_5](start_span)[span_5](end_span)
* **Video Walkthrough**: [Watch Demo on YouTube](https://youtube.com/shorts/kG6QgOCADEs?si=6qk_K_8yX7r2qXm7)[span_6](start_span)[span_6](end_span)

---

## Key Features

* **Vernacular & Voice Interface**: Multilingual audio-visual guidance (Hindi, Marathi, English) designed for low-literacy users[span_7](start_span)[span_7](end_span).
* **Transparent Price Discovery**: Real-time market prices per kilogram for e-waste categories (PCBs, CRT monitors, batteries, wires)[span_8](start_span)[span_8](end_span).
* **Digital Lot Creation**: Snap photographs, categorize materials, and assign estimated weight and lot IDs[span_9](start_span)[span_9](end_span).
* **Offline-First Architecture**: Continuous local tracking and operation in low-connectivity areas, auto-synchronizing when connectivity returns[span_10](start_span)[span_10](end_span).
* **Safety & Hazard Guidance**: Audio and visual prompts for handling hazardous materials safely (CRTs, batteries)[span_11](start_span)[span_11](end_span).
* **Digital Handover & Traceability**: Verifiable handover logs with photo, GPS tag, timestamp, and unique lot ID[span_12](start_span)[span_12](end_span).

---

##   Tech Stack

| Domain | Technology / Tool |
| :--- | :--- |
| **Frontend Platform** | Web App / PWA (HTML5, Tailwind CSS, JavaScript) |
| **Mapping & Location** | Leaflet.js / OpenStreetMap, HTML5 Geolocation API |
| **Voice & Localization** | Web Speech API (Speech Synthesis / Voice Guidance) |
| **Hosting & Deployment** | Vercel Platform[span_13](start_span)[span_13](end_span) |
| **Data Storage & Sync** | Web LocalStorage (Offline Mode) + Database Integration |

---

##  Repository Structure

```text
├── index.html            # Main web application dashboard
├── css/                  # Styling & Tailwind configurations
├── js/                   # Core application logic & speech engines
├── assets/               # Visual icons, category imagery, & graphics
├── README.md             # Project documentation & overview
└── LICENSE               # Open-source license terms
```

##.Local Development Setup
1.
bash:
git clone [https://github.com/YOUR_GITHUB_USERNAME/kabadiwala-connect.git](https://github.com/YOUR_GITHUB_USERNAME/kabadiwala-connect.git)
cd kabadiwala-connect

2. Run Locally
Simply open index.html in any web browser, or start a local live server:
bash :
# Using Python simple server
python3 -m http.server 8000

Open http://localhost:8000 in your browser.

## Regulatory & Environmental Alignment
This project supports the framework outlined under:
MoEFCC – E-Waste Management Rules, 2022  
CPCB – Extended Producer Responsibility (EPR) Certificate Framework  
Digital India – Digital & Inclusive Infrastructure Initiatives

## Author
Aditya Kumar Yadav
GitHub: github.com/YOUR_GITHUB_USERNAME
LinkedIn: linkedin.com/in/YOUR_LINKEDIN_PROFILE
Created for the MY Bharat Hack for Social Cause initiative.
