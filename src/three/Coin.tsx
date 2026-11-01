import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { poseAt, type Pose } from '../lib/choreography';
import { intro, pointer, prefersReducedMotion } from '../lib/motion';
import { clamp, damp } from '../lib/utils';
import { makeBlobTexture, makeRingAlpha } from './textures';

// Coin dimensions (world units, before responsive scaling).
const R = 1.4; // radius
const H = 0.12; // half thickness at the raised rim
const F = 0.075; // half thickness of the recessed field
const RIN = 1.12; // radius where the field meets the rim

function buildBody() {
  const pts: [number, number][] = [
    [0, -F],
    [RIN, -F],
    [RIN + 0.02, -(F + 0.02)],
    [RIN + 0.05, -H],
    [R - 0.07, -H],
    [R - 0.03, -H + 0.012],
    [R, -H + 0.05],
    [R, H - 0.05],
    [R - 0.03, H - 0.012],
    [R - 0.07, H],
    [RIN + 0.05, H],
    [RIN + 0.02, F + 0.02],
    [RIN, F],
    [0, F],
  ];
  const geo = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 160);
  return toCreasedNormals(geo, 0.6);
}

/** The AvenZo symbol: a chevron "A" with a single coin-dot as its crossbar. */
function buildSymbol() {
  const chevron = new THREE.Shape();
  const pts: [number, number][] = [
    [-0.5, -0.5],
    [0, 0.55],
    [0.5, -0.5],
    [0.33, -0.5],
    [0, 0.19],
    [-0.33, -0.5],
  ];
  pts.forEach(([x, y], i) => (i === 0 ? chevron.moveTo(x, y) : chevron.lineTo(x, y)));
  chevron.closePath();
  const dot = new THREE.Shape();
  dot.absarc(0, -0.31, 0.085, 0, Math.PI * 2, false);
  const geo = new THREE.ExtrudeGeometry([chevron, dot], {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 32,
  });
  geo.translate(0, -0.025, 0);
  return toCreasedNormals(geo, 0.7);
}

function Reeding({ material }: { material: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const N = 150;
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      o.position.set(Math.cos(a) * (R + 0.004), Math.sin(a) * (R + 0.004), 0);
      o.rotation.set(0, 0, a);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} material={material}>
      <boxGeometry args={[0.03, 0.03, 0.17]} />
    </instancedMesh>
  );
}

export default function Coin({ isMobile }: { isMobile: boolean }) {
  const root = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const cur = useRef<Pose | null>(null);
  const spinAcc = useRef(0);

  const { body, symbol, ringGeo, gold, polished, engrave, blob } = useMemo(() => {
    const ringTex = makeRingAlpha('SHOP • EARN • CASHBACK • SHOP • EARN • CASHBACK • ', 1.33, 1.25, 0.105);
    return {
      body: buildBody(),
      symbol: buildSymbol(),
      ringGeo: new THREE.RingGeometry(1.17, 1.33, 128, 1),
      gold: new THREE.MeshPhysicalMaterial({
        color: '#d9aa38',
        metalness: 1,
        roughness: 0.3,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.5,
      }),
      polished: new THREE.MeshPhysicalMaterial({
        color: '#e8bb48',
        metalness: 1,
        roughness: 0.14,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.8,
      }),
      engrave: new THREE.MeshStandardMaterial({
        color: '#5a410d',
        metalness: 1,
        roughness: 0.55,
        alphaMap: ringTex,
        alphaTest: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
      blob: makeBlobTexture(),
    };
  }, []);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const tgt = poseAt(window.scrollY);
    if (!cur.current) cur.current = { ...tgt };
    const c = cur.current;
    const k = 3.4;
    c.x = damp(c.x, tgt.x, k, dt);
    c.y = damp(c.y, tgt.y, k, dt);
    c.z = damp(c.z, tgt.z, k, dt);
    c.s = damp(c.s, tgt.s, k, dt);
    c.rx = damp(c.rx, tgt.rx, k, dt);
    c.ry = damp(c.ry, tgt.ry, k, dt);
    c.spin = damp(c.spin, tgt.spin, 2, dt);
    if (!prefersReducedMotion) spinAcc.current += c.spin * dt;

    const e = intro.p;
    const vw = state.viewport.width;
    const vh = state.viewport.height;
    const D = isMobile ? Math.min(vw * 0.74, vh * 0.4) : Math.min(vw * 0.34, vh * 0.62);
    const base = D / (R * 2);
    const scale = Math.max(base * c.s * (0.55 + 0.45 * e), 0.0001);
    const floatY = prefersReducedMotion ? 0 : Math.sin(t * 0.9) * 0.035 * D;
    const px = isMobile ? 0 : pointer.x;
    const py = isMobile ? 0 : pointer.y;

    root.current.position.set((c.x * vw) / 2, (c.y * vh) / 2 + floatY, c.z - (1 - e) * 4);
    root.current.scale.setScalar(scale);
    spin.current.rotation.set(
      c.rx + py * 0.16 + Math.sin(t * 0.5) * 0.04,
      c.ry + spinAcc.current + px * 0.28 + (1 - e) * Math.PI * 2.4,
      Math.sin(t * 0.6) * 0.03,
    );

    // Soft contact shadow + warm glow that trail the coin.
    const near = clamp(1 - c.z / 1.4, 0, 1);
    const vis = e * near * clamp(c.s * 1.6, 0, 1);
    const sy = root.current.position.y - R * scale - 0.32 * scale;
    for (const [m, o, w] of [
      [shadow.current, 0.34, 3.1],
      [glow.current, 0.22, 3.6],
    ] as const) {
      m.position.set(root.current.position.x, sy, -0.2);
      m.scale.set(scale * w, scale * w * 0.17, 1);
      (m.material as THREE.MeshBasicMaterial).opacity = o * vis;
    }
  });

  return (
    <>
      <group ref={root}>
        <group ref={spin}>
          <mesh geometry={body} material={gold} rotation={[Math.PI / 2, 0, 0]} />
          <Reeding material={gold} />
          {/* front face */}
          <mesh geometry={symbol} material={polished} position={[0, 0, F - 0.002]} scale={1.25} />
          <mesh geometry={ringGeo} material={engrave} position={[0, 0, H + 0.002]} />
          {/* back face */}
          <group rotation={[0, Math.PI, 0]}>
            <mesh geometry={symbol} material={polished} position={[0, 0, F - 0.002]} scale={1.25} />
            <mesh geometry={ringGeo} material={engrave} position={[0, 0, H + 0.002]} />
          </group>
        </group>
      </group>

      <mesh ref={shadow} renderOrder={-2}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={blob} color="#000000" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={glow} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={blob}
          color="#d4af37"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
