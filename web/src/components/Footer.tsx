import { ExternalLink, ShieldCheck, Scale, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-primary text-white text-xs border-t border-slate-muted/30 pt-10 pb-12">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-muted/30 pb-8">
          {/* Col 1: Project Identity & Authors */}
          <div className="md:col-span-5 space-y-3">
            <div className="space-y-1">
              <span className="text-base font-semibold tracking-tight text-white block">
                Conditions, Not Cutoffs
              </span>
              <span className="text-xs text-blue-grey-light/80 block">
                Chip-Supply-Chain Leverage for AI Safety
              </span>
            </div>
            <p className="text-slate-muted text-[11px] leading-relaxed">
              Research conducted by <strong>Andrew, Ayodele and Gideon</strong> for the Middle Powers hackathon, Track C (Diplomacy). This platform serves as the research publication and interactive data companion.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-secondary text-blue-grey-light text-[11px] border border-slate-muted/40 font-mono">
              <Award size={13} />
              <span>Middle Powers Hackathon · Track C Diplomacy</span>
            </div>
          </div>

          {/* Col 2: Licences & Attribution */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block font-mono">
              Data Licences &amp; Attribution
            </span>
            <ul className="space-y-2 text-[11px] text-slate-muted leading-relaxed">
              <li>
                <strong className="text-blue-grey-light">Emerging Technology Observatory (ETO):</strong>{' '}
                <em>Semiconductor Supply Chain Dataset</em> (September 2026 release). Licensed under{' '}
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline inline-flex items-center gap-0.5"
                >
                  <span>CC BY-NC 4.0</span>
                  <ExternalLink size={10} />
                </a>. Non-commercial research use only.
              </li>
              <li>
                <strong className="text-blue-grey-light">CSET (2021):</strong>{' '}
                <em>The Semiconductor Supply Chain: Assessing National Competitiveness</em>. Licensed under{' '}
                <span className="text-white">CC BY-NC 4.0</span>.
              </li>
              <li>
                <strong className="text-blue-grey-light">TrendForce &amp; SIA / BCG (2024):</strong> Extracted figures (HBM memory 2025; &lt;10nm logic capacity 2022) are cited for empirical analysis; original files are not redistributed.
              </li>
            </ul>
          </div>

          {/* Col 3: Research Navigation */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block font-mono">
              Research Sections
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-muted">
              <li>
                <a href="#map" className="hover:text-white transition-colors">
                  Middle-Power Cartography
                </a>
              </li>
              <li>
                <a href="#database" className="hover:text-white transition-colors">
                  Chokepoint Database (35 Rows)
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">
                  Precedent Distance Simulator
                </a>
              </li>
              <li>
                <a href="#precedents" className="hover:text-white transition-colors">
                  Historical Cases (K1 to K5)
                </a>
              </li>
              <li>
                <a href="#policy" className="hover:text-white transition-colors">
                  AI Safety Asks (A1 to A7)
                </a>
              </li>
              <li>
                <a href="#method" className="hover:text-white transition-colors">
                  Screening Method &amp; Limits
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-muted">
          <p>
            Treat repository data as single source of truth. Zero synthetic scores or fabricated citations.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success-text"></span>
            <span>Status: Research &amp; Report Complete</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

