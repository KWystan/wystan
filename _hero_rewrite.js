
const fs = require("fs");
const path = "E:/Project/Portfolio - 1/client/src/components/Hero.jsx";
let h = fs.readFileSync(path, "utf8");

// Find the two-column header: from "<div\n          className="flex flex-col md:flex-row" to before first divider
const startMarker = "flex flex-col md:flex-row items-start gap-6 md:gap-8";
const startIdx = h.indexOf(startMarker);
// Go back to find the opening <div
const divStart = h.lastIndexOf("<div", startIdx);
// Find the first divider after this
const divider1 = h.indexOf("my-6 border-line-animate", startIdx);
const dividerEnd = h.indexOf("</div>", divider1) + 6;

// The section to remove/replace is from divStart to dividerEnd (first divider + its wrapping div)
const sectionToReplace = h.substring(divStart, dividerEnd);

// New text block (text at very top)
const newTextBlock = `<div
          className="flex flex-col gap-1 mb-10"
          style={{ animation: `fade-up 0.3s var(--ease-out-expo) both` }}
        >
          <span className="font-display text-lg text-black/50 leading-none">
            Hello, I\'m
          </span>
          <h1 className="font-display text-[28px] font-semibold text-black leading-tight tracking-tight">
            {hero.firstName} {hero.middleName} {hero.lastName}
          </h1>
          <p className="text-sm text-black/55 leading-snug min-h-[1.25em]">
            <TypewriterText />
          </p>
          <p className="text-sm text-black/60 leading-relaxed max-w-2xl font-serif mt-3">
            I\'m a third-year BSIT student at West Visayas State University ? CICT, passionate about web development, networking, and building clean, functional interfaces. Welcome to my corner of the web.
          </p>
        </div>

        {/* ? Photo + overlapping card ? */}
        <div className="flex flex-col items-center">
          {/* Photo ? centered, moved down */}
          <div
            className="size-[160px] md:size-[200px] rounded-full border-2 border-black/12 overflow-hidden -mb-16 md:-mb-20 relative z-10"
            style={{ animation: `fade-up 0.3s var(--ease-out-expo) both, float 4s var(--ease-in-out-expo) infinite` }}
          >
            <img src={profilePic} alt={hero.firstName} className="w-full h-full object-cover" />
          </div>

          {/* Card ? overlaps bottom of photo */}
          <div
            className="relative z-20 w-full border border-black/10 rounded-xl bg-white p-5 md:p-6"
            style={{ animation: `fade-up 0.35s var(--ease-out-expo) both` }}
          >
            {/* Social + Contact inline row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">`;

// Now find the social links section (after the first divider)
const socialStart = h.indexOf("flex flex-wrap items-center gap-x-5 gap-y-2", dividerEnd);
const socialDivStart = h.lastIndexOf("<div", socialStart);
// Find the second divider after this
const divider2 = h.indexOf("my-6 border-line-animate", socialDivStart + 1);
const divider2End = h.indexOf("</div>", divider2) + 6;

// The social section
const socialSection = h.substring(socialDivStart, divider2End);

// Extract social content (without the wrapping div and divider)
const socialContent = socialSection.substring(socialSection.indexOf(">") + 1, socialSection.lastIndexOf("</div>"));
// Remove leading/trailing whitespace
const socialTrimmed = socialContent.trim();

// New social + stats inside card
const cardContent = `          {hero.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-black/50 hover:text-black/80 transition-colors duration-150 active:scale-[0.97]"
                aria-label={social.name}
              >
                {socialIcons[social.name]}
                <span className="hidden sm:inline">{social.name}</span>
              </a>
            ))}

            <span className="w-px h-4 bg-black/8 hidden sm:block" />

            <a
              href={`mailto:${hero.email}`}
              className="flex items-center gap-1.5 text-[11px] text-black/50 hover:text-black/80 transition-colors duration-150 active:scale-[0.97]"
            >
              <span className="material-symbols-outlined text-[14px] text-black/45">mail</span>
              {hero.email}
            </a>

            <span className="w-px h-4 bg-black/8 hidden sm:block" />

            <span className="flex items-center gap-1.5 text-[11px] text-black/50">
              <span className="material-symbols-outlined text-[14px] text-black/45">language</span>
              {hero.website}
            </span>

            <span className="w-px h-4 bg-black/8 hidden sm:block" />

            <span className="flex items-center gap-1.5 text-[11px] text-black/50">
              <span className="material-symbols-outlined text-[14px] text-black/45">location_on</span>
              {hero.location}
            </span>
          </div>

          {/* Divider inside card */}
          <div className="border-t border-black/6 my-4 border-line-animate" />

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center md:text-left">
              <p className="font-display text-2xl font-semibold text-black leading-tight">{stats[0].value}</p>
              <p className="text-[10px] font-medium tracking-wider uppercase text-black/35 mt-1">Projects Built</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-display text-2xl font-semibold text-black leading-tight">{stats[1].value}</p>
              <p className="text-[10px] font-medium tracking-wider uppercase text-black/35 mt-1">Years Coding</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-display text-2xl font-semibold text-black leading-tight">{stats[2].value}</p>
              <p className="text-[10px] font-medium tracking-wider uppercase text-black/35 mt-1">Certifications</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-display text-2xl font-semibold text-black leading-tight">{stats[3].value}</p>
              <p className="text-[10px] font-medium tracking-wider uppercase text-black/35 mt-1">Technologies Used</p>
            </div>
          </div>
        </div>
      </div>`;

// Now find the old stats section to remove it
const statsStart = h.indexOf("grid grid-cols-2 md:grid-cols-4 gap-6", divider2End);
const statsDivStart = h.lastIndexOf("<div", statsStart);
// Find the end of stats section (closing divs)
// Count open/close divs from statsDivStart
let depth = 0;
let statsEnd = statsDivStart;
for (let i = statsDivStart; i < h.length; i++) {
  if (h.substring(i, i+5) === "<div ") depth++;
  if (h.substring(i, i+5) === "<div\n") depth++;
  if (h.substring(i, i+6) === "</div>") {
    depth--;
    if (depth < 0) { statsEnd = i + 6; break; }
  }
}

// Replace:
// 1. Old header section (divStart to dividerEnd) -> newTextBlock
// 2. Old social section (socialDivStart to divider2End) -> '' (removed, moved into card)
// 3. Old stats section (statsDivStart to statsEnd) -> '' (removed, moved into card)

// But this is a surgical replacement. Let me do it step by step.

// Step 1: Replace old header with new text block
const afterHeader = h.substring(0, divStart) + newTextBlock + h.substring(dividerEnd);
console.log("After header replacement, length:", afterHeader.length);

// Step 2: The social and stats sections need to be found again in the new content
// Actually, since the header was replaced, the positions shifted.
// Let me find the social section in the new content
const socialStart2 = afterHeader.indexOf("flex flex-wrap items-center gap-x-5 gap-y-2");
if (socialStart2 > -1) {
  const socialDivStart2 = afterHeader.lastIndexOf("<div", socialStart2);
  const divider2_2 = afterHeader.indexOf("my-6 border-line-animate", socialStart2 + 1);
  const divider2End2 = afterHeader.indexOf("</div>", divider2_2) + 6;
  
  // Step 2: Replace social section with card opening
  const afterSocial = afterHeader.substring(0, socialDivStart2) + cardContent + afterHeader.substring(divider2End2);
  console.log("After social replacement, length:", afterSocial.length);
  
  // Step 3: Find and remove old stats section
  const statsStart2 = afterSocial.indexOf("grid grid-cols-2 md:grid-cols-4 gap-6");
  if (statsStart2 > -1) {
    const statsDivStart2 = afterSocial.lastIndexOf("<div", statsStart2);
    let depth2 = 0;
    let statsEnd2 = statsDivStart2;
    for (let i = statsDivStart2; i < afterSocial.length; i++) {
      if (afterSocial.substring(i, i+5) === "<div ") depth2++;
      if (afterSocial.substring(i, i+5) === "<div\n") depth2++;
      if (afterSocial.substring(i, i+6) === "</div>") {
        depth2--;
        if (depth2 < 0) { statsEnd2 = i + 6; break; }
      }
    }
    
    const afterStats = afterSocial.substring(0, statsDivStart2) + afterSocial.substring(statsEnd2);
    console.log("Final length:", afterStats.length);
    
    // Also remove the old second divider (between social and stats, now unnecessary)
    // The divider was part of the cardContent we already replaced
    
    fs.writeFileSync(path, new TextEncoder().encode(afterStats));
    console.log("Hero.jsx restructured successfully");
  } else {
    console.log("Could not find stats section");
  }
} else {
  console.log("Could not find social section");
}
