type Props = {
  phaseAngle: number;
  radius: number;
  cx: number;
  cy: number;
  litColor?: string;
  darkColor?: string;
};

export function MoonPhaseIcon({
  phaseAngle,
  radius: r,
  cx,
  cy,
  litColor = '#FFE87C',
  darkColor = '#2a2a2a',
}: Props) {
  const angle = ((phaseAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // New moon
  if (angle < 0.05 || angle > 2 * Math.PI - 0.05) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={darkColor} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#555" strokeWidth={0.5} />
      </g>
    );
  }

  // Full moon
  if (Math.abs(angle - Math.PI) < 0.05) {
    return <circle cx={cx} cy={cy} r={r} fill={litColor} />;
  }

  const cosA = Math.cos(angle);
  const terminatorRx = Math.max(Math.abs(cosA) * r, 0.01);
  const isWaxing = angle < Math.PI;

  let litPath: string;
  if (isWaxing) {
    // Right side illuminated
    // Right semicircle top→right→bottom (sweep=1)
    // Terminator bottom→top: crescent=through right(sweep=0), gibbous=through left(sweep=1)
    const sweep = cosA > 0 ? 0 : 1;
    litPath = [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 0 1 ${cx} ${cy + r}`,
      `A ${terminatorRx} ${r} 0 0 ${sweep} ${cx} ${cy - r}`,
      'Z',
    ].join(' ');
  } else {
    // Left side illuminated
    // Left semicircle top→left→bottom (sweep=0)
    // Terminator bottom→top: crescent=through left(sweep=1), gibbous=through right(sweep=0)
    const sweep = cosA < 0 ? 0 : 1;
    litPath = [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 0 0 ${cx} ${cy + r}`,
      `A ${terminatorRx} ${r} 0 0 ${sweep} ${cx} ${cy - r}`,
      'Z',
    ].join(' ');
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={darkColor} />
      <path d={litPath} fill={litColor} />
    </g>
  );
}
