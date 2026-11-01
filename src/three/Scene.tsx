import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import Coin from './Coin';
import Particles from './Particles';
import { intro, pointer } from '../lib/motion';
import { damp } from '../lib/utils';

/** Cinematic camera: slow drift, pointer parallax, dolly-in during the intro. */
function Rig({ isMobile }: { isMobile: boolean }) {
  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    const px = isMobile ? 0 : pointer.x;
    const py = isMobile ? 0 : pointer.y;
    cam.position.x = damp(cam.position.x, px * 0.35 + Math.sin(t * 0.25) * 0.12, 2.5, dt);
    cam.position.y = damp(cam.position.y, py * 0.2 + Math.cos(t * 0.2) * 0.06, 2.5, dt);
    cam.position.z = 6 + (1 - intro.p) * 2.2;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
      >
        {/* Studio reflections built from light panels: no HDR download needed. */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={['#0b0804']} />
          <Lightformer form="rect" intensity={2.2} color="#fff4dc" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
          <Lightformer form="rect" intensity={5} color="#fff3d6" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[9, 1.8, 1]} />
          <Lightformer form="rect" intensity={4} color="#ffd9a0" position={[6, -0.5, 2]} rotation-y={-Math.PI / 2} scale={[9, 1.3, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#c9a050" position={[0, -3, 5]} scale={[9, 1.3, 1]} />
          <Lightformer form="circle" intensity={3} color="#ffffff" position={[0, 1, -7]} scale={6} />
          <Lightformer form="rect" intensity={1.2} color="#fff0cf" position={[0, 0.5, 7]} scale={[6, 3, 1]} />
        </Environment>
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} color="#ffe6b0" />
        <directionalLight position={[-4, -1, -3]} intensity={0.8} color="#fff6e0" />
        <Rig isMobile={isMobile} />
        <Particles count={isMobile ? 50 : 130} />
        <Coin isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
