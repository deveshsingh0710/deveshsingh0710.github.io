import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QuantumStage } from './stages/QuantumStage';
import { VisionStage } from './stages/VisionStage';
import { HealthcareStage } from './stages/HealthcareStage';

interface FloatingHoverPortalProps {
  hoveredProject: 'quantum' | 'vision' | 'healthcare' | null;
}

export function FloatingHoverPortal({ hoveredProject }: FloatingHoverPortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(0);
  const targetPos = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const isHovered = hoveredProject !== null;
    const targetOpacity = isHovered ? 1.0 : 0.0;

    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.12);

    if (groupRef.current) {
      // Magnetic cursor tracking: portal floats dynamically near the cursor
      targetPos.current.x = state.pointer.x * 2.8 + 1.2;
      targetPos.current.y = state.pointer.y * 1.8;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos.current.x, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos.current.y, 0.08);

      // Subtle tilt physics
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.35, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.25, 0.08);

      const s = currentOpacity.current * 0.85;
      groupRef.current.scale.set(s, s, s);
    }
  });

  if (!hoveredProject && currentOpacity.current < 0.01) return null;

  return (
    <group ref={groupRef} position={[2.0, 0, 0]}>
      {hoveredProject === 'quantum' && <QuantumStage opacity={currentOpacity.current} />}
      {hoveredProject === 'vision' && <VisionStage opacity={currentOpacity.current} />}
      {hoveredProject === 'healthcare' && <HealthcareStage opacity={currentOpacity.current} />}
    </group>
  );
}
