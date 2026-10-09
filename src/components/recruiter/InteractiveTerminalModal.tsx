import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, Maximize2, Sparkles, CornerDownLeft } from 'lucide-react';
import { soundFx } from '../../lib/soundFx.ts';

interface InteractiveTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenResume: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

const HELP_TEXT = `
AVAILABLE YASH-OS COMMANDS:
  help               - List all available terminal commands
  skills             - Inspect hardware, robotics & full-stack software skills
  projects           - List top engineering projects with live links
  experience         - Show robotics internships & competitions timeline
  education          - Display degree, institute & academic background
  academy            - Print Yash Gayake YouTube Academy details & course links
  resume             - Open printable PDF resume viewer
  contact            - Print email, GitHub, LinkedIn & location
  whoami             - Print current user session context
  date               - Print system timestamp
  clear              - Clear terminal window buffer
  exit               - Close this terminal modal
`;

export function InteractiveTerminalModal({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenResume
}: InteractiveTerminalModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1">
          <p className="text-cyan-400 font-bold">
            ⚡ YASH-OS v2.4 (x86_64-robotics-linux-gnu)
          </p>
          <p className="text-neutral-400">
            Welcome to Yash Gayake's Interactive Developer Terminal.
          </p>
          <p className="text-neutral-400">
            Type <span className="text-cyan-300 font-bold">'help'</span> to see available commands or <span className="text-cyan-300 font-bold">'projects'</span> to explore work.
          </p>
        </div>
      )
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundFx.playTerminalKey();
    const cmd = trimmed.toLowerCase();

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (cmd === 'exit' || cmd === 'quit') {
      onClose();
      return;
    }

    let output: string | React.ReactNode = '';
    let isError = false;

    switch (cmd) {
      case 'help':
        output = <pre className="whitespace-pre-wrap text-neutral-300">{HELP_TEXT}</pre>;
        break;

      case 'skills':
        output = (
          <div className="space-y-1.5 text-neutral-300">
            <p className="text-cyan-400 font-bold">[ROBOTICS & HARDWARE]:</p>
            <p className="pl-3 text-neutral-400">ROS 2, Microcontrollers, ESP32, Arduino, Raspberry Pi, PWM Motors, Sensors, PCB Design, Kinematics, PID Controllers</p>
            <p className="text-cyan-400 font-bold">[SOFTWARE & CLOUD]:</p>
            <p className="pl-3 text-neutral-400">TypeScript, React 19, Node.js, Express, Python 3, C++, Tailwind CSS, Three.js (WebGL), REST APIs, Docker, Git</p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-neutral-300">
            <p className="text-cyan-400 font-bold">TOP FEATURED ENGINEERING PROJECTS:</p>
            <div className="pl-2 space-y-1">
              <p>1. <strong className="text-white">Autonomous Mobile Robot (AMR):</strong> ROS 2 + SLAM navigation with LiDAR obstacle mapping.</p>
              <p>2. <strong className="text-white">6-DOF Robotic Manipulator:</strong> Inverse kinematics engine with real-time trajectory planning.</p>
              <p>3. <strong className="text-white">IoT Smart Greenhouse:</strong> Multi-sensor environmental telemetry with automated irrigation.</p>
              <p>4. <strong className="text-white">Gemini AI Grounded Agent:</strong> RAG portfolio intelligence with multimodal audio reasoning.</p>
            </div>
          </div>
        );
        break;

      case 'resume':
        output = (
          <p className="text-emerald-400">
            Opening Resume Modal Viewer... [SUCCESS]
          </p>
        );
        onOpenResume();
        break;

      case 'academy':
        output = (
          <div className="space-y-1 text-neutral-300">
            <p className="text-rose-400 font-bold">🎓 YASH GAYAKE ACADEMY (YouTube Teaching Channel)</p>
            <p className="text-neutral-400">Full-length practical tutorials on Robotics, ROS 2, Arduino microcontrollers, and modern web software development.</p>
            <p className="text-neutral-400">Includes downloadable handwritten notes, cheatsheets, and live code playground.</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-neutral-300 font-mono text-xs">
            <p>Email: <span className="text-cyan-400">yashgayake900@gmail.com</span></p>
            <p>GitHub: <a href="https://github.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/yashgayake</a></p>
            <p>LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">linkedin.com/in/yashgayake</a></p>
            <p>Location: Pune / Mumbai, India</p>
          </div>
        );
        break;

      case 'whoami':
        output = "guest@yash-os (Recruiter / Developer Session with interactive sudo privileges)";
        break;

      case 'date':
        output = new Date().toUTCString();
        break;

      default:
        isError = true;
        output = `command not found: "${trimmed}". Type 'help' to see list of valid commands.`;
        break;
    }

    setHistory(prev => [...prev, { command: trimmed, output, isError }]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border border-neutral-700 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="ml-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>bash - yash@developer-rig:~</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Screen Buffer */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3 bg-neutral-950/95 selection:bg-cyan-500/30 selection:text-white">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-cyan-400 font-bold">yash@portfolio:~$</span>
                <span className="text-white font-semibold">{item.command}</span>
              </div>
              <div className={`leading-relaxed ${item.isError ? 'text-rose-400' : 'text-neutral-200'}`}>
                {item.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Interactive Prompt Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleCommand(inputVal);
          }}
          className="p-3 bg-neutral-900/80 border-t border-neutral-800 flex items-center gap-2"
        >
          <span className="text-xs font-mono text-cyan-400 font-bold shrink-0">
            yash@portfolio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type 'help', 'skills', 'projects', 'resume'..."
            className="flex-1 bg-transparent font-mono text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono"
            title="Execute"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
