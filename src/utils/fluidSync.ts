/**
 * Synchronization logic for the 3D Fluid Conduit within the Projects Section:
 * Checkpoint 1: Project 1 (Quantum Tunneling PDE Solver)
 * Checkpoint 2: Project 2 (LabelChecker AI Vision Engine)
 * Checkpoint 3: Project 3 (Healthcare Telemetry Streaming Engine)
 */

// 3 exact dock positions along the 3D Catmull-Rom curve conduit (0.0 to 1.0)
export const DOCK_POSITIONS = {
  PROJECT_1: 0.22, // Quantum Tunneling PDE Solver
  PROJECT_2: 0.55, // LabelChecker AI Vision Engine
  PROJECT_3: 0.85, // Healthcare Telemetry Engine
} as const;

// Precision windows around each project dock checkpoint.
// Outside these windows, active checkpoint is NULL so the card DISAPPEARS ("hat jata hai")!
export const CHECKPOINT_WINDOWS = [
  { id: 1, min: 0.15, max: 0.32, dock: DOCK_POSITIONS.PROJECT_1 },
  { id: 2, min: 0.48, max: 0.65, dock: DOCK_POSITIONS.PROJECT_2 },
  { id: 3, min: 0.78, max: 0.95, dock: DOCK_POSITIONS.PROJECT_3 },
];

/**
 * Determines which project checkpoint (1, 2, 3) should be displayed based on projectsProgress (0.0 to 1.0).
 * Returns null if fluid is between checkpoints, ensuring cards completely disappear when scrolling between them.
 */
export function getActiveCheckpoint(projectsProgress: number): number | null {
  for (const win of CHECKPOINT_WINDOWS) {
    if (projectsProgress >= win.min && projectsProgress <= win.max) {
      return win.id;
    }
  }

  return null;
}
