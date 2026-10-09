import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, ChevronRight, FileCheck } from 'lucide-react';
import { soundFx } from '../../lib/soundFx.ts';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ROBOTICS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "In robotics control systems, what does the 'D' term in a PID controller primarily minimize?",
    options: [
      "Steady-state offset error",
      "System overshoot and rate of error change",
      "Motor input current consumption",
      "Sensor sampling latency"
    ],
    correctIndex: 1,
    explanation: "The Derivative (D) term predicts future error by calculating the rate of change, acting as a damper to minimize overshoot and oscillations."
  },
  {
    id: 2,
    question: "What is the primary difference between Forward Kinematics (FK) and Inverse Kinematics (IK)?",
    options: [
      "FK is for wheels; IK is for robotic arms only",
      "FK computes end-effector position from joint angles; IK computes required joint angles for a desired position",
      "IK is linear whereas FK is always non-linear",
      "FK requires ROS 2, while IK works on Arduino"
    ],
    correctIndex: 1,
    explanation: "Forward Kinematics maps given joint angles to find where the gripper is. Inverse Kinematics solves the complex trigonometric equation backwards to find the joint angles to reach a target."
  },
  {
    id: 3,
    question: "Why are optical encoders essential on DC gear motors in autonomous rovers?",
    options: [
      "To provide closed-loop feedback on wheel rotation and velocity (Odometry)",
      "To prevent motor driver overheating",
      "To measure ambient room lighting",
      "To provide high-voltage power surge protection"
    ],
    correctIndex: 0,
    explanation: "Encoders output quadrature pulses that allow microcontrollers to calculate precise distance traveled and wheel velocity for dead reckoning odometry."
  },
  {
    id: 4,
    question: "In ROS 2 (Robot Operating System), which communication pattern is best for requesting a 1-time sensor calibration?",
    options: [
      "Publish/Subscribe Topic",
      "Service (Request/Response client-server)",
      "Action with feedback loop",
      "Raw TCP socket broadcast"
    ],
    correctIndex: 1,
    explanation: "ROS 2 Services provide synchronous request-response communication, ideal for one-off commands like calibration or resetting pose."
  },
  {
    id: 5,
    question: "Which microcontroller communication protocol is full-duplex, synchronous, and uses MISO/MOSI lines?",
    options: [
      "I2C (Inter-Integrated Circuit)",
      "UART (Universal Asynchronous Receiver-Transmitter)",
      "SPI (Serial Peripheral Interface)",
      "CAN Bus (Controller Area Network)"
    ],
    correctIndex: 2,
    explanation: "SPI uses Master Out Slave In (MOSI) and Master In Slave Out (MISO) along with a clock (SCK) and Chip Select (CS) for high-speed full-duplex transfers."
  }
];

interface StudentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  onPassQuiz: (score: number, total: number) => void;
}

export function StudentQuizModal({ isOpen, onClose, courseTitle, onPassQuiz }: StudentQuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = ROBOTICS_QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = ROBOTICS_QUIZ_QUESTIONS.length;

  const handleSelectOption = (optIdx: number) => {
    soundFx.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      ROBOTICS_QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      setIsSubmitted(true);
      soundFx.playSuccess();
      onPassQuiz(correctCount, totalQuestions);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Score calculation
  let correctCount = 0;
  ROBOTICS_QUIZ_QUESTIONS.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const passed = correctCount >= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>Certification Knowledge Assessment</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                  5 Questions
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">{courseTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                  <span>Question {currentIdx + 1} of {totalQuestions}</span>
                  <span>Pass Criterion: 80% (4/5)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
                <p className="text-sm sm:text-base font-semibold text-neutral-100 leading-snug">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-semibold shadow-sm'
                          : 'bg-neutral-950/80 hover:bg-neutral-800/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono flex items-center justify-center border ${
                          isSelected ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                {passed ? <FileCheck className="w-8 h-8 text-emerald-400" /> : <RotateCcw className="w-8 h-8 text-rose-400" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-100">
                  {passed ? 'Congratulations! You Passed!' : 'Assessment Incomplete'}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-neutral-400 mt-1">
                  You scored <span className="text-cyan-400 font-bold text-base">{correctCount}</span> out of {totalQuestions} ({Math.round((correctCount / totalQuestions) * 100)}%)
                </p>
              </div>

              {passed ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-left font-mono space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Yash Gayake Academy Certification Unlocked!</span>
                  </p>
                  <p className="text-neutral-300 font-normal">
                    Your official certificate is generated with verifiable serial hash and distinction honor.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left font-mono">
                  Review the video lectures and notes, then retake the assessment to unlock your certificate (Requires at least 4/5 correct).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-neutral-200"
              >
                Exit Assessment
              </button>
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIdx] === undefined}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  selectedAnswers[currentIdx] !== undefined
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/20'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'Submit & Grade'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-neutral-950 hover:bg-cyan-400"
              >
                {passed ? 'Claim Certificate' : 'Back to Class'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
