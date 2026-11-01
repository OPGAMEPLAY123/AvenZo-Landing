import { easeInOutCubic } from './utils';

/**
 * The coin's journey, expressed as poses pinned to scroll positions.
 *
 * Each section can declare stops at fractions (f: 0..1) of its own scrollable
 * range. Between stops the pose is interpolated — linearly inside a section,
 * eased between sections — so the coin is a pure function of scroll position.
 * That keeps it deterministic: scrub backwards, jump via anchors, resize — it
 * always lands in the right place.
 *
 * x / y are fractions of half the viewport width / height at the coin's plane.
 * s multiplies the responsive base size. rx/ry are radians. spin is rad/s of
 * continuous idle rotation layered on top.
 */
export interface Pose {
  x: number;
  y: number;
  z: number;
  s: number;
  rx: number;
  ry: number;
  spin: number;
}

const base: Pose = { x: 0, y: 0, z: 0, s: 1, rx: 0.1, ry: 0, spin: 0 };
const P = (o: Partial<Pose>): Pose => ({ ...base, ...o });
type Stop = { f: number; pose: Pose };

export const SECTION_ORDER = ['hero', 'cashback', 'how-it-works', 'partners', 'why', 'finale'] as const;
type SectionId = (typeof SECTION_ORDER)[number];
type Track = Record<SectionId, Stop[]>;

const PI = Math.PI;

const finale: Stop[] = [
  { f: 0, pose: P({ s: 0.9, ry: 17.2, spin: 0.25 }) },
  { f: 0.2, pose: P({ z: 0.6, s: 1, ry: 20, rx: 0.05, spin: 0 }) },
  { f: 0.42, pose: P({ z: 5.4, s: 1.1, ry: 26, rx: 0, spin: 0 }) },
  { f: 0.5, pose: P({ z: 7, s: 1.1, ry: 27, rx: 0, spin: 0 }) },
  { f: 1, pose: P({ z: 7, s: 1.1, ry: 27, rx: 0, spin: 0 }) },
];

const desktop: Track = {
  hero: [{ f: 0, pose: P({ y: -0.04, rx: 0.12, ry: 0, spin: 0.4 }) }],
  cashback: [
    { f: 0, pose: P({ x: 0.5, s: 0.84, ry: 2.4, spin: 0.12 }) },
    { f: 1, pose: P({ x: 0.5, y: 0.02, s: 0.9, rx: 0.08, ry: 5.2, spin: 0.12 }) },
  ],
  'how-it-works': [
    { f: 0, pose: P({ x: -0.5, s: 0.78, ry: 5.2, spin: 0.1 }) },
    { f: 1, pose: P({ x: -0.5, s: 0.78, ry: 5.2 + PI * 3, spin: 0.1 }) },
  ],
  partners: [{ f: 0, pose: P({ x: 0.82, y: 0.52, s: 0.3, ry: 14.6, spin: 0.2 }) }],
  why: [
    { f: 0, pose: P({ x: 0.82, y: 0.52, s: 0.3, ry: 14.6, spin: 0.2 }) },
    { f: 1, pose: P({ x: 0.82, y: 0.52, s: 0.3, ry: 17, spin: 0.2 }) },
  ],
  finale,
};

const mobile: Track = {
  hero: [{ f: 0, pose: P({ y: 0.04, rx: 0.12, ry: 0, spin: 0.4 }) }],
  cashback: [
    { f: 0, pose: P({ y: 0.5, s: 0.52, ry: 2.4, spin: 0.12 }) },
    { f: 1, pose: P({ y: 0.5, s: 0.56, rx: 0.08, ry: 5.2, spin: 0.12 }) },
  ],
  'how-it-works': [
    { f: 0, pose: P({ y: 0.5, s: 0.52, ry: 5.2, spin: 0.1 }) },
    { f: 1, pose: P({ y: 0.5, s: 0.52, ry: 5.2 + PI * 3, spin: 0.1 }) },
  ],
  partners: [{ f: 0, pose: P({ y: 0.5, s: 0.001, ry: 14.6 }) }],
  why: [
    { f: 0, pose: P({ y: 0.5, s: 0.001, ry: 14.6 }) },
    { f: 1, pose: P({ y: 0.5, s: 0.001, ry: 17 }) },
  ],
  finale,
};

interface Resolved {
  y: number;
  sec: number;
  pose: Pose;
}

let stops: Resolved[] = [];
const out: Pose = { ...base };
const KEYS: (keyof Pose)[] = ['x', 'y', 'z', 's', 'rx', 'ry', 'spin'];

/** Re-measure the page. Call on mount, after fonts load and on ScrollTrigger refresh. */
export function rebuildChoreography(isMobile: boolean) {
  const track = isMobile ? mobile : desktop;
  const vh = window.innerHeight;
  const list: Resolved[] = [];
  SECTION_ORDER.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(el.offsetHeight - vh, 0);
    track[id].forEach((s) => list.push({ y: top + s.f * scrollable, sec: i, pose: s.pose }));
  });
  list.sort((a, b) => a.y - b.y);
  stops = list;
}

export function poseAt(y: number): Pose {
  const n = stops.length;
  if (n === 0) return base;
  if (y <= stops[0].y) return stops[0].pose;
  if (y >= stops[n - 1].y) return stops[n - 1].pose;
  let i = 0;
  while (i < n - 2 && y >= stops[i + 1].y) i++;
  const a = stops[i];
  const b = stops[i + 1];
  let t = (y - a.y) / Math.max(b.y - a.y, 1);
  if (a.sec !== b.sec) t = easeInOutCubic(t);
  for (const k of KEYS) out[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * t;
  return out;
}
