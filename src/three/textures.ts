import * as THREE from 'three';

/**
 * White-on-black text set around a circle. Used as an alpha map on the coin's
 * rim ring so "SHOP • EARN • CASHBACK" reads as engraved lettering.
 * UVs of THREE.RingGeometry map the outer radius to the texture edge.
 */
export function makeRingAlpha(text: string, outerRadius: number, textRadius: number, fontUnits: number) {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, size, size);
  g.fillStyle = '#fff';
  const px = (fontUnits / outerRadius) * (size / 2);
  g.font = `700 ${px}px Manrope, "Helvetica Neue", Arial, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const r = (textRadius / outerRadius) * (size / 2);
  const chars = [...text];
  const step = (Math.PI * 2) / chars.length;
  chars.forEach((ch, i) => {
    g.save();
    g.translate(size / 2, size / 2);
    g.rotate(i * step);
    g.translate(0, -r);
    g.fillText(ch, 0, 0);
    g.restore();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

/** Soft radial falloff, white centre → transparent edge. */
export function makeBlobTexture() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Tiny glowing dot for gold particles. */
export function makeDotTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,244,200,1)');
  grad.addColorStop(0.3, 'rgba(240,200,100,0.85)');
  grad.addColorStop(1, 'rgba(212,175,55,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}
