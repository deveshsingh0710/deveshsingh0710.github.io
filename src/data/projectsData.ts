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
  chapterNumber: string;
  stats: { label: string; value: string }[];
  codeSnippet: string;
  architectureNotes: string;
}

export const PROJECTS: Project[] = [
  {
    id: "quantum-tunneling",
    title: "Quantum Tunneling",
    subtitle: "Wave Mechanics & Potential Barrier Simulation",
    category: "Scientific Computing & Simulation",
    chapterNumber: "II",
    description:
      "Interactive computational physics engine modeling time-dependent Schrödinger wave-packet dynamics. Simulates quantum transmission and reflection coefficients through finite potential energy barriers in real-time.",
    keyFeatures: [
      "Real-time integration of 1D/2D Schrödinger wave equations",
      "Dynamic potential barrier width, height, and kinetic energy tuning",
      "Probability density calculation (|Ψ|²) and wave-packet dispersion",
      "GPU-accelerated rendering of phase angles and interference fringes"
    ],
    techStack: ["Python", "NumPy", "SciPy", "Matplotlib", "WebAssembly / Canvas"],
    githubUrl: "https://github.com/deveshsingh0710/Quantum-Tunneling",
    stats: [
      { label: "Accuracy", value: "99.8%" },
      { label: "Timestep (dt)", value: "0.01 fs" },
      { label: "Transmission Rate", value: "T(E) ~ exp(-2kL)" }
    ],
    codeSnippet: `def schrodinger_step(psi, V, dt, dx):\n    # Split-operator kinetic & potential phase evolution\n    psi = np.exp(-1j * V * dt / (2 * HBAR)) * psi\n    psi_k = np.fft.fft(psi)\n    psi_k = np.exp(-1j * HBAR * k**2 * dt / (2 * M)) * psi_k\n    psi = np.fft.ifft(psi_k)\n    return np.exp(-1j * V * dt / (2 * HBAR)) * psi`,
    architectureNotes: "Uses spectral split-step Fourier transforms to achieve O(N log N) computational performance while preserving unitarity."
  },
  {
    id: "labelchecker",
    title: "LabelChecker",
    subtitle: "Automated Computer Vision & OCR QA Pipeline",
    category: "AI & Computer Vision",
    chapterNumber: "III",
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
    stats: [
      { label: "Inference Latency", value: "42ms" },
      { label: "Recall Rate", value: "99.4%" },
      { label: "Verification Throughput", value: "120 labels/min" }
    ],
    codeSnippet: `async def verify_label(image_tensor: torch.Tensor):\n    features = backbone_model(image_tensor)\n    boxes, confidences = detector(features)\n    ocr_result = ocr_engine.extract(image_tensor, boxes)\n    is_compliant = compliance_ruleset.audit(ocr_result)\n    return VerificationReport(status=is_compliant, conf=confidences.mean())`,
    architectureNotes: "Deployed as containerized microservices communicating via asynchronous event streams for high-speed industrial conveyor pipelines."
  },
  {
    id: "healthcare",
    title: "Healthcare Ecosystem",
    subtitle: "Patient Diagnostics & Health Informatics Infrastructure",
    category: "Full-Stack & Distributed Systems",
    chapterNumber: "IV",
    description:
      "Enterprise healthcare architecture built to streamline patient telemetry, diagnostic scheduling, and sensitive EHR records with strict compliance and low-latency synchronization.",
    keyFeatures: [
      "Role-based access control (RBAC) with cryptographic audit logging",
      "Real-time vitals monitoring with automated anomalous alert triggers",
      "HL7 / FHIR compliant medical records data interchange engine",
      "Resilient database replication with automated disaster recovery"
    ],
    techStack: ["React", "TypeScript", "Node.js / Express", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/deveshsingh0710/healthcare",
    stats: [
      { label: "Data Integrity", value: "100% ACID" },
      { label: "Sync Latency", value: "< 15ms" },
      { label: "Telemetry Uptime", value: "99.99%" }
    ],
    codeSnippet: `export const recordVitalTelemetry = async (payload: VitalsPacket) => {\n  const session = await db.transaction();\n  try {\n    await telemetryRepo.insert(payload, { transaction: session });\n    if (payload.heartRate > CRITICAL_THRESHOLD) {\n      await alertDispatcher.notifyOnCall(payload.patientId);\n    }\n    await session.commit();\n  } catch (err) { await session.rollback(); throw err; }\n};`,
    architectureNotes: "Built around event-driven microservices ensuring zero data loss during network partition in emergency care centers."
  }
];

export const DEVELOPER_BIO = {
  name: "Devesh Singh",
  title: "Machine Learning Engineer",
  location: "Global / Remote",
  bio: "Specialized in deep learning architectures, computer vision pipelines, high-performance simulation engines, and distributed intelligence systems.",
  stats: [
    { label: "Core Focus", value: "Machine Learning & Computer Vision" },
    { label: "Primary Languages", value: "Python, PyTorch, C++, TypeScript" },
    { label: "Specialties", value: "Deep Learning, Physics Simulation, Distributed AI" },
    { label: "Philosophy", value: "Mathematical Precision, Speed & Production Reliability" }
  ],
  skills: [
    "Python", "TypeScript", "React", "Node.js", "Docker", "PostgreSQL",
    "OpenCV", "PyTorch", "Three.js / WebGL", "Algorithms", "Git & CI/CD", "Linux"
  ],
  links: {
    github: "https://github.com/deveshsingh0710",
    portfolio: "https://deveshsingh0710.github.io",
    email: "mailto:deveshsingh@example.com"
  }
};
