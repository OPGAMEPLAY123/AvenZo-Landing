import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { intro, prefersReducedMotion } from '../lib/motion';
import { makeDotTexture } from './textures';

const wrap = (v: number, min: number, max: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Floating gold dust. Positions are updated on the CPU — a few dozen points is trivial. */
export default function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const tex = useMemo(() => makeDotTexture(), []);

  const data = useMemo(() => {
    const base = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const depth = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 11;
      base[i * 3 + 1] = (Math.random() - 0.5) * 9.6;
      base[i * 3 + 2] = -3 + Math.random() * 5;
      speed[i] = 0.05 + Math.random() * 0.18;
      depth[i] = Math.random();
    }
    return { base, pos, speed, depth };
  }, [count]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const sy = window.scrollY * 0.0012;
    const { base, pos, speed, depth } = data;
    for (let i = 0; i < count; i++) {
      if (!prefersReducedMotion) base[i * 3 + 1] += speed[i] * dt;
      pos[i * 3] = base[i * 3] + Math.sin(t * 0.4 + i) * 0.12;
      pos[i * 3 + 1] = wrap(base[i * 3 + 1] + sy * (0.4 + depth[i] * 1.6), -4.8, 4.8);
      pos[i * 3 + 2] = base[i * 3 + 2];
    }
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    attr.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.85 * intro.p;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}
