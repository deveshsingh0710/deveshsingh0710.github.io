import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidCoreProps {
  opacity: number;
}

export function LiquidCore({ opacity }: LiquidCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.PointLight>(null);

  // High-poly sphere geometry for organic liquid deformation
  const baseGeometry = useMemo(() => new THREE.SphereGeometry(1.8, 64, 64), []);
  const basePositions = useMemo(() => {
    return (baseGeometry.attributes.position as THREE.BufferAttribute).array.slice();
  }, [baseGeometry]);

  const targetPointer = useRef({ x: 0, y: 0 });
  const currentPointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth pointer damping
    targetPointer.current.x = state.pointer.x;
    targetPointer.current.y = state.pointer.y;

    currentPointer.current.x = THREE.MathUtils.lerp(currentPointer.current.x, targetPointer.current.x, 0.08);
    currentPointer.current.y = THREE.MathUtils.lerp(currentPointer.current.y, targetPointer.current.y, 0.08);

    if (meshRef.current) {
      const geom = meshRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      const pX = currentPointer.current.x * 2.5;
      const pY = currentPointer.current.y * 2.5;

      for (let i = 0; i < basePositions.length; i += 3) {
        const ox = basePositions[i];
        const oy = basePositions[i + 1];
        const oz = basePositions[i + 2];

        // Organic multi-harmonic ripple
        const distToMouse = Math.sqrt(Math.pow(ox - pX, 2) + Math.pow(oy - pY, 2));
        const mouseWave = Math.sin(distToMouse * 3.5 - t * 4) * 0.15;

        const noise =
          Math.sin(ox * 2.0 + t * 1.5) *
          Math.cos(oy * 2.0 + t * 1.2) *
          Math.sin(oz * 2.0 + t * 0.8) *
          0.22;

        const displacement = 1 + noise + mouseWave;

        array[i] = ox * displacement;
        array[i + 1] = oy * displacement;
        array[i + 2] = oz * displacement;
      }

      posAttr.needsUpdate = true;
      geom.computeVertexNormals();

      // Magnetic tilt towards cursor
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, pX * 0.6, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -pY * 0.6, 0.05);
    }

    if (innerGlowRef.current) {
      innerGlowRef.current.intensity = (2.5 + Math.sin(t * 3) * 0.8) * opacity;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group position={[2.4, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Hyper-Realistic Liquid Obsidian Glass Drop */}
      <mesh ref={meshRef} geometry={baseGeometry}>
        <meshPhysicalMaterial
          color="#031a12"
          emissive="#064e3b"
          emissiveIntensity={0.25}
          roughness={0.03}
          metalness={0.1}
          transmission={0.92}
          thickness={2.2}
          ior={1.54}
          reflectivity={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          attenuationColor="#10b981"
          attenuationDistance={1.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Internal Luminous Energy Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#6ee7b7"
          emissive="#10b981"
          emissiveIntensity={2.5}
          roughness={0.2}
        />
      </mesh>

      {/* Subsurface Light Emitter */}
      <pointLight ref={innerGlowRef} color="#34d399" intensity={3 * opacity} distance={6} />
      <pointLight position={[2, 2, 2]} color="#38bdf8" intensity={2 * opacity} distance={5} />
      <pointLight position={[-2, -2, -2]} color="#059669" intensity={1.5 * opacity} distance={5} />
    </group>
  );
}
