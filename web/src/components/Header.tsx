'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
}

const NAV_ITEMS = [
  { id: 'database', label: 'Chokepoint Database' },
  { id: 'simulator', label: 'Leverage Simulator' },
  { id: 'precedents', label: 'Historical Precedents' },
  { id: 'policy', label: 'AI Safety Policy' },
  { id: 'method', label: 'Method & Limits' },
];

export default function Header({ activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-app-card/95 backdrop-blur border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex flex-col group">
            <span className="text-base sm:text-lg font-semibold text-navy-primary tracking-tight leading-tight group-hover:text-navy-secondary transition-colors">
              Conditions, Not Cutoffs
            </span>
            <span className="text-xs text-body-secondary hidden sm:inline">
              Chip-Supply-Chain Leverage for AI Safety
            </span>
          </a>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-grey-light text-slate-muted border border-app-border">
            Working Research Companion
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-navy-primary bg-blue-grey-light font-semibold'
                    : 'text-body-secondary hover:text-navy-primary hover:bg-app-bg'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <span className="inline-flex sm:hidden items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-grey-light text-slate-muted">
            In Progress
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-body-secondary hover:text-navy-primary rounded-md border border-app-border hover:bg-app-bg"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-app-border bg-app-card px-4 pt-2 pb-3 space-y-1 shadow-sm">
          <div className="pb-2 mb-2 border-b border-app-border flex items-center justify-between text-xs text-slate-muted">
            <span>Research complete · Report in progress</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-grey-light text-navy-primary font-semibold'
                    : 'text-body-secondary hover:bg-app-bg hover:text-navy-primary'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}

