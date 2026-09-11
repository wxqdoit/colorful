import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const slugs = ["soccer-goal", "pipe-organ", "processor-chip", "greenhouse-building", "hanging-gong", "test-tube-rack", "radar-antenna", "accordion", "solderless-breadboard", "elliptical-trainer", "bunk-bed", "quilted-pillow"];
const themes = {light:{surface:"#f0e9f8",back:"#d9c9ed",detail:"#aa8bcf",bg:"#fff",text:"#332940"},dark:{surface:"#746188",back:"#af94ca",detail:"#efdcfa",bg:"#1d1923",text:"#f0e9f8"}};
for (const [theme, colors] of Object.entries(themes)) {
  const cells = slugs.map((slug, i) => {
    const render = (before, x, size) => {
      const folder = before ? "design/archive/0.7.0-originals" : "assets/regular";
      const body = fs.readFileSync(resolve(root,`${folder}/original-${slug}.svg`),"utf8")
        .replace(/^<svg[^>]*>/, "").replace("</svg>", "")
        .replace(/var\(--project-art-(\w+),\s*[^)]+\)/g, (_, token) => colors[token]);
      return `<g transform="translate(${x} 28) scale(${size/24})" fill="none" stroke="${colors.detail}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
    };
    return `<g transform="translate(${(i%3)*350+22} ${Math.floor(i/3)*155+65})"><text y="10" fill="${colors.text}" font-size="13">${slug}</text>${render(true,0,60)}${render(false,100,60)}${render(false,192,26)}<text y="120" fill="${colors.text}" font-size="11">修订前</text><text x="100" y="120" fill="${colors.text}" font-size="11">修订后</text><text x="192" y="120" fill="${colors.text}" font-size="11">26 px</text></g>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="700" font-family="Arial"><rect width="1050" height="700" fill="${colors.bg}"/><text x="22" y="35" font-size="23" fill="${colors.text}">Colorful Originals · 风格规范 1.1 · ${theme}</text>${cells}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(resolve(root,`design/originals/review/style-${theme}.png`));
}
console.log("Rendered 12 before/after style comparisons in light and dark themes.");
