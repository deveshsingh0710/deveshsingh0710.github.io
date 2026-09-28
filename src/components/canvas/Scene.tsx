import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { Book3D } from './Book3D';

interface SceneProps {
  currentChapter: number;
  flipProgress: number;
  isTurning: boolean;
}

export function Scene({ currentChapter, flipProgress, isTurning }: SceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 5.5, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]} // Crisp rendering up to 2x DPR
      >
        {/* Ambient Dark Room Tone */}
        <color attach="background" args={['#08090c']} />

        {/* Studio Lighting Rig */}
        <ambientLight intensity={0.8} />

        {/* Warm Focused Overhead Desk Spotlight */}
        <spotLight
          position={[2, 9, 3]}
          angle={0.6}
          penumbra={0.8}
          intensity={45}
          color="#fef08a"
          castShadow
        />

        {/* Cool Cyan Rim Light for Pop-up Holograms */}
        <directionalLight position={[-6, 4, -3]} intensity={2.0} color="#38bdf8" />

        {/* Soft Purple Secondary Fill */}
        <directionalLight position={[5, 2, -4]} intensity={1.5} color="#c084fc" />

        {/* Ambient Floating Dust Motes in the light beam */}
        <Sparkles
          count={60}
          scale={[10, 6, 8]}
          size={1.5}
          speed={0.3}
          opacity={0.4}
          color="#fde047"
        />

        {/* The 3D Book & Pop-ups */}
        <Book3D
          currentChapter={currentChapter}
          flipProgress={flipProgress}
          isTurning={isTurning}
        />

        {/* Interactive Smooth Orbit Controls (Constrained so user cannot get lost under the desk) */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={12}
          minPolarAngle={Math.PI / 6} // Cannot look from straight above
          maxPolarAngle={Math.PI / 2.3} // Cannot look beneath the desk
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
