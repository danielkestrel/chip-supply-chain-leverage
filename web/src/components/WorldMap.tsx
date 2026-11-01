'use client';

import { useState, useRef, useEffect } from 'react';
import mapDataRaw from '@/data/map-data.json';
import { ZoomIn, ZoomOut, RotateCcw, Globe, Compass } from 'lucide-react';

interface TargetCountry {
  id: string;
  name: string;
  path: string;
  centroid: [number, number];
  badgePos: [number, number];
  rows: number;
  replaceGt5: number;
  strongestHold: string;
  fillColor: string;
  strokeColor: string;
  radius: number;
  leaderLine: boolean;
  labelAnchor: 'start' | 'middle' | 'end';
}

interface MapData {
  width: number;
  height: number;
  land: string;
  borders: string;
  targets: Record<string, TargetCountry>;
  presets: {
    world: { x: number; y: number; width: number; height: number };
    europe: { x: number; y: number; width: number; height: number };
    eastAsia: { x: number; y: number; width: number; height: number };
  };
}

const mapData = mapDataRaw as unknown as MapData;

interface WorldMapProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

export default function WorldMap({ selectedCountry, onSelectCountry }: WorldMapProps) {
  const [viewBox, setViewBox] = useState(mapData.presets.world);
  const [activePreset, setActivePreset] = useState<'world' | 'europe' | 'eastAsia'>('world');
  const [hoveredCountry, setHoveredCountry] = useState<TargetCountry | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; vbX: number; vbY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothly transition viewBox
  const animateTo = (targetVb: { x: number; y: number; width: number; height: number }) => {
    const startVb = { ...viewBox };
    const duration = 400; // ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeInOutCubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setViewBox({
        x: startVb.x + (targetVb.x - startVb.x) * ease,
        y: startVb.y + (targetVb.y - startVb.y) * ease,
        width: startVb.width + (targetVb.width - startVb.width) * ease,
        height: startVb.height + (targetVb.height - startVb.height) * ease,
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handlePreset = (preset: 'world' | 'europe' | 'eastAsia') => {
    setActivePreset(preset);
    animateTo(mapData.presets[preset]);
  };

  const handleZoom = (factor: number) => {
    const newWidth = Math.max(80, Math.min(mapData.width, viewBox.width * factor));
    const newHeight = Math.max(45, Math.min(mapData.height, viewBox.height * factor));
    const newX = viewBox.x + (viewBox.width - newWidth) / 2;
    const newY = viewBox.y + (viewBox.height - newHeight) / 2;
    animateTo({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const handleReset = () => {
    handlePreset('world');
  };

  // Drag pan handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // primary button only
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      vbX: viewBox.x,
      vbY: viewBox.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;

    const dx = (e.clientX - dragStartRef.current.x) * scaleX;
    const dy = (e.clientY - dragStartRef.current.y) * scaleY;

    setViewBox((prev) => ({
      ...prev,
      x: dragStartRef.current!.vbX - dx,
      y: dragStartRef.current!.vbY - dy,
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleCountryHover = (c: TargetCountry, e: React.MouseEvent | React.FocusEvent) => {
    setHoveredCountry(c);
    if ('clientX' in e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      // Centroid fallback for keyboard navigation
      const scaleX = containerRef.current ? containerRef.current.clientWidth / viewBox.width : 1;
      const scaleY = containerRef.current ? containerRef.current.clientHeight / viewBox.height : 1;
      setTooltipPos({
        x: (c.badgePos[0] - viewBox.x) * scaleX,
        y: (c.badgePos[1] - viewBox.y) * scaleY - 30,
      });
    }
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
    setTooltipPos(null);
  };

  const handleCountryClick = (countryName: string) => {
    if (selectedCountry === countryName) {
      onSelectCountry('All');
    } else {
      onSelectCountry(countryName);
    }
  };

  const targetsList = Object.values(mapData.targets).sort((a, b) => b.rows - a.rows);

  return (
    <section id="map" className="py-8 bg-app-bg border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              <Compass size={14} />
              <span>Cartographic Distribution · Natural Earth Projection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              The Middle-Power Chokepoints
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              Eight nations holding &ge;40% of critical semiconductor inputs, matched by ISO 3166 numeric code.
            </p>
          </div>

          {/* View Preset Controls */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-app-border bg-app-card p-0.5 text-xs font-medium text-body-secondary shadow-sm">
              <button
                type="button"
                onClick={() => handlePreset('world')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreset === 'world'
                    ? 'bg-navy-secondary text-white font-semibold'
                    : 'hover:text-navy-primary hover:bg-app-bg'
                }`}
              >
                World
              </button>
              <button
                type="button"
                onClick={() => handlePreset('europe')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreset === 'europe'
                    ? 'bg-navy-secondary text-white font-semibold'
                    : 'hover:text-navy-primary hover:bg-app-bg'
                }`}
              >
                Europe
              </button>
              <button
                type="button"
                onClick={() => handlePreset('eastAsia')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activePreset === 'eastAsia'
                    ? 'bg-navy-secondary text-white font-semibold'
                    : 'hover:text-navy-primary hover:bg-app-bg'
                }`}
              >
                East Asia
              </button>
            </div>

            {/* Zoom / Reset */}
            <div className="inline-flex rounded-md border border-app-border bg-app-card p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => handleZoom(0.75)}
                className="p-1 text-slate-muted hover:text-navy-primary hover:bg-app-bg rounded transition-colors"
                title="Zoom In"
                aria-label="Zoom in on map"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1.33)}
                className="p-1 text-slate-muted hover:text-navy-primary hover:bg-app-bg rounded transition-colors"
                title="Zoom Out"
                aria-label="Zoom out on map"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1 text-slate-muted hover:text-navy-primary hover:bg-app-bg rounded transition-colors"
                title="Reset View"
                aria-label="Reset map view"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Map Viewport Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full aspect-[960/500] max-h-[580px] bg-[#f7f8fa] border border-app-border rounded-card overflow-hidden select-none shadow-inner ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ touchAction: 'pan-y' }}
        >
          <svg
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            className="w-full h-full block"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Ocean is the container background */}

            {/* Base Land - Natural Earth 50m */}
            <path
              d={mapData.land}
              fill="#e9eef4"
              stroke="none"
              className="transition-colors duration-200"
            />

            {/* Country Hairline Borders Mesh */}
            <path
              d={mapData.borders}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Target 8 Middle-Power Countries */}
            {targetsList.map((country) => {
              const isSelected = selectedCountry === country.name;
              const isHovered = hoveredCountry?.name === country.name;

              return (
                <path
                  key={country.id}
                  d={country.path}
                  fill={country.fillColor}
                  stroke={isSelected ? '#101d35' : isHovered ? '#101d35' : country.strokeColor}
                  strokeWidth={isSelected ? 1.5 : isHovered ? 1.2 : 0.6}
                  className="cursor-pointer transition-all duration-150"
                  tabIndex={0}
                  role="button"
                  aria-label={`${country.name}: ${country.rows} chokepoints`}
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={(e) => handleCountryHover(country, e)}
                  onMouseLeave={handleCountryLeave}
                  onFocus={(e) => handleCountryHover(country, e)}
                  onBlur={handleCountryLeave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCountryClick(country.name);
                    }
                  }}
                />
              );
            })}

            {/* Leader Lines for crowded or small countries */}
            {targetsList.map((country) => {
              if (!country.leaderLine) return null;
              const isSelected = selectedCountry === country.name;
              const isHovered = hoveredCountry?.name === country.name;

              return (
                <line
                  key={`line-${country.id}`}
                  x1={country.centroid[0]}
                  y1={country.centroid[1]}
                  x2={country.badgePos[0]}
                  y2={country.badgePos[1]}
                  stroke={isSelected || isHovered ? '#101d35' : '#526782'}
                  strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
                  strokeDasharray={isSelected ? 'none' : '2,2'}
                  className="pointer-events-none transition-colors"
                />
              );
            })}

            {/* Country Badges and Labels */}
            {targetsList.map((country) => {
              const isSelected = selectedCountry === country.name;
              const isHovered = hoveredCountry?.name === country.name;
              const [bX, bY] = country.badgePos;

              return (
                <g
                  key={`badge-${country.id}`}
                  transform={`translate(${bX}, ${bY})`}
                  className="cursor-pointer"
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={(e) => handleCountryHover(country, e)}
                  onMouseLeave={handleCountryLeave}
                  onFocus={(e) => handleCountryHover(country, e)}
                  onBlur={handleCountryLeave}
                  tabIndex={0}
                  role="button"
                  aria-label={`${country.name}: ${country.rows} chokepoint rows`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCountryClick(country.name);
                    }
                  }}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r={country.radius + 3.5}
                      fill="none"
                      stroke="#101d35"
                      strokeWidth="1.5"
                      strokeDasharray="3,2"
                    />
                  )}

                  {/* Circular Badge */}
                  <circle
                    r={country.radius}
                    fill={isSelected ? '#101d35' : '#1d3557'}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    className="transition-transform duration-150 hover:scale-110 shadow-sm"
                  />

                  {/* Row count in Geist Mono */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={country.radius >= 14 ? '11px' : '9px'}
                    fontFamily="var(--font-geist-mono), monospace"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {country.rows}
                  </text>

                  {/* Text Label */}
                  <text
                    x={country.labelAnchor === 'start' ? country.radius + 5 : country.labelAnchor === 'end' ? -country.radius - 5 : 0}
                    y={country.labelAnchor === 'middle' ? -country.radius - 4 : 1}
                    textAnchor={country.labelAnchor}
                    dominantBaseline={country.labelAnchor === 'middle' ? 'auto' : 'central'}
                    fill={isSelected ? '#101d35' : '#172235'}
                    fontSize="10px"
                    fontWeight={isSelected ? '700' : '600'}
                    fontFamily="var(--font-geist-sans), sans-serif"
                    className="pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                  >
                    {country.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Map Legend */}
          <div className="absolute bottom-3 left-3 bg-app-card/95 backdrop-blur px-3 py-2 rounded-md border border-app-border text-[11px] shadow-sm pointer-events-auto space-y-1">
            <span className="font-semibold text-navy-primary block">
              Scored Chokepoint Rows (Stepped Scale)
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8ea6c2] border border-white"></span>
                <span className="text-body-secondary font-mono">1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#6381a3] border border-white"></span>
                <span className="text-body-secondary font-mono">2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#3a597e] border border-white"></span>
                <span className="text-body-secondary font-mono">6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1d3557] border border-white"></span>
                <span className="text-body-secondary font-mono">21</span>
              </div>
            </div>
            {selectedCountry !== 'All' && (
              <div className="pt-1 border-t border-app-border flex items-center justify-between text-xs text-navy-secondary">
                <span>Filter: <strong>{selectedCountry}</strong></span>
                <button
                  type="button"
                  onClick={() => onSelectCountry('All')}
                  className="text-[10px] text-body-secondary hover:text-navy-primary underline ml-2"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Tooltip */}
          {hoveredCountry && tooltipPos && (
            <div
              className="absolute z-20 pointer-events-none bg-navy-primary text-white p-3 rounded-lg shadow-lg border border-slate-muted/30 text-xs max-w-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth || 400) - 240)}px`,
                top: `${Math.max(tooltipPos.y - 100, 10)}px`,
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-muted/40 pb-1">
                <span className="font-semibold text-sm tracking-tight text-white">
                  {hoveredCountry.name}
                </span>
                <span className="font-mono text-[11px] text-blue-grey-light bg-navy-secondary px-1.5 py-0.2 rounded">
                  ISO {hoveredCountry.id}
                </span>
              </div>
              <div className="space-y-0.5 pt-0.5 text-[11px]">
                <div className="flex justify-between text-blue-grey-light">
                  <span>Scored chokepoints:</span>
                  <span className="font-mono font-semibold text-white">{hoveredCountry.rows} rows</span>
                </div>
                <div className="flex justify-between text-blue-grey-light">
                  <span>Time to replace &gt;5 years:</span>
                  <span className="font-mono font-semibold text-white">
                    {hoveredCountry.replaceGt5} {hoveredCountry.replaceGt5 === 1 ? 'row' : 'rows'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-muted pt-1 border-t border-slate-muted/30 leading-snug">
                  <strong className="text-white font-medium">Strongest hold:</strong>{' '}
                  {hoveredCountry.strongestHold}
                </p>
                <div className="text-[10px] text-blue-grey-light/70 italic pt-0.5">
                  Click to {selectedCountry === hoveredCountry.name ? 'clear filter' : 'filter database'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accessible Plain Country Summary List Below Map */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
              Middle Powers Overview ({targetsList.length} Countries)
            </span>
            {selectedCountry !== 'All' && (
              <button
                type="button"
                onClick={() => onSelectCountry('All')}
                className="text-xs text-navy-secondary font-medium hover:underline"
              >
                Reset map filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {targetsList.map((c) => {
              const isSelected = selectedCountry === c.name;
              return (
                <button
                  key={`item-${c.id}`}
                  type="button"
                  onClick={() => handleCountryClick(c.name)}
                  className={`p-2 rounded-md text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-grey-light border-navy-secondary shadow-sm'
                      : 'bg-app-card border-app-border hover:border-slate-muted hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy-primary truncate">{c.name}</span>
                    <span
                      className={`text-[11px] font-mono px-1 py-0.2 rounded font-semibold ${
                        isSelected ? 'bg-navy-secondary text-white' : 'bg-blue-grey-light text-slate-muted'
                      }`}
                    >
                      {c.rows}
                    </span>
                  </div>
                  <div className="text-[10px] text-body-secondary mt-1 truncate">
                    {c.replaceGt5 > 0 ? (
                      <span className="text-status-success-text font-medium">{c.replaceGt5} &gt;5yr holds</span>
                    ) : (
                      'All &lt;5yr repl.'
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

