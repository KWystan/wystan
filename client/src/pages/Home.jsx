import Hero from '../components/Hero';
import Contributions from '../components/Contributions';
import { projects } from '../data/portfolioData';

export default function Home() {
  return (
    <div>
      <Hero />

      {/* ï¿½ Featured Projects ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ */}
      <section className="mt-12 border-t border-black/6 border-line-animate">
        <div className="border-l border-black/7 border-line-animate pt-8 px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold tracking-tight text-black leading-tight">
              Featured Projects
            </h2>
            <a
              href="/projects"
              className="text-[11px] text-black/45 hover-gate:text-black transition-colors duration-150"
            >
              View all &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.slice(0, 3).map((project) => (
              <a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-black/10 rounded-lg overflow-hidden transition-all duration-200 hover-gate:border-black/25 active:scale-[0.99]"
              >
                {project.snippets && (
                  <div className="aspect-[3/2] bg-white border-b border-black/8 overflow-hidden">
                    <img
                      src={project.snippets[0]}
                      alt={project.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-sm font-semibold text-black">{project.title}</h3>
                    <span className="text-[10px] text-black/35 whitespace-nowrap">{project.period}</span>
                  </div>
                  <p className="text-xs text-black/55 leading-relaxed line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.techs.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-1 rounded border border-black/10 text-black/45"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techs.length > 3 && (
                      <span className="text-[10px] px-2 py-1 rounded border border-black/10 text-black/35">
                        +{project.techs.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ï¿½ GitHub Activity ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ */}
      <Contributions />
    </div>
  );
}

