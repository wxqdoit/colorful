import fs from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { styledOriginal } from "./style.mjs";
const dir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const files = args.filter(x=>!x.startsWith("--"));
const from = Number(args.find(x=>x.startsWith("--from="))?.split("=")[1] ?? 0);
const take = Number(args.find(x=>x.startsWith("--take="))?.split("=")[1] ?? Infinity);
let entries = [];
if (files.length)
  for (const file of files) {
    const { originals } = await import(new URL(file, import.meta.url));
    entries.push(
      ...originals.map((x) => ({
        ...x,
        name: x.slug,
        source: styledOriginal(x),
      })),
    );
  }
else {
  const manifest = JSON.parse(fs.readFileSync(resolve(dir, "catalog.json")));
  entries = manifest.map((x) => ({
    ...x,
    source: fs.readFileSync(
      resolve(dir, `../../assets/regular/${x.name}.svg`),
      "utf8",
    ),
  }));
}
entries = entries.slice(from, from+take);
const out = resolve(dir, "review");
fs.mkdirSync(out, { recursive: true });
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const pages = [];
for (let batch = 0; batch < Math.ceil(entries.length / 50); batch++) {
  const subset = entries.slice(batch * 50, (batch + 1) * 50);
  const cells = subset
    .map((x, i) => {
      const body = x.source
        .replace(/^<svg[^>]*>/, "")
        .replace("</svg>", "")
        .replace(/var\([^,]+,\s*([^)]+)\)/g, "$1");
      return `<g transform="translate(${(i % 5) * 230} ${Math.floor(i / 5) * 106 + 48})"><g transform="translate(12 4) scale(2.1)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><g transform="translate(85 20) scale(1.083333)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><text x="12" y="74" fill="#332940" font-size="11" font-family="Arial">${esc(x.name.replace(/^original-/, ""))}</text><text x="12" y="90" fill="#71657e" font-size="10" font-family="Arial">${esc(x.category)}</text></g>`;
    })
    .join("");
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="1150" height="1110"><rect width="1150" height="1110" fill="#fff"/><text x="12" y="26" fill="#332940" font-family="Arial" font-size="16">Colorful Originals · ${batch * 50 + 1}—${batch * 50 + subset.length} · 50px / 26px</text>${cells}</svg>`;
  const filename = `sheet-${String(batch + 1).padStart(2, "0")}.png`;
  await sharp(Buffer.from(image)).png().toFile(resolve(out, filename));
  pages.push(filename);
}
fs.writeFileSync(
  resolve(out, "sheets.json"),
  JSON.stringify({ icons: entries.length, pages }, null, 2) + "\n",
);
console.log(
  `Rendered ${entries.length} originals on ${pages.length} labeled contact sheets at50px and26px.`,
);
