import fs from 'node:fs';
import sharp from '/Users/wxqdoit/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const names=JSON.parse(fs.readFileSync('design/redesign/assignments/people-media.json')).map(x=>x.name);
for(let batch=0;batch<4;batch++){
 const cells=names.slice(batch*70,(batch+1)*70).map((name,i)=>{const body=fs.readFileSync(`assets/regular/${name}.svg`,'utf8').replace(/^<svg[^>]*>/,'').replace('</svg>','').replace(/var\([^,]+, ([^)]+)\)/g,'$1');return `<g transform="translate(${i%7*170} ${Math.floor(i/7)*108})"><g transform="translate(10 10) scale(2.3)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><g transform="translate(92 29) scale(1.0833)" fill="none" stroke="#aa8bcf" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${body}</g><text x="10" y="87" fill="#333" font-size="10" font-family="Arial">${name}</text></g>`;}).join('');
 await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1190" height="1080"><rect width="1190" height="1080" fill="white"/>${cells}</svg>`)).png().toFile(`/tmp/people-media-${batch}.png`);
}
console.log('Rendered four 56px/26px contact sheets under /tmp/people-media-*.png');
