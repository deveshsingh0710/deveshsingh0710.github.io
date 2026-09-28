/**
 * Unified synchronization logic for the 3D Fluid Conduit and Project HUD cards.
 * Single source of truth across CurvedThread3D and PortfolioLayout.
 */

// Scroll boundaries for the fluid conduit scrubbing phase
export const FLUID_SCROLL_START = 0.08;
export const FLUID_SCROLL_END = 0.62;

// Exact dock positions along the 3D Catmull-Rom curve conduit (0.0 to 1.0)
export const DOCK_POSITIONS = {
  PROJECT_1: 0.22, // Quantum Tunneling PDE Solver
  PROJECT_2: 0.52, // LabelChecker AI Vision Engine
  PROJECT_3: 0.82, // Healthcare Telemetry Streaming Engine
} as const;

// Precision windows around each dock checkpoint
export const DOCK_WINDOWS = [
  { min: 0.15, max: 0.29, dock: DOCK_POSITIONS.PROJECT_1, index: 0 },
  { min: 0.45, max: 0.59, dock: DOCK_POSITIONS.PROJECT_2, index: 1 },
  { min: 0.75, max: 0.89, dock: DOCK_POSITIONS.PROJECT_3, index: 2 },
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
 * Determines which project card should be displayed.
 * Returns null if fluid is between checkpoints or if scroll has progressed past projects.
 */
export function getActiveProjectIndex(scrollProgress: number): number | null {
  if (scrollProgress >= FLUID_SCROLL_END) return null;

  const fluid = getFluidProgress(scrollProgress);

  for (const win of DOCK_WINDOWS) {
    if (fluid >= win.min && fluid <= win.max) {
      return win.index;
    }
  }

  return null;
}
