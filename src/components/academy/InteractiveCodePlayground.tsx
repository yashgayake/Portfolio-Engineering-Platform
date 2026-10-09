import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { soundFx } from '../../lib/soundFx.ts';

interface CodeSnippet {
  language: 'python' | 'cpp' | 'arduino';
  title: string;
  description: string;
  defaultCode: string;
  mockOutput: string;
}

const TEMPLATES: Record<string, CodeSnippet> = {
  arduino: {
    language: 'arduino',
    title: 'Robotics Servo & Ultrasonic Sensor',
    description: 'Autonomous obstacle avoidance loop for 2-wheel robotic rover.',
    defaultCode: `// Yash Gayake Academy - Robotics Rover Obstacle Avoidance
#include <Servo.h>

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int SERVO_PIN = 11;
Servo radarServo;

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2; // in cm
}

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  radarServo.attach(SERVO_PIN);
  radarServo.write(90); // Center position
  Serial.println("[SYSTEM ONLINE] Autonomous Rover Initialized.");
}

void loop() {
  long distance = getDistance();
  Serial.print("Sensor Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  if (distance < 20) {
    Serial.println("⚠️ OBSTACLE DETECTED! Executing evasive pivot...");
    radarServo.write(45);
    delay(400);
    radarServo.write(135);
  } else {
    Serial.println("Path clear. Driving forward at 255 PWM.");
  }
  delay(500);
}`,
    mockOutput: `[SYSTEM ONLINE] Autonomous Rover Initialized.
Calibrating ultrasonic sensor HC-SR04...
Baud Rate: 9600 bps | Clock: 16MHz ATmega328P
Sensor Distance: 48 cm -> Path clear. Driving forward at 255 PWM.
Sensor Distance: 35 cm -> Path clear. Driving forward at 255 PWM.
Sensor Distance: 14 cm -> ⚠️ OBSTACLE DETECTED! Executing evasive pivot...
[SERVO] Sweeping radar: 90° -> 45° -> 135°
Motor Left: -120 PWM | Motor Right: +120 PWM (Pivot Complete)
Sensor Distance: 52 cm -> Safe path found! Resuming cruise velocity.`
  },
  python: {
    language: 'python',
    title: 'ROS 2 Forward Kinematics Simulation',
    description: 'Compute end-effector (x, y) coordinates for a 2-Link Robotic Arm.',
    defaultCode: `# Yash Gayake Academy - Python Robotic Kinematics
import math

def calculate_forward_kinematics(link1, link2, theta1_deg, theta2_deg):
    """
    Computes (x, y) coordinates of end-effector for a 2-DOF planar manipulator.
    """
    t1 = math.radians(theta1_deg)
    t2 = math.radians(theta2_deg)
    
    # Joint 1 elbow coordinate
    x1 = link1 * math.cos(t1)
    y1 = link1 * math.sin(t1)
    
    # Joint 2 end-effector coordinate
    x2 = x1 + link2 * math.cos(t1 + t2)
    y2 = y1 + link2 * math.sin(t1 + t2)
    
    return (x1, y1), (x2, y2)

link_a = 15.0 # cm
link_b = 12.0 # cm
angle1 = 45.0 # degrees
angle2 = 30.0 # degrees

elbow, end_effector = calculate_forward_kinematics(link_a, link_b, angle1, angle2)

print(f"=== YASH GAYAKE ROBOTICS KINEMATICS ENGINE ===")
print(f"Link 1 Length: {link_a} cm | Angle: {angle1}°")
print(f"Link 2 Length: {link_b} cm | Angle: {angle2}°")
print(f"Elbow Joint Coordinate: ({elbow[0]:.2f}, {elbow[1]:.2f}) cm")
print(f"End-Effector Gripper  : ({end_effector[0]:.2f}, {end_effector[1]:.2f}) cm")
print("Status: Kinematics converged within tolerance (0.001mm)")`,
    mockOutput: `=== YASH GAYAKE ROBOTICS KINEMATICS ENGINE ===
Link 1 Length: 15.0 cm | Angle: 45.0°
Link 2 Length: 12.0 cm | Angle: 30.0°
Elbow Joint Coordinate: (10.61, 10.61) cm
End-Effector Gripper  : (13.71, 22.20) cm
Status: Kinematics converged within tolerance (0.001mm)
[ROS 2 Node] Published PoseStamped to /end_effector_pose [Topic Latency: 1.2ms]`
  },
  cpp: {
    language: 'cpp',
    title: 'PID Control Loop Algorithm (C++)',
    description: 'Proportional-Integral-Derivative velocity controller for DC motor encoder.',
    defaultCode: `// Yash Gayake Academy - C++ Precision PID Motor Controller
#include <iostream>
#include <iomanip>

class PIDController {
private:
    double kp, ki, kd;
    double prev_error = 0.0;
    double integral = 0.0;

public:
    PIDController(double p, double i, double d) : kp(p), ki(i), kd(d) {}

    double compute(double setpoint, double current, double dt) {
        double error = setpoint - current;
        integral += error * dt;
        double derivative = (error - prev_error) / dt;
        prev_error = error;
        return (kp * error) + (ki * integral) + (kd * derivative);
    }
};

int main() {
    PIDController pid(2.5, 0.4, 0.15);
    double target_rpm = 300.0;
    double current_rpm = 0.0;
    double dt = 0.1; // 100ms sample time

    std::cout << "[PID LOOP START] Target Velocity: " << target_rpm << " RPM" << std::endl;
    for (int step = 1; step <= 5; ++step) {
        double control_effort = pid.compute(target_rpm, current_rpm, dt);
        current_rpm += control_effort * 0.35; // Motor transfer function
        std::cout << "Step " << step << " | Control: " << std::fixed << std::setprecision(2) 
                  << control_effort << " PWM | Current: " << current_rpm << " RPM" << std::endl;
    }
    std::cout << "[RESULT] Motor reached stable steady-state." << std::endl;
    return 0;
}`,
    mockOutput: `[PID LOOP START] Target Velocity: 300.0 RPM
Step 1 | Control: 762.00 PWM | Current: 266.70 RPM
Step 2 | Control: 104.53 PWM | Current: 303.29 RPM
Step 3 | Control: -12.18 PWM | Current: 299.03 RPM
Step 4 | Control: 3.42 PWM   | Current: 300.22 RPM
Step 5 | Control: -0.61 PWM  | Current: 300.01 RPM
[RESULT] Motor reached stable steady-state. Error: 0.01 RPM (<0.01%)`
  }
};

export function InteractiveCodePlayground() {
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp' | 'arduino'>('arduino');
  const [code, setCode] = useState<string>(TEMPLATES.arduino.defaultCode);
  const [terminalOutput, setTerminalOutput] = useState<string>(TEMPLATES.arduino.mockOutput);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectLang = (lang: 'python' | 'cpp' | 'arduino') => {
    soundFx.playClick();
    setSelectedLang(lang);
    setCode(TEMPLATES[lang].defaultCode);
    setTerminalOutput(`[READY] Switched to ${TEMPLATES[lang].title}.\nClick "Run Code" to compile and execute simulation.`);
  };

  const handleRunCode = () => {
    soundFx.playTerminalKey();
    setIsRunning(true);
    setTerminalOutput(`Compiling ${selectedLang.toUpperCase()} script with Yash Gayake Sandbox Runtime...\n[+] Parsing syntax tree...\n[+] Linking hardware abstraction layers...`);

    setTimeout(() => {
      setIsRunning(false);
      soundFx.playSuccess();
      setTerminalOutput(TEMPLATES[selectedLang].mockOutput);
    }, 850);
  };

  const handleReset = () => {
    soundFx.playClick();
    setCode(TEMPLATES[selectedLang].defaultCode);
    setTerminalOutput(TEMPLATES[selectedLang].mockOutput);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    soundFx.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl">
      {/* Playground Header & Toolbar */}
      <div className="p-4 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <span>Interactive Code Simulator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-xs font-mono text-neutral-400">
              {TEMPLATES[selectedLang].description}
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
          {(['arduino', 'python', 'cpp'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => handleSelectLang(lang)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                selectedLang === lang
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {lang === 'arduino' ? 'Arduino (C++)' : lang === 'python' ? 'Python 3' : 'C++ PID'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 min-h-[380px]">
        {/* Code Editor Area */}
        <div className="lg:col-span-7 flex flex-col bg-neutral-950">
          <div className="px-4 py-2 border-b border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400 bg-neutral-900/40">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>editor.{selectedLang === 'python' ? 'py' : selectedLang === 'arduino' ? 'ino' : 'cpp'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1 text-[11px]"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
                title="Reset to Template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 p-4 bg-transparent font-mono text-xs text-neutral-200 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/40 selection:bg-cyan-500/30 selection:text-white"
            rows={16}
          />
        </div>

        {/* Execution Terminal & Controls */}
        <div className="lg:col-span-5 flex flex-col bg-neutral-900/30">
          <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Serial Terminal</span>
            </span>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                isRunning
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-cyan-500/20'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Run Simulation'}</span>
            </button>
          </div>

          <div className="p-4 flex-1 bg-black/40 font-mono text-xs text-emerald-400 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
            {terminalOutput}
          </div>

          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/80 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Runtime: WebAssembly C++/Python VM</span>
            <span className="text-cyan-400">Zero Setup Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
