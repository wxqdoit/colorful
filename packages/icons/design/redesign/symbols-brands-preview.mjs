import fs from 'node:fs';
import sharp from '/Users/wxqdoit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const names=JSON.parse(fs.readFileSync('design/redesign/assignments/symbols-brands.json')).map(x=>x.name);
for(let batch=0;batch<2;batch++){
 const slice=names.slice(batch*40,(batch+1)*40);const cells=slice.map((name,i)=>{const body=fs.readFileSync(`assets/regular/${name}.svg`,'utf8').replace(/^<svg[^>]*>/,'').replace('</svg>','').replace(/var\([^,]+, ([^)]+)\)/g,'$1');return `<g transform="translate(${i%5*200} ${Math.floor(i/5)*108})"><g transform="translate(10 10) scale(2.3)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><g transform="translate(92 29) scale(1.0833)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><text x="10" y="87" fill="#333" font-size="11" font-family="Arial">${name}</text></g>`;}).join('');
 await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="864"><rect width="1000" height="864" fill="white"/>${cells}</svg>`)).png().toFile(`/tmp/symbols-brands-${batch}.png`);
}
