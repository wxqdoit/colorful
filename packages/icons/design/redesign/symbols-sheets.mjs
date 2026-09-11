import fs from 'node:fs';
import sharp from '/Users/wxqdoit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const group=process.argv[2]||'symbols-functional';
const entries=JSON.parse(fs.readFileSync(`design/redesign/assignments/${group}.json`));
fs.mkdirSync('design/redesign/previews',{recursive:true});
for(let page=0;page<Math.ceil(entries.length/60);page++){
const list=entries.slice(page*60,page*60+60);const body=list.map(({name},i)=>{const raw=fs.readFileSync(`assets/regular/${name}.svg`,'utf8').replace(/var\(--project-art-\w+,\s*([^)]+)\)/g,'$1').replace(/<svg[^>]*>/,'').replace('</svg>','');return `<g transform="translate(${(i%6)*160} ${Math.floor(i/6)*102})"><rect x="1" y="1" width="158" height="100" rx="10" fill="#fff"/><g transform="translate(24 18) scale(2)">${raw}</g><g transform="translate(108 29) scale(1.0833)">${raw}</g><text x="80" y="86" text-anchor="middle" font-family="Arial" font-size="9" fill="#514961">${name}</text></g>`}).join('');
// Keep inherited SVG paint matching regular assets.
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${Math.ceil(list.length/6)*102}" viewBox="0 0 960 ${Math.ceil(list.length/6)*102}" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><rect width="100%" height="100%" fill="#f5f3f8" stroke="none"/>${body.replaceAll('<text ','<text stroke="none" ')}</svg>`;
await sharp(Buffer.from(svg)).png().toFile(`design/redesign/previews/${group}-${page+1}.png`);
}console.log(`Rendered ${entries.length} ${group}`);
