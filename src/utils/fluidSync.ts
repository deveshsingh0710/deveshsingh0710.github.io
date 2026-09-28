/**
 * Unified synchronization logic for the 3D Fluid Conduit and the 3 Projects:
 * Checkpoint 1: Project 1 (Quantum Tunneling PDE Solver)
 * Checkpoint 2: Project 2 (LabelChecker AI Vision Engine)
 * Checkpoint 3: Project 3 (Healthcare Telemetry Streaming Engine)
 */

export const FLUID_SCROLL_START = 0.05;
export const FLUID_SCROLL_END = 0.95;

// Exact dock positions along the 3D Catmull-Rom curve conduit (0.0 to 1.0)
export const DOCK_POSITIONS = {
  PROJECT_1: 0.25, // Quantum Tunneling PDE Solver
  PROJECT_2: 0.58, // LabelChecker AI Vision Engine
  PROJECT_3: 0.88, // Healthcare Telemetry Engine
} as const;

// Precision windows around each project dock checkpoint.
// Outside these windows, active checkpoint is NULL so the card DISAPPEARS ("hat jata hai")!
export const CHECKPOINT_WINDOWS = [
  { id: 1, min: 0.17, max: 0.33, dock: DOCK_POSITIONS.PROJECT_1 },
  { id: 2, min: 0.50, max: 0.66, dock: DOCK_POSITIONS.PROJECT_2 },
  { id: 3, min: 0.80, max: 0.95, dock: DOCK_POSITIONS.PROJECT_3 },
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
 * Determines which project checkpoint (1, 2, 3) should be displayed.
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
