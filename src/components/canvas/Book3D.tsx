import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QuantumPopUp } from './popups/QuantumPopUp';
import { VisionPopUp } from './popups/VisionPopUp';
import { HealthcarePopUp } from './popups/HealthcarePopUp';
import { IntroPopUp } from './popups/IntroPopUp';

interface Book3DProps {
  currentChapter: number;
  flipProgress: number; // 0 (start of turn) to 1 (end of turn)
  isTurning: boolean;
}

export function Book3D({ currentChapter, flipProgress }: Book3DProps) {
  const bookGroupRef = useRef<THREE.Group>(null);
  const leftCoverRef = useRef<THREE.Group>(null);
  const rightCoverRef = useRef<THREE.Group>(null);
  const turningPageRef = useRef<THREE.Group>(null);

  const isCover = currentChapter === 0;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Mouse parallax tilt
    if (bookGroupRef.current) {
      const targetRotX = (state.pointer.y * 0.15) + (isCover ? 0.2 : 0.45);
      const targetRotY = (state.pointer.x * 0.2) + (isCover ? -0.2 : 0);
      const targetY = isCover ? -0.2 : -0.4;

      bookGroupRef.current.rotation.x = THREE.MathUtils.lerp(bookGroupRef.current.rotation.x, targetRotX, 0.05);
      bookGroupRef.current.rotation.y = THREE.MathUtils.lerp(bookGroupRef.current.rotation.y, targetRotY, 0.05);
      bookGroupRef.current.position.y = THREE.MathUtils.lerp(bookGroupRef.current.position.y, targetY, 0.05);

      // Subtle breathing float
      bookGroupRef.current.position.y += Math.sin(t * 1.5) * 0.008;
    }

    // Cover open / closed state
    if (leftCoverRef.current) {
      const targetAngle = isCover ? 0 : -Math.PI * 0.48;
      leftCoverRef.current.rotation.y = THREE.MathUtils.lerp(leftCoverRef.current.rotation.y, targetAngle, 0.08);
    }

    if (rightCoverRef.current) {
      const targetAngle = isCover ? 0 : 0;
      rightCoverRef.current.rotation.y = THREE.MathUtils.lerp(rightCoverRef.current.rotation.y, targetAngle, 0.08);
    }

    // Turning page rotation and bend
    if (turningPageRef.current) {
      const angle = -flipProgress * Math.PI * 0.96;
      turningPageRef.current.rotation.y = angle;
    }
  });

  // Calculate pop-up unfold amount (1 when settled, dipping to 0 during page turns)
  const unfoldProgress = THREE.MathUtils.clamp(1 - flipProgress * 1.5, 0, 1);

  return (
    <group ref={bookGroupRef} position={[0, -0.3, 0]}>
      {/* Wooden / Slate Study Desk Base */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial
          color="#0d0e12"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative ambient desk shadow */}
      <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 7]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      {/* BOOK SPINE */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 5.2, 16, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial
          color="#1c1917"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* LEFT COVER (Hinged at x = 0) */}
      <group ref={leftCoverRef} position={[0, 0, 0]}>
        <mesh position={[-2.7, 0, 0]}>
          <boxGeometry args={[5.2, 0.14, 5.3]} />
          <meshStandardMaterial
            color="#181512"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Gold Corner Trims */}
        <mesh position={[-5.2, 0.08, 2.5]}>
          <boxGeometry args={[0.3, 0.02, 0.3]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-5.2, 0.08, -2.5]}>
          <boxGeometry args={[0.3, 0.02, 0.3]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Closed Cover Emblem (Visible when closed in Chapter 0) */}
        {isCover && (
          <group position={[-2.7, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.8, 0.85, 32]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.75, 32]} />
              <meshStandardMaterial color="#292524" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* Left Page Paper Stack (Thickness) */}
        {!isCover && (
          <group position={[-2.6, 0.12, 0]}>
            <mesh>
              <boxGeometry args={[4.8, 0.16, 4.9]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
            {/* Gilded Page Edges */}
            <mesh position={[-2.42, 0, 0]}>
              <boxGeometry args={[0.04, 0.16, 4.9]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>

      {/* RIGHT COVER (Hinged at x = 0) */}
      <group ref={rightCoverRef} position={[0, 0, 0]}>
        <mesh position={[2.7, -0.01, 0]}>
          <boxGeometry args={[5.2, 0.14, 5.3]} />
          <meshStandardMaterial
            color="#181512"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Right Page Paper Stack (Thickness) */}
        <group position={[2.6, 0.12, 0]}>
          <mesh>
            <boxGeometry args={[4.8, 0.16, 4.9]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          {/* Gilded Page Edges */}
          <mesh position={[2.42, 0, 0]}>
            <boxGeometry args={[0.04, 0.16, 4.9]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* ACTIVE 3D POP-UP STAGE ON RIGHT PAGE */}
          {!isCover && (
            <group position={[0, 0.12, 0]}>
              {currentChapter === 1 && <IntroPopUp unfoldProgress={unfoldProgress} />}
              {currentChapter === 2 && <QuantumPopUp unfoldProgress={unfoldProgress} />}
              {currentChapter === 3 && <VisionPopUp unfoldProgress={unfoldProgress} />}
              {currentChapter === 4 && <HealthcarePopUp unfoldProgress={unfoldProgress} />}
              {currentChapter === 5 && <IntroPopUp unfoldProgress={unfoldProgress} />}
            </group>
          )}
        </group>
      </group>

      {/* DYNAMIC TURNING PAGE (When flipping) */}
      <group ref={turningPageRef} position={[0, 0.15, 0]}>
        <mesh position={[2.4, 0, 0]}>
          <boxGeometry args={[4.7, 0.02, 4.8]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.6}
            metalness={0.1}
            transparent
            opacity={flipProgress > 0.01 && flipProgress < 0.99 ? 0.95 : 0}
          />
        </mesh>
      </group>

      {/* SILK BOOKMARK RIBBON (Hanging out from bottom spine) */}
      <mesh position={[0.2, -0.05, 3.2]} rotation={[0.4, 0.1, -0.2]}>
        <boxGeometry args={[0.3, 0.02, 2.0]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
