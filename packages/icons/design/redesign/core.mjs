import fs from 'node:fs';
import './core-special.mjs';
import {registry} from './core-families.mjs';
import {ink} from './core-kit.mjs';
const assigned=JSON.parse(fs.readFileSync('design/redesign/assignments/core.json','utf8'));
if(registry.size!==assigned.length)throw Error('Core route count mismatch');
for(const {name} of assigned){const entry=registry.get(name);if(!entry)throw Error(`Missing explicit design: ${name}`);fs.writeFileSync(`assets/regular/${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, ${ink.detail})" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${entry.svg}</svg>\n`);}
fs.writeFileSync('design/redesign/notes/core.json',JSON.stringify(assigned.map(({name})=>({name,family:registry.get(name).family,visualReason:registry.get(name).reason})),null,2)+'\n');
console.log(`Redesigned ${assigned.length} core icons, all explicit routes.`);
