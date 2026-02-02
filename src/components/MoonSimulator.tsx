'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { OrbitalView } from './OrbitalView';
import { SkyView } from './SkyView';
import {
  SYNODIC_PERIOD,
  moonOrbitAngle,
  observerAngle,
  moonSkyPosition,
  isMoonVisible,
  getPhaseName,
  formatHour,
  getRiseHour,
  getMeridianHour,
  getSetHour,
} from '@/lib/moonMath';

const PRESETS = [
  { name: '新月', lunarAge: 0, hour: 12 },
  { name: '三日月', lunarAge: 3, hour: 19 },
  { name: '上弦の月', lunarAge: 7.4, hour: 18 },
  { name: '満月', lunarAge: 14.8, hour: 0 },
  { name: '下弦の月', lunarAge: 22.1, hour: 6 },
];

export function MoonSimulator() {
  const [lunarAge, setLunarAge] = useState(14.8);
  const [hour, setHour] = useState(21);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const animRef = useRef(0);
  const lastTimeRef = useRef(0);

  const moonAngle = moonOrbitAngle(lunarAge);
  const obsAngle = observerAngle(hour);
  const skyPos = moonSkyPosition(moonAngle, obsAngle);
  const visible = isMoonVisible(skyPos);
  const phaseName = getPhaseName(lunarAge);
  const riseH = getRiseHour(lunarAge);
  const meridianH = getMeridianHour(lunarAge);
  const setH = getSetHour(lunarAge);

  const animate = useCallback(
    (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      setHour((h) => {
        const next = h + dt * speed;
        return ((next % 24) + 24) % 24;
      });
      setLunarAge((a) => {
        const next = a + (dt * speed) / 24;
        return ((next % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;
      });

      animRef.current = requestAnimationFrame(animate);
    },
    [speed],
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, animate]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-1 text-white">
        月の動きシミュレーター
      </h1>
      <p className="text-center text-xs text-gray-400 mb-3">
        月齢と時刻を変えて、月の見え方と位置の関係を確認しよう
      </p>

      {/* Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <h2 className="text-center text-sm font-bold text-gray-300 mb-2">
            地球の真上から見た図（北極側）
          </h2>
          <OrbitalView moonAngle={moonAngle} observerAngle={obsAngle} />
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <h2 className="text-center text-sm font-bold text-gray-300 mb-2">
            地上から見た月の動き
          </h2>
          <SkyView
            moonAngle={moonAngle}
            observerAngle={obsAngle}
            skyPosition={skyPos}
            moonVisible={visible}
          />
        </div>
      </div>

      {/* Info & Controls */}
      <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-800 space-y-5">
        {/* Phase info row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">現在の月：</span>
            <span className="font-bold text-yellow-300 text-lg">{phaseName}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">月齢：</span>
            <span className="font-bold text-white">{lunarAge.toFixed(1)}日</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400 text-sm">時刻：</span>
            <span className="font-bold text-white">{formatHour(hour)}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            {visible ? (
              <span className="text-green-400 font-bold">● 月が見えます</span>
            ) : (
              <span className="text-gray-500">○ 月は地平線の下</span>
            )}
          </div>
        </div>

        {/* Rise/Meridian/Set */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="text-gray-300">
            <span className="text-gray-500">東の空に昇る：</span>
            <span className="font-bold">{formatHour(riseH)}</span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">南中する：</span>
            <span className="font-bold">{formatHour(meridianH)}</span>
          </div>
          <div className="text-gray-300">
            <span className="text-gray-500">西の空に沈む：</span>
            <span className="font-bold">{formatHour(setH)}</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm w-14 text-gray-400 shrink-0">月齢</label>
            <input
              type="range"
              min="0"
              max={SYNODIC_PERIOD}
              step="0.1"
              value={lunarAge}
              onChange={(e) => setLunarAge(Number(e.target.value))}
              className="flex-1 accent-yellow-400"
            />
            <span className="text-sm w-16 text-right text-gray-300">
              {lunarAge.toFixed(1)}日
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm w-14 text-gray-400 shrink-0">時刻</label>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.1"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="flex-1 accent-blue-400"
            />
            <span className="text-sm w-16 text-right text-gray-300">
              {formatHour(hour)}
            </span>
          </div>
        </div>

        {/* Play controls */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition cursor-pointer"
          >
            {isPlaying ? '⏸ 一時停止' : '▶ 再生'}
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>速度：</span>
            {[1, 2, 4, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                x{s}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">プリセット：</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setLunarAge(preset.lunarAge);
                setHour(preset.hour);
              }}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
