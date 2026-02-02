export const SYNODIC_PERIOD = 29.53;
const TWO_PI = 2 * Math.PI;

export function moonOrbitAngle(lunarAge: number): number {
  const age = ((lunarAge % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;
  return (age / SYNODIC_PERIOD) * TWO_PI;
}

export function observerAngle(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  const angle = ((h - 12) / 24) * TWO_PI;
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

export function moonSkyPosition(moonAngle: number, obsAngle: number): number {
  let diff = moonAngle - obsAngle;
  while (diff > Math.PI) diff -= TWO_PI;
  while (diff < -Math.PI) diff += TWO_PI;
  return diff;
}

export function isMoonVisible(skyPos: number): boolean {
  return skyPos > -Math.PI / 2 && skyPos < Math.PI / 2;
}

export function dayFactor(obsAngle: number): number {
  return (1 + Math.cos(obsAngle)) / 2;
}

export function getPhaseName(lunarAge: number): string {
  const age = ((lunarAge % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;
  if (age < 0.75 || age > 28.78) return '新月';
  if (age < 5.5) return '三日月';
  if (age < 9.2) return '上弦の月';
  if (age < 12.9) return '十日夜月';
  if (age < 16.6) return '満月';
  if (age < 20.3) return '居待月';
  if (age < 24) return '下弦の月';
  return '有明月';
}

export function getMeridianHour(lunarAge: number): number {
  const orbitAngle = moonOrbitAngle(lunarAge);
  return ((orbitAngle / TWO_PI) * 24 + 12) % 24;
}

export function getRiseHour(lunarAge: number): number {
  return (getMeridianHour(lunarAge) - 6 + 24) % 24;
}

export function getSetHour(lunarAge: number): number {
  return (getMeridianHour(lunarAge) + 6) % 24;
}

export function formatHour(h: number): string {
  const hour = Math.floor(((h % 24) + 24) % 24);
  const min = Math.round(((h % 1) + 1) % 1 * 60);
  return `${hour}:${min.toString().padStart(2, '0')}`;
}
