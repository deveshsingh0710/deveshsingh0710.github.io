/**
 * Unified synchronization logic for the 3D Fluid Conduit and all 5 Checkpoints:
 * Checkpoint 1: Project 1 (Quantum Tunneling PDE Solver)
 * Checkpoint 2: Project 2 (LabelChecker AI Vision Engine)
 * Checkpoint 3: Project 3 (Healthcare Telemetry Streaming Engine)
 * Checkpoint 4: Specialization (ML Toolchain & Skills)
 * Checkpoint 5: Transmission (Direct Contact & Terminal Clone)
 */

export const FLUID_SCROLL_START = 0.05;
export const FLUID_SCROLL_END = 0.96;

// 5 exact dock positions along the 3D Catmull-Rom curve conduit (0.0 to 1.0)
export const DOCK_POSITIONS = {
  PROJECT_1: 0.16, // Quantum Tunneling
  PROJECT_2: 0.36, // LabelChecker AI
  PROJECT_3: 0.56, // Healthcare Telemetry
  SPECIALIZATION: 0.76, // Skill Clusters & Engineering Philosophy
  TRANSMISSION: 0.94, // Direct Contact & Terminal Clone
} as const;

// Precision windows around each dock checkpoint.
// Between checkpoints, active checkpoint is NULL so previous card DISAPPEARS ("hat jata hai")!
export const CHECKPOINT_WINDOWS = [
  { id: 1, min: 0.11, max: 0.23, dock: DOCK_POSITIONS.PROJECT_1 },
  { id: 2, min: 0.30, max: 0.43, dock: DOCK_POSITIONS.PROJECT_2 },
  { id: 3, min: 0.50, max: 0.63, dock: DOCK_POSITIONS.PROJECT_3 },
  { id: 4, min: 0.70, max: 0.83, dock: DOCK_POSITIONS.SPECIALIZATION },
  { id: 5, min: 0.89, max: 1.00, dock: DOCK_POSITIONS.TRANSMISSION },
];

/**
 * Calculates current fluid fill level (0.0 to 1.0) from global page scroll progress.
 */
export function getFluidProgress(scrollProgress: number): number {
  if (scrollProgress <= FLUID_SCROLL_START) return 0;
  if (scrollProgress >= FLUID_SCROLL_END) return 1;
  return (scrollProgress - FLUID_SCROLL_START) / (FLUID_SCROLL_END - FLUID_SCROLL_START);
}

/**
 * Determines which checkpoint (1, 2, 3, 4, 5) should be displayed.
 * Returns null if fluid is between checkpoints, ensuring cards completely disappear when scrolling between them.
 */
export function getActiveCheckpoint(scrollProgress: number): number | null {
  const fluid = getFluidProgress(scrollProgress);

  for (const win of CHECKPOINT_WINDOWS) {
    if (fluid >= win.min && fluid <= win.max) {
      return win.id;
    }
  }

  return null;
}

/**
 * Converts a target fluid dock value to exact pixel scroll position.
 */
export function getScrollPositionForFluid(fluidValue: number): number {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  const targetScrollProgress = FLUID_SCROLL_START + fluidValue * (FLUID_SCROLL_END - FLUID_SCROLL_START);
  return targetScrollProgress * maxScroll;
}
