import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DatabaseData, SiteSettings, Skill, Project, Experience, Education, Certification, Achievement, Article, ContactMessage, AnalyticsEvent } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.json');

const INITIAL_DATA: DatabaseData = {
  settings: {
    name: "Yash Gayake",
    professionalTitle: "Automation & Robotics Student | Developer",
    supportingText: "Building with code, exploring robotics, and continuously learning modern technologies across software, automation, and cybersecurity.",
    bio: "I am an Automation & Robotics engineering student and developer passionate about creating robust technical solutions where hardware integration meets reliable software architecture. My primary technical interests encompass software engineering, robotics systems, Linux security, and automated deployment.",
    email: "yashgayake900@gmail.com",
    githubUrl: "https://github.com/yashgayake",
    linkedinUrl: "https://linkedin.com/in/yashgayake",
    resumeUrl: "",
    resumeLastUpdated: "September 2026",
    profileImage: "",
    location: "India",
    seoTitle: "Yash Gayake | Automation & Robotics Student & Developer",
    seoDescription: "Official portfolio and engineering platform of Yash Gayake. Automation & Robotics Student, Developer, and Technology Enthusiast.",
    githubUsername: "yashgayake",
    focusedAreas: [
      "Automation & Robotics",
      "Software Development",
      "Cybersecurity",
      "DevOps"
    ],
    technicalInterests: [
      "Software Development",
      "Automation & Robotics",
      "Cybersecurity",
      "DevOps",
      "AI/ML",
      "Blockchain"
    ]
  },
  skills: [
    // Programming
    { id: "sk-1", name: "Python", category: "Programming", orderIndex: 1 },
    { id: "sk-2", name: "C/C++", category: "Programming", orderIndex: 2 },
    { id: "sk-3", name: "JavaScript", category: "Programming", orderIndex: 3 },
    { id: "sk-4", name: "TypeScript", category: "Programming", orderIndex: 4 },
    // Development
    { id: "sk-5", name: "React", category: "Development", orderIndex: 5 },
    { id: "sk-6", name: "Next.js", category: "Development", orderIndex: 6 },
    { id: "sk-7", name: "HTML", category: "Development", orderIndex: 7 },
    { id: "sk-8", name: "CSS", category: "Development", orderIndex: 8 },
    { id: "sk-9", name: "REST APIs", category: "Development", orderIndex: 9 },
    // Tools
    { id: "sk-10", name: "Git", category: "Tools", orderIndex: 10 },
    { id: "sk-11", name: "GitHub", category: "Tools", orderIndex: 11 },
    { id: "sk-12", name: "Docker", category: "Tools", orderIndex: 12 },
    { id: "sk-13", name: "VS Code", category: "Tools", orderIndex: 13 },
    // Systems
    { id: "sk-14", name: "Linux", category: "Systems", orderIndex: 14 },
    { id: "sk-15", name: "Networking", category: "Systems", orderIndex: 15 },
    // Automation & Robotics
    { id: "sk-16", name: "Arduino", category: "Automation & Robotics", orderIndex: 16 },
    { id: "sk-17", name: "Sensors", category: "Automation & Robotics", orderIndex: 17 },
    { id: "sk-18", name: "Robotics", category: "Automation & Robotics", orderIndex: 18 },
    { id: "sk-19", name: "Industrial Automation", category: "Automation & Robotics", orderIndex: 19 },
    // Cybersecurity
    { id: "sk-20", name: "Linux Security", category: "Cybersecurity", orderIndex: 20 },
    { id: "sk-21", name: "Networking", category: "Cybersecurity", orderIndex: 21 },
    { id: "sk-22", name: "Security Fundamentals", category: "Cybersecurity", orderIndex: 22 }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Autonomous Mobile Robot Platform [Editable Template]",
      slug: "autonomous-mobile-robot-platform",
      shortDescription: "An experimental autonomous ground platform exploring sensor fusion and ROS navigation nodes.",
      overview: "Designed as a prototype testbed for testing low-cost obstacle avoidance and dead reckoning sensor fusion algorithms in indoor laboratory environments.",
      problem: "Traditional wheel encoders suffer from cumulative odometric drift, leading to degraded path planning over extended travel distances.",
      solution: "Implemented complementary filtering across an IMU and dual optical wheel encoders paired with ultrasonic proximity arrays for real-time collision prevention.",
      features: [
        "Real-time sensor telemetry streaming",
        "Deterministic obstacle avoidance state machine",
        "Hardware-level motor PWM control via microcontrollers"
      ],
      technologies: ["C/C++", "Arduino", "Robotics", "Sensors", "Python"],
      category: "Robotics",
      thumbnail: "",
      heroImage: "",
      architecture: "Sensor Node (Arduino) -> Serial UART Interface -> SBC Processing Node (ROS) -> Motor Driver H-Bridge",
      gallery: [],
      challenges: "Mitigating sensor noise and motor switching EMI using optocouplers and software digital filtering.",
      whatILearned: "In-depth understanding of sensor calibration, timing interrupts in embedded C++, and telemetry parsing.",
      githubUrl: "https://github.com/yashgayake",
      liveDemoUrl: "",
      featured: true,
      published: true,
      createdAt: "2026-05-10T10:00:00.000Z",
      updatedAt: "2026-05-10T10:00:00.000Z"
    },
    {
      id: "proj-2",
      title: "Modular Full-Stack Developer Hub [Editable Template]",
      slug: "modular-fullstack-developer-hub",
      shortDescription: "A modern developer dashboard integrating telemetry monitoring, REST APIs, and responsive UI controls.",
      overview: "A lightweight administrative portal built to manage project status, incoming telemetry, and technical notes through a clean, accessible interface.",
      problem: "Disparate logging files made it difficult to quickly review hardware build telemetry and active software services.",
      solution: "Created an integrated full-stack application with unified API endpoints and responsive tabular controls.",
      features: [
        "Authentication-protected admin portal",
        "Real-time filtering by category and tags",
        "Secure REST endpoints with server-side validation"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Node.js"],
      category: "Development",
      thumbnail: "",
      heroImage: "",
      architecture: "Vite + React Client <-> Express REST Backend <-> File/Database Persistence Layer",
      gallery: [],
      challenges: "Maintaining high responsiveness while ensuring strict type safety across client and server boundaries.",
      whatILearned: "Best practices for modular React component boundaries, state management, and API design.",
      githubUrl: "https://github.com/yashgayake",
      liveDemoUrl: "",
      featured: true,
      published: true,
      createdAt: "2026-06-15T10:00:00.000Z",
      updatedAt: "2026-06-15T10:00:00.000Z"
    },
    {
      id: "proj-3",
      title: "Linux System Hardening & Log Monitor [Editable Template]",
      slug: "linux-system-hardening-monitor",
      shortDescription: "A Python utility for auditing Linux security configurations and inspecting authentication logs.",
      overview: "Built to automate standard security checks across experimental Linux workstations and edge microcomputers.",
      problem: "Manual verification of firewall rules, SSH configurations, and open network ports is repetitive and prone to oversight.",
      solution: "Automated baseline scanner that parses log files, verifies permission matrices, and outputs formatted security reports.",
      features: [
        "SSH brute-force detection and parsing",
        "Automated UFW status verification",
        "Actionable security remediation checklist"
      ],
      technologies: ["Python", "Linux Security", "Networking", "Security Fundamentals"],
      category: "Cybersecurity",
      thumbnail: "",
      heroImage: "",
      architecture: "Cron Daemon -> Python Log Parser -> System Metrics Aggregator -> Alerting Pipeline",
      gallery: [],
      challenges: "Efficiently streaming large auth.log records without saturating memory on low-resource machines.",
      whatILearned: "Practical Linux security hardening standards and regex parsing for structured log auditing.",
      githubUrl: "https://github.com/yashgayake",
      liveDemoUrl: "",
      featured: false,
      published: true,
      createdAt: "2026-07-20T10:00:00.000Z",
      updatedAt: "2026-07-20T10:00:00.000Z"
    }
  ],
  experience: [
    {
      id: "exp-1",
      organization: "[Add Organization / Institute Name]",
      position: "Automation & Software Project Member [Editable]",
      startDate: "2025",
      endDate: "Present",
      current: true,
      description: "[Add your specific project or internship role details here using the Admin Dashboard]",
      technologies: ["Python", "C/C++", "Linux", "Git"],
      organizationUrl: "",
      category: "Project/Activity",
      orderIndex: 1
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "[Add Your University / College Name]",
      degree: "Bachelor of Technology / Engineering",
      branch: "Automation and Robotics",
      startYear: "2023",
      endYear: "2027",
      description: "Undergraduate curriculum covering Robotics Kinematics, Control Systems, Microprocessors, Industrial Automation, and Software Systems.",
      achievements: [
        "[Add academic accomplishments or team project highlights in Admin Dashboard]"
      ],
      orderIndex: 1
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "[Add Certification Name in Admin]",
      issuingOrganization: "[Issuing Body / Organization]",
      issueDate: "2025",
      credentialId: "",
      credentialUrl: "",
      relatedSkills: ["Linux", "Python", "Networking"],
      orderIndex: 1
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "[Add Milestone / Competition Result in Admin]",
      organization: "[Competition or Institution]",
      date: "2025",
      description: "[Optional achievement records can be created and managed via the Admin Dashboard]",
      orderIndex: 1
    }
  ],
  articles: [
    {
      id: "art-1",
      title: "Understanding Sensor Fusion in Mobile Robotics",
      slug: "understanding-sensor-fusion-mobile-robotics",
      category: "Robotics",
      tags: ["Robotics", "Sensors", "Arduino", "C++"],
      readingTimeMinutes: 5,
      excerpt: "A technical overview of integrating ultrasonic, IMU, and encoder feedback for reliable robotic positioning.",
      content: `# Understanding Sensor Fusion in Mobile Robotics\n\nWhen designing autonomous mobile robots, relying on a single sensor modality inevitably leads to cumulative drift or blind spots. Sensor fusion combines observations from multiple disparate sensors to derive an estimate of system state with lower uncertainty than any individual sensor could provide.\n\n### The Need for Redundancy\n\nIn typical indoor robotics setups:\n- **Wheel Encoders** suffer from wheel slippage on smooth floors.\n- **Inertial Measurement Units (IMUs)** experience gyro bias and thermal drift over time.\n- **Ultrasonic / ToF Sensors** are prone to specular reflection off angled surfaces.\n\n### Basic Fusion Approaches\n\n1. **Complementary Filtering**: A computationally lightweight method suitable for 8-bit or 32-bit microcontrollers (such as Arduino or STM32). High-pass filtering the gyro rate while low-pass filtering accelerometer tilt balances dynamic response and steady-state drift.\n2. **Extended Kalman Filter (EKF)**: The standard non-linear estimation technique used in ROS navigation stacks to fuse odometry and visual landmarks.\n\n### Practical Implementation Notes\nAlways isolate sensor power rails from high-current motor drivers to eliminate switching transients and ground bounce.`,
      published: true,
      publishedDate: "2026-08-15",
      updatedDate: "2026-08-15"
    },
    {
      id: "art-2",
      title: "Fundamental Linux Hardening for Developer Environments",
      slug: "linux-hardening-developer-environments",
      category: "Cybersecurity",
      tags: ["Linux Security", "DevOps", "Networking"],
      readingTimeMinutes: 4,
      excerpt: "Essential security baselines every software and robotics developer should apply to workstations and edge nodes.",
      content: `# Fundamental Linux Hardening for Developer Environments\n\nWhether configuring an edge SBC on a robot or managing a cloud deployment, security must not be an afterthought. Linux environments can be significantly hardened with a few foundational practices.\n\n### Key Baseline Principles\n\n1. **Principle of Least Privilege**: Never run application scripts as the root user. Create dedicated system users with minimal file permissions.\n2. **SSH Hardening**:\n   - Disable root login: \`PermitRootLogin no\`\n   - Enforce public key authentication and disable password logins: \`PasswordAuthentication no\`\n   - Change standard listening port if exposed to public interfaces.\n3. **UFW / Firewall Rules**: Close all unsolicited inbound ports and only open necessary application ports.\n4. **Audit and Monitoring**: Regularly inspect \`/var/log/auth.log\` for failed authentication attempts.\n\nSecurity is a continuous posture, not a one-time checklist.`,
      published: true,
      publishedDate: "2026-09-02",
      updatedDate: "2026-09-02"
    }
  ],
  contactMessages: [],
  analyticsEvents: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure database file exists with initial structure
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
}

export function readDb(): DatabaseData {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      settings: { ...INITIAL_DATA.settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    console.error('Error reading database file, using fallback:', error);
    return INITIAL_DATA;
  }
}

export function writeDb(data: DatabaseData): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error writing database file:', error);
    throw error;
  }
}
