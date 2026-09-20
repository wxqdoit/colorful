import fs from 'node:fs';
import svgpath from 'svgpath';
import {p,l,c,r,ring,ink} from './core-kit.mjs';
import {roundSVG,inspectRoundness} from '../../scripts/round-svg.mjs';

// Every glyph below is drawn for this family. Transforms apply only to our
// authored glyph skeletons, never to upstream vendor artwork.
const move=(d,x=0,y=0,sx=1,sy=sx)=>svgpath(d).scale(sx,sy).translate(x,y).round(3).toString();
const accent=(d,w=2.7)=>l(d,`stroke="var(--project-art-back, ${ink.back})" stroke-width="${w}"`);
const local=(d,a)=>accent(a)+l(d);
const shell=kind=>kind==='circle'?c('surface',12,12,9)+p('back','M12 3A9 9 0 0 1 21 12L19.3 12A7.3 7.3 0 0 0 12 4.7Z')+ring(12,12,9):r('surface',3.5,3.5,17,17,3)+r('back',3.5,3.5,17,2.8,1.4)+l('M6.5 3.5H17.5Q20.5 3.5 20.5 6.5V17.5Q20.5 20.5 17.5 20.5H6.5Q3.5 20.5 3.5 17.5V6.5Q3.5 3.5 6.5 3.5Z');
const D={
 zero:'M3 0C-.7 0-.7 10 3 10C6.7 10 6.7 0 3 0Z',
 one:'M1 2L3.5 0V10M1 10H6',
 two:'M.3 2.1C.7-.9 6.1-.7 6 2.7C5.9 4.5 3.7 5.9 .4 9Q-.1 10 .8 10H6',
 three:'M.4 .6C2-1 6-.3 6 2.5C6 4.3 4.4 5 2.8 5C4.8 5 6.3 5.9 6 8C5.6 10.9 1.3 10.5 .2 9',
 four:'M5 10V0L0 7H6.5',
 five:'M6 0H.8L.4 4.7C2.8 3.5 6.2 4.1 6.2 7.2C6.2 10.8 1.6 10.8 .3 9',
 six:'M5.7 .7C3.4-1.2 .1 1.4 .1 6.6C.1 11 6.2 11.1 6.2 7C6.2 3.4 .5 3.4 .1 6.6',
 seven:'M0 0H6.5L2.1 10',
 eight:'M3 4.6C-1.2 4.4-.5 0 3 0C6.5 0 7.2 4.4 3 4.6C-1.6 4.8-1.1 10 3 10C7.1 10 7.6 4.8 3 4.6Z',
 nine:'M.5 9.3C2.8 11.2 6.1 8.6 6.1 3.4C6.1-1 .0-1.1 0 3C0 6.6 5.7 6.6 6.1 3.4',
};
const DA={zero:'M3 0C.9 0 .2 2.4 .2 4',one:'M3.5 1V5',two:'M.3 2.1C.7-.9 6.1-.7 6 2.7',three:'M.4 .6C2-1 6-.3 6 2.5',four:'M5 0L1.5 5',five:'M6 0H.8',six:'M5.7 .7C3.4-1.2 .1 1.4 .1 6.6',seven:'M0 0H6.5',eight:'M3 0C.7 0-.3 1.8 .6 3.3',nine:'M.5 9.3C2.8 11.2 6.1 8.6 6.1 3.4'};
const num=(n,x=8,y=5,s=1.4,withAccent=true)=>{if(!D[n])throw Error(n);return (withAccent?accent(move(DA[n],x,y,s),2.6):'')+l(move(D[n],x,y,s));};
const GL={A:'M0 10L3.5 0L7 10M1.4 6.2H5.6',H:'M0 0V10M7 0V10M0 5H7',P:'M0 10V0H3.7C8 0 8 5.2 3.7 5.2H0',R:'M0 10V0H3.7C8 0 8 5.2 3.7 5.2H0M3.5 5.2L7 10',V:'M0 0L3.5 10L7 0',T:'M0 0H8M4 0V10',B:'M0 10V0H3.8C8 0 8 4.8 3.8 4.8H0M3.8 4.8C8.5 4.8 8.5 10 3.8 10Z',S:'M6.6 1C3.1-1.6-.5.6 .2 3C.8 5.3 5.7 4.8 6.6 7C8.1 10.8 2.5 11.3 0 9',U:'M0 0V6.5C0 11.2 7 11.2 7 6.5V0',X:'M0 0L7 10M7 0L0 10',M:'M0 10V0L4 5.8L8 0V10'};
const letter=(n,x=7.1,y=5,s=1.4,a=true)=> (a?accent(move(n==='V'?'M0 0L3.5 10':n==='A'?'M0 10L3.5 0':n==='T'?'M0 0H8':'M0 0V10',x,y,s),2.7):'')+l(move(GL[n],x,y,s));
const shapes={};
const add=(name,body,family,reason)=>{if(shapes[name])throw Error(`Duplicate ${name}`);shapes[name]={body,family,visualReason:reason};};
const math=(name,body,reason='Open mathematical glyph with a local lavender emphasis on its defining stroke.')=>add(name,body,'math',reason);
const typo=(name,body,reason='Hand-drawn rounded type skeleton preserves the typographic operation with generous counters.')=>add(name,body,'typography',reason);

for(const [n] of Object.entries(D)){
 add(`number-${n}`,num(n,7.6,4.8,1.42),'numeral',`Readable ${n} with a local highlighted stroke and open rounded counters.`);
 for(const container of ['circle','square'])add(`number-${container}-${n}`,shell(container)+num(n,9,7,.99),'numeral',`${n} sits in its named ${container}; family counters and baseline remain consistent.`);
}
for(const n of ['h','p','v'])typo(`letter-circle-${n}`,shell('circle')+letter(n.toUpperCase(),8.5,7,1),`Rounded ${n.toUpperCase()} is centered in its semantically required circular enclosure.`);

const simpleMarks={plus:'M5 12H19M12 5V19',minus:'M5 12H19',x:'M6 6L18 18M18 6L6 18',check:'M4.8 12.1L9.5 16.7L19.2 6.9'};
for(const [n,d] of Object.entries(simpleMarks)){
 const a=n==='plus'?'M5 12H19':n==='minus'?d:n==='x'?'M6 6L18 18':'M4.8 12.1L9.5 16.7';
 add(n,local(d,a),'action',`The ${n} mark stays open; color strengthens one meaningful arm.`);
 for(const kind of ['circle','square'])add(`${n}-${kind}`,shell(kind)+l(move(d,3.6,3.6,.7)),'action',`A ${n} mark in its named ${kind} enclosure, with matching centered proportions.`);
}
add('check-fat',p('back','M3.5 12.7Q2.9 12.1 3.5 11.5L5.6 9.4Q6.2 8.8 6.8 9.4L9.7 12.3L17.3 4.7Q17.9 4.1 18.5 4.7L20.6 6.8Q21.2 7.4 20.6 8L10.3 18.3Q9.7 18.9 9.1 18.3Z')+l('M5.4 12.2L9.7 16.5L18.7 7.5'),'action','A broad rounded check ribbon deliberately distinguishes the fat variant.');
add('check-square-offset',r('surface',3.5,6.2,14.3,14.3,2.4)+r('back',3.5,6.2,2.8,14.3,1.4)+l('M17.8 13.8V18.1Q17.8 20.5 15.4 20.5H5.9Q3.5 20.5 3.5 18.1V8.6Q3.5 6.2 5.9 6.2H12.7M8.2 10.2L12.2 14.2L20 5.4'),'action','The check extends above and right of its partially open checkbox.');
add('checks',accent('M3.4 12.5L7.4 16.5',2.8)+l('M3.4 12.5L7.4 16.5L16.4 7.5M11 15L13 17L21 9'),'action','Two overlapping checks remain individually readable.');

math('equals',local('M5 8.5H19M5 15.5H19','M5 8.5H19'));
math('not-equals',local('M5 8.5H19M5 15.5H19M16.5 4L7.5 20','M5 8.5H19'));
math('approximate-equals',local('M4.5 8.5C9 3.5 15 13.5 19.5 8.5M4.5 15.5C9 10.5 15 20.5 19.5 15.5','M4.5 8.5C9 3.5 15 13.5 19.5 8.5'));
math('tilde',local('M4 12C8.5 6 15.5 18 20 12','M4 12C6 9.5 8.2 9.4 10.5 10.9'));
math('divide',r('back',4.5,10.7,15,2.6,1.3)+l('M5 12H19')+c('back',12,5.8,1.6)+c('detail',12,5.8,.55)+c('back',12,18.2,1.6)+c('detail',12,18.2,.55));
math('plus-minus',local('M5 8.5H19M12 3.8V13.2M5 19H19','M5 8.5H19'));
for(const side of ['less','greater']){
 const d=side==='less'?'M18 4.8L6 12L18 19.2':'M6 4.8L18 12L6 19.2';
 math(`${side}-than`,local(d,side==='less'?'M18 4.8L6 12':'M6 4.8L18 12'));
 const d2=side==='less'?'M18 4.5L6 10L18 15.5':'M6 4.5L18 10L6 15.5';
 math(`${side}-than-or-equal`,local(d2+'M6 20H18',side==='less'?'M18 4.5L6 10':'M6 4.5L18 10'));
}
math('percent',l('M18.5 4.5L5.5 19.5')+c('surface',6.7,6.7,2.6)+ring(6.7,6.7,2.6)+c('back',17.3,17.3,2.6)+ring(17.3,17.3,2.6));
math('empty',c('surface',12,12,7)+ring(12,12,7)+accent('M5 20L19 4')+l('M5 20L19 4'));
math('infinity',local('M12 12C9 7.8 7.9 7 6 7C.7 7 .7 17 6 17C9.2 17 14.8 7 18 7C23.3 7 23.3 17 18 17C16.1 17 15 16.2 12 12','M12 12C9 7.8 7.9 7 6 7C3.8 7 2.5 8.8 2.5 11'));
math('pi',local('M4 6H20M8 6V15.5Q8 19 5.5 19M15.5 6V16.7Q15.5 19.5 19 18.5','M4 6H20'));
math('sigma',local('M19 5H5L12 12L5 19H19','M5 19H19'));
math('radical',local('M3 13H5L8.5 19.5L12 4.5H21','M12 4.5H21'));
math('function',local('M17.7 4.8C13.7 1.9 11.7 5.3 11.4 8L10 16C9.6 19.5 7.7 21.5 4.8 19M6.5 10H16.5','M6.5 10H16.5'));
math('union',local('M5 5V13C5 21.7 19 21.7 19 13V5','M5 5V13'));
math('intersection',local('M5 19V11C5 2.3 19 2.3 19 11V19','M5 19V11'));
for(const side of ['subset','superset']){
 const d=side==='subset'?'M18.5 5H12C2.5 5 2.5 19 12 19H18.5':'M5.5 5H12C21.5 5 21.5 19 12 19H5.5';
 const a=side==='subset'?'M18.5 5H12':'M5.5 5H12';
 math(`${side}-proper-of`,local(d,a),'An open curved inclusion bracket; proper variant has no equality bar.');
 math(`not-${side}-of`,local(d+'M18.5 3.5L5.5 20.5',a),'A diagonal cancellation crosses the open inclusion bracket.');
 math(`${side}-of`,local(move(d,0,.4,1,.78)+'M5.5 20H18.5',move(a,0,.4,1,.78)),'The equality baseline distinguishes inclusive from proper inclusion.');
}
const member='M18.5 5H12C2.5 5 2.5 19 12 19H18.5M5 12H17';
math('member-of',local(member,'M5 12H17'));
math('not-member-of',local(member+'M18.5 3.5L5.5 20.5','M5 12H17'));
math('math-operations',accent('M4.5 7H10.5')+l('M4.5 7H10.5M15 4.5L20 9.5M20 4.5L15 9.5M4.5 17H10.5M7.5 14V20M14.5 15H20.5M14.5 19H20.5'),'Four separate arithmetic quadrants retain minus, multiply, plus, and equals.');

// Punctuation and code: no artificial card behind a bare glyph.
typo('asterisk',local('M12 4V20M5 8L19 16M5 16L19 8','M12 4V20'),'Six evenly spaced arms with a tinted vertical stem.');
typo('asterisk-simple',local('M12 4V12M4.4 9.5L12 12L7.3 19M12 12L16.7 19M12 12L19.6 9.5','M12 4V12'),'Five arms retain the simple asterisk identity.');
typo('at',p('surface','M15.9 8.3C13.7 6.4 8.5 7.1 8.5 12C8.5 16.7 14.8 17 15.8 12.3Z')+l('M15.9 8V13.4C15.9 17.4 21 15.8 21 11.6C21 5.2 15.1 2.7 10.6 3.5C1 5.1 1.3 20.5 11.9 20.5Q15.4 20.5 18 18.5M15.8 11.5C15.8 6.2 8.5 6.5 8.5 12C8.5 17.2 15.8 16.6 15.8 11.5'));
typo('binary',num('zero',5,3.6,.66)+num('one',13.5,3.6,.66)+num('one',5,14,.66)+num('zero',13.5,14,.66),'A clear two-by-two 01 / 10 binary arrangement with individual numeral counters.');
for(const [n,left] of Object.entries({angle:'M8 4L3.5 12L8 20',curly:'M8 4H7Q5.5 4 5.5 6V9.5Q5.5 12 3.5 12Q5.5 12 5.5 14.5V18Q5.5 20 7 20H8',round:'M8 4C2.5 7 2.5 17 8 20',square:'M8 4H4.5V20H8'})){
 typo(`brackets-${n}`,accent(left,2.5)+l(left)+l(move(left,24,0,-1,1)),`A paired ${n} delimiter has matching height and a wide empty center.`);
}
for(const n of ['code-simple','code'])typo(n,local('M8 6L3 12L8 18M16 6L21 12L16 18'+(n==='code'?'M14 4L10 20':''),'M8 6L3 12'),n==='code'?'Angle brackets and a slash form the complete code glyph.':'The simple code variant uses two open angle brackets.');
typo('code-block',r('surface',3,3.5,11.5,8.5,2)+r('back',3,3.5,2.7,8.5,1.35)+l('M6.4 5.5L4.3 7.8L6.4 10.1M10.8 5.5L12.9 7.8L10.8 10.1M17.2 6.2H19Q20.5 6.2 20.5 7.7V18.7Q20.5 20.2 19 20.2H7.8Q6.3 20.2 6.3 18.7V14.8'),'A compact code fragment sits at the open corner of its block outline.');
typo('command',local('M8.5 8.5V5.5C8.5 1.8 3 1.8 3 5.5C3 7.2 4.1 8.5 5.5 8.5H18.5C22.2 8.5 22.2 3 18.5 3C16.8 3 15.5 4.1 15.5 5.5V18.5C15.5 22.2 21 22.2 21 18.5C21 16.8 19.9 15.5 18.5 15.5H5.5C1.8 15.5 1.8 21 5.5 21C7.2 21 8.5 19.9 8.5 18.5Z','M8.5 8.5H15.5'));
typo('control',p('back','M5 13.3L12 6.3L19 13.3Z')+l('M5 13.3L12 6.3L19 13.3Z'),'The closed upward control triangle preserves upstream identity with softened corners.');
typo('option',local('M3.5 7H8.7Q9.5 7 10 8L14.5 17Q15 18 15.8 18H20.5M14.5 7H20.5','M14.5 7H20.5'));
for(const n of ['hash','hash-straight'])typo(n,local(n==='hash'?'M9 4L7 20M17 4L15 20M4 9H20M3.5 15H19.5':'M8 4V20M16 4V20M4 8H20M4 16H20',n==='hash'?'M4 9H20':'M4 8H20'));
typo('paragraph',p('back','M12.5 4.5H8.8C2 4.5 2 14.5 8.8 14.5H12.5Z')+l('M20 4.5H8.8C2 4.5 2 14.5 8.8 14.5H12.5M12.5 4.5V20M17 4.5V20'));
typo('quotes',p('surface','M3.5 5H9.8V11.5H3.5Z')+p('back','M14.2 5H20.5V11.5H14.2Z')+l('M3.5 5H9.8V11.5Q9.8 17 4.5 19M3.5 11.5H9.8M14.2 5H20.5V11.5Q20.5 17 15.2 19M14.2 11.5H20.5'));
for(const n of ['copyright','copyleft'])typo(n,shell('circle')+l(n==='copyright'?'M15.1 8.7C10.1 5 6.8 12 10 15.5Q12.5 18 15.1 15.3':'M8.9 8.7C13.9 5 17.2 12 14 15.5Q11.5 18 8.9 15.3'),`${n} keeps its ${n==='copyright'?'forward':'reversed'} C inside the named legal symbol circle.`);
typo('trademark',letter('T',3,7.5,.8)+letter('M',13,7.5,.85));
typo('trademark-registered',shell('circle')+letter('R',8.7,7,.93));

const dollar='M17.5 7.7C17.2 4.8 7.1 3.8 6.4 8.3C5.8 11.9 17.8 11.3 17.6 15.7C17.4 20.5 7.1 19.8 6.2 16';
const currency=(n,d,a,reason)=>add(`currency-${n}`,local(d,a),'currency',reason||`Hand-drawn ${n.toUpperCase()} currency mark retains its characteristic stems, bars, and counters.`);
currency('dollar',dollar+'M12 3V21','M12 3V9');
currency('dollar-simple',dollar+'M12 3V5M12 19V21','M12 3V5');
add('currency-circle-dollar',shell('circle')+l(move(dollar+'M12 3V21',4.2,4.2,.65)),'currency','A dollar sign centered in the explicitly named coin circle.');
currency('btc','M7.5 5H13.8C19.1 5 19.1 11.5 13.8 11.5H7.5M13.8 11.5C20.4 11.5 20.4 19 13.8 19H7.5M9 5V19M11 3V5M14 3V5M11 19V21M14 19V21','M9 5V19');
add('currency-eth',p('surface','M12 3L19 12L12 15L5 12Z')+p('back','M12 3L19 12L12 15ZM5 13.5L12 17L19 13.5L12 21Z')+l('M12 3L19 12L12 15L5 12ZM12 3V15M5 13.5L12 21L19 13.5'),'currency','Faceted Ethereum diamonds retain the split waist and vertical facet.');
currency('cny','M6 5H18M4.5 10H19.5M9.5 10V12Q9.5 18.5 4.3 19M14 10V17Q14 19 16 19H20V17','M6 5H18','The yuan character 元 retains the two upper bars and two distinct lower legs.');
currency('jpy','M5.5 4.5L12 12.5L18.5 4.5M7 12.5H17M7 16H17M12 12.5V20','M7 12.5H17');
currency('eur','M18.3 5.5C10.5-.3 4.5 7 6.5 14.6C8 20.4 14.9 21 18.3 18.5M3.8 10H15M3.8 14H14.2','M3.8 10H15');
currency('gbp','M18.7 6.6C17 2.8 9 3.1 9 8V13.5Q9 17.8 5 19H19M5 12H15','M5 12H15');
currency('inr','M6 4.5H19M6 8.5H19M10 4.5C18.8 4.5 18.8 12.5 7 12.5L16 20','M6 4.5H19');
currency('krw','M3.5 5L7.3 19L12 6.8L16.7 19L20.5 5M3.5 10H20.5M4.3 13.5H19.7','M3.5 10H20.5');
currency('kzt','M5.5 5H18.5M5.5 9H18.5M12 9V20','M5.5 5H18.5');
currency('ngn','M6.8 20V4L17.2 20V4M3.5 10H20.5M3.5 14H20.5','M3.5 10H20.5');
currency('rub','M8 20V4.5H13.5C20.7 4.5 20.7 12.5 13.5 12.5H5M5 16H14','M5 16H14');

// Editing rows use small rounded text bars, with spacing doing the work.
for(const align of ['left','right','center','justify']){
 let body='';
 for(let i=0;i<4;i++){let w=i%2===0||align==='justify'?16:10;let x=align==='right'?20-w:align==='center'?12-w/2:4;let y=5+4.7*i;body+=i===0?r('back',x,y-1.2,w,2.4,1.2):'';body+=l(`M${x} ${y}H${x+w}`);}
 typo(`text-align-${align}`,body,`${align} alignment is encoded by the actual row endpoints, with a tinted first text line.`);
}
for(const n of ['bullets','dashes','numbers']){
 let body='';
 for(let i=0;i<3;i++){let y=5.5+i*6.5;body+=l(`M9 ${y}H20`);if(n==='bullets')body+=c(i===0?'back':'detail',4.8,y,i===0?1.5:.7);else if(n==='dashes')body+=(i===0?r('back',3,y-1.2,3.5,2.4,1.2):'')+l(`M3 ${y}H6.5`);else body+=num(['one','two','three'][i],3.2,y-2.1,.42,i===0);}
 typo(`list-${n}`,body,`Three rows retain their distinct ${n} markers with a clear text gutter.`);
}
typo('list-plus',r('back',4,4.5,16,2.6,1.3)+l('M4 5.8H20M4 12H20M4 18.2H12M16 18.2H21M18.5 15.7V20.7'));
typo('text-columns',r('back',3.5,4.4,7,2.4,1.2)+r('surface',13.5,4.4,7,2.4,1.2)+[5.6,10,14.4,18.8].map(y=>l(`M3.5 ${y}H10.5M13.5 ${y}H20.5`)).join(''),'Two separated blocks of four aligned rows establish text columns.');
for(const n of ['indent','outdent'])typo(`text-${n}`,r('back',3.5,3.8,17,2.4,1.2)+l('M3.5 5H20.5M11.5 9.7H20.5M11.5 14.3H20.5M3.5 19H20.5')+l(n==='indent'?'M3 12H8M5.5 9.5L8 12L5.5 14.5':'M8 12H3M5.5 9.5L3 12L5.5 14.5'),`A ${n==='indent'?'right':'left'} arrow occupies the text gutter and retains operation direction.`);
typo('text-aa',letter('A',3,5.5,1.15)+l('M20.5 11.5V18.5M20.5 15C20.5 10.5 14.5 10.5 14.5 15C14.5 19.5 20.5 19.5 20.5 15'),'Uppercase A and a single-storey lowercase a retain a clear cap-height contrast.');
typo('text-a-underline',letter('A',7.1,3.5,1.4)+r('back',4.5,20,15,1.8,.9)+l('M5 20.9H19'));
typo('text-b',p('surface','M7 4.5H12.5C20 4.5 20 11 12.5 11H7Z')+p('back','M7 11H12.5C21 11 21 19.5 12.5 19.5H7Z')+l(move(GL.B,7,4.5,1.45)));
typo('text-h',letter('H'));
for(const n of ['one','two','three','four','five','six'])typo(`text-h-${n}`,letter('H',3.5,5,1.23)+num(n,15.5,12.4,.75),`The H remains dominant while the readable ${n} identifies heading level.`);
typo('text-italic',local('M10 4.5H19M5 19.5H14M15 4.5L9 19.5','M10 4.5H19'));
typo('text-strikethrough',accent('M4 12H20')+l('M17.7 6.3C15.8 3.7 8.1 3.8 7 7.6Q6.4 9.8 10.1 11M14.5 13Q18.8 14 17.5 17.3C15.8 21.2 8.7 19.9 6.7 17.5M4 12H20'));
for(const n of ['subscript','superscript'])typo(`text-${n}`,letter('X',3.5,5.5,1.1)+num('two',15.5,n==='subscript'?14:3.5,.7),`The small 2 sits ${n==='subscript'?'below':'above'} the main X baseline.`);
typo('text-t',letter('T',6.4,5,1.4)+l('M6.4 5V7M17.6 5V7M9.6 19H14.4'));
typo('text-t-slash',accent('M5 4L19 20')+l('M5 4L19 20M9.6 19H14.4M12 14V19M12 5V8M9 5H18V8M6 8V5'));
typo('text-underline',letter('U',7.1,3.5,1.4)+r('back',4.5,20,15,1.8,.9)+l('M5 20.9H19'));
typo('translate',accent('M3 6H14',2.5)+l('M3 6H14M8.5 3.5V6M11.8 6Q10.7 13.7 3 15M5.5 8.5Q7.7 13.5 13 15M12.5 20L17 10.5L21.5 20M14 16.8H20'),'The Chinese translation strokes and Latin A interlock without losing either script.');

const cnDigits={zero:'零',one:'一',two:'二',three:'三',four:'四',five:'五',six:'六',seven:'七',eight:'八',nine:'九'};
const cnCurrency={btc:'比特币',eth:'以太坊',cny:'人民币元',jpy:'日元',dollar:'美元','dollar-simple':'美元简式','circle-dollar':'圆形美元',eur:'欧元',gbp:'英镑',inr:'印度卢比',krw:'韩元',kzt:'哈萨克斯坦坚戈',ngn:'尼日利亚奈拉',rub:'俄罗斯卢布'};
const cnNames={
'approximate-equals':'约等于','asterisk':'六角星号','asterisk-simple':'五角星号','at':'艾特符号','binary':'二进制',
'brackets-angle':'尖括号','brackets-curly':'花括号','brackets-round':'圆括号','brackets-square':'方括号',
'check':'勾选','check-circle':'圆形勾选','check-fat':'粗勾选','check-square':'方形勾选','check-square-offset':'偏移方形勾选','checks':'双勾选',
'code':'代码','code-block':'代码块','code-simple':'简式代码','command':'命令键','control':'控制键','copyleft':'著佐权','copyright':'版权',
'divide':'除号','empty':'空集','equals':'等号','function':'函数','greater-than':'大于','greater-than-or-equal':'大于等于','hash':'井号','hash-straight':'直井号','infinity':'无穷大','intersection':'交集','less-than':'小于','less-than-or-equal':'小于等于',
'list-bullets':'项目符号列表','list-dashes':'短横线列表','list-numbers':'有序列表','list-plus':'添加列表项','math-operations':'四则运算','member-of':'属于','minus':'减号','minus-circle':'圆形减号','minus-square':'方形减号','not-equals':'不等于','not-member-of':'不属于','not-subset-of':'不是子集','not-superset-of':'不是超集',
'option':'选项键','paragraph':'段落标记','percent':'百分号','pi':'圆周率','plus':'加号','plus-circle':'圆形加号','plus-minus':'正负号','plus-square':'方形加号','quotes':'引号','radical':'根号','sigma':'求和符号','subset-of':'子集或相等','subset-proper-of':'真子集','superset-of':'超集或相等','superset-proper-of':'真超集',
'text-a-underline':'文字颜色','text-aa':'大小写','text-align-center':'文本居中','text-align-justify':'两端对齐','text-align-left':'文本左对齐','text-align-right':'文本右对齐','text-b':'粗体','text-columns':'文本分栏','text-h':'标题','text-indent':'增加缩进','text-italic':'斜体','text-outdent':'减少缩进','text-strikethrough':'删除线','text-subscript':'下标','text-superscript':'上标','text-t':'文本','text-t-slash':'清除文本格式','text-underline':'下划线','tilde':'波浪号','trademark':'商标','trademark-registered':'注册商标','translate':'翻译','union':'并集','x':'叉号','x-circle':'圆形叉号','x-square':'方形叉号'};
function chineseLabel(name){
 if(name.startsWith('number-')){const parts=name.split('-');return (parts.length===3?(parts[1]==='circle'?'圆形':'方形'):'')+'数字'+cnDigits[parts.at(-1)];}
 if(name.startsWith('currency-'))return cnCurrency[name.slice(9)];
 if(name.startsWith('letter-circle-'))return '圆形字母'+name.at(-1).toUpperCase();
 if(name.startsWith('text-h-'))return cnDigits[name.slice(7)]+'级标题';
 if(!cnNames[name])throw Error('Missing Chinese label: '+name);
 return cnNames[name];
}
const assignments=JSON.parse(fs.readFileSync(new URL('./assignments/symbols-type.json',import.meta.url),'utf8'));
const notes=[];
for(const {name} of assignments){
 const item=shapes[name];if(!item)throw Error(`Unimplemented assigned symbol: ${name}`);
 const svg=roundSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, #aa8bcf)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${item.body}</svg>`).source;
 const check=inspectRoundness(svg);if(check.issues.length)throw Error(`${name}: ${JSON.stringify(check.issues)}`);
 fs.writeFileSync(new URL(`../../assets/regular/${name}.svg`,import.meta.url),svg);
 notes.push({name,label:chineseLabel(name),category:'文字与运算',family:item.family,visualReason:item.visualReason});
}
if(Object.keys(shapes).length!==assignments.length)throw Error('Unassigned artwork detected');
fs.writeFileSync(new URL('./notes/symbols-type.json',import.meta.url),JSON.stringify(notes,null,2)+'\n');
console.log(`Authored and rounded ${notes.length} typography/math/currency/action symbols.`);
