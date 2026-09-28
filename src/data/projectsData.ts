export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  stats: { label: string; value: string }[];
  codeSnippet: string;
  architecturePipeline: string[];
  benchmarkBadge: string;
  sparklineData: number[]; // Points for mini loss/accuracy chart
  architectureNotes: string;
}

export const PROJECTS: Project[] = [
  {
    id: "quantum-tunneling",
    title: "Quantum-Tunneling Simulation",
    subtitle: "Wave Mechanics & Potential Barrier Dispersion Engine",
    category: "Computational Physics & PDE Solver",
    description:
      "Interactive computational physics engine modeling time-dependent Schrödinger wave-packet dynamics. Simulates quantum transmission and reflection coefficients through finite potential barriers in real-time.",
    keyFeatures: [
      "Real-time integration of 1D/2D Schrödinger wave equations",
      "Dynamic potential barrier width, height, and kinetic energy tuning",
      "Probability density calculation (|Ψ|²) and wave-packet dispersion",
      "GPU-accelerated rendering of phase angles and interference fringes"
    ],
    techStack: ["Python", "NumPy", "SciPy", "Matplotlib", "WebAssembly / Canvas"],
    githubUrl: "https://github.com/deveshsingh0710/Quantum-Tunneling",
    benchmarkBadge: "99.8% Unitarity Preserved",
    sparklineData: [45, 38, 29, 22, 17, 12, 8, 5, 3, 2, 1.2],
    architecturePipeline: [
      "Initial Gaussian ψ(x,0)",
      "Spectral Split-Step FFT",
      "RK4 Dispersion Integration",
      "Density Field |Ψ|² Render"
    ],
    stats: [
      { label: "Accuracy", value: "99.8%" },
      { label: "Timestep (dt)", value: "0.01 fs" },
      { label: "Convergence", value: "O(N log N)" }
    ],
    codeSnippet: `def schrodinger_step(psi, V, dt, dx):
    # Split-operator kinetic & potential phase evolution
    psi = np.exp(-1j * V * dt / (2 * HBAR)) * psi
    psi_k = np.fft.fft(psi)
    psi_k = np.exp(-1j * HBAR * k**2 * dt / (2 * M)) * psi_k
    psi = np.fft.ifft(psi_k)
    return np.exp(-1j * V * dt / (2 * HBAR)) * psi`,
    architectureNotes: "Uses spectral split-step Fourier transforms to achieve O(N log N) computational performance while preserving unitarity."
  },
  {
    id: "labelchecker",
    title: "LabelChecker AI",
    subtitle: "Automated Industrial Computer Vision & OCR QA Pipeline",
    category: "AI & Computer Vision",
    description:
      "Intelligent inspection pipeline designed to automate packaging and industrial label compliance. Uses convolutional feature extraction and optical character verification to catch defects and mismatches.",
    keyFeatures: [
      "Sub-millimeter bounding box precision for barcode and text alignment",
      "Multi-language OCR verification with automated fuzzy text matching",
      "Defect classification pipeline trained on industrial packaging anomalies",
      "Real-time camera feed processing with high FPS throughput"
    ],
    techStack: ["Python", "OpenCV", "PyTorch", "FastAPI", "Docker"],
    githubUrl: "https://github.com/deveshsingh0710/labelchecker",
    benchmarkBadge: "120 Labels / Min Real-Time",
    sparklineData: [92, 85, 68, 51, 38, 24, 16, 9, 6, 4, 2.1],
    architecturePipeline: [
      "RTSP 4K Camera Ingest",
      "YOLOv8 Feature Backbone",
      "TrOCR Attention Head",
      "QC Rule Compliance Flag"
    ],
    stats: [
      { label: "Inference Latency", value: "42ms" },
      { label: "Recall Rate", value: "99.4%" },
      { label: "Throughput", value: "120 labels/min" }
    ],
    codeSnippet: `async def verify_label(image_tensor: torch.Tensor):
    features = backbone_model(image_tensor)
    boxes, confidences = detector(features)
    ocr_result = ocr_engine.extract(image_tensor, boxes)
    is_compliant = compliance_ruleset.audit(ocr_result)
    return VerificationReport(status=is_compliant, conf=confidences.mean())`,
    architectureNotes: "Deployed as containerized microservices communicating via asynchronous event streams for high-speed industrial conveyor pipelines."
  },
  {
    id: "healthcare",
    title: "Healthcare Telemetry Engine",
    subtitle: "Patient Diagnostics & Health Informatics Infrastructure",
    category: "Distributed Systems & Telemetry",
    description:
      "Enterprise healthcare architecture built to streamline patient telemetry, diagnostic scheduling, and sensitive EHR records with strict compliance and low-latency synchronization.",
    keyFeatures: [
      "Role-based access control (RBAC) with cryptographic audit logging",
      "Real-time vitals monitoring with automated anomalous alert triggers",
      "HL7 / FHIR compliant medical records data interchange engine",
      "Resilient database replication with automated disaster recovery"
    ],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Kafka"],
    githubUrl: "https://github.com/deveshsingh0710/healthcare",
    benchmarkBadge: "99.99% Zero Data Loss",
    sparklineData: [80, 72, 60, 48, 35, 25, 18, 11, 7, 3, 1.0],
    architecturePipeline: [
      "HL7 / FHIR Device Stream",
      "Kafka Event Buffer",
      "Isolation Forest Anomaly",
      "PostgreSQL ACID Replication"
    ],
    stats: [
      { label: "Data Integrity", value: "100% ACID" },
      { label: "Sync Latency", value: "< 15ms" },
      { label: "Telemetry Uptime", value: "99.99%" }
    ],
    codeSnippet: `export const recordVitalTelemetry = async (payload: VitalsPacket) => {
  const session = await db.transaction();
  try {
    await telemetryRepo.insert(payload, { transaction: session });
    if (payload.heartRate > CRITICAL_THRESHOLD) {
      await alertDispatcher.notifyOnCall(payload.patientId);
    }
    await session.commit();
  } catch (err) { await session.rollback(); throw err; }
};`,
    architectureNotes: "Built around event-driven microservices ensuring zero data loss during network partition in emergency care centers."
  }
];

export const DEVELOPER_BIO = {
  name: "Devesh Singh",
  title: "Machine Learning Engineer",
  location: "Global / Remote",
  bio: "Specialized in deep learning architectures, computer vision pipelines, high-performance simulation engines, and distributed intelligence systems.",
  stats: [
    { label: "PRIMARY FOCUS", value: "Deep Learning & Computer Vision" },
    { label: "LANGUAGES", value: "Python, PyTorch, C++, TypeScript" },
    { label: "SPECIALTY", value: "Edge AI & Computational Physics" }
  ],
  skillClusters: [
    {
      category: "Deep Learning & MLOps",
      skills: ["PyTorch", "TensorFlow", "MLflow", "ONNX Runtime", "CUDA", "FastAPI"]
    },
    {
      category: "Computer Vision & Edge AI",
      skills: ["YOLOv8", "OpenCV", "TrOCR", "Segment Anything", "TensorRT", "DeepStream"]
    },
    {
      category: "Scientific Computing & Math",
      skills: ["NumPy", "SciPy", "PDE Solvers", "Spectral FFT", "Monte Carlo", "Matrix Opt"]
    },
    {
      category: "Systems & Infrastructure",
      skills: ["C++", "Docker", "Linux / Bash", "PostgreSQL", "Kafka", "Git & CI/CD"]
    }
  ],
  links: {
    github: "https://github.com/deveshsingh0710",
    email: "mailto:deveshsingh0710@gmail.com"
  }
};
