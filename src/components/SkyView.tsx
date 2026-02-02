import { MoonPhaseIcon } from './MoonPhaseIcon';
import { dayFactor, formatHour } from '@/lib/moonMath';

const W = 600;
const H = 390;
const GROUND_Y = 290;
const ARC_CX = W / 2;
const ARC_CY = GROUND_Y;
const ARC_R = 220;
const MOON_SIZE = 22;

type Props = {
  moonAngle: number;
  observerAngle: number;
  skyPosition: number;
  moonVisible: boolean;
  hour: number;
};

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): string {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * c)},${Math.round(a[1] + (b[1] - a[1]) * c)},${Math.round(a[2] + (b[2] - a[2]) * c)})`;
}

const NIGHT: [number, number, number] = [12, 18, 60];
const TWILIGHT: [number, number, number] = [60, 70, 120];
const DAY: [number, number, number] = [110, 170, 230];

function skyColor(df: number): string {
  if (df < 0.35) return lerpColor(NIGHT, TWILIGHT, df / 0.35);
  return lerpColor(TWILIGHT, DAY, (df - 0.35) / 0.65);
}

// Fixed star positions and sizes for night sky
const STARS: [number, number, number][] = [
  [80, 40, 1.5], [150, 80, 1], [220, 30, 1.5], [310, 55, 1], [400, 25, 1.5], [470, 70, 1],
  [530, 40, 1], [100, 150, 1.5], [200, 120, 1], [350, 140, 1.5], [450, 110, 1], [540, 160, 1.5],
  [60, 200, 1], [180, 230, 1.5], [280, 180, 1], [420, 200, 1], [500, 240, 1.5], [140, 260, 1],
  [320, 250, 1], [460, 260, 1.5], [250, 90, 1], [380, 80, 1.5], [50, 110, 1], [560, 100, 1.5],
];

function skyPosToArc(skyPos: number) {
  // skyPos: π/2 = East, 0 = South (top of arc), -π/2 = West
  const arcAngle = Math.PI / 2 - skyPos;
  return {
    x: ARC_CX - ARC_R * Math.cos(arcAngle),
    y: ARC_CY - ARC_R * Math.sin(arcAngle),
  };
}

export function SkyView({
  moonAngle,
  observerAngle: obsAngle,
  skyPosition,
  moonVisible,
  hour,
}: Props) {
  const df = dayFactor(obsAngle);
  const bg = skyColor(df);
  const starOpacity = Math.max(0, 1 - df * 2.5);

  // Moon position on arc
  const moonPos = skyPosToArc(skyPosition);

  // Sun sky position
  let sunSkyPos = 0 - obsAngle;
  while (sunSkyPos > Math.PI) sunSkyPos -= 2 * Math.PI;
  while (sunSkyPos < -Math.PI) sunSkyPos += 2 * Math.PI;
  const sunVisible = sunSkyPos > -Math.PI / 2 && sunSkyPos < Math.PI / 2;
  const sunPos = skyPosToArc(sunSkyPos);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Sky background */}
      <rect width={W} height={GROUND_Y} fill={bg} rx="8" />
      {/* Round bottom corners of sky */}
      <rect y={GROUND_Y - 8} width={W} height={8} fill={bg} />

      {/* Stars */}
      {STARS.map(([sx, sy, sr], i) => (
        <circle
          key={i}
          cx={sx}
          cy={sy}
          r={sr}
          fill="white"
          opacity={starOpacity * (0.4 + ((i * 7) % 10) / 15)}
        />
      ))}

      {/* Ground */}
      <rect y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#3d2b1f" />
      {/* Grass/ground top edge */}
      <line
        x1="0"
        y1={GROUND_Y}
        x2={W}
        y2={GROUND_Y}
        stroke="#2a5a1a"
        strokeWidth="3"
      />

      {/* Moon arc path (dashed) */}
      <path
        d={`M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Direction labels */}
      <text
        x={ARC_CX - ARC_R}
        y={GROUND_Y + 30}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        東
      </text>
      <text
        x={ARC_CX}
        y={GROUND_Y + 30}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        南
      </text>
      <text
        x={ARC_CX + ARC_R}
        y={GROUND_Y + 30}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        西
      </text>

      {/* Sun with rays */}
      {sunVisible && sunPos.y < GROUND_Y && (
        <g>
          {/* Outer glow */}
          <circle cx={sunPos.x} cy={sunPos.y} r={28} fill="#FFD700" opacity={0.15} />
          {/* Rays */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={sunPos.x + Math.cos(a) * 18}
                y1={sunPos.y + Math.sin(a) * 18}
                x2={sunPos.x + Math.cos(a) * 30}
                y2={sunPos.y + Math.sin(a) * 30}
                stroke="#FFD700"
                strokeWidth="2"
                opacity={0.6}
                strokeLinecap="round"
              />
            );
          })}
          {/* Sun body */}
          <circle cx={sunPos.x} cy={sunPos.y} r={14} fill="#FF8C00" />
          <circle cx={sunPos.x} cy={sunPos.y} r={10} fill="#FFD700" />
          {/* Label */}
          <text
            x={sunPos.x}
            y={sunPos.y - 22}
            fill="#FFD700"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            太陽
          </text>
        </g>
      )}

      {/* Moon */}
      {moonVisible ? (
        <g>
          <g transform={`rotate(${-skyPosition * (180 / Math.PI)}, ${moonPos.x}, ${moonPos.y})`}>
            <MoonPhaseIcon
              phaseAngle={moonAngle}
              radius={MOON_SIZE}
              cx={moonPos.x}
              cy={moonPos.y}
            />
          </g>
          <text
            x={moonPos.x}
            y={moonPos.y - MOON_SIZE - 6}
            fill="#FFE87C"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            月
          </text>
        </g>
      ) : (
        <text
          x={ARC_CX}
          y={GROUND_Y - 100}
          fill="rgba(255,255,255,0.4)"
          fontSize="15"
          textAnchor="middle"
        >
          月は地平線の下にあります
        </text>
      )}

      {/* Movement direction arrows on arc */}
      {moonVisible && (
        <g opacity="0.3">
          <text
            x={moonPos.x + 30}
            y={moonPos.y - 5}
            fill="white"
            fontSize="16"
            textAnchor="middle"
          >
            →
          </text>
        </g>
      )}

      {/* Time-of-day indicator bar */}
      <rect y={GROUND_Y + 42} width={W} height={46} fill="rgba(0,0,0,0.3)" rx="4" />
      {/* Day/night gradient bar */}
      <defs>
        <linearGradient id="timeBar">
          <stop offset="0%" stopColor="#0c1445" />
          <stop offset="25%" stopColor="#0c1445" />
          <stop offset="40%" stopColor="#ff8844" />
          <stop offset="50%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#ff8844" />
          <stop offset="75%" stopColor="#0c1445" />
          <stop offset="100%" stopColor="#0c1445" />
        </linearGradient>
      </defs>
      <rect
        x={20}
        y={GROUND_Y + 50}
        width={W - 40}
        height={8}
        rx="4"
        fill="url(#timeBar)"
        opacity="0.7"
      />
      {/* Time bar labels */}
      <text x={20} y={GROUND_Y + 74} fill="#aaa" fontSize="11" textAnchor="start">0時</text>
      <text x={20 + (W - 40) / 4} y={GROUND_Y + 74} fill="#aaa" fontSize="11" textAnchor="middle">6時</text>
      <text x={20 + (W - 40) / 2} y={GROUND_Y + 74} fill="#aaa" fontSize="11" textAnchor="middle">12時</text>
      <text x={20 + (3 * (W - 40)) / 4} y={GROUND_Y + 74} fill="#aaa" fontSize="11" textAnchor="middle">18時</text>
      <text x={W - 20} y={GROUND_Y + 74} fill="#aaa" fontSize="11" textAnchor="end">24時</text>
      {/* Time marker on bar */}
      {(() => {
        const barX = 20 + (hour / 24) * (W - 40);
        return (
          <g>
            <line x1={barX} y1={GROUND_Y + 47} x2={barX} y2={GROUND_Y + 61} stroke="white" strokeWidth="2" strokeLinecap="round" />
            <text
              x={barX}
              y={GROUND_Y + 74}
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              {formatHour(hour)}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
