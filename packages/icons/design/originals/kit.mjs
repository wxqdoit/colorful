// Shared geometric primitives only. Every illustration is composed explicitly in its pack.
export const ink = {surface:'#f0e9f8',back:'#d9c9ed',detail:'#aa8bcf'};
export const p=(color,d)=>`<path d="${d}" fill="var(--project-art-${color}, ${ink[color]})" stroke="none"/>`;
export const l=(d)=>`<path d="${d}" fill="none"/>`;
export const c=(color,x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--project-art-${color}, ${ink[color]})" stroke="none"/>`;
export const e=(color,x,y,rx,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="var(--project-art-${color}, ${ink[color]})" stroke="none"/>`;
export const r=(color,x,y,w,h,rx=1.4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="var(--project-art-${color}, ${ink[color]})" stroke="none"/>`;
export const g=(transform,body)=>`<g transform="${transform}">${body}</g>`;
export const svg=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, ${ink.detail})" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>\n`;
