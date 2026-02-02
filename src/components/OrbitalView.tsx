import { MoonPhaseIcon } from './MoonPhaseIcon';

const CX = 250;
const CY = 250;
const EARTH_R = 30;
const ORBIT_R = 130;
const OUTER_R = 190;
const MOON_R = 16;
const REF_R = 12;
const OUTER_MOON_R = 14;

type Props = {
  moonAngle: number;
  observerAngle: number;
};

const LABELS: { angle: number; label: string }[] = [
  { angle: 0, label: '新月' },
  { angle: Math.PI / 2, label: '上弦の月' },
  { angle: Math.PI, label: '満月' },
  { angle: (3 * Math.PI) / 2, label: '下弦の月' },
];

const REF_ANGLES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

function pos(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) };
}

/** Moon as seen from above (north pole): right half always lit by sun */
function SunlitMoon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#2a2a2a" />
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`}
        fill="#FFE87C"
      />
    </g>
  );
}

export function OrbitalView({ moonAngle, observerAngle: obsAngle }: Props) {
  const moon = pos(moonAngle, ORBIT_R);
  const obs = pos(obsAngle, EARTH_R * 0.95);

  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto">
      {/* Background */}
      <rect width="500" height="500" fill="#0a0a2e" rx="8" />

      {/* Defs */}
      <defs>
        <marker
          id="sunArr"
          markerWidth="8"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
        >
          <polygon points="0,0 8,3 0,6" fill="#FFA500" />
        </marker>
        <marker
          id="ccwArrow"
          markerWidth="8"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
        >
          <polygon points="0,0 8,3 0,6" fill="#e55" />
        </marker>
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sun rays */}
      {[170, 215, 250, 285, 330].map((yy) => (
        <line
          key={yy}
          x1="495"
          y1={yy}
          x2="415"
          y2={yy}
          stroke="#FFA500"
          strokeWidth="2.5"
          strokeOpacity="0.45"
          markerEnd="url(#sunArr)"
        />
      ))}
      <text
        x="488"
        y="152"
        fill="#FFA500"
        fontSize="13"
        textAnchor="end"
        fontWeight="bold"
        opacity="0.8"
      >
        太陽光線
      </text>

      {/* Orbit circle */}
      <circle
        cx={CX}
        cy={CY}
        r={ORBIT_R}
        fill="none"
        stroke="#555"
        strokeWidth="1"
        strokeDasharray="5 3"
      />

      {/* Orbital direction arrow (counter-clockwise) */}
      <path
        d={`M ${CX + ORBIT_R * Math.cos(0.5)} ${CY - ORBIT_R * Math.sin(0.5)} A ${ORBIT_R} ${ORBIT_R} 0 0 0 ${CX + ORBIT_R * Math.cos(1.1)} ${CY - ORBIT_R * Math.sin(1.1)}`}
        fill="none"
        stroke="#e55"
        strokeWidth="2.5"
        markerEnd="url(#ccwArrow)"
      />
      <text x="345" y="115" fill="#ccc" fontSize="11" textAnchor="middle">
        月の公転
      </text>

      {/* ===== Inner ring: actual sun illumination (right half always lit) ===== */}
      {REF_ANGLES.map((a) => {
        const p = pos(a, ORBIT_R);
        const isCurrent =
          Math.abs(a - moonAngle) < 0.25 ||
          Math.abs(a - moonAngle + 2 * Math.PI) < 0.25 ||
          Math.abs(a - moonAngle - 2 * Math.PI) < 0.25;
        return (
          <g key={`inner-${a}`} opacity={isCurrent ? 0.2 : 0.8}>
            <SunlitMoon cx={p.x} cy={p.y} r={REF_R} />
          </g>
        );
      })}

      {/* ===== Outer ring: appearance from Earth ===== */}
      {REF_ANGLES.map((a) => {
        const p = pos(a, OUTER_R);
        return (
          <g key={`outer-${a}`} opacity={0.75}>
            <MoonPhaseIcon
              phaseAngle={a}
              radius={OUTER_MOON_R}
              cx={p.x}
              cy={p.y}
              litColor="#ccc"
              darkColor="#222"
            />
          </g>
        );
      })}

      {/* Connecting lines between inner and outer moons */}
      {REF_ANGLES.map((a) => {
        const inner = pos(a, ORBIT_R + REF_R + 2);
        const outer = pos(a, OUTER_R - OUTER_MOON_R - 2);
        return (
          <line
            key={`line-${a}`}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="#444"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        );
      })}

      {/* Phase labels (outside outer ring) */}
      {LABELS.map(({ angle: a, label }) => {
        const p = pos(a, OUTER_R + OUTER_MOON_R + 16);
        return (
          <text
            key={label}
            x={p.x}
            y={p.y}
            fill="white"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}

      {/* Annotation: inner = actual, outer = from Earth */}
      <text x="12" y="20" fill="#888" fontSize="9">
        内側：実際の光の当たり方
      </text>
      <text x="12" y="33" fill="#888" fontSize="9">
        外側：地球から見た形
      </text>

      {/* Earth - night side */}
      <circle cx={CX} cy={CY} r={EARTH_R} fill="#0e2a52" />
      {/* Earth - day side (right half facing sun) */}
      <path
        d={`M ${CX} ${CY - EARTH_R} A ${EARTH_R} ${EARTH_R} 0 0 1 ${CX} ${CY + EARTH_R} Z`}
        fill="#2e7dd1"
      />
      <text
        x={CX}
        y={CY + 3}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        fontWeight="bold"
      >
        地球
      </text>
      <text
        x={CX}
        y={CY + EARTH_R + 14}
        fill="#ccc"
        fontSize="9"
        textAnchor="middle"
      >
        自転 ↺
      </text>

      {/* Observer marker */}
      <circle
        cx={obs.x}
        cy={obs.y}
        r={4}
        fill="#ff4444"
        stroke="white"
        strokeWidth="1.5"
      />
      <text
        x={obs.x}
        y={obs.y - 9}
        fill="#ff6666"
        fontSize="9"
        textAnchor="middle"
      >
        観測者
      </text>

      {/* Line of sight from observer to moon */}
      <line
        x1={obs.x}
        y1={obs.y}
        x2={moon.x}
        y2={moon.y}
        stroke="#ff6666"
        strokeWidth="1.2"
        strokeDasharray="6 3"
        opacity="0.7"
      />

      {/* Current moon on orbit: actual illumination (right half lit) */}
      <g filter="url(#moonGlow)">
        <SunlitMoon cx={moon.x} cy={moon.y} r={MOON_R} />
      </g>
      <circle
        cx={moon.x}
        cy={moon.y}
        r={MOON_R + 3}
        fill="none"
        stroke="#FFE87C"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}
