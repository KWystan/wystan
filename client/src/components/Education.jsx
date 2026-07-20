import { education } from '../data/portfolioData';
import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Education() {
  const [ref, visible] = useScrollReveal();
  const [expanded, setExpanded] = useState({});

  return (
    <section id="education" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-4 leading-tight">
          Education <span className="text-black/35 text-base font-normal">[{education.length}]</span>
        </h2>
        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''} space-y-3`}
        >
          {education.map((school, i) => {
            const isExpanded = expanded[i];
            return (
              <div key={i} className="border border-black/10 rounded-lg p-4 transition-all duration-200 hover-gate:border-black/20 active:scale-[0.99]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg border border-black/18 overflow-hidden flex-shrink-0">
                    <img src={school.image} alt={school.school} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-black">{school.school}</h3>
                    <p className="text-xs text-black/55">{school.degree}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-black/40">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px] text-black/40">calendar_today</span>
                    {school.period}
                  </span>
                  <span className="text-black/15">�</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px] text-black/40">location_on</span>
                    {school.location}
                  </span>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className="space-y-1.5">
                    {school.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-black/55">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {school.details.length > 0 && (
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [i]: !isExpanded }))}
                    className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black/70 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                    {isExpanded ? 'Less details' : 'More details'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
