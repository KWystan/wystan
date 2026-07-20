import { uses } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

const categoryIcons = {
  Hardware: 'computer',
  Software: 'code',
  Browser: 'globe',
  Productivity: 'checklist',
};

export default function Uses() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="py-8 lg:py-10">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <div style={{ animation: `fade-up 0.3s var(--ease-out-expo) both` }}>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-black leading-tight">
            Uses
          </h1>
          <p className="text-xs text-black/40 mt-1">The tools, software, and gear I use every day</p>
        </div>

        <div ref={ref} className={`scroll-reveal ${visible ? 'revealed' : ''} mt-5`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(uses).map(([category, items]) => (
              <div key={category} className="border border-black/10 rounded-lg p-4 transition-all duration-200 hover:border-black/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[16px] text-black/40">
                    {categoryIcons[category] || 'settings'}
                  </span>
                  <h2 className="text-sm font-semibold text-black">{category}</h2>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-black/70">{item.name}</p>
                        <p className="text-[10px] text-black/45">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-black/30 text-center mt-6">
            Always evolving � this list will grow as I discover better tools.
          </p>
        </div>
      </div>
    </section>
  );
}
