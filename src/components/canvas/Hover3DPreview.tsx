import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QuantumStage } from './stages/QuantumStage';
import { VisionStage } from './stages/VisionStage';
import { HealthcareStage } from './stages/HealthcareStage';

interface Hover3DPreviewProps {
  hoveredProject: 'quantum' | 'vision' | 'healthcare' | null;
  cameraY: number;
}

export function Hover3DPreview({ hoveredProject, cameraY }: Hover3DPreviewProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(0);

  useFrame((state) => {
    const isHovered = hoveredProject !== null;
    const targetOpacity = isHovered ? 1.0 : 0.0;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.1);

    if (groupRef.current) {
      // Follow the current camera Y level so it's always in view when hovered!
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, cameraY, 0.12);

      // Subtle parallax tilt towards mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.35, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.25, 0.08);

      const s = currentOpacity.current;
      groupRef.current.scale.set(s, s, s);
    }
  });

  if (!hoveredProject && currentOpacity.current < 0.01) return null;

  return (
    <group ref={groupRef} position={[2.5, 0, 0]}>
      {hoveredProject === 'quantum' && <QuantumStage opacity={currentOpacity.current} />}
      {hoveredProject === 'vision' && <VisionStage opacity={currentOpacity.current} />}
      {hoveredProject === 'healthcare' && <HealthcareStage opacity={currentOpacity.current} />}
    </group>
  );
}
