
const fs = require("fs");
const bt = String.fromCharCode(96);
const nl = "\n";

// Read current file to preserve imports, icons, typewriter, stats
const path = "E:/Project/Portfolio - 1/client/src/components/Hero.jsx";
const h = fs.readFileSync(path, "utf8");

// Extract the parts we want to keep:
// 1. Everything from start to "export default function Hero() {"
const funcStart = h.indexOf("export default function Hero()");
const header = h.substring(0, funcStart);

// 2. The stats computation (between return and the old layout)
const returnStart = h.indexOf("return (", funcStart);
const statsCode = h.substring(funcStart, returnStart);

// Build new return content
const textBlock = [
  "    <section className=\"pt-20 pb-2\">",
  '      <div className="max-w-5xl mx-auto px-6 w-full border-l border-black/7 border-line-animate">',
  "        " + bt + "/* \u2014 Text at the very top \u2014 */" + bt,
  "        <div",
  '          className="flex flex-col gap-1 mb-10"',
  "          style={{ animation: " + bt + "fade-up 0.3s var(--ease-out-expo) both" + bt + " }}",
  "        >",
  '          <span className="font-display text-lg text-black/50 leading-none">',
  "            Hello, I" + bt + "m",
  "          </span>",
  '          <h1 className="font-display text-[28px] font-semibold text-black leading-tight tracking-tight">',
  "            {hero.firstName} {hero.middleName} {hero.lastName}",
  "          </h1>",
  '          <p className="text-sm text-black/55 leading-snug min-h-[1.25em]">',
  "            <TypewriterText />",
  "          </p>",
  '          <p className="text-sm text-black/60 leading-relaxed max-w-2xl font-serif mt-3">',
  "            I" + bt + "m a third-year BSIT student at West Visayas State University \u2014 CICT, passionate about web development, networking, and building clean, functional interfaces. Welcome to my corner of the web.",
  "          </p>",
  "        </div>",
  "",
  "        " + bt + "/* \u2014 Photo + overlapping card \u2014 */" + bt,
  '        <div className="flex flex-col items-center">',
  "          " + bt + "/* Photo \u2014 centered, moved down */" + bt,
  "          <div",
  '            className="size-[160px] md:size-[200px] rounded-full border-2 border-black/12 overflow-hidden -mb-16 md:-mb-20 relative z-10"',
  "            style={{ animation: " + bt + "fade-up 0.3s var(--ease-out-expo) both, float 4s var(--ease-in-out-expo) infinite" + bt + " }}",
  "          >",
  "            <img src={profilePic} alt={hero.firstName} className=\"w-full h-full object-cover\" />",
  "          </div>",
  "",
  "          " + bt + "/* Card \u2014 overlaps bottom of photo */" + bt,
  '          <div',
  '            className="relative z-20 w-full border border-black/10 rounded-xl bg-white p-5 md:p-6"',
  "            style={{ animation: " + bt + "fade-up 0.35s var(--ease-out-expo) both" + bt + " }}",
  "          >",
  "            " + bt + "/* Social + Contact inline row */" + bt,
  '            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">'
];

console.log("Script ready to run");
