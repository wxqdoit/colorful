import fs from 'node:fs/promises';
import {p,l,r,c,g,ring} from './core-kit.mjs';
import {roundSVG,inspectRoundness} from '../../scripts/round-svg.mjs';

// Original 24-unit family geometry. Vendor artwork is only a semantic reference.
const art=new Map(), notes=new Map();
const set=(name,body,family,why)=>{if(art.has(name))throw Error(`Duplicate ${name}`);art.set(name,body);notes.set(name,{name,family,visualReason:why});};
const turn=(angle,body)=>g(`rotate(${angle} 12 12)`,body);
const reflect=body=>g('translate(24 0) scale(-1 1)',body);
const flip=body=>g('translate(0 24) scale(1 -1)',body);
const angles={right:0,'down-right':45,down:90,'down-left':135,left:180,'up-left':225,up:270,'up-right':315};
// Rounded triangular arrowhead: the local fill belongs to the arrow, not its backdrop.
const head=(x,y,angle=0,size=4,color='back')=>g(`translate(${x} ${y}) rotate(${angle})`,p(color,`M-.45 -.35Q.05 0-.45 .35L${-size+.65} ${size*.73-.25}Q${-size} ${size*.73} ${-size} ${size*.73-.65}V${-size*.73+.65}Q${-size} ${-size*.73} ${-size+.65} ${-size*.73+.25}Z`)+l(`M${-size+.3} ${-size*.73+.3}L-.25 0L${-size+.3} ${size*.73-.3}`));
const arrow=(x1,y1,x2,y2,size=4)=>{const a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;return l(`M${x1} ${y1}L${x2} ${y2}`)+head(x2,y2,a,size);};
const rail=(d)=>l(d);

// Alignment uses actual aligned objects: one block in simple, two unequal blocks otherwise.
for(const simple of [false,true]){
 const suffix=simple?'-simple':'';
 const left=rail('M3.5 4V20')+(simple?r('surface',6.5,8,14,8,1.8)+r('back',6.5,8,4,8,1.8)+l('M9 10.5H17.5'):r('surface',6.5,5,11,5.5,1.7)+r('back',6.5,13.5,14,5.5,1.7)+l('M9 7.75H15M9 16.25H17.5'));
 for(const [dir,angle] of Object.entries({left:0,top:90,right:180,bottom:270}))set(`align-${dir}${suffix}`,turn(angle,left),'alignment',`${simple?'One rounded block':'Two unequal rounded blocks'} rests against the ${dir} alignment rail.`);
 const center=simple?r('surface',4,8,16,8,1.8)+r('back',9.5,8,5,8,1.2)+l('M12 3.5V8M12 16V20.5M7 12H17'):r('surface',6,5,12,5.5,1.5)+r('back',4,13.5,16,5.5,1.5)+l('M12 3V5M12 10.5V13.5M12 19V21M9 7.75H15M8 16.25H16');
 set(`align-center-horizontal${suffix}`,center,'alignment','Rounded blocks share a vertical center guide for horizontal centering.');
 set(`align-center-vertical${suffix}`,turn(90,center),'alignment','Rounded blocks share a horizontal center guide for vertical centering.');
}
for(const [dir,angle] of Object.entries(angles)){
 set(`arrow-${dir}`,turn(angle,arrow(4,12,20,12,6)),'straight-arrow',`An open shaft and rounded filled head point ${dir}.`);
 for(const container of ['circle','square']){
  const shell=container==='circle'?c('surface',12,12,9)+ring(12,12,9):r('surface',3,3,18,18,4)+l('M7 3H17Q21 3 21 7V17Q21 21 17 21H7Q3 21 3 17V7Q3 3 7 3Z');
  set(`arrow-${container}-${dir}`,shell+turn(angle,arrow(7,12,17,12,4.5)),'contained-arrow',`The named ${container} encloses a clearly ${dir} arrow.`);
 }
 if(dir.includes('-')){
  const up=dir.startsWith('up'),right=dir.endsWith('right');
  set(`arrow-line-${dir}`,rail(up?'M4 20.5H20':'M4 3.5H20')+arrow(right?7:17,up?17:7,right?18:6,up?6:18,5),'arrow-stop',`Diagonal ${dir} arrow leaves a horizontal origin line, preserving the reference meaning.`);
 }else set(`arrow-line-${dir}`,turn(angle,rail('M20.5 4V20')+arrow(3.5,12,17,12,5)),'arrow-stop',`A ${dir} arrow approaches its perpendicular end stop.`);
}
// Broad arrows have a true filled stem; tail line counts remain exact.
for(const [dir,angle] of Object.entries({right:0,down:90,left:180,up:270}))for(const lines of [0,1,2]){
 const tail=lines===0?4:lines===1?7:9;
 const body=p('surface',`M${tail+1} 8.5H12V5Q12 3.9 12.9 4.8L20 11.2Q20.9 12 20 12.8L12.9 19.2Q12 20.1 12 19V15.5H${tail+1}Q${tail} 15.5 ${tail} 14.5V9.5Q${tail} 8.5 ${tail+1} 8.5Z`)+p('back','M12 5Q12 3.9 12.9 4.8L20 11.2Q20.9 12 20 12.8L12.9 19.2Q12 20.1 12 19V5Z')+l(`M${tail+2} 12H16M13 6L20 12L13 18`)+(lines>0?l(`M${tail-3} 9V15`):'')+(lines>1?l(`M${tail-6} 9V15`):'');
 set(`arrow-fat-${lines===1?'line-':lines===2?'lines-':''}${dir}`,turn(angle,body),'broad-arrow',`Broad rounded ${dir} arrow with ${lines} detached tail ${lines===1?'line':'lines'}.`);
}
// Curved bends and right-angle elbows share endpoints but retain distinct turning radii.
const orientations={
 'up-left':s=>s,'up-right':reflect,'down-left':flip,'down-right':s=>reflect(flip(s)),
 'left-down':s=>turn(270,s),'left-up':s=>flip(turn(270,s)),
 'right-down':s=>reflect(turn(270,s)),'right-up':s=>reflect(flip(turn(270,s)))
};
for(const family of ['bend','elbow','u'])for(const [dir,orient] of Object.entries(orientations)){
 const base=family==='bend'?l('M20 19C20 12.9 16.1 9 10 9H5')+head(4,9,180,5):family==='elbow'?l('M19 20V9Q19 7 17 7H5')+head(4,7,180,5):l('M7 19H15C22 19 22 8 15 8H5')+head(4,8,180,5);
 set(`arrow-${family}-${dir}`,orient(base),`${family}-arrow`,`${family==='bend'?'A generous quarter curve':family==='elbow'?'A compact rounded right-angle elbow':'A deep U-turn'} preserves the ${dir} travel sequence and terminal direction.`);
}
const doubleBend=l('M20 19C20 13.3 16.4 9 11 9')+head(9,9,180,4)+l('M7 5.8L3.6 9L7 12.2');
set('arrow-bend-double-up-left',doubleBend,'bend-arrow','A curved return terminates in two separate left-facing arrowheads.');
set('arrow-bend-double-up-right',reflect(doubleBend),'bend-arrow','A curved return terminates in two separate right-facing arrowheads.');
const angledElbow=l('M3.5 9L10.6 16.1Q11.5 17 12.4 16.1L19 9.5')+head(20,8.5,315,5.4);
set('arrow-elbow-right',angledElbow,'elbow-arrow','A diagonal elbow rises to an upper-right arrowhead.');
set('arrow-elbow-left',reflect(angledElbow),'elbow-arrow','A diagonal elbow rises to an upper-left arrowhead.');
const arc=l('M20.5 18C20.5 7.5 10 3.9 4.4 12')+head(3.5,13.5,125,5);
set('arrow-arc-left',arc,'arc-arrow','A broad arch curls down into the left arrowhead.');
set('arrow-arc-right',reflect(arc),'arc-arrow','A broad arch curls down into the right arrowhead.');
const cycle=l('M17.5 18.5C12.1 23 4 19.2 4 12C4 5 12.1 1.4 17.5 6.5L20 9')+head(20.5,9.5,45,4.8);
const cycles=l('M6 7C10 2.7 15 3.2 18.5 7L20 8.5M18 17C14 21.3 9 20.8 5.5 17L4 15.5')+head(20.5,9,45,4.3)+head(3.5,15,225,4.3);
for(const [plural,body] of [[false,cycle],[true,cycles]])for(const reverse of [false,true])set(`${plural?'arrows':'arrow'}-${reverse?'counter-clockwise':'clockwise'}`,reverse?reflect(body):body,'rotation-arrow',`${plural?'Two opposed arcs':'One open circular arc'} runs ${reverse?'counterclockwise':'clockwise'}; filled arrowheads expose the rotation direction.`);
set('arrow-square-out',r('surface',4,8,12,12,2.5)+l('M11 8H6Q4 8 4 10V18Q4 20 6 20H14Q16 20 16 18V13')+arrow(12,12,20,4,5),'boundary-arrow','The arrow leaves the upper-right corner of an open square.');
set('arrow-square-in',r('surface',8,4,12,12,2.5)+l('M8 10V6Q8 4 10 4H18Q20 4 20 6V14Q20 16 18 16H14')+arrow(4,20,12,12,5),'boundary-arrow','The arrow enters the lower-left opening of a square.');

const doubleHorizontal=l('M4 12H20')+head(3.5,12,180,4.5)+head(20.5,12,0,4.5);
set('arrows-horizontal',doubleHorizontal,'bidirectional-arrow','Two opposing heads share one horizontal shaft.');
set('arrows-vertical',turn(90,doubleHorizontal),'bidirectional-arrow','Two opposing heads share one vertical shaft.');
const exchange=arrow(20,7.5,4,7.5,4.5)+arrow(4,16.5,20,16.5,4.5);
set('arrows-left-right',exchange,'bidirectional-arrow','Two distinct parallel lanes point in opposite horizontal directions.');
set('arrows-down-up',turn(90,exchange),'bidirectional-arrow','Two distinct parallel lanes point in opposite vertical directions.');
for(const inward of [false,true]){
 const io=inward?'in':'out';
 for(const variant of ['','-simple','-cardinal']){
  let body='';
  if(variant==='-cardinal')for(const a of [0,90,180,270])body+=turn(a,inward?arrow(21,12,15,12,3):arrow(15,12,21,12,3));
  else for(const a of variant==='-simple'?[0,180]:[0,90,180,270])body+=turn(a,inward?arrow(20,4,14.7,9.3,3.8):arrow(14.7,9.3,20,4,3.8));
  set(`arrows-${io}${variant}`,body,'expand-collapse',`${inward?'Inward':'Outward'} heads on ${variant==='-cardinal'?'four cardinal axes':variant==='-simple'?'two opposite diagonal axes':'four diagonal axes'} leave the center open.`);
 }
 const body=l('M12 4V20')+(inward?arrow(3,12,9.5,12,3.2)+arrow(21,12,14.5,12,3.2):arrow(9.5,12,3,12,3.2)+arrow(14.5,12,21,12,3.2));
 set(`arrows-${io}-line-horizontal`,body,'expand-collapse',`Two horizontal arrows point ${inward?'toward':'away from'} the center divider.`);
 set(`arrows-${io}-line-vertical`,turn(90,body),'expand-collapse',`Two vertical arrows point ${inward?'toward':'away from'} the center divider.`);
}
set('arrows-merge',l('M6.5 4V9Q6.5 10 7.3 10.8L12 15.5V20M17.5 4V9Q17.5 10 16.7 10.8L12 15.5')+head(12,21,90,4.5),'branch-arrow','Two upper lanes converge into one downward arrow.');
set('arrows-split',l('M12 3.5V7.5L6.8 12.7Q6 13.5 6 14.5V20M12 7.5L17.2 12.7Q18 13.5 18 14.5V20')+head(6,21,90,3.8)+head(18,21,90,3.8),'branch-arrow','One upper lane separates into two independently headed downward branches.');

// Carets are rounded folded chevrons, visibly distinct from stemmed arrows.
const caret=(x,y,size=5,color='back')=>g(`translate(${x} ${y})`,p(color,`M${-size} ${-size*.55}Q${-size+.3} ${-size*.9} ${-size+.9} ${-size*.45}L-.5 ${size*.2}Q0 ${size*.45} .5 ${size*.2}L${size-.9} ${-size*.45}Q${size-.3} ${-size*.9} ${size} ${-size*.55}Q${size+.3} ${-size*.2} ${size-.1} .2L.8 ${size*.85}Q0 ${size+0.15}-.8 ${size*.85}L${-size+.1} .2Q${-size-.3} ${-size*.2} ${-size} ${-size*.55}Z`)+l(`M${-size+.4} ${-size*.55}L0 ${size*.32}L${size-.4} ${-size*.55}`));
const caretAngles={down:0,left:90,up:180,right:270};
for(const [dir,angle] of Object.entries(caretAngles))for(const variant of ['','double-','line-','circle-','circle-double-']){
 const circle=variant.includes('circle'),double=variant.includes('double'),line=variant==='line-';
 let body=double?caret(12,circle?9.2:8.2,circle?3.8:5.5,'surface')+caret(12,circle?14.3:14.3,circle?3.8:5.5):caret(12,line?10:11,circle?4.5:6.5);
 if(line)body+=l('M5 19H19');
 body=turn(angle,body);
 if(circle)body=c('surface',12,12,9)+ring(12,12,9)+body;
 set(`caret-${variant}${dir}`,body,'caret',`${double?'Two successive':'One'} rounded ${dir} chevron${circle?' inside the named circle':line?' with a perpendicular stop line':''}.`);
}
for(const circle of [false,true]){
 const body=turn(180,caret(12,17, circle?3.4:4.6))+caret(12,17,circle?3.4:4.6);
 set(`caret-${circle?'circle-':''}up-down`,(circle?c('surface',12,12,9)+ring(12,12,9):'')+body,'caret','Separated upward and downward chevrons preserve the bidirectional selector meaning.');
}
for(const inward of [false,true]){
 const corner=inward?p('back','M4 8H7Q8 8 8 7V4Q8 3 9 3Q10 3 10 4V9Q10 10 9 10H4Q3 10 3 9Q3 8 4 8Z')+l('M3.5 9H9V3.5'):p('back','M9 3Q10 3 10 4Q10 5 9 5H6Q5 5 5 6V9Q5 10 4 10Q3 10 3 9V5Q3 3 5 3Z')+l('M9 4H5Q4 4 4 5V9');
 set(`corners-${inward?'in':'out'}`,[0,90,180,270].map(a=>turn(a,corner)).join(''),'corners',`Four local L-shaped corner pieces face ${inward?'inward':'outward'} without an unrelated filled rectangle.`);
}
const split=l('M9.5 4V20M14.5 4V20')+arrow(9.5,12,3,12,3.2)+arrow(14.5,12,21,12,3.2);
set('split-horizontal',split,'split-axis','Two vertical divider rails separate left and right pointing arrows.');
set('split-vertical',turn(90,split),'split-axis','Two horizontal divider rails separate upward and downward arrows.');
for(const variant of ['','-angular','-simple']){
 const body=variant==='-simple'?l('M4 5L20 19M4 19L9.5 13.5M14.5 10L20 5')+head(20,19,45,4)+head(20,5,315,4):variant==='-angular'?l('M3.5 7H7.5L16.5 17H20M3.5 17H7.5L10 14M14 10L16.5 7H20')+head(21,7,0,3.5)+head(21,17,0,3.5):l('M3.5 7H6C11 7 13 17 18 17H20M3.5 17H6C8 17 9 15.5 10 14M14 10C15.5 7.5 16.5 7 18 7H20')+head(21,7,0,3.5)+head(21,17,0,3.5);
 set(`shuffle${variant}`,body,'shuffle',`${variant==='-simple'?'Diagonal':variant==='-angular'?'Angled':'Smooth'} crossing routes preserve the crossing gap and two right endpoints.`);
}
const sort=r('back',4,4.5,12,2.5,1.2)+r('surface',4,10.5,7.5,2.5,1.2)+r('surface',4,16.5,5.5,2.5,1.2)+l('M5 12H10.5M5 18H8.5')+arrow(18,10,18,20,3.7);
set('sort-ascending',sort,'sorting','Three descending-length rows pair with a downward arrow, matching the upstream ascending order symbol.');
set('sort-descending',flip(sort),'sorting','Three ascending-length rows pair with an upward arrow, matching the upstream descending order symbol.');
const trend=l('M3.5 17L9 11.5Q9.5 11 10 11.5L13 14.5Q13.5 15 14 14.5L20 7.5')+head(20.5,7,315,5);
set('trend-up',trend,'trend','A rising zigzag ends in an upper-right filled arrowhead.');
set('trend-down',flip(trend),'trend','A falling zigzag ends in a lower-right filled arrowhead.');

// Search labels describe direction and variant explicitly; no English-name fallback.
function chineseLabel(name){
 const dir={up:'上',down:'下',left:'左',right:'右','up-left':'左上','up-right':'右上','down-left':'左下','down-right':'右下'};
 const fixed={
  'arrow-arc-left':'向左弧形箭头','arrow-arc-right':'向右弧形箭头',
  'arrow-clockwise':'顺时针箭头','arrow-counter-clockwise':'逆时针箭头',
  'arrows-clockwise':'顺时针双箭头','arrows-counter-clockwise':'逆时针双箭头',
  'arrow-square-in':'箭头进入方框','arrow-square-out':'箭头离开方框',
  'arrows-down-up':'左下右上双箭头','arrows-left-right':'上左下右双箭头',
  'arrows-horizontal':'水平双向箭头','arrows-vertical':'垂直双向箭头',
  'arrows-merge':'箭头合流','arrows-split':'箭头分流',
  'caret-up-down':'上下折角','caret-circle-up-down':'圆框上下折角',
  'corners-in':'四角向内收拢','corners-out':'四角向外展开',
  'shuffle':'曲线随机交叉','shuffle-angular':'折线随机交叉','shuffle-simple':'简单双线交叉',
  'sort-ascending':'升序排列','sort-descending':'降序排列',
  'split-horizontal':'水平分隔展开','split-vertical':'垂直分隔展开',
  'trend-up':'上升趋势','trend-down':'下降趋势'
 };
 if(fixed[name])return fixed[name];
 if(name.startsWith('align-')){
  const simple=name.endsWith('-simple');const key=name.slice(6).replace(/-simple$/,'');
  const map={bottom:'底部对齐',top:'顶部对齐',left:'左侧对齐',right:'右侧对齐','center-horizontal':'水平居中','center-vertical':'垂直居中'};
  if(map[key])return map[key]+(simple?'（单对象）':'');
 }
 const arrow=name.match(/^arrow-(circle-|square-|line-|fat-lines-|fat-line-|fat-)?(up-left|up-right|down-left|down-right|up|down|left|right)$/);
 if(arrow){
  const [,variant='',direction]=arrow,d=dir[direction];
  if(variant==='line-')return direction.includes('-')?`自横线向${d}箭头`:`向${d}至边线`;
  const prefix={'':'','circle-':'圆框','square-':'方框','fat-':'宽体','fat-line-':'单尾线宽体','fat-lines-':'双尾线宽体'}[variant];
  return `${prefix}向${d}箭头`;
 }
 const curved=name.match(/^arrow-(bend-double|bend|elbow|u)-(.+)$/);
 if(curved){
  const [,kind,direction]=curved;
  const turnDir={...dir,'left-up':'先左再上','left-down':'先左再下','right-up':'先右再上','right-down':'先右再下'};
  if(turnDir[direction])return turnDir[direction]+({'bend-double':'双头转弯箭头',bend:'转弯箭头',elbow:'直角转折箭头',u:'回转箭头'}[kind]);
 }
 const arrows=name.match(/^arrows-(in|out)(-cardinal|-line-horizontal|-line-vertical|-simple)?$/);
 if(arrows){
  const [,direction,variant='']=arrows;
  return ({'':'四向斜角','-cardinal':'四向正交','-line-horizontal':'水平中线','-line-vertical':'垂直中线','-simple':'双向斜角'}[variant])+(direction==='in'?'内收箭头':'外扩箭头');
 }
 const caret=name.match(/^caret-(circle-double-|circle-|double-|line-)?(up|down|left|right)$/);
 if(caret){const [,variant='',direction]=caret;return ({'':'','circle-double-':'圆框双','circle-':'圆框','double-':'双','line-':'带边线'}[variant])+`向${dir[direction]}折角`;}
 throw Error(`Missing Chinese label: ${name}`);
}

const assigned=JSON.parse(await fs.readFile(new URL('./assignments/symbols-directions.json',import.meta.url),'utf8'));
let corners=0;
for(const {name} of assigned){
 if(!art.has(name))throw Error(`Unimplemented assigned icon: ${name}`);
 const source=`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, #aa8bcf)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${art.get(name)}</svg>`;
 const rounded=roundSVG(source);corners+=rounded.corners;
 const check=inspectRoundness(rounded.source);if(check.issues.length)throw Error(`${name}: ${JSON.stringify(check.issues)}`);
 await fs.writeFile(new URL(`../../assets/regular/${name}.svg`,import.meta.url),rounded.source);
}
const extras=[...art.keys()].filter(name=>!assigned.some(a=>a.name===name));if(extras.length)throw Error(`Unassigned outputs: ${extras}`);
await fs.mkdir(new URL('./notes/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('./notes/symbols-directions.json',import.meta.url),JSON.stringify(assigned.map(({name})=>({...notes.get(name),label:chineseLabel(name),category:'方向与布局'})),null,2)+'\n');
console.log(`Generated ${assigned.length} directions; rounded ${corners} joins; no missing assignments or roundness issues.`);
