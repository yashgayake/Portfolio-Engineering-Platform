import type { Course, NoteResource } from '../types.ts';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-python-automation',
    title: 'Python for Robotics, Automation & Systems Engineering',
    slug: 'python-robotics-automation',
    tagline: 'Master Python from fundamentals to hardware automation, sensors, and scripting.',
    description:
      'A comprehensive, hands-on masterclass created by Yash Gayake. Learn practical Python programming specifically tailored for automation engineers, robotics builders, and scripting specialists. Includes downloadable source codes, real-world case studies, and automated hardware control loops.',
    instructorName: 'Yash Gayake',
    instructorTitle: 'Robotics & Automation Developer',
    category: 'Python',
    level: 'Beginner',
    price: 499, // ₹499 INR / $6
    originalPrice: 1499,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    previewYoutubeVideoId: 'gfDE2a7MKjA', // CodeWithHarry Python intro video
    youtubePlaylistUrl: 'https://www.youtube.com/@CodeWithHarry',
    tags: ['Python 3', 'Automation', 'Sensors', 'Robotics', 'Hardware I/O'],
    featured: true,
    studentsCount: 1420,
    rating: 4.9,
    reviewsCount: 318,
    certificateOffered: true,
    updatedAt: 'September 2026',
    notes: [
      {
        id: 'note-python-cheatsheet',
        title: 'Master Python Automation Cheatsheet & Code Handbook',
        description: 'Complete condensed 48-page reference covering data structures, socket programming, GPIO libraries, and file automation with copy-paste snippets.',
        category: 'Python',
        price: 99,
        pagesCount: 48,
        previewSnippet: 'import serial, time\n# Yash Gayake Automation Routine\nser = serial.Serial("/dev/ttyUSB0", 9600)\ntime.sleep(2)\nser.write(b"ROBOT_INIT_OK\\n")',
        downloadUrl: '#',
        tags: ['Python', 'Cheatsheet', 'PDF Notes', 'Automation'],
        featured: true,
        downloadsCount: 840
      }
    ],
    lectures: [
      {
        id: 'lec-py-01',
        title: '01. Welcome & Setting Up Python Development Environment',
        durationMinutes: 18,
        youtubeVideoId: 'gfDE2a7MKjA', // Free CodeWithHarry sample
        description: 'Introduction to Python 3 installation, VS Code extensions, virtual environments, and package managers.',
        orderIndex: 1,
        freePreview: true,
        notesMarkdown: '# Lecture 1 Notes\n- Install Python 3.12+\n- Setup VS Code with Python extension pack\n- Run `python -m venv env` to create an isolated environment.'
      },
      {
        id: 'lec-py-02',
        title: '02. Variables, Dynamic Typing & Memory Model',
        durationMinutes: 24,
        youtubeVideoId: '7wnove7K-ZQ',
        description: 'Understand how Python handles variable references, primitive types, typecasting, and user inputs.',
        orderIndex: 2,
        freePreview: true,
        notesMarkdown: '# Lecture 2 Notes\n- Numbers (int, float, complex)\n- Strings, formatting with f-strings\n- Type inspection with `type()` and `id()`'
      },
      {
        id: 'lec-py-03',
        title: '03. Control Flow, Sensor Loops & Conditional Automation',
        durationMinutes: 32,
        youtubeVideoId: 'UrsmFxEIp5k',
        description: 'Writing logic loops that react to telemetry data, threshold interrupts, and break conditions.',
        orderIndex: 3,
        freePreview: false,
        notesMarkdown: '# Lecture 3 Notes\n- `while True` continuous polling loops\n- Defensive try-except-finally blocks for hardware safety'
      },
      {
        id: 'lec-py-04',
        title: '04. Functions, Modular Architecture & Clean Code',
        durationMinutes: 28,
        youtubeVideoId: 'vLqTf2b6GZw',
        description: 'Creating reusable driver modules, default arguments, return tuples, and docstrings.',
        orderIndex: 4,
        freePreview: false,
        notesMarkdown: '# Lecture 4 Notes\n- Pure functions vs side-effect hardware callers\n- `*args` and `**kwargs` for flexible configuration'
      },
      {
        id: 'lec-py-05',
        title: '05. Capstone Project: Building an Automated Telemetry Logger',
        durationMinutes: 45,
        youtubeVideoId: 'gfDE2a7MKjA',
        description: 'Complete capstone project integrating file systems, timestamping, and mock telemetry output.',
        orderIndex: 5,
        freePreview: false,
        notesMarkdown: '# Capstone Project Notes\n- Read mock sensor stream\n- Write to SQLite / CSV database\n- Emit real-time log summaries'
      }
    ]
  },
  {
    id: 'course-robotics-embedded',
    title: 'Robotics Engineering, Sensors & Microcontroller Programming',
    slug: 'robotics-engineering-microcontrollers',
    tagline: 'Learn microcontrollers, kinematics, motor drivers, and autonomous robot logic.',
    description:
      'Step-by-step embedded robotics curriculum taught from real lab experience. Delve into PWM motor speed control, ultrasonic/LIDAR sensor fusion, I2C/SPI serial communication, and building autonomous navigation chassis.',
    instructorName: 'Yash Gayake',
    instructorTitle: 'Automation & Robotics Student',
    category: 'Robotics & Automation',
    level: 'Intermediate',
    price: 699, // ₹699
    originalPrice: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    previewYoutubeVideoId: 'd8_xXNcGYgo',
    youtubePlaylistUrl: 'https://www.youtube.com',
    tags: ['Robotics', 'Embedded C++', 'Sensors', 'PID Control', 'Actuators'],
    featured: true,
    studentsCount: 960,
    rating: 4.95,
    reviewsCount: 215,
    certificateOffered: true,
    updatedAt: 'August 2026',
    notes: [
      {
        id: 'note-robotics-handbook',
        title: 'Mobile Robotics Kinematics & Motor Drivers Guide',
        description: 'Detailed circuits, H-bridge pinouts, differential drive kinematics equations, and sensor calibration curves.',
        category: 'Robotics',
        price: 149,
        pagesCount: 52,
        previewSnippet: '// PWM Motor Control\nanalogWrite(ENA_PIN, speed);\ndigitalWrite(IN1, HIGH);\ndigitalWrite(IN2, LOW);',
        downloadUrl: '#',
        tags: ['Robotics', 'Circuits', 'Motors', 'Kinematics'],
        featured: true,
        downloadsCount: 620
      }
    ],
    lectures: [
      {
        id: 'lec-rob-01',
        title: '01. Robotics Fundamentals & Architectural Overview',
        durationMinutes: 20,
        youtubeVideoId: 'd8_xXNcGYgo',
        description: 'Overview of mechanical chassis, electrical distribution, sensor telemetry, and microcontroller processors.',
        orderIndex: 1,
        freePreview: true,
        notesMarkdown: '# Robotics Basics\n- Actuators vs Sensors\n- Power budget and voltage regulation'
      },
      {
        id: 'lec-rob-02',
        title: '02. Ultrasonic & Infrared Distance Sensor Calibration',
        durationMinutes: 30,
        youtubeVideoId: '09C__S3r0io',
        description: 'Calculating sound propagation delays, pulse widths, and filtering sensor noise spikes.',
        orderIndex: 2,
        freePreview: true,
        notesMarkdown: '# Sensor Calibration\n- Trigger pin pulse (10 microseconds)\n- Echo duration to centimeters calculation: `cm = (duration / 2) / 29.1`'
      },
      {
        id: 'lec-rob-03',
        title: '03. Dual H-Bridge Motor Drivers & Pulse Width Modulation',
        durationMinutes: 35,
        youtubeVideoId: 'y8tM9w2hHwI',
        description: 'L298N / TB6612 driver configuration, current limits, reverse polarity protection, and soft start curves.',
        orderIndex: 3,
        freePreview: false,
        notesMarkdown: '# Motor Control\n- Avoid instant reverse to prevent inductive flyback spikes.'
      },
      {
        id: 'lec-rob-04',
        title: '04. Building an Autonomous Obstacle Avoidance Bot',
        durationMinutes: 48,
        youtubeVideoId: 'd8_xXNcGYgo',
        description: 'Implementing state machine logic: FORWARD -> OBSTACLE_DETECTED -> SCAN_LEFT_RIGHT -> TURN -> RESUME.',
        orderIndex: 4,
        freePreview: false,
        notesMarkdown: '# Autonomous Navigation\n- Finite State Machine (FSM) implementation in C++ / Python.'
      }
    ]
  },
  {
    id: 'course-linux-cybersecurity',
    title: 'Linux Systems Administration, Bash Scripting & Security Hardening',
    slug: 'linux-bash-cybersecurity',
    tagline: 'Become proficient in Linux terminal, shell automation, SSH, firewalls, and security audit.',
    description:
      'Engineered for developers who want complete mastery over Linux servers and dev environments. Covers file permissions, SSH key setup, process supervision with systemd, automated Bash cron scripts, UFW firewall configurations, and vulnerability scanning.',
    instructorName: 'Yash Gayake',
    instructorTitle: 'Systems Developer',
    category: 'Linux & DevOps',
    level: 'Beginner',
    price: 0, // 100% FREE for students!
    originalPrice: 999,
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
    previewYoutubeVideoId: 'sWbUDq4S6Y8', // CodeWithHarry Linux sample
    youtubePlaylistUrl: 'https://www.youtube.com',
    tags: ['Linux', 'Bash', 'SSH', 'Cybersecurity', 'DevOps'],
    featured: true,
    studentsCount: 2310,
    rating: 4.98,
    reviewsCount: 540,
    certificateOffered: true,
    updatedAt: 'July 2026',
    notes: [
      {
        id: 'note-linux-handbook',
        title: 'Linux Terminal 100 Commands Cheatsheet & Bash Cookbook',
        description: 'Concise, high-yield guide containing top 100 commands for permissions, networking, process management, and grep/awk/sed text wrangling.',
        category: 'Linux & Security',
        price: 0, // Free
        pagesCount: 38,
        previewSnippet: '# Quick Security Audit\nchmod 600 ~/.ssh/id_ed25519\nufw default deny incoming\nufw allow 22/tcp\nufw enable',
        downloadUrl: '#',
        tags: ['Linux', 'Terminal', 'Bash', 'Free Guide'],
        featured: true,
        downloadsCount: 1950
      }
    ],
    lectures: [
      {
        id: 'lec-lin-01',
        title: '01. Linux Kernel, Distros & Terminal Navigation',
        durationMinutes: 25,
        youtubeVideoId: 'sWbUDq4S6Y8',
        description: 'Understand the filesystem hierarchy standard (FHS), directory traversal, and essential commands.',
        orderIndex: 1,
        freePreview: true,
        notesMarkdown: '# Terminal Navigation\n- `ls -la`, `cd`, `pwd`, `mkdir -p`\n- Absolute vs relative paths'
      },
      {
        id: 'lec-lin-02',
        title: '02. Permissions, Users, Groups & Sudo Privileges',
        durationMinutes: 30,
        youtubeVideoId: 'roTt2L_sC1Y',
        description: 'Deep dive into chmod octal values (r=4, w=2, x=1), chown, useradd, and sudoers security policies.',
        orderIndex: 2,
        freePreview: true,
        notesMarkdown: '# Permissions\n- `chmod 755 script.sh`\n- `chown yash:dev /opt/app`'
      },
      {
        id: 'lec-lin-03',
        title: '03. Writing Production Bash Automation Scripts',
        durationMinutes: 40,
        youtubeVideoId: 'roTt2L_sC1Y',
        description: 'Shebang, variables, positional parameters ($1, $2), exit codes ($?), and automated backup cron jobs.',
        orderIndex: 3,
        freePreview: true,
        notesMarkdown: '# Bash Automation\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\necho "Running system backup..."\n```'
      },
      {
        id: 'lec-lin-04',
        title: '04. Network Scanning & Server Security Hardening',
        durationMinutes: 36,
        youtubeVideoId: 'sWbUDq4S6Y8',
        description: 'Configuring UFW, disabling root SSH password auth, inspecting open ports with netstat / ss, and fail2ban.',
        orderIndex: 4,
        freePreview: true,
        notesMarkdown: '# Security Hardening\n- `/etc/ssh/sshd_config`\n- `PermitRootLogin no`\n- `PasswordAuthentication no`'
      }
    ]
  },
  {
    id: 'course-fullstack-dev',
    title: 'Modern Full-Stack Web Development: React, TypeScript & Node.js',
    slug: 'modern-fullstack-react-typescript',
    tagline: 'Build real-world, production-ready web apps from scratch with modern architecture.',
    description:
      'Learn how modern web applications are engineered. Build full-stack solutions with React 19, TypeScript, Express API backends, Tailwind CSS, and secure database persistence.',
    instructorName: 'Yash Gayake',
    instructorTitle: 'Full-Stack Developer',
    category: 'Web Development',
    level: 'Intermediate',
    price: 599, // ₹599
    originalPrice: 1799,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    previewYoutubeVideoId: '6mbwJ2xhgzM', // CodeWithHarry Web Dev sample
    youtubePlaylistUrl: 'https://www.youtube.com',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'REST API'],
    featured: true,
    studentsCount: 1890,
    rating: 4.92,
    reviewsCount: 412,
    certificateOffered: true,
    updatedAt: 'August 2026',
    notes: [
      {
        id: 'note-web-blueprint',
        title: 'Full-Stack Architecture & TypeScript Cheatsheet',
        description: 'Complete reference for typing React components, hooks lifecycle, Express middleware pipelines, and API patterns.',
        category: 'Web Dev',
        price: 129,
        pagesCount: 64,
        previewSnippet: 'export interface UserPayload {\n  id: string;\n  email: string;\n  role: "student" | "admin";\n}',
        downloadUrl: '#',
        tags: ['React', 'TypeScript', 'API', 'Notes'],
        featured: true,
        downloadsCount: 1100
      }
    ],
    lectures: [
      {
        id: 'lec-web-01',
        title: '01. Modern Frontend Architecture & Vite Tooling',
        durationMinutes: 22,
        youtubeVideoId: '6mbwJ2xhgzM',
        description: 'Why modern bundlers like Vite outperform legacy setups; project layout and environment variables.',
        orderIndex: 1,
        freePreview: true,
        notesMarkdown: '# Frontend Architecture\n- Fast HMR with Vite\n- Strict TypeScript config (`tsconfig.json`)'
      },
      {
        id: 'lec-web-02',
        title: '02. Mastering React Hooks & State Management',
        durationMinutes: 35,
        youtubeVideoId: 'RGKi6LSPDLU',
        description: 'useState, useEffect, useMemo, custom hooks, and avoiding re-render bottlenecks.',
        orderIndex: 2,
        freePreview: true,
        notesMarkdown: '# React Hooks\n- Custom hook encapsulation\n- Managing global state via Context API'
      },
      {
        id: 'lec-web-03',
        title: '03. Building Secure Express REST APIs & Authentication',
        durationMinutes: 42,
        youtubeVideoId: 'BLl32FvcdVM',
        description: 'Request handling, CORS configuration, token verification, and database query abstractions.',
        orderIndex: 3,
        freePreview: false,
        notesMarkdown: '# Backend REST API\n- Express router structure\n- Error handling middleware'
      },
      {
        id: 'lec-web-04',
        title: '04. Deployment & Cloud Production Checklist',
        durationMinutes: 28,
        youtubeVideoId: '6mbwJ2xhgzM',
        description: 'Building optimized static assets, containerizing applications, and continuous deployment.',
        orderIndex: 4,
        freePreview: false,
        notesMarkdown: '# Production Deployment\n- Docker container setup\n- Reverse proxying with Nginx'
      }
    ]
  }
];

export const ALL_NOTES_STORE: NoteResource[] = [
  {
    id: 'note-python-cheatsheet',
    title: 'Master Python Automation Cheatsheet & Code Handbook',
    description: 'Complete condensed 48-page reference covering data structures, socket programming, GPIO libraries, and file automation with copy-paste snippets.',
    category: 'Python',
    price: 99,
    pagesCount: 48,
    previewSnippet: 'import serial, time\n# Yash Gayake Automation Routine\nser = serial.Serial("/dev/ttyUSB0", 9600)\ntime.sleep(2)\nser.write(b"ROBOT_INIT_OK\\n")',
    downloadUrl: '#',
    tags: ['Python', 'Cheatsheet', 'PDF Notes', 'Automation'],
    featured: true,
    downloadsCount: 840
  },
  {
    id: 'note-robotics-handbook',
    title: 'Mobile Robotics Kinematics & Motor Drivers Guide',
    description: 'Detailed circuits, H-bridge pinouts, differential drive kinematics equations, and sensor calibration curves.',
    category: 'Robotics',
    price: 149,
    pagesCount: 52,
    previewSnippet: '// PWM Motor Control\nanalogWrite(ENA_PIN, speed);\ndigitalWrite(IN1, HIGH);\ndigitalWrite(IN2, LOW);',
    downloadUrl: '#',
    tags: ['Robotics', 'Circuits', 'Motors', 'Kinematics'],
    featured: true,
    downloadsCount: 620
  },
  {
    id: 'note-linux-handbook',
    title: 'Linux Terminal 100 Commands Cheatsheet & Bash Cookbook',
    description: 'Concise, high-yield guide containing top 100 commands for permissions, networking, process management, and grep/awk/sed text wrangling.',
    category: 'Linux & Security',
    price: 0,
    pagesCount: 38,
    previewSnippet: '# Quick Security Audit\nchmod 600 ~/.ssh/id_ed25519\nufw default deny incoming\nufw allow 22/tcp\nufw enable',
    downloadUrl: '#',
    tags: ['Linux', 'Terminal', 'Bash', 'Free Guide'],
    featured: true,
    downloadsCount: 1950
  },
  {
    id: 'note-web-blueprint',
    title: 'Full-Stack Architecture & TypeScript Cheatsheet',
    description: 'Complete reference for typing React components, hooks lifecycle, Express middleware pipelines, and API patterns.',
    category: 'Web Dev',
    price: 129,
    pagesCount: 64,
    previewSnippet: 'export interface UserPayload {\n  id: string;\n  email: string;\n  role: "student" | "admin";\n}',
    downloadUrl: '#',
    tags: ['React', 'TypeScript', 'API', 'Notes'],
    featured: true,
    downloadsCount: 1100
  },
  {
    id: 'note-dsa-essentials',
    title: 'Data Structures & Algorithms: Pattern Matching & Complexity Handbook',
    description: 'Visual diagrams of arrays, linked lists, trees, graphs, and two-pointer/sliding window algorithmic techniques with Big-O analysis.',
    category: 'DSA',
    price: 199,
    pagesCount: 75,
    previewSnippet: '// Two-Pointer Algorithm Pattern\nlet left = 0, right = arr.length - 1;\nwhile (left < right) {\n  const sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  sum < target ? left++ : right--;\n}',
    downloadUrl: '#',
    tags: ['DSA', 'Algorithms', 'Interview Prep', 'Cheat Sheet'],
    featured: true,
    downloadsCount: 1450
  }
];
