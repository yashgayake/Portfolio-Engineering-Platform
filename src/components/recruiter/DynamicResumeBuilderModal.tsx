import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  Cpu, 
  Code2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import type { SiteSettings, Project, Skill } from '../../types.ts';
import { soundFx } from '../../lib/soundFx.ts';
import { useToast } from '../Toast.tsx';

interface DynamicResumeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  projects?: Project[];
  skills?: Skill[];
}

export function DynamicResumeBuilderModal({
  isOpen,
  onClose,
  settings,
  projects = [],
  skills = []
}: DynamicResumeBuilderModalProps) {
  const { success } = useToast();
  const [profileFocus, setProfileFocus] = useState<'all' | 'robotics' | 'software' | 'fullstack'>('robotics');
  const [includeAcademy, setIncludeAcademy] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);

  if (!isOpen) return null;

  const handlePrintDownload = () => {
    soundFx.playSuccess();
    success('Generating customized resume print sheet...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-neutral-900 border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>Dynamic Recruiter Resume Tailor</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400">
                  EXPORT READY
                </span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Tailor Yash Gayake's credentials according to your specific open requisition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Builder Toolbar Options */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 uppercase">Target Role:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'robotics', label: 'Robotics & Hardware Focus' },
                { id: 'software', label: 'Full-Stack Software Focus' },
                { id: 'all', label: 'Complete Comprehensive Profile' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundFx.playClick();
                    setProfileFocus(opt.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    profileFocus === opt.id
                      ? 'bg-cyan-500 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDownload}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Live Tailored Printable Resume Document */}
        <div className="flex-1 p-6 overflow-y-auto bg-neutral-950/70 font-sans">
          <div className="p-8 rounded-xl bg-white text-neutral-900 shadow-2xl max-w-3xl mx-auto space-y-6 print:shadow-none print:m-0 print:p-0">
            {/* Header Document */}
            <div className="border-b-2 border-neutral-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950">
                  {settings.name || 'YASH GAYAKE'}
                </h1>
                <p className="text-sm font-bold uppercase tracking-wider text-cyan-800 mt-0.5">
                  {profileFocus === 'robotics'
                    ? 'Robotics & Automation Engineer | ROS 2 & Microcontroller Systems'
                    : profileFocus === 'software'
                    ? 'Full-Stack Software Engineer | TypeScript & Cloud APIs'
                    : 'Automation & Robotics Engineer | Full-Stack Developer'}
                </p>
              </div>

              <div className="text-xs font-mono text-neutral-600 space-y-0.5 sm:text-right">
                <p>Email: {settings.email || 'yashgayake900@gmail.com'}</p>
                <p>Location: Pune / Mumbai, India</p>
                <p>Portfolio: yashgayake.dev</p>
              </div>
            </div>

            {/* Profile Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Executive Profile Summary
              </h2>
              <p className="text-xs text-neutral-700 leading-relaxed font-serif">
                {profileFocus === 'robotics'
                  ? 'High-impact Automation & Robotics specialist with deep hands-on expertise in Autonomous Mobile Robots (AMRs), ROS 2, microcontroller architectures (ESP32/Arduino), PID trajectory controllers, and sensor fusion. Dedicated to precision engineering, low-latency firmware, and robust physical computing.'
                  : profileFocus === 'software'
                  ? 'Modern Full-Stack Software Engineer specializing in reactive web applications (React 19, TypeScript), high-throughput Express.js backend services, WebGL/Three.js spatial graphics, and Gemini AI API integrations. Known for scalable architecture and high-performance clean code.'
                  : 'Versatile Robotics & Software Engineer bridging physical hardware automation with modern cloud software and machine intelligence. Proven track record across competitive robotics, autonomous systems, and scalable full-stack applications.'}
              </p>
            </div>

            {/* Core Competencies Grid */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Core Technical Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <p className="font-bold text-neutral-950">Robotics & Embedded:</p>
                  <p className="text-neutral-700">ROS 2, Microcontrollers, ESP32, Arduino, Raspberry Pi, PID Control, Sensors, Ultrasonic/LiDAR, Kinematics</p>
                </div>
                <div>
                  <p className="font-bold text-neutral-950">Software & Architecture:</p>
                  <p className="text-neutral-700">TypeScript, JavaScript, Python, C++, React 19, Node.js, Express, Three.js (WebGL), REST APIs, Git</p>
                </div>
              </div>
            </div>

            {/* Selected Key Projects */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Featured Engineering Implementations
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Autonomous Mobile Robot (AMR) Navigation System</span>
                    <span className="font-mono text-[11px] text-neutral-600">ROS 2 • LiDAR • Python</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed mt-0.5">
                    Designed and built an autonomous differential drive robotic vehicle utilizing SLAM map generation, 2D LiDAR obstacle avoidance algorithms, and closed-loop motor encoder odometry.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Precision 6-DOF Robotic Arm Manipulator</span>
                    <span className="font-mono text-[11px] text-neutral-600">Kinematics • C++ • PWM Servos</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed mt-0.5">
                    Engineered an articulated robotic arm featuring forward and inverse trigonometric kinematics, precision servo angle mapping, and high-frequency PID trajectory smoothing.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Interactive 3D WebGL Portfolio & Autonomous Agent</span>
                    <span className="font-mono text-[11px] text-neutral-600">Three.js • React 19 • Gemini AI</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed mt-0.5">
                    Created an autonomous 3D avatar with real-time biological arm waving kinematics, voice audio synthesis, and an intelligent Gemini AI grounded assistant.
                  </p>
                </div>
              </div>
            </div>

            {/* Educational Outreach & Community */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Education & Community Outreach
              </h2>
              <div className="flex justify-between text-xs font-bold text-neutral-900">
                <span>Yash Gayake Academy (YouTube Education Portal)</span>
                <span className="font-mono text-[11px] text-neutral-600">Lead Instructor</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed mt-0.5">
                Authored complete modular curriculum in Robotics, ROS 2, and Electronics; published free open-source code repositories, practical labs, and downloadable engineering notes for 1000+ students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
