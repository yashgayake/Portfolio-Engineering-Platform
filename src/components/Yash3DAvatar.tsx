import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  ChevronRight,
  Play,
  Hand
} from 'lucide-react';

interface Avatar3DProps {
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  scale?: number;
  height?: number | string;
  showControls?: boolean;
  enableSpeech?: boolean;
}

interface DialogueItem {
  id: string;
  text: string;
  badge: string;
  pose: 'wave' | 'chill' | 't-pose';
  durationMs: number;
}

const AUTONOMOUS_DIALOGUES: DialogueItem[] = [
  {
    id: 'intro',
    text: "Hi there! 👋 Welcome to my portfolio! I'm Yash Gayake. Explore my robotics & software work!",
    badge: 'WELCOME • SAYING HI',
    pose: 'wave',
    durationMs: 7000
  },
  {
    id: 'robotics',
    text: "I design autonomous robots, ROS systems, IoT microcontrollers, and precision control algorithms! 🤖",
    badge: 'ROBOTICS & HARDWARE',
    pose: 'chill',
    durationMs: 7500
  },
  {
    id: 'software',
    text: "I build responsive full-stack software, TypeScript web applications, and fast cloud APIs! 💻",
    badge: 'FULL-STACK SOFTWARE',
    pose: 'wave',
    durationMs: 7500
  },
  {
    id: 'academy',
    text: "Don't miss Yash Gayake Academy for free practical robotics tutorials and video courses on YouTube! 🎓",
    badge: 'ACADEMY COURSES',
    pose: 'chill',
    durationMs: 7500
  },
  {
    id: 'connect',
    text: "You can drag me with your mouse to rotate 360°, check out my projects, and let's collaborate! 🚀",
    badge: '360° INTERACTIVE',
    pose: 'wave',
    durationMs: 7500
  }
];

export function Yash3DAvatar({
  className = '',
  interactive = true,
  autoRotate = false,
  scale = 1.0,
  height = '100%',
  showControls = true,
  enableSpeech = true
}: Avatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [currentPose, setCurrentPose] = useState<'t-pose' | 'wave' | 'chill'>('wave');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sound_fx_muted') === 'true';
    }
    return false;
  });
  const [welcomeBannerVisible, setWelcomeBannerVisible] = useState(true);

  // Sync voiceMuted with global navbar speaker toggle
  useEffect(() => {
    const handleGlobalMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      const isMuted = customEvent.detail?.isMuted ?? false;
      setVoiceMuted(isMuted);
      if (isMuted) {
        setIsSpeaking(false);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    };

    window.addEventListener('sound_fx_mute_changed', handleGlobalMuteChange);
    return () => {
      window.removeEventListener('sound_fx_mute_changed', handleGlobalMuteChange);
    };
  }, []);

  // References for Three.js animations
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const rightForearmRef = useRef<THREE.Group | null>(null);
  const rightHandRef = useRef<THREE.Group | null>(null);
  const leftForearmRef = useRef<THREE.Group | null>(null);
  const leftHandRef = useRef<THREE.Group | null>(null);
  const leftEyeMeshRef = useRef<THREE.Mesh | null>(null);
  const rightEyeMeshRef = useRef<THREE.Mesh | null>(null);
  const mouthRef = useRef<THREE.Mesh | null>(null);

  // Robust Speech Synthesizer
  const speakCurrentText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (voiceMuted || localStorage.getItem('sound_fx_muted') === 'true') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.15;
      utterance.rate = 1.03;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => 
        (v.lang.startsWith('en') || v.lang.startsWith('hi')) && 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // User explicitly triggers voice audio
  const handleStartSpeaking = () => {
    setAudioStarted(true);
    setVoiceMuted(false);
    speakCurrentText(AUTONOMOUS_DIALOGUES[dialogueIndex].text);
  };

  // Re-trigger dynamic welcome wave animation manually if clicked
  const triggerManualWelcome = () => {
    setCurrentPose('wave');
    setWelcomeBannerVisible(true);
    if (!audioStarted) {
      handleStartSpeaking();
    } else {
      speakCurrentText(AUTONOMOUS_DIALOGUES[0].text);
    }
  };

  // Cycle dialogues autonomously
  useEffect(() => {
    if (!enableSpeech) return;

    const currentItem = AUTONOMOUS_DIALOGUES[dialogueIndex];
    if (currentItem) {
      setCurrentPose(currentItem.pose);
      if (audioStarted && !voiceMuted) {
        speakCurrentText(currentItem.text);
      }
    }

    const timer = setTimeout(() => {
      setDialogueIndex(prev => (prev + 1) % AUTONOMOUS_DIALOGUES.length);
    }, currentItem.durationMs);

    return () => clearTimeout(timer);
  }, [dialogueIndex, audioStarted, voiceMuted, enableSpeech]);

  // First time auto-speak attempt on user interaction with page
  useEffect(() => {
    if (!enableSpeech || audioStarted) return;

    const enableOnInteraction = () => {
      if (!audioStarted) {
        setAudioStarted(true);
        speakCurrentText(AUTONOMOUS_DIALOGUES[0].text);
      }
      window.removeEventListener('click', enableOnInteraction);
      window.removeEventListener('keydown', enableOnInteraction);
    };

    window.addEventListener('click', enableOnInteraction, { once: true });
    window.addEventListener('keydown', enableOnInteraction, { once: true });

    return () => {
      window.removeEventListener('click', enableOnInteraction);
      window.removeEventListener('keydown', enableOnInteraction);
    };
  }, [enableSpeech, audioStarted]);

  // Three.js Scene Setup with On-Mount Dynamic Welcome Animation Sequence
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Start camera slightly zoomed out for the dynamic entry transition
    camera.position.set(0, 0.35, 4.3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // Dynamic Welcome Aura Glow Light (pulses on mount)
    const welcomeAuraLight = new THREE.PointLight(0x38bdf8, 3.5, 6);
    welcomeAuraLight.position.set(0, 1.2, 1.5);
    scene.add(welcomeAuraLight);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.3);
    keyLight.position.set(3, 4, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.3);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // Materials
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1918,
      roughness: 0.65,
      metalness: 0.08
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdfd2,
      roughness: 0.45,
      metalness: 0.02
    });

    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x545558,
      roughness: 0.75,
      metalness: 0.05
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f7,
      roughness: 0.6,
      metalness: 0.0
    });

    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.05
    });

    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x3d2319,
      roughness: 0.2,
      metalness: 0.1
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x120a07 });
    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf49d90,
      transparent: true,
      opacity: 0.45
    });

    // Model Group - Start scaled down slightly for smooth on-mount entrance pop
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, -0.4, 0);
    avatarGroup.scale.set(0.75, 0.75, 0.75);
    avatarGroupRef.current = avatarGroup;

    // --- HEAD & FACE ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.72, 0);
    headGroupRef.current = headGroup;

    const headGeo = new THREE.SphereGeometry(0.48, 32, 32);
    headGeo.scale(1.08, 0.95, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.12, 16, 16);
    earGeo.scale(0.5, 0.9, 0.6);
    const leftEar = new THREE.Mesh(earGeo, skinMaterial);
    leftEar.position.set(-0.52, -0.02, 0);
    leftEar.rotation.z = 0.2;
    headGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.x = 0.52;
    rightEar.rotation.z = -0.2;
    headGroup.add(rightEar);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.11, 24, 24);
    eyeGeo.scale(0.85, 1.15, 0.3);

    const irisL = new THREE.Mesh(eyeGeo, irisMat);
    irisL.position.set(-0.21, -0.04, 0.44);
    irisL.rotation.y = -0.12;

    const pupilGeo = new THREE.SphereGeometry(0.065, 16, 16);
    pupilGeo.scale(0.8, 1.1, 0.3);
    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.21, -0.04, 0.46);
    pupilL.rotation.y = -0.12;

    const glint1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), highlightMat);
    glint1.position.set(-0.22, 0.01, 0.475);
    const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), highlightMat);
    glint2.position.set(-0.19, -0.07, 0.475);

    const eyeGroupL = new THREE.Group();
    eyeGroupL.add(irisL, pupilL, glint1, glint2);
    headGroup.add(eyeGroupL);
    leftEyeMeshRef.current = irisL;

    const irisR = new THREE.Mesh(eyeGeo, irisMat);
    irisR.position.set(0.21, -0.04, 0.44);
    irisR.rotation.y = 0.12;
    const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    pupilR.position.set(0.21, -0.04, 0.46);
    pupilR.rotation.y = 0.12;

    const glint1R = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), highlightMat);
    glint1R.position.set(0.20, 0.01, 0.475);
    const glint2R = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), highlightMat);
    glint2R.position.set(0.23, -0.07, 0.475);

    const eyeGroupR = new THREE.Group();
    eyeGroupR.add(irisR, pupilR, glint1R, glint2R);
    headGroup.add(eyeGroupR);
    rightEyeMeshRef.current = irisR;

    // Smile & Talking Mouth
    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.065, -0.175, 0.46),
      new THREE.Vector3(0, -0.215, 0.475),
      new THREE.Vector3(0.065, -0.175, 0.46)
    );
    const mouthGeo = new THREE.TubeGeometry(mouthCurve, 12, 0.013, 8, false);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5a2d24 });
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    headGroup.add(mouthMesh);
    mouthRef.current = mouthMesh;

    // Blush
    const blushGeo = new THREE.CircleGeometry(0.065, 16);
    const blushL = new THREE.Mesh(blushGeo, blushMat);
    blushL.position.set(-0.31, -0.13, 0.42);
    blushL.rotation.y = -0.3;
    const blushR = new THREE.Mesh(blushGeo, blushMat);
    blushR.position.set(0.31, -0.13, 0.42);
    blushR.rotation.y = 0.3;
    headGroup.add(blushL, blushR);

    // Eyebrows
    const browMat = new THREE.MeshBasicMaterial({ color: 0x221d1b });
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.01), browMat);
    browL.position.set(-0.22, 0.14, 0.46);
    browL.rotation.z = -0.08;
    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.016, 0.01), browMat);
    browR.position.set(0.22, 0.14, 0.46);
    browR.rotation.z = 0.08;
    headGroup.add(browL, browR);

    // Hair
    const hairGroup = new THREE.Group();
    const hairCapGeo = new THREE.SphereGeometry(0.52, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMaterial);
    hairCap.position.set(0, 0.04, -0.04);
    hairCap.castShadow = true;
    hairGroup.add(hairCap);

    const createHairStrand = (
      scaleVec: [number, number, number],
      pos: [number, number, number],
      rot: [number, number, number]
    ) => {
      const strandGeo = new THREE.ConeGeometry(0.14, 0.45, 8);
      strandGeo.translate(0, -0.2, 0);
      const strand = new THREE.Mesh(strandGeo, hairMaterial);
      strand.scale.set(...scaleVec);
      strand.position.set(...pos);
      strand.rotation.set(...rot);
      strand.castShadow = true;
      return strand;
    };

    hairGroup.add(createHairStrand([0.9, 1.0, 0.7], [0, 0.34, 0.46], [0.25, 0, 0]));
    hairGroup.add(createHairStrand([0.8, 0.95, 0.6], [-0.14, 0.32, 0.45], [0.25, 0.15, -0.15]));
    hairGroup.add(createHairStrand([0.8, 0.95, 0.6], [0.14, 0.32, 0.45], [0.25, -0.15, 0.15]));
    hairGroup.add(createHairStrand([0.75, 0.85, 0.6], [-0.28, 0.26, 0.42], [0.2, 0.35, -0.3]));
    hairGroup.add(createHairStrand([0.75, 0.85, 0.6], [0.28, 0.26, 0.42], [0.2, -0.35, 0.3]));
    hairGroup.add(createHairStrand([0.8, 1.1, 0.7], [-0.46, 0.08, 0.22], [0, 0.2, -0.2]));
    hairGroup.add(createHairStrand([0.8, 1.1, 0.7], [0.46, 0.08, 0.22], [0, -0.2, 0.2]));

    for (let i = -3; i <= 3; i++) {
      const angle = (i / 3) * 1.2;
      const x = Math.sin(angle) * 0.44;
      const z = -Math.cos(angle) * 0.44;
      hairGroup.add(createHairStrand([0.85, 1.05, 0.7], [x, -0.12, z], [-0.3, angle, -angle * 0.3]));
    }
    hairGroup.add(createHairStrand([1.1, 0.9, 0.9], [0.06, 0.52, -0.05], [0.1, 0.3, 0.2]));
    hairGroup.add(createHairStrand([0.9, 0.8, 0.8], [-0.15, 0.49, 0.04], [0.15, -0.2, -0.2]));

    headGroup.add(hairGroup);
    avatarGroup.add(headGroup);

    // --- TORSO ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.08, 0);

    const shirtGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.52, 24);
    const shirtMesh = new THREE.Mesh(shirtGeo, shirtMaterial);
    shirtMesh.castShadow = true;
    torsoGroup.add(shirtMesh);

    const jacketGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.56, 24, 1, true, 0.45, Math.PI * 2 - 0.9);
    const jacketMesh = new THREE.Mesh(jacketGeo, suitMaterial);
    jacketMesh.position.y = -0.02;
    jacketMesh.castShadow = true;
    torsoGroup.add(jacketMesh);

    const lapelGeo = new THREE.BoxGeometry(0.08, 0.32, 0.04);
    const leftLapel = new THREE.Mesh(lapelGeo, suitMaterial);
    leftLapel.position.set(-0.16, 0.08, 0.26);
    leftLapel.rotation.set(-0.05, 0.25, 0.12);
    torsoGroup.add(leftLapel);

    const rightLapel = leftLapel.clone();
    rightLapel.position.x = 0.16;
    rightLapel.rotation.set(-0.05, -0.25, -0.12);
    torsoGroup.add(rightLapel);

    const buttonGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12);
    buttonGeo.rotateX(Math.PI / 2);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x1f1f21, roughness: 0.3 });
    const buttonMesh = new THREE.Mesh(buttonGeo, buttonMat);
    buttonMesh.position.set(-0.1, -0.06, 0.275);
    torsoGroup.add(buttonMesh);

    avatarGroup.add(torsoGroup);

    // --- ACCURATE ANATOMICAL ARMS & DETAILED HANDS ---
    const createDetailedHand = (isRight: boolean) => {
      const handContainer = new THREE.Group();

      // Palm (rounded rectangular box)
      const palmGeo = new THREE.BoxGeometry(0.09, 0.10, 0.04);
      const palmMesh = new THREE.Mesh(palmGeo, skinMaterial);
      palmMesh.position.y = -0.05;
      palmMesh.castShadow = true;
      handContainer.add(palmMesh);

      // Thumb
      const thumbGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.055, 12);
      thumbGeo.translate(0, 0.025, 0);
      const thumbMesh = new THREE.Mesh(thumbGeo, skinMaterial);
      thumbMesh.position.set(isRight ? -0.05 : 0.05, -0.035, 0.015);
      thumbMesh.rotation.z = isRight ? 0.65 : -0.65;
      thumbMesh.rotation.x = 0.2;
      handContainer.add(thumbMesh);

      // 4 Fingers
      for (let f = 0; f < 4; f++) {
        const fingerX = (f - 1.5) * 0.022;
        const fingerLen = f === 1 || f === 2 ? 0.055 : 0.048;
        const fingerGeo = new THREE.CylinderGeometry(0.014, 0.016, fingerLen, 10);
        fingerGeo.translate(0, -fingerLen / 2, 0);
        const fingerMesh = new THREE.Mesh(fingerGeo, skinMaterial);
        fingerMesh.position.set(fingerX, -0.10, 0);
        handContainer.add(fingerMesh);
      }

      return handContainer;
    };

    // RIGHT ARM: Shoulder -> Upper Arm -> Elbow Joint -> Forearm -> Hand
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.32, 0.26, 0);

    const rightUpperSleeveGeo = new THREE.CylinderGeometry(0.09, 0.082, 0.24, 16);
    rightUpperSleeveGeo.translate(0, -0.12, 0);
    const rightUpperSleeve = new THREE.Mesh(rightUpperSleeveGeo, suitMaterial);
    rightUpperSleeve.castShadow = true;
    rightShoulder.add(rightUpperSleeve);

    // Right Elbow & Forearm
    const rightForearm = new THREE.Group();
    rightForearm.position.set(0, -0.22, 0);

    const rightLowerSleeveGeo = new THREE.CylinderGeometry(0.082, 0.075, 0.22, 16);
    rightLowerSleeveGeo.translate(0, -0.11, 0);
    const rightLowerSleeve = new THREE.Mesh(rightLowerSleeveGeo, suitMaterial);
    rightLowerSleeve.castShadow = true;
    rightForearm.add(rightLowerSleeve);

    // White Shirt Cuff at wrist
    const cuffGeo = new THREE.CylinderGeometry(0.076, 0.076, 0.03, 16);
    cuffGeo.translate(0, -0.22, 0);
    const rightCuff = new THREE.Mesh(cuffGeo, shirtMaterial);
    rightForearm.add(rightCuff);

    // Right Hand
    const rightHand = createDetailedHand(true);
    rightHand.position.set(0, -0.23, 0);
    rightForearm.add(rightHand);

    rightShoulder.add(rightForearm);
    avatarGroup.add(rightShoulder);

    rightArmGroupRef.current = rightShoulder;
    rightForearmRef.current = rightForearm;
    rightHandRef.current = rightHand;

    // LEFT ARM: Shoulder -> Upper Arm -> Elbow -> Forearm -> Hand
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.32, 0.26, 0);

    const leftUpperSleeve = rightUpperSleeve.clone();
    leftShoulder.add(leftUpperSleeve);

    const leftForearm = new THREE.Group();
    leftForearm.position.set(0, -0.22, 0);

    const leftLowerSleeve = rightLowerSleeve.clone();
    leftForearm.add(leftLowerSleeve);

    const leftCuff = rightCuff.clone();
    leftForearm.add(leftCuff);

    const leftHand = createDetailedHand(false);
    leftHand.position.set(0, -0.23, 0);
    leftForearm.add(leftHand);

    leftShoulder.add(leftForearm);
    avatarGroup.add(leftShoulder);

    leftArmGroupRef.current = leftShoulder;
    leftForearmRef.current = leftForearm;
    leftHandRef.current = leftHand;

    // --- LEGS & SNEAKERS ---
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.13, -0.22, 0);
    const pantGeo = new THREE.CylinderGeometry(0.105, 0.1, 0.55, 16);
    pantGeo.translate(0, -0.26, 0);
    const leftPant = new THREE.Mesh(pantGeo, suitMaterial);
    leftPant.castShadow = true;
    leftLeg.add(leftPant);

    const shoeGeo = new THREE.BoxGeometry(0.14, 0.11, 0.26);
    shoeGeo.translate(0, -0.54, 0.05);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMaterial);
    leftShoe.castShadow = true;
    leftLeg.add(leftShoe);
    avatarGroup.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.13, -0.22, 0);
    const rightPant = leftPant.clone();
    rightLeg.add(rightPant);
    const rightShoe = leftShoe.clone();
    rightLeg.add(rightShoe);
    avatarGroup.add(rightLeg);

    // Ground Ring
    const ringGeo = new THREE.RingGeometry(0.7, 0.85, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.84;
    avatarGroup.add(ringMesh);

    scene.add(avatarGroup);

    // Mouse Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        if (headGroupRef.current) {
          headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, normX * 0.35, 0.1);
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -normY * 0.2, 0.1);
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.012;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.015;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.35, Math.min(0.35, targetRotationX));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop with Multi-Phase Mount Welcome Sequence
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // =========================================================================
      // DYNAMIC ON-MOUNT WELCOME SEQUENCE (Elapsed Time: 0s to 5.5s)
      // Phase 1 (0s - 1.2s): Smooth camera dolly-in & model scale pop into view
      // Phase 2 (0.2s - 4.5s): Animated greeting head nod & energetic friendly waving
      // Phase 3 (4.5s+): Transitions seamlessly into standard continuous interactive mode
      // =========================================================================
      const isWelcomePhase = elapsedTime < 4.8;

      if (isWelcomePhase) {
        // Smooth camera dolly-in from 4.3 to 3.8
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3.8, 0.06);

        // Smooth scale pop & rise onto pedestal
        if (avatarGroupRef.current) {
          avatarGroupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
          avatarGroupRef.current.position.y = THREE.MathUtils.lerp(avatarGroupRef.current.position.y, -0.15, 0.08);
        }

        // Welcome aura pulse
        welcomeAuraLight.intensity = Math.sin(elapsedTime * 6.0) * 1.5 + 2.5;

        // Friendly welcoming head nod & tilt towards the visitor
        if (headGroupRef.current) {
          const welcomeHeadBob = Math.sin(elapsedTime * 3.5) * 0.08;
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -0.05 + welcomeHeadBob, 0.12);
          headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, Math.sin(elapsedTime * 2.0) * 0.1, 0.12);
        }
      } else {
        // Regular camera position
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3.8, 0.05);
        welcomeAuraLight.intensity = THREE.MathUtils.lerp(welcomeAuraLight.intensity, 0.8, 0.05);
      }

      // 360 Auto-Rotation
      if (isRotating && !isDragging) {
        targetRotationY += 0.007;
      }

      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y = THREE.MathUtils.lerp(avatarGroupRef.current.rotation.y, targetRotationY, 0.08);
        avatarGroupRef.current.rotation.x = THREE.MathUtils.lerp(avatarGroupRef.current.rotation.x, targetRotationX, 0.08);

        // Breathing idle
        const breath = Math.sin(elapsedTime * 2.2) * 0.018;
        if (!isWelcomePhase) {
          avatarGroupRef.current.position.y = -0.15 + breath;
        }
        ringMesh.rotation.z += 0.012;
      }

      // Mouth talking sync (active when speaking or during initial welcome burst)
      if (mouthRef.current) {
        if (isSpeaking || (isWelcomePhase && elapsedTime > 0.4 && elapsedTime < 3.2)) {
          const mouthOpen = Math.abs(Math.sin(elapsedTime * 15.0)) * 0.6 + 0.8;
          mouthRef.current.scale.set(1.0, mouthOpen, 1.0);
        } else {
          mouthRef.current.scale.set(1.0, 1.0, 1.0);
        }
      }

      // Real Anatomical Hand Wave & Welcome Arm Gestures
      if (
        rightArmGroupRef.current &&
        rightForearmRef.current &&
        rightHandRef.current &&
        leftArmGroupRef.current &&
        leftForearmRef.current &&
        leftHandRef.current
      ) {
        // DYNAMIC MOUNT SEQUENCE OR ACTIVE 'WAVE' POSE
        if (isWelcomePhase || currentPose === 'wave') {
          // RIGHT ARM: Lift shoulder high up for an open, energetic welcome wave
          const targetShoulderZ = -Math.PI / 2.65;
          const targetShoulderX = 0.38;
          rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            rightArmGroupRef.current.rotation.z,
            targetShoulderZ,
            0.12
          );
          rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            rightArmGroupRef.current.rotation.x,
            targetShoulderX,
            0.12
          );

          // Forearm bent up high at elbow towards visitor
          const targetForearmZ = -Math.PI / 2.15;
          rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(
            rightForearmRef.current.rotation.z,
            targetForearmZ,
            0.12
          );
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(
            rightForearmRef.current.rotation.x,
            -0.22,
            0.12
          );

          // Dynamic side-to-side hand waving flapping (faster during initial welcome mount)
          const waveSpeed = isWelcomePhase ? 8.5 : 6.5;
          const waveMagnitude = isWelcomePhase ? 0.55 : 0.45;
          const waveOscillation = Math.sin(elapsedTime * waveSpeed) * waveMagnitude;
          rightHandRef.current.rotation.z = waveOscillation;
          rightHandRef.current.rotation.y = 0.4; // Palm facing straight towards visitor

          // LEFT ARM: Welcoming open gesture (slight open welcoming angle)
          const leftWelcomingAngle = isWelcomePhase ? 0.35 : 0.18;
          leftArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            leftArmGroupRef.current.rotation.z,
            leftWelcomingAngle + Math.sin(elapsedTime * 2.0) * 0.04,
            0.1
          );
          leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            leftArmGroupRef.current.rotation.x,
            isWelcomePhase ? 0.2 : 0.05,
            0.1
          );
          leftForearmRef.current.rotation.z = THREE.MathUtils.lerp(leftForearmRef.current.rotation.z, 0.12, 0.1);
        } else if (currentPose === 't-pose') {
          // Exact T-Pose
          rightArmGroupRef.current.rotation.set(0, 0, -Math.PI / 2.05);
          rightForearmRef.current.rotation.set(0, 0, 0);
          rightHandRef.current.rotation.set(0, 0, 0);

          leftArmGroupRef.current.rotation.set(0, 0, Math.PI / 2.05);
          leftForearmRef.current.rotation.set(0, 0, 0);
          leftHandRef.current.rotation.set(0, 0, 0);
        } else if (currentPose === 'chill') {
          // Relaxed standing posture with arms naturally resting forward
          rightArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            rightArmGroupRef.current.rotation.z,
            -0.22,
            0.1
          );
          rightArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(rightArmGroupRef.current.rotation.x, 0.1, 0.1);
          rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(
            rightForearmRef.current.rotation.z,
            -0.2,
            0.1
          );
          rightHandRef.current.rotation.set(0, 0, 0);

          leftArmGroupRef.current.rotation.z = THREE.MathUtils.lerp(
            leftArmGroupRef.current.rotation.z,
            0.22,
            0.1
          );
          leftArmGroupRef.current.rotation.x = THREE.MathUtils.lerp(leftArmGroupRef.current.rotation.x, 0.1, 0.1);
          leftForearmRef.current.rotation.z = THREE.MathUtils.lerp(
            leftForearmRef.current.rotation.z,
            0.2,
            0.1
          );
        }
      }

      // Eye blinking
      const blinkCycle = elapsedTime % 4.5;
      if (blinkCycle > 4.35 && leftEyeMeshRef.current && rightEyeMeshRef.current) {
        leftEyeMeshRef.current.scale.y = 0.1;
        rightEyeMeshRef.current.scale.y = 0.1;
      } else if (leftEyeMeshRef.current && rightEyeMeshRef.current) {
        leftEyeMeshRef.current.scale.y = 1.15;
        rightEyeMeshRef.current.scale.y = 1.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, isRotating, currentPose, isSpeaking, scale]);

  const handleResetView = () => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.rotation.set(0, 0, 0);
    }
    if (headGroupRef.current) {
      headGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleNextDialogue = () => {
    const nextIdx = (dialogueIndex + 1) % AUTONOMOUS_DIALOGUES.length;
    setDialogueIndex(nextIdx);
    if (audioStarted && !voiceMuted) {
      speakCurrentText(AUTONOMOUS_DIALOGUES[nextIdx].text);
    }
  };

  const currentDialogue = AUTONOMOUS_DIALOGUES[dialogueIndex];

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ height }}
    >
      {/* AUTONOMOUS SPEECH BUBBLE WITH CLEAR SAYING HI MESSAGE & SOUND BUTTON */}
      {enableSpeech && bubbleVisible && (
        <div className="absolute top-10 sm:top-12 left-3 right-3 z-20 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="relative p-3.5 rounded-2xl bg-neutral-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-950/40 backdrop-blur-md text-neutral-100">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 flex items-center gap-1">
                  <Hand className="w-3 h-3 text-cyan-400 animate-bounce" />
                  <span>{currentDialogue.badge}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Re-trigger wave button */}
                <button
                  type="button"
                  onClick={triggerManualWelcome}
                  className="px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono transition-colors flex items-center gap-1"
                  title="Wave & Say Hi Again"
                >
                  <Hand className="w-2.5 h-2.5" />
                  <span>Wave Hi</span>
                </button>

                {/* Sound Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!audioStarted) {
                      handleStartSpeaking();
                    } else {
                      const newMuted = !voiceMuted;
                      setVoiceMuted(newMuted);
                      if (!newMuted) {
                        speakCurrentText(currentDialogue.text);
                      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                      }
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 font-semibold ${
                    audioStarted && !voiceMuted
                      ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-cyan-500/40'
                  }`}
                  title={audioStarted && !voiceMuted ? "Audio is playing" : "Click to hear Yash speak!"}
                >
                  {audioStarted && !voiceMuted ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-neutral-950" />
                      <span>Speaking</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-cyan-400" />
                      <span>Hear Voice</span>
                    </>
                  )}
                </button>

                {/* Next Dialogue */}
                <button
                  type="button"
                  onClick={handleNextDialogue}
                  className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-300 transition-colors"
                  title="Next topic"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Speaking Dialogue Text */}
            <p className="text-xs sm:text-[13px] font-sans text-neutral-200 leading-snug font-medium">
              {currentDialogue.text}
            </p>

            {/* Downward Speech Bubble Pointing Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-900 border-r border-b border-cyan-500/50 rotate-45" />
          </div>
        </div>
      )}

      {/* 3D Canvas Mounting Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center pt-8"
        title="Click & Drag to rotate Yash's 3D Avatar 360°"
      />

      {/* Floating 3D Interaction Controls */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 backdrop-blur-md shadow-xl text-neutral-300 z-10 transition-opacity duration-200">
          {/* Pose Selector Button */}
          <button
            type="button"
            onClick={() => setCurrentPose(currentPose === 'wave' ? 't-pose' : currentPose === 't-pose' ? 'chill' : 'wave')}
            className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono transition-colors flex items-center gap-1"
            title="Toggle Avatar Poses (Wave / T-Pose / Chill)"
          >
            <Sparkles className="w-3 h-3" />
            <span className="capitalize">{currentPose}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1 rounded-md transition-colors ${
              isRotating ? 'text-cyan-400 bg-cyan-500/10' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title={isRotating ? 'Pause 360° Auto-Rotation' : 'Resume 360° Auto-Rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Reset Front View */}
          <button
            type="button"
            onClick={handleResetView}
            className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-neutral-100 transition-colors"
            title="Reset front perspective"
          >
            Front
          </button>

          {/* Dialogue Toggle */}
          <button
            type="button"
            onClick={() => setBubbleVisible(!bubbleVisible)}
            className={`p-1 rounded-md transition-colors ${
              bubbleVisible ? 'text-cyan-400 bg-cyan-500/10' : 'text-neutral-500'
            }`}
            title={bubbleVisible ? "Hide Dialogue Bubble" : "Show Dialogue Bubble"}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <span className="text-[9px] font-mono text-neutral-500 hidden sm:inline pl-1 border-l border-neutral-800">
            Drag 360°
          </span>
        </div>
      )}
    </div>
  );
}
