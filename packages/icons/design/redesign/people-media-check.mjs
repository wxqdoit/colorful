import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import svgpath from 'svgpath';
import {paper} from '../../scripts/geometry.mjs';
const assigned=JSON.parse(fs.readFileSync('design/redesign/assignments/people-media.json'));
let issues=[];
for(const {name} of assigned){
 const source=fs.readFileSync(`assets/regular/${name}.svg`,'utf8');
 const doc=new JSDOM(source,{contentType:'image/svg+xml'}).window.document;
 if(doc.querySelector('parsererror'))issues.push([name,'XML']);
 if(/NaN|Infinity|undefined/.test(source))issues.push([name,'invalid value']);
 if(doc.querySelector('text,image,filter,mask,clipPath,[id]'))issues.push([name,'disallowed element']);
 const colors=[...new Set(source.match(/#[0-9a-f]{6}/g))];if(colors.some(x=>!['#f0e9f8','#d9c9ed','#aa8bcf'].includes(x)))issues.push([name,'colors']);
 for(const el of doc.querySelectorAll('path,rect,ellipse,circle')){
 const num=k=>+el.getAttribute(k);let d=el.getAttribute('d');
 if(el.localName==='rect'){let [x,y,w,h]=['x','y','width','height'].map(num);d=`M${x} ${y}h${w}v${h}h${-w}Z`;}
 if(el.localName==='ellipse'||el.localName==='circle'){let x=num('cx'),y=num('cy'),rx=num(el.localName==='circle'?'r':'rx'),ry=num(el.localName==='circle'?'r':'ry');d=`M${x-rx} ${y}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0Z`;}
 let transforms=[];for(let e=el;e&&e.localName!=='svg';e=e.parentElement){if(e.hasAttribute('transform'))transforms.unshift(e.getAttribute('transform'));}
 d=svgpath(d).transform(transforms.join(' ')).toString();
 const path=new paper.CompoundPath(d);let b=path.bounds;const margin=el.getAttribute('stroke')==='none'?0:.55;
 if(b.left-margin<0||b.top-margin<0||b.right+margin>24||b.bottom+margin>24)issues.push([name,el.localName,[b.left,b.top,b.right,b.bottom].map(x=>+x.toFixed(3)),margin]);path.remove();
 }
}
console.log(JSON.stringify({count:assigned.length,issues},null,2));
