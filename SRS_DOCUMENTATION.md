# Software Requirements Specification (SRS)
## Project Name: Yash Gayake - Robotics & Software Engineering Portfolio with Interactive 3D Avatar, AI Grounded Chatbot, and Student Academy

**Author / Developer:** Yash Gayake  
**Email:** yashgayake900@gmail.com  
**Version:** 2.0.0  
**Date:** September 2026  
**Document Status:** Approved & Final Implementation  

---

## Table of Contents
1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience
   - 1.4 Product Scope & Overview
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective & System Architecture
   - 2.2 User Classes and Characteristics
   - 2.3 Operating Environment & Technical Stack
   - 2.4 Design and Implementation Constraints
   - 2.5 Assumptions and Dependencies
3. [System Features & Functional Requirements](#3-system-features--functional-requirements)
   - 3.1 Dual-View Architecture (Portfolio First & Student Academy)
   - 3.2 Real-Time 3D Interactive WebGL Avatar (Three.js)
   - 3.3 Autonomous Speech, Gestures & Voice Narration
   - 3.4 AI Assistant Chatbot (Gemini Grounded Intelligence)
   - 3.5 Projects Showcase with Filtering & Live Metrics
   - 3.6 Skills, Tech Stack & Experience Timeline
   - 3.7 Student Academy (Courses, YouTube Modules, Notes Download)
   - 3.8 Contact Form, Direct Messaging & Telemetry
   - 3.9 Resume Preview & PDF Generation
   - 3.10 Admin Dashboard & Live Content Management
4. [External Interface Requirements](#4-external-interface-requirements)
   - 4.1 User Interfaces (UI/UX Principles)
   - 4.2 Hardware Interfaces
   - 4.3 Software Interfaces
   - 4.4 Communications Interfaces (REST / SSE / WebSockets)
5. [Non-Functional Requirements (NFR)](#5-non-functional-requirements-nfr)
   - 5.1 Performance Requirements
   - 5.2 Safety & Reliability
   - 5.3 Security Requirements
   - 5.4 Software Quality Attributes (Maintainability, Usability, Portability)
6. [Data Model & Firestore Blueprint](#6-data-model--firestore-blueprint)
7. [Comprehensive Project Report](#7-comprehensive-project-report)
   - 7.1 Problem Statement
   - 7.2 Proposed Solution & Innovations
   - 7.3 Key Engineering Milestones Accomplished
   - 7.4 Verification & Validation Results
8. [Future Enhancements & Roadmap](#8-future-enhancements--roadmap)
   - 8.1 Short-Term Enhancements (v2.1 - v2.3)
   - 8.2 Medium-Term Enhancements (v3.0)
   - 8.3 Long-Term Futuristic Roadmap (v4.0+)
9. [Conclusion & Sign-off](#9-conclusion--sign-off)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document details the complete functional and non-functional specifications, software architecture, technical implementation details, project execution report, and future enhancement roadmap for the **Yash Gayake Next-Gen Web Application**. This system functions simultaneously as a high-performance **Engineering Portfolio**, an **Interactive 3D Autonomous Avatar Agent**, a **Gemini AI Grounded Chatbot**, and an educational **Student Academy Platform**.

### 1.2 Document Conventions
- **IEEE Std 830-1998**: Formatted in strict compliance with the IEEE Recommended Practice for Software Requirements Specifications.
- **RFC 2119 Keywords**: MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, MAY are used to denote requirement criticality.
- **HUD**: Heads-Up Display (futuristic UI overlay style).
- **WebGL**: Web Graphics Library for GPU-accelerated 3D rendering in the browser without plugins.
- **RAG**: Retrieval-Augmented Generation for grounded AI chatbot replies.

### 1.3 Intended Audience
- **Primary Stakeholder / Creator:** Yash Gayake (Automation & Robotics Engineer / Developer).
- **Evaluators & Recruiters:** Engineering managers, hiring committees, robotics lab directors, tech venture leads.
- **Students & Learners:** Robotics and computer science students accessing learning resources.
- **Software Engineers & Maintainers:** Developers auditing, extending, or maintaining this codebase.

### 1.4 Product Scope & Overview
The software provides a comprehensive digital footprint for Yash Gayake that bridges the physical world of **Automation & Robotics** with modern **Full-Stack Software Engineering & Artificial Intelligence**. Unlike traditional static portfolios, this platform integrates:
- GPU-accelerated 3D character visualization running at 60 FPS.
- Autonomous visitor greeting with multi-part voice narration and anatomical wave gestures.
- Gemini 2.5/3.5 Flash and Pro AI grounding for live question answering on projects, skills, and contact information.
- A full-featured educational portal (**Student Academy**) offering YouTube video courses, notes, and study material.
- Complete live administration dashboard for content updates without redeploying code.

---

## 2. Overall Description

### 2.1 Product Perspective & System Architecture
The application follows a **Full-Stack Single Page Application (SPA) with Express Middleware and Server-Side API Proxying**:

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  +---------------------------------------------------------------------------+  |
|  |                           React 19 + TypeScript                           |  |
|  |                                                                           |  |
|  |  +--------------------+  +--------------------+  +---------------------+  |  |
|  |  |   Portfolio View   |  |   3D WebGL Avatar  |  |   Student Academy   |  |  |
|  |  |  (Hero, Projects,  |  |  (Three.js Engine, |  |  (Courses, Notes,   |  |  |
|  |  |  Skills, About)    |  |  Speech, Gestures) |  |   YouTube Links)    |  |  |
|  |  +--------------------+  +--------------------+  +---------------------+  |  |
|  |            |                       |                       |              |  |
|  |  +--------------------+  +--------------------+  +---------------------+  |  |
|  |  |  Gemini AI Chatbot |  |  Admin CMS Console |  |  Resume & Analytics |  |  |
|  |  +--------------------+  +--------------------+  +---------------------+  |  |
|  +---------------------------------------------------------------------------+  |
+----------------------------------------|----------------------------------------+
                                         | REST / HTTPS (JSON)
+----------------------------------------v----------------------------------------+
|                                 SERVER TIER                                     |
|  +---------------------------------------------------------------------------+  |
|  |                        Express.js Backend (Node.js)                       |  |
|  |  - Proxy Routes: /api/chat, /api/contact, /api/analytics, /api/admin      |  |
|  |  - Security: Environment Secrets Masking, Rate Limiting, File Upload      |  |
|  |  - Mail Service: Nodemailer SMTP Dispatcher                               |  |
|  +---------------------------------------------------------------------------+  |
+--------------------|-----------------------------------|------------------------+
                     |                                   |
+--------------------v-------------+   +-----------------v------------------------+
|        GOOGLE GEMINI API         |   |          PERSISTENCE STORAGE             |
|  - Gemini 3.5 Flash / 3.1 Pro    |   |  - Firebase Cloud Firestore / Local DB   |
|  - Grounded System Prompt RAG    |   |  - Supabase Storage / File Store         |
+----------------------------------+   +------------------------------------------+
```

### 2.2 User Classes and Characteristics
1. **General Visitors / Tech Recruiters / Industry Clients:**
   - Default priority. Upon visiting the website, the user lands directly on the **Engineering Portfolio**.
   - Requires zero friction, fast load times (< 1.5s), responsive mobile/tablet/desktop layouts, high-fidelity 3D visuals, and verified project links (GitHub/Live Demo).
2. **Students & Learners:**
   - Navigates seamlessly to **Student Academy** via the top navigation bar or hero call-to-action button.
   - Watches structured robotics/coding lectures, downloads course notes, and explores educational resources.
3. **Site Owner / Administrator (Yash Gayake):**
   - Accesses `/admin` authentication modal to add/edit projects, update YouTube lectures, manage contact submissions, and configure site settings in real-time.

### 2.3 Operating Environment & Technical Stack
- **Frontend Core:** React 19, TypeScript 5.8+, Vite 6, Tailwind CSS v4.
- **3D Graphics Engine:** Three.js 0.186+, WebGL 2.0, HTML5 Canvas.
- **Animations:** Motion (Framer Motion 12+), CSS Keyframe transforms.
- **Icons:** Lucide React (vector icon suite).
- **Audio & Speech:** Web Speech Synthesis API (`SpeechSynthesisUtterance`).
- **Server:** Node.js (v20+), Express.js (v4.21+), `tsx` runtime.
- **AI Core:** `@google/genai` TypeScript SDK (Google Gemini Models).
- **Database & Cloud:** Firebase Firestore / Supabase JS client.
- **Transpilation & Bundling:** ESBuild, TypeScript Compiler (`tsc`).

### 2.4 Design and Implementation Constraints
- **Hardware Acceleration:** Fallback graceful rendering if client device does not support WebGL.
- **Browser Autoplay Policies:** Audio voice greeting must adhere to modern browser audio context policies (activated via user gesture or visual speech bubble display).
- **Navigation Priority (User Mandate):** The website **MUST** open directly into the main Portfolio first. The Student Academy is accessible via dedicated navigation triggers.

---

## 3. System Features & Functional Requirements

### 3.1 Dual-View Architecture (Portfolio First & Student Academy)
- **FR-1.1:** When the root URL (`/` or `index.html`) is loaded, the application **SHALL** render the **Engineering Portfolio** by default.
- **FR-1.2:** The application **SHALL** maintain a clean URL hash routing mechanism (`#portfolio`, `#academy`, `#projects`, `#skills`, `#contact`).
- **FR-1.3:** The Navbar **SHALL** contain a persistent, highlighted **"Student Academy"** badge tab that toggles the view to the Academy without reloading the page.
- **FR-1.4:** The Student Academy view **SHALL** provide a persistent **"← Back to Portfolio"** action button at the top header to return to the portfolio seamlessly.

### 3.2 Real-Time 3D Interactive WebGL Avatar (Three.js)
- **FR-2.1:** The system **SHALL** render a customized 3D Chibi character modeled after Yash Gayake's official character specification:
  - Charcoal-black layered spiky anime hair with front bangs and nape tufts.
  - Deep espresso chibi eyes with dual specular highlight points and natural blinking.
  - Soft porcelain skin tone with subtle pink cheek blush.
  - Charcoal-gray tailored suit jacket with lapels and single dark button.
  - Crisp white crewneck inner shirt and white sneakers.
  - Glowing cybernetic circular pedestal ring at the base.
- **FR-2.2:** The 3D scene **SHALL** support 360-degree orbital rotation via mouse drag and touch gestures with damping physics.
- **FR-2.3:** The 3D avatar **SHALL** support three distinct switchable poses:
  1. **Wave Pose:** Natural biological arm wave with bent elbow, tilted forearm, and waving palm.
  2. **T-Pose:** Exact anatomical reference pose matching initial character blueprint.
  3. **Chill Pose:** Relaxed standing posture with arms naturally positioned at the side.

### 3.3 Autonomous Speech, Gestures & Voice Narration
- **FR-3.1:** As soon as the page is mounted, the 3D avatar **SHALL** initiate an autonomous speech sequence with visible speech bubbles:
  1. *Greeting:* "Hi there! 👋 Welcome to my portfolio! I'm Yash Gayake. Explore my robotics & software work!"
  2. *Robotics:* "I design autonomous robots, ROS systems, IoT microcontrollers, and precision control algorithms! 🤖"
  3. *Software:* "I build responsive full-stack software, TypeScript web applications, and fast cloud APIs! 💻"
  4. *Academy:* "Don't miss Yash Gayake Academy for free practical robotics tutorials and video courses on YouTube! 🎓"
  5. *Collaboration:* "You can drag me with your mouse to rotate 360°, check out my projects, and let's collaborate! 🚀"
- **FR-3.2:** When speaking, the avatar's 3D mouth **SHALL** execute real-time talking/lip-sync mesh scaling.
- **FR-3.3:** The speech bubble **SHALL** provide a prominent **"▶ Hear Voice"** / **"Speaking"** button that leverages the browser's Web Speech API to vocalize all dialogues in clean audio.
- **FR-3.4:** The user **SHALL** be able to cycle forward to the next dialogue topic or hide the bubble using dedicated UI controls.

### 3.4 AI Assistant Chatbot (Gemini Grounded Intelligence)
- **FR-4.1:** A floating AI launcher button with a live 3D Yash avatar thumbnail **SHALL** be docked at the bottom-right corner.
- **FR-4.2:** The chatbot **SHALL** be grounded on Yash Gayake's verified portfolio data (education, robotics achievements, GitHub repositories, LinkedIn profile, email).
- **FR-4.3:** The user **SHALL** be able to select between three Gemini operational modes:
  - **Fast Mode:** Powered by `gemini-3.1-flash-lite` for instantaneous responses.
  - **Balanced Mode:** Powered by `gemini-3.5-flash` for general portfolio inquiry.
  - **Pro Mode:** Powered by `gemini-3.1-pro-preview` for technical architecture and code explanation.
- **FR-4.4:** The chatbot UI **SHALL** include quick topic pills (LinkedIn, GitHub Repos, Robotics, Contact) and a real-time portfolio analysis scan bar.

### 3.5 Projects Showcase with Filtering & Live Metrics
- **FR-5.1:** Projects **SHALL** be filterable by domain: All, Robotics, Automation, Web Development, Cybersecurity.
- **FR-5.2:** Each project card **SHALL** display: Title, description, tech stack tags, direct GitHub repository link, live demo URL, and featured status badge.
- **FR-5.3:** The system **SHALL** track project views and outbound clicks via the internal analytics pipeline.

### 3.6 Skills, Tech Stack & Experience Timeline
- **FR-6.1:** Skills **SHALL** be categorized into Robotics/Hardware (ROS, Arduino, Raspberry Pi, Sensors), Software Development (TypeScript, React, Python, C++), and Tools/Cloud.
- **FR-6.2:** An interactive chronological timeline **SHALL** present Yash's academic education, certifications, and project milestones.

### 3.7 Student Academy (Courses, YouTube Modules, Notes Download)
- **FR-7.1:** The Academy view **SHALL** showcase organized video courses linked to Yash's YouTube channel.
- **FR-7.2:** Course items **SHALL** include module titles, video duration, difficulty level, prerequisites, and direct links to downloadable notes/PDFs.
- **FR-7.3:** Search and category filters **SHALL** allow students to find robotics, programming, and electronics tutorials quickly.

### 3.8 Contact Form, Direct Messaging & Telemetry
- **FR-8.1:** A responsive contact form **SHALL** validate user name, email, subject, and message length.
- **FR-8.2:** Submissions **SHALL** be processed by the Express backend (`/api/contact`), logged to persistent storage, and dispatched via SMTP email notification.

### 3.9 Resume Preview & PDF Generation
- **FR-9.1:** A dedicated Resume modal **SHALL** provide a formatted interactive preview of Yash Gayake's curriculum vitae with direct PDF download functionality.

### 3.10 Admin Dashboard & Live Content Management
- **FR-10.1:** The site administrator **SHALL** be able to authenticate securely via the `/admin` portal.
- **FR-10.2:** The administrator **SHALL** be able to create, update, and delete projects, skills, education records, and site settings without modifying source files.

---

## 4. External Interface Requirements

### 4.1 User Interfaces (UI/UX Principles)
- **Cyber-Modern Aesthetic:** High-contrast neutral dark backgrounds (`#0a0a0c`, `#121216`) with electric cyan (`#06b6d4`, `#38bdf8`) accents and rose highlights for the Academy.
- **Micro-Interactions:** Subtle hover lifts, button active scale-downs (`scale-[0.98]`), and loading skeletons.
- **Responsiveness:** Fluid grid and flexbox arrangements ensuring seamless operation from 320px mobile screens to 4K ultra-wide monitors.

### 4.2 Hardware Interfaces
- Standard client display screen, GPU with WebGL 2.0 acceleration support, mouse/trackpad pointer, multi-touch capacitive digitizer, and audio speaker/headphones.

### 4.3 Software Interfaces
- **Browser APIs:** HTML5 Canvas, WebGL, Web Audio / Web Speech API, LocalStorage / SessionStorage.
- **External Services:** Google Gemini API (`@google/genai`), YouTube Embeds/APIs, Firebase Firestore SDK, GitHub API / External links.

### 4.4 Communications Interfaces
- HTTPS REST Endpoints:
  - `POST /api/chat` - AI message processing and Gemini RAG pipeline.
  - `POST /api/contact` - User inquiries and email notifications.
  - `GET /api/analytics` - System metrics and engagement tracking.
  - `GET /api/settings` - Dynamic portfolio configuration.

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance Requirements
- **First Contentful Paint (FCP):** < 1.0 second on standard broadband.
- **Time to Interactive (TTI):** < 2.0 seconds including 3D engine initialization.
- **Animation Frame Rate:** Stable 60 FPS under normal browsing conditions.
- **API Response Latency:** < 1.5 seconds for Gemini streaming/fast responses.

### 5.2 Safety & Reliability
- **Failure Isolation:** In the event of a WebGL context loss or failure, the application **SHALL** continue functioning as a standard 2D portfolio without crashing.
- **Error Boundaries:** React error boundaries around dynamic widgets.

### 5.3 Security Requirements
- **Zero Client-Side Secrets:** Gemini API keys, SMTP credentials, and administrative tokens are strictly stored in server-side environment variables.
- **Input Sanitization:** Contact form inputs and chatbot prompts are sanitized against XSS and injection attacks.
- **CORS & Headers:** Proper HTTP headers configured on Express server.

### 5.4 Software Quality Attributes
- **Maintainability:** Modular component breakdown (`src/components/*`), fully typed TypeScript contracts (`src/types.ts`).
- **Usability:** 100% keyboard navigable navigation elements, accessible ARIA labels for screen readers.

---

## 6. Data Model & Firestore Blueprint

```json
{
  "entities": {
    "site_settings": {
      "name": "string",
      "professionalTitle": "string",
      "supportingText": "string",
      "email": "string",
      "location": "string",
      "githubUrl": "string",
      "linkedinUrl": "string",
      "youtubeUrl": "string"
    },
    "projects": {
      "id": "string",
      "title": "string",
      "description": "string",
      "tags": "array<string>",
      "category": "string (robotics|web|automation|cybersecurity)",
      "githubUrl": "string",
      "demoUrl": "string",
      "featured": "boolean"
    },
    "academy_courses": {
      "id": "string",
      "title": "string",
      "description": "string",
      "youtubeVideoId": "string",
      "category": "string",
      "duration": "string",
      "notesUrl": "string",
      "order": "number"
    },
    "contact_messages": {
      "id": "string",
      "name": "string",
      "email": "string",
      "subject": "string",
      "message": "string",
      "timestamp": "ISO8601 string",
      "read": "boolean"
    }
  }
}
```

---

## 7. Comprehensive Project Report

### 7.1 Problem Statement
In an increasingly crowded market of engineering candidates, standard static portfolios (built on generic static templates or PDF documents) fail to accurately communicate an engineer's multidimensional capabilities. For a candidate specializing in **Automation & Robotics and Software Development**, static pages cannot demonstrate real-time 3D spatial thinking, physics comprehension, interactive systems design, or state-of-the-art AI integration.

### 7.2 Proposed Solution & Innovations
The Yash Gayake Web Application provides a technological tour-de-force:
1. **Interactive 3D Self-Representation:** A custom 3D chibi avatar rendered in real-time WebGL, featuring biological arm waving, customizable poses (Wave, T-Pose, Chill), and 360-degree rotation.
2. **Autonomous Conversational Greeting:** Rather than waiting for passive reading, the avatar greets every visitor with animated speech bubbles, live voice narration, and real-time lip movement.
3. **Dual-Channel Purpose:** Combines a high-impact recruiter-facing engineering portfolio with an empowering community-facing **Student Academy** for free technical learning.
4. **AI Grounded Intelligence:** Recruiters and engineers can interrogate Yash's portfolio in natural language via a Gemini-powered conversational agent.

### 7.3 Key Engineering Milestones Accomplished
- ✅ **Architectural Re-alignment:** Configured the application lifecycle so the **Main Portfolio** is the primary landing view, providing immediate access to the 3D model, hero headlines, and projects, with instant access to the Student Academy.
- ✅ **Anatomical Hand & Arm Rigging:** Upgraded the 3D avatar with anatomically defined chibi hands (palm, thumb, 4 fingers, shirt cuffs) and jointed arm kinematics (shoulder &rarr; upper arm &rarr; elbow &rarr; forearm &rarr; hand) for realistic, fluid "Hi" waving.
- ✅ **Voice Audio Synthesis:** Integrated the Web Speech Synthesis API with a responsive **"▶ Hear Voice"** trigger and synchronized mouth movement.
- ✅ **Production Quality Assurance:** Codebase validated via TypeScript compiler (`tsc --noEmit`) and ESBuild/Vite packaging pipelines with zero errors.

### 7.4 Verification & Validation Results
| Test Item | Specification | Result |
| :--- | :--- | :---: |
| **Initial View Test** | Fresh website load opens Portfolio first | **PASS** |
| **Academy Navigation** | Navbar badge & CTA buttons switch view to Academy | **PASS** |
| **3D Rendering** | Three.js WebGL canvas renders avatar with shadows | **PASS** |
| **360° Drag Orbit** | Mouse and touch gestures rotate model smoothly | **PASS** |
| **Pose Switching** | Wave, T-Pose, and Chill poses interpolate cleanly | **PASS** |
| **Dialogue Sequence** | Cycles through 5 autonomous speech topics | **PASS** |
| **Voice Audio** | Speech synthesis plays on user click gesture | **PASS** |
| **AI Chatbot** | Answers grounded questions on Yash's background | **PASS** |
| **TypeScript / Build** | 0 compilation warnings or fatal errors | **PASS** |

---

## 8. Future Enhancements & Roadmap

### 8.1 Short-Term Enhancements (v2.1 - v2.3)
1. **Custom GLTF/GLB 3D Rig Import:**
   - Add support for importing rigged `.glb` character models with custom skeletal bones and morph targets.
2. **Multi-Lingual Avatar Voice Narration:**
   - Expand the autonomous speech synthesizer to support Hindi, English, and regional Indian languages based on user locale.
3. **Interactive 3D Robotics Lab Sandbox:**
   - Introduce an interactive 3D robotic arm (e.g., 6-DOF robotic manipulator or SCARA robot) inside the robotics project section, allowing visitors to manipulate inverse kinematics in the browser.

### 8.2 Medium-Term Enhancements (v3.0)
1. **Gemini Live Multimodal Voice Streaming (WebRTC):**
   - Upgrade the text/speech synthesis to **Gemini Real-Time Audio Streaming (Live API)** so visitors can talk into their microphone and the 3D Yash avatar replies in natural conversational audio in real-time.
2. **Student Academy Interactive Code Playground:**
   - Embed an in-browser C++ / Python / Arduino code simulator inside course modules so students can test robotics code without installing software.
3. **Gamified Learning Progress & Badges:**
   - Enable student profiles, completion tracking for video courses, and automated PDF certificates of completion.

### 8.3 Long-Term Futuristic Roadmap (v4.0+)
1. **WebXR / VR / AR Portfolio Viewing:**
   - Allow users with VR headsets (Meta Quest / Apple Vision Pro) or smartphones to place Yash's 3D avatar in augmented reality on their physical workspace.
2. **Autonomous ROS Hardware Telemetry Stream:**
   - Stream live sensor telemetry (LiDAR point clouds, IMU orientation, battery voltage) from Yash's actual physical robots directly onto a live portfolio dashboard via WebSockets.

---

## 9. Conclusion & Sign-off

The **Yash Gayake Next-Gen Portfolio & Student Academy** establishes a new benchmark for software and robotics engineering portfolios. By uniting real-time 3D graphics, conversational AI, educational outreach, and pristine user experience, the system delivers an engaging, memorable, and technically authoritative platform for visitors, recruiters, and students alike.

**Specification Approval:**  
- **Lead Engineer:** Yash Gayake  
- **System Version:** 2.0.0 Production  
- **Status:** Complete & Fully Deployed  
