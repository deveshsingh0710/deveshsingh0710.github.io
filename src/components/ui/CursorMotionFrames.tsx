import { useState, useEffect, useRef } from 'react';
import { Sparkles, Cpu, Eye, Radio, Layers, Activity } from 'lucide-react';
import { sounds } from '../../utils/audio';

const FRAMES_DATA = [
  {
    id: 1,
    tag: "FRAME 01 // PDE SOLVER",
    title: "Quantum Wave-Packet Dispersion",
    subtitle: "Time-Dependent Schrödinger Equation • Finite Barrier Transmission",
    spec: "Unitarity: 99.8% • dt: 0.01fs",
    icon: Activity,
    accent: "#00E5FF",
    badge: "Physics PINN"
  },
  {
    id: 2,
    tag: "FRAME 02 // ATTENTION MANIFOLD",
    title: "Multi-Head Neural Tokenization",
    subtitle: "Scaled Dot-Product Attention • Dense Latent Vector Embedding",
    spec: "Dim: 768 • Heads: 12 • RoPE Embeddings",
    icon: Cpu,
    accent: "#8B5CF6",
    badge: "Transformer"
  },
  {
    id: 3,
    tag: "FRAME 03 // VISION PIPELINE",
    title: "Sub-Millimeter Edge Feature Tensor",
    subtitle: "Feature Pyramid Network (FPN) • YOLOv8 Multi-Class Backbone",
    spec: "FPS: 120 • Latency: 14ms • IoU: 0.94",
    icon: Eye,
    accent: "#D8FF64",
    badge: "Computer Vision"
  },
  {
    id: 4,
    tag: "FRAME 04 // DISTRIBUTED STREAM",
    title: "Asynchronous Kafka Event Ingestion",
    subtitle: "Distributed Partition Buffer • ACID Telemetry Replication",
    spec: "Throughput: 120k evt/s • Partition: 16",
    icon: Radio,
    accent: "#0052F2",
    badge: "Telemetry"
  },
  {
    id: 5,
    tag: "FRAME 05 // TENSORRT KERNEL",
    title: "FP16 Tensor Core Kernel Fusion",
    subtitle: "Mixed-Precision Systolic Matrix Multipliers • CUDA 12.4",
    spec: "Compute: 82 TFLOPS • Mem: 24GB VRAM",
    icon: Layers,
    accent: "#22D3EE",
    badge: "CUDA Engine"
  }
];

export function CursorMotionFrames() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [pixelPos, setPixelPos] = useState({ x: 0, y: 0 });
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  
  const lastSoundFrame = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // Handle cursor movement inside the frame stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalized 0.0 to 1.0 coordinates
    const normX = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const normY = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    
    setCursorPos({ x: normX, y: normY });
    setPixelPos({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });

    // 3D Perspective Tilt (-12deg to +12deg)
    const rotY = (normX - 0.5) * 18;
    const rotX = -(normY - 0.5) * 18;
    setTilt({ rotateX: rotX, rotateY: rotY });

    // Compute which of the 5 frames to display based on cursor horizontal position
    const frameIdx = Math.min(Math.floor(normX * FRAMES_DATA.length), FRAMES_DATA.length - 1);
    if (frameIdx !== activeFrameIndex) {
      setActiveFrameIndex(frameIdx);
      if (frameIdx !== lastSoundFrame.current) {
        sounds.playClick();
        lastSoundFrame.current = frameIdx;
      }
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // High-Performance Procedural Kinetic Frame Renderer on 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const activeColor = FRAMES_DATA[activeFrameIndex].accent;

      // ==========================================
      // FRAME 0: Quantum Wave Dispersion
      // ==========================================
      if (activeFrameIndex === 0) {
        const centerY = height * 0.52;
        // Barrier
        ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
        ctx.fillRect(width * 0.48, height * 0.2, width * 0.04, height * 0.6);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(width * 0.48, height * 0.2, width * 0.04, height * 0.6);

        // Incident & Reflected & Transmitted Wave Packet
        ctx.beginPath();
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 4) {
          const envelope = Math.exp(-Math.pow((x - width * 0.35) / 100, 2));
          const wave = Math.sin(x * 0.08 - time * 4) * envelope * 65;
          const y = centerY + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary transmitted packet
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
        ctx.lineWidth = 1.5;
        for (let x = width * 0.52; x < width; x += 4) {
          const envelope = Math.exp(-Math.pow((x - width * 0.7) / 120, 2));
          const wave = Math.sin(x * 0.08 - time * 4) * envelope * 28;
          const y = centerY + wave;
          if (x === width * 0.52) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // ==========================================
      // FRAME 1: Neural Self-Attention Manifold
      // ==========================================
      else if (activeFrameIndex === 1) {
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const radius = Math.min(width, height) * 0.32;
        const tokenCount = 14;

        const nodes: { x: number; y: number }[] = [];
        for (let i = 0; i < tokenCount; i++) {
          const angle = (i / tokenCount) * Math.PI * 2 + time * 0.2;
          nodes.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }

        // Draw attention connection arcs
        for (let i = 0; i < tokenCount; i++) {
          for (let j = i + 1; j < tokenCount; j++) {
            const weight = (Math.sin(time * 2 + i * j) + 1) * 0.5;
            if (weight > 0.45) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(139, 92, 246, ${weight * 0.6})`;
              ctx.lineWidth = weight * 2;
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.quadraticCurveTo(centerX, centerY, nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw token nodes
        nodes.forEach((n, idx) => {
          ctx.beginPath();
          ctx.fillStyle = idx % 2 === 0 ? '#8B5CF6' : '#22D3EE';
          ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // ==========================================
      // FRAME 2: Computer Vision Feature Tensor
      // ==========================================
      else if (activeFrameIndex === 2) {
        const boxX = width * 0.28;
        const boxY = height * 0.22;
        const boxW = width * 0.44;
        const boxH = height * 0.56;

        // Bounding Box
        ctx.strokeStyle = '#D8FF64';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Corner Crosshairs
        const arm = 14;
        ctx.fillStyle = '#D8FF64';
        ctx.fillRect(boxX - 2, boxY - 2, arm, 4);
        ctx.fillRect(boxX - 2, boxY - 2, 4, arm);
        ctx.fillRect(boxX + boxW - arm + 2, boxY - 2, arm, 4);
        ctx.fillRect(boxX + boxW - 2, boxY - 2, 4, arm);

        // Scanline
        const scanY = boxY + ((Math.sin(time * 3) + 1) * 0.5) * boxH;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(216, 255, 100, 0.7)';
        ctx.lineWidth = 2;
        ctx.moveTo(boxX, scanY);
        ctx.lineTo(boxX + boxW, scanY);
        ctx.stroke();

        // Classification Overlay Tag
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(boxX, boxY - 24, 150, 22);
        ctx.fillStyle = '#D8FF64';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText("LABEL_OK: 99.4% CONF", boxX + 6, boxY - 8);
      }

      // ==========================================
      // FRAME 3: Distributed Kafka Telemetry
      // ==========================================
      else if (activeFrameIndex === 3) {
        const laneCount = 4;
        const startY = height * 0.28;
        const laneSpacing = height * 0.14;

        for (let l = 0; l < laneCount; l++) {
          const y = startY + l * laneSpacing;
          // Track line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(width * 0.1, y);
          ctx.lineTo(width * 0.9, y);
          ctx.stroke();

          // Packet stream
          for (let p = 0; p < 5; p++) {
            const speed = (l + 1) * 1.5;
            const px = width * 0.1 + ((time * 60 * speed + p * 110) % (width * 0.8));
            ctx.fillStyle = '#0052F2';
            ctx.fillRect(px, y - 6, 22, 12);
            ctx.strokeStyle = '#22D3EE';
            ctx.strokeRect(px, y - 6, 22, 12);
          }
        }
      }

      // ==========================================
      // FRAME 4: CUDA Tensor Core Kernel
      // ==========================================
      else {
        const matrixSize = 8;
        const cellSize = 22;
        const startX = width * 0.5 - (matrixSize * cellSize) * 0.5;
        const startY = height * 0.5 - (matrixSize * cellSize) * 0.5;

        for (let r = 0; r < matrixSize; r++) {
          for (let c = 0; c < matrixSize; c++) {
            const cellVal = (Math.sin(time * 3 + r * 0.5 + c * 0.8) + 1) * 0.5;
            const x = startX + c * cellSize;
            const y = startY + r * cellSize;

            ctx.fillStyle = `rgba(34, 211, 238, ${cellVal * 0.85})`;
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.strokeRect(x, y, cellSize, cellSize);
          }
        }
      }

      // Crosshair tracking mouse cursor
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pixelPos.x, 0);
      ctx.lineTo(pixelPos.x, height);
      ctx.moveTo(0, pixelPos.y);
      ctx.lineTo(width, pixelPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [activeFrameIndex, pixelPos]);

  const activeData = FRAMES_DATA[activeFrameIndex];
  const IconComponent = activeData.icon;

  return (
    <section id="frames" className="relative pt-24 pb-16 px-6 md:px-12 border-b border-white/[0.08] bg-[#080B14]">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Eyebrow & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-[11px] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>00 // CURSOR-DRIVEN MOTION FRAMES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-100">
              Interactive Latent Feature Frames
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono-code text-slate-400">
            <span className="hidden sm:inline">Scrub horizontally to step through frames:</span>
            <div className="flex items-center space-x-1 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-cyan-400 font-bold">
              <span>FRAME 0{activeData.id}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">05</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3D PERSPECTIVE MOTION FRAME STAGE
            - Follows mouse cursor in real-time
            - Tilts in 3D perspective
            - Scrubs across the 5 frames
        ======================================================== */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: '1200px',
          }}
          className="relative w-full h-[400px] sm:h-[480px] rounded-2xl cursor-crosshair overflow-hidden group select-none"
        >
          {/* 3D Tilted Viewport Card */}
          <div
            style={{
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition: 'transform 0.08s ease-out',
            }}
            className="w-full h-full rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            {/* The Animated Procedural Canvas */}
            <canvas
              ref={canvasRef}
              width={1000}
              height={500}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top-Left Telemetry HUD (Gavinder Style) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 space-y-1.5 pointer-events-none">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono-code text-cyan-300 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>CUDA 12.4 • FP16 RUNTIME</span>
              </div>
              <div className="text-xs sm:text-sm font-bold font-display text-slate-100 flex items-center space-x-2">
                <IconComponent className="w-4 h-4 text-cyan-400" />
                <span>{activeData.title}</span>
              </div>
              <div className="text-[11px] font-mono-code text-slate-400 line-clamp-1">
                {activeData.subtitle}
              </div>
              <div className="text-[10px] font-mono-code text-cyan-300 font-semibold">
                {activeData.spec}
              </div>
            </div>

            {/* Top-Right Cursor Telemetry */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex flex-col items-end space-y-1 pointer-events-none font-mono-code text-[10px]">
              <span className="text-slate-400">CURSOR TRACKING:</span>
              <span className="text-cyan-300 font-bold">
                X: {pixelPos.x}px | Y: {pixelPos.y}px
              </span>
              <span className="text-slate-500">
                ROT: [{tilt.rotateX.toFixed(1)}°, {tilt.rotateY.toFixed(1)}°]
              </span>
            </div>

            {/* Bottom Scrubber Progress Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 pointer-events-none">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mb-1.5">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeData.accent }} />
                  <span className="text-slate-200 font-semibold">{activeData.tag}</span>
                </span>
                <span className="text-cyan-400 font-bold">{(cursorPos.x * 100).toFixed(0)}% SCRUB</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 bg-slate-950/80 rounded-full border border-slate-800 overflow-hidden relative">
                <div
                  style={{ width: `${cursorPos.x * 100}%`, backgroundColor: activeData.accent }}
                  className="h-full rounded-full transition-all duration-75 shadow-lg shadow-cyan-500/50"
                />
              </div>

              {/* 5 Milestone Step Pills */}
              <div className="grid grid-cols-5 gap-2 mt-2.5">
                {FRAMES_DATA.map((f, idx) => {
                  const isCurrent = idx === activeFrameIndex;
                  return (
                    <div
                      key={f.id}
                      className={`p-1.5 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? 'bg-slate-900/90 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950/60 text-slate-500 border-slate-800/80'
                      }`}
                    >
                      <div className="text-[9px] font-mono-code uppercase font-bold truncate">0{f.id} // {f.badge}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
