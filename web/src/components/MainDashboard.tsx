'use client';

import { useState, useEffect } from 'react';
import { ChokepointRow, HistoricalCase, Ask, CountrySummary, UnscreenableInput } from '@/types';
import Header from './Header';
import Overview from './Overview';
import WorldMap from './WorldMap';
import ChokepointDatabase from './ChokepointDatabase';
import LeverageSimulator from './LeverageSimulator';
import HistoricalPrecedents from './HistoricalPrecedents';
import SafetyPolicy from './SafetyPolicy';
import MethodAndLimits from './MethodAndLimits';
import Footer from './Footer';

interface MainDashboardProps {
  chokepoints: ChokepointRow[];
  cases: HistoricalCase[];
  asks: Ask[];
  countries: CountrySummary[];
  unscreenable: UnscreenableInput[];
  metrics: {
    totalScored: number;
    countriesCount: number;
    replaceGt5Count: number;
    depHighCount: number;
  };
}

export default function MainDashboard({
  chokepoints,
  cases,
  asks,
  countries,
  unscreenable,
  metrics,
}: MainDashboardProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('database');
  const [simulatorPreset, setSimulatorPreset] = useState<string>('C32');

  // IntersectionObserver to quietly update active section in sticky header
  useEffect(() => {
    const sectionIds = ['database', 'simulator', 'precedents', 'policy', 'method'];
    const observers: IntersectionObserver[] = [];

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(observerCallback, {
          rootMargin: '-20% 0px -70% 0px',
        });
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleOpenInSimulator = (row: ChokepointRow) => {
    setSimulatorPreset(row.row_id);
    const simEl = document.getElementById('simulator');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-body-primary font-sans antialiased">
      {/* Sticky Header with 5 Nav Links & Quiet Active Indicator */}
      <Header activeSection={activeSection} />

      <main className="flex-1">
        {/* Research Overview & Compact Metrics */}
        <Overview
          totalScored={metrics.totalScored}
          countriesCount={metrics.countriesCount}
          replaceGt5Count={metrics.replaceGt5Count}
          depHighCount={metrics.depHighCount}
        />

        {/* Cartographic World Map Section */}
        <WorldMap
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
        />

        {/* Chokepoint Database (35 Rows) */}
        <ChokepointDatabase
          rows={chokepoints}
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onOpenInSimulator={handleOpenInSimulator}
        />

        {/* Leverage Simulator (2-Column Desktop Workspace) */}
        <LeverageSimulator
          chokepoints={chokepoints}
          cases={cases}
          initialRowId={simulatorPreset}
        />

        {/* Historical Precedents (K1 to K5) */}
        <HistoricalPrecedents cases={cases} />

        {/* AI Safety Policy (A1 to A7) */}
        <SafetyPolicy asks={asks} />

        {/* Method & Limits */}
        <MethodAndLimits unscreenable={unscreenable} />
      </main>

      {/* Footer with Licences & Hackathon Credits */}
      <Footer />
    </div>
  );
}

