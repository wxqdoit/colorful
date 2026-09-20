import fs from 'node:fs';
import {p,l,c,r,g,ring,mark,outlineDocument,label} from './core-kit.mjs';
import {roundSVG} from '../../scripts/round-svg.mjs';
const entries=JSON.parse(fs.readFileSync('design/redesign/assignments/symbols-functional.json'));
const art=new Map(), notes=[];
function add(name,family,cn,why,svg){if(art.has(name))throw Error(name);art.set(name,svg);notes.push({name,family,label:cn,category:'功能符号',visualReason:why});}
const line=(d,color='back')=>l(d,`stroke="var(--project-art-${color}, ${color==='back'?'#d9c9ed':'#f0e9f8'})"`);
const bead=(x,y)=>c('back',x,y,1.55)+c('surface',x-.2,y-.2,.65);
const rectline=(x,y,w,h,rad=2)=>l(`M${x+rad} ${y}H${x+w-rad}Q${x+w} ${y} ${x+w} ${y+rad}V${y+h-rad}Q${x+w} ${y+h} ${x+w-rad} ${y+h}H${x+rad}Q${x} ${y+h} ${x} ${y+h-rad}V${y+rad}Q${x} ${y} ${x+rad} ${y}Z`);
const head=c('back',12,4.1,2.1),torso=r('back',10.9,8.4,2.2,5.8,1.1);
add('anchor','nautical-anchor','船锚','圆形吊环、弧形锚臂与两片软圆锚爪。',c('surface',12,4.4,2.5)+ring(12,4.4,1.7)+l('M12 6.4V21M7.5 10H16.5M4 14C4 22 20 22 20 14')+p('back','M2.9 16L4 12.8L7 15.5Z')+p('back','M17 15.5L20 12.8L21.1 16Z'));
add('anchor-simple','nautical-anchor','简洁船锚','省略横梁，保留锚杆、圆环与双臂。',c('surface',12,4.6,2.5)+ring(12,4.6,1.65)+l('M12 6.5V20M4 13C4 22 20 22 20 13')+p('back','M3 15L4 12L6.5 14Z')+p('back','M17.5 14L20 12L21 15Z'));
add('asclepius','medical-staff','阿斯克勒庇俄斯之杖','单蛇沿垂直杖盘绕，蛇头是柔软叶形。',r('back',11,2.5,2,19,1)+l('M15.5 5H17C21 5 21 11 17 11H8C4 11 4 16 8 16H15C19 16 19 20 15 20H9')+p('surface','M4 5Q4 3.5 8 4.5Q8 8 3 8Q3 6 4 5Z')+c('detail',6,5.5,.45));
add('angle','geometry-angle','角度','两条开放射线与独立弧形角标。',p('surface','M5 19L9 10Q14 13 14 19Z')+l('M12 3L5 19H21')+line('M8 12Q12 14 12 19'));
add('bezier-curve','vector-controls','贝塞尔曲线','曲线、控制柄和三个节点呈现真实编辑结构。',line('M4 7H20')+l('M3 19C3 3 21 3 21 19')+bead(3,19)+bead(21,19)+r('back',10.5,5.5,3,3,.8)+c('surface',4,7,1.2)+c('surface',20,7,1.2));
add('bounding-box','vector-controls','边界框','圆角边界框与四个可拖动控制点。',rectline(4.5,4.5,15,15,1.3)+[[4.5,4.5],[19.5,4.5],[4.5,19.5],[19.5,19.5]].map(([x,y])=>r('back',x-1.5,y-1.5,3,3,.8)).join(''));
for(const [name,extra,cn]of[['bluetooth','','蓝牙'],['bluetooth-connected',c('back',3.5,12,1.3)+c('back',20.5,12,1.3),'蓝牙已连接'],['bluetooth-slash',l('M4 3L20 21'),'蓝牙关闭'],['bluetooth-x',mark('x',20,17,.6),'蓝牙错误']])add(name,'bluetooth-signal',cn,'上下两个角形波瓣沿同一根主轴交错。',p('surface','M12 3L17.5 7.5L12 12L17.5 16.5L12 21Z')+l('M7 7L17.5 16.5L12 21V3L17.5 7.5L7 17')+extra);
for(const[n,count,cn]of[['none',0,'无信号'],['low',1,'低信号'],['medium',2,'中信号'],['high',3,'强信号'],['full',4,'满格信号'],['slash',0,'信号关闭'],['x',0,'信号错误']]){let s='';for(let i=0;i<4;i++)s+=r(i<count?'back':'surface',3+i*4.8,16-i*3.4,2.8,5+i*3.4,1)+l(`M${4.4+i*4.8} ${18.8-i*3.4}V19.6`);if(n==='slash')s+=l('M3.5 3.5L21 21');if(n==='x')s+=mark('x',7,7,1.1);add('cell-signal-'+n,'signal-bars',cn,'四格圆头信号柱用填色数量明确区分强度。',s)}
add('circle','basic-shapes','圆形','柔和实体圆与克制的轮廓弧线。',c('back',12,12,8.6)+l('M7 5.7A8 8 0 0 1 19.4 15'));
add('circle-half','basic-shapes','半圆','左半圆填色，右半圆开放。',p('back','M12 3.5A8.5 8.5 0 0 0 12 20.5Z')+l('M12 3.5A8.5 8.5 0 0 1 12 20.5Z'));
add('circle-half-tilt','basic-shapes','斜半圆','沿四十五度对角线分割。',g('rotate(45 12 12)',p('back','M12 3.5A8.5 8.5 0 0 0 12 20.5Z')+l('M12 3.5A8.5 8.5 0 0 1 12 20.5Z')));
add('circle-notch','basic-shapes','缺口圆','开放圆环留出上方缺口，以圆头结束。',line('M6.8 6A8 8 0 1 0 17.2 6')+l('M17.2 6A8 8 0 0 1 20 12')+c('back',6.8,6,1));
const dashedCircle=()=>Array.from({length:8},(_,i)=>g(`rotate(${i*45} 12 12)`,l('M10 3.7Q12 3.2 14 3.7'))).join('');
add('circle-dashed','selection-outline','虚线圆', '八段圆头弧线构成选择边界。',dashedCircle()+c('back',12,3.35,1.05));
add('crop','vector-controls','裁剪','两条交错的裁切尺，彩色重叠区域保留裁剪含义。',p('surface','M7 7H18V18H7Z')+l('M3 7H18V22M7 2V18H22')+line('M7 11V18H14'));
const cursor=p('back','M5 3.5Q4.8 2.5 6 3L20 12Q21 12.7 19.6 13L13.3 14L10.1 20Q9.5 21 9 19.8Z')+l('M6.2 5.5L17 12M12 14L16 20');
add('cursor','pointer','光标','软圆箭形指针以不对称斜边保持准确指向。',cursor);
add('cursor-click','pointer','点击光标','指针周围的三束短线表示点击反馈。',g('translate(1 4) scale(.8)',cursor)+line('M4 3L5 5M11 2V4M18 4L16.5 5.5')+c('back',19,9,1.1));
add('cursor-text','pointer','文本光标','对称插入光标与中央浅色选择带。',r('surface',7,5,10,14,1.5)+l('M8 3Q12 3 12 6V18Q12 21 8 21M16 3Q12 3 12 6M12 18Q12 21 16 21'));
add('dna','molecular-strands','DNA 双螺旋','双曲线以连接横杆交替缠绕。',p('surface','M5 3C5 11 19 13 19 21H17C17 14 3 11 3 3Z')+line('M19 3C19 11 5 13 5 21')+l('M5 3C5 11 19 13 19 21M7 6H17M10 10H14M10 14H14M7 18H17')+c('back',19,3,1.2)+c('back',5,21,1.2));
add('dot','punctuation-dots','点','一枚清晰的圆实点。',c('back',12,12,3)+ring(12,12,3));
add('dot-outline','punctuation-dots','空心点','细圆环与内侧浅色环面。',c('surface',12,12,3.3)+ring(12,12,3.3));
for(const n of entries.filter(x=>x.name.startsWith('dots-')).map(x=>x.name)){const vertical=n.endsWith('vertical'),nine=n==='dots-nine',six=n.startsWith('dots-six'),circle=n.includes('circle'),outline=n.includes('outline');let s=circle?c('surface',12,12,8.4)+ring(12,12,8.4):'';const pts=nine?[-5,0,5].flatMap(y=>[-5,0,5].map(x=>[12+x,12+y])):six?(vertical?[-2.6,2.6].flatMap(x=>[-5,0,5].map(y=>[12+x,12+y])):[-2.6,2.6].flatMap(y=>[-5,0,5].map(x=>[12+x,12+y]))):[-5,0,5].map(t=>vertical?[12,12+t]:[12+t,12]);s+=pts.map(([x,y],i)=>outline?c('surface',x,y,1.65)+ring(x,y,1.65):c(i===0?'detail':'back',x,y,nine?1.6:1.7)+l(`M${x-.5} ${y}H${x+.5}`)).join('');add(n,'punctuation-dots',`${nine?'九':six?'六':'三'}点${vertical?'竖列':''}${circle?'圆框':outline?'空心':''}`,'等距圆点以准确数量和排列区分操作入口。',s)}
const circleA='M15 9A6 6 0 1 0 9 15A6 6 0 0 1 15 9Z';
const circleB='M15 9A6 6 0 1 1 9 15A6 6 0 0 0 15 9Z';
const circleLens='M15 9A6 6 0 0 1 9 15A6 6 0 0 1 15 9Z';
for(const mode of ['intersect','exclude','subtract'])for(const square of [false,true]){
 const n=mode+(square?'-square':''); let s;
 if(square){
  const a='M5 3H13Q15 3 15 5V9H9V15H5Q3 15 3 13V5Q3 3 5 3Z',b='M15 9H19Q21 9 21 11V19Q21 21 19 21H11Q9 21 9 19V15H15Z';
  s=mode==='intersect'?r('surface',3,3,12,12,2)+r('surface',9,9,12,12,2)+r('back',9,9,6,6,.8):mode==='exclude'?p('back',a)+p('surface',b):p('back',a);
  s+=rectline(3,3,12,12)+rectline(9,9,12,12);
 }else{
  s=mode==='intersect'?c('surface',9,9,6)+c('surface',15,15,6)+p('back',circleLens):mode==='exclude'?p('back',circleA)+p('surface',circleB):p('back',circleA);
  s+=ring(9,9,6)+ring(15,15,6);
 }
 add(n,'boolean-shapes',`${mode==='intersect'?'交集':mode==='exclude'?'排除交集':'减去'}${square?'方形':'圆形'}`,'实体区域准确呈现交集、对称差集或前形减去后形；细轮廓保留操作对象。',s);
}
add('intersect-three','boolean-shapes','三重交集','三圆交叠，中央交集单独强调。',c('surface',8,14,6)+c('back',16,14,6)+p('detail','M12 9.527864A6 6 0 0 1 13.990372 13.660248A6 6 0 0 1 10.009628 13.660248A6 6 0 0 1 12 9.527864Z')+ring(12,8,6)+ring(8,14,6)+ring(16,14,6));
for(const [n,text,cn]of[['file-c','C','C 文件'],['file-c-sharp','C+','C# 文件'],['file-html','HT','HTML 文件'],['file-ini','INI','配置文件'],['file-js','JS','JavaScript 文件'],['file-py','PY','Python 文件'],['file-rs','RS','Rust 文件'],['file-ts','TS','TypeScript 文件']]){let word=text==='HT'?g('translate(6.5 12) scale(.82)',l('M0 0V4M2 0V4M0 2H2M3 0H5M4 0V4M6 4V0L7.5 2L9 0V4M10 0V4H12')):text==='PY'?label('P',8,12)+g('translate(11.5 12) scale(.85)',l('M0 0L1.2 2L2.4 0M1.2 2V4')):text==='INI'?g('translate(6.6 12) scale(.85)',l('M0 0H2M1 0V4M0 4H2M3.4 4V0L5.8 4V0M7.2 0H9.2M8.2 0V4M7.2 4H9.2')):label(text,text.length===1?10:8,12);if(n==='file-c-sharp')word=label('C',7,12)+g('translate(12 12) scale(.7)',l('M1 0L.5 5M3 0L2.5 5M0 1.5H4M0 3.5H4'));add(n,'format-document',cn,'圆角纸张与折页承托清晰格式字形。',outlineDocument()+word+l('M8 18H15'))}
add('file-dashed','format-document','虚线文件','折页文件采用断续的圆头外轮廓。',p('surface','M14 3L20 9H16Q14 9 14 7Z')+l('M10 3H7Q4 3 4 6M4 10V14M4 18Q4 21 7 21H10M14 21H17Q20 21 20 18M20 14V10M14 3L20 9')+line('M8 11H12M8 15H16'));
for(const simple of [false,true])add('folder-'+(simple?'simple-':'')+'user','person-folder',simple?'简洁用户文件夹':'用户文件夹','人物头像与肩线位于文件夹正面。',p('back','M3 6Q3 4 5 4H9L12 7H20Q22 7 22 9V18Q22 20 20 20H5Q3 20 3 18Z')+(simple?'':p('surface','M3 10Q3 8 5 8H20Q22 8 21.6 10L20 19Q19.8 21 18 21H4Q2 21 2.4 19Z'))+c('surface',12,12,2)+l('M8.5 18C8.5 13.8 15.5 13.8 15.5 18'));
const genderBase=c('surface',10.5,13,5.2)+ring(10.5,13,5.2);
for(const[n,cn,s]of[['female','女性',l('M10.5 18.2V22M8 20H13')],['male','男性',l('M14 9.5L20 3.5M15.5 3.5H20V8')],['neuter','中性',l('M10.5 18.2V22')],['nonbinary','非二元性别',l('M10.5 7.8V2M7.8 3.5L13.2 6.5M7.8 6.5L13.2 3.5')],['intersex','间性',l('M14 9.5L20 3.5M15.5 3.5H20V8M10.5 18.2V22M8 20H13')],['transgender','跨性别',l('M14.2 9.3L20 3.5H16M20 3.5V7.5M7 9L2.5 4.5H6M2.5 4.5V8M3.8 7.8L6.4 5.2M10.5 18.2V22M8 20H13')]])add('gender-'+n,'gender-symbol',cn,'统一开放圆环与准确的性别符号端部。',genderBase+s);
function poly(points,color='back'){return p(color,points.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join('')+'Z')}
for(const[n,count,cn]of[['triangle',3,'三角形'],['pentagon',5,'五边形'],['hexagon',6,'六边形'],['octagon',8,'八边形']]){const pts=Array.from({length:count},(_,i)=>{const t=(-90+i*360/count)*Math.PI/180;return[+(12+9*Math.cos(t)).toFixed(3),+(12+9*Math.sin(t)).toFixed(3)]});add(n,'basic-polygons',cn,'保持准确边数，转角使用实际圆弧。',poly(pts)+l(`M${pts[0][0]} ${pts[0][1]}L${pts[1][0]} ${pts[1][1]}L${pts[2][0]} ${pts[2][1]}`))}
add('parallelogram','basic-polygons','平行四边形','同向斜边保持平行关系，四角柔化。',p('back','M8 5H21L16 19H3Z')+l('M8 5H21L18 13'));
add('polygon','basic-polygons','多边形','不规则五边形的编辑节点与柔化轮廓。',p('surface','M4 8L14 3L21 11L17 21L5 18Z')+l('M4 8L14 3L21 11L17 21L5 18Z')+bead(4,8)+bead(14,3)+bead(17,21));
for(const[n,d,pts,cn]of[['line-segment','M5 19L19 5',[[5,19],[19,5]],'线段'],['line-segments','M4 18L9 6L16 17L21 5',[[4,18],[9,6],[16,17],[21,5]],'折线段'],['path','M4 18C4 6 17 21 17 10Q17 5 21 5',[[4,18],[21,5]],'路径']])add(n,'vector-path',cn,'开放线条连接有意义的起止节点。',l(d)+pts.map(([x,y])=>bead(x,y)).join(''));
add('line-vertical','vector-path','竖线','细直立线配圆润的上下端点。',r('surface',10.5,3,3,18,1.5)+l('M12 3V21'));
const poses={
'person-simple':[head+torso,'M4 9H20M12 14L7 21M12 14L17 21','站立人物'],
'person-simple-walk':[c('back',13,4,2)+g('rotate(12 12 11)',torso),'M11 8L7 12H4M13 9L17 13H20M12 14L8 21M12 14L17 18L18 21','行走人物'],
'person-simple-run':[c('back',15,4,2)+p('back','M12 8Q14 7 14.5 9L12.5 14L10.5 13Z'),'M12 8L8 7L5 10M14 9L17 12L21 9M11.5 13L7 17L3 16M12.5 14L16 17L14 21','奔跑人物'],
'person-simple-ski':[c('back',15,4,2)+p('back','M12 7Q13 6 14 8L17 11L12 13L10 10Z'),'M13 8L8 10L5 9M16 11L11 15L16 18M12 13L7 16L11 19M3 20L20 22Q22 22 22 20M6 10L4 19M9 11L8 20','滑雪人物'],
'person-simple-tai-chi':[head+torso,'M4 9H20M12 14L5 21M12 14L18 17V21','太极人物'],
'person-simple-throw':[c('back',11,4,2)+r('back',10,8,2.2,6,1.1)+c('surface',21,7,1.7),'M11 8L16 10L19 7M11 9L7 13H4M11 14L7 21M11 14L16 18L17 21','投掷人物']};
for(const[n,[body,d,cn]]of Object.entries(poses))add(n,'gesture-people',cn,'头部与躯干是柔软色块，关节线保留动作姿态。',body+l(d));
add('playlist','music-list','播放列表','三行曲目与独立音乐符号。',r('surface',3,4,15,3,1.5)+l('M4 5.5H17M4 10.5H14M4 15.5H10M18 18V10L22 9V12')+c('back',15.5,19,2.5));
add('pulse','signal-wave','脉搏','连续脉搏曲线与一枚读数节点。',p('surface','M8 12L11 4L15 20L18 12Z')+l('M2.5 12H8L11 4L15 20L18 12H21.5')+c('back',21,12,1));
add('rectangle','basic-rectangles','矩形','横向圆角实体矩形。',r('back',3,6,18,12,2.2)+l('M6 6H18Q21 6 21 9V13'));
add('square','basic-rectangles','正方形','四边等长的软圆方形。',r('back',4,4,16,16,2.4)+l('M7 4H17Q20 4 20 7V13'));
for(const[n,bottom,split]of[['square-half',false,false],['square-half-bottom',true,false],['square-split-horizontal',false,true],['square-split-vertical',true,true]]){const s=split?(bottom?r('back',4,4,16,7,1.6)+r('surface',4,13,16,7,1.6)+l('M7 7.5H17M7 16.5H17'):r('back',4,4,7,16,1.6)+r('surface',13,4,7,16,1.6)+l('M7.5 7V17M16.5 7V17')):(bottom?r('back',4,12,16,8,1.6)+rectline(4,4,16,16)+l('M4 12H20'):r('back',4,4,8,16,1.6)+rectline(4,4,16,16)+l('M12 4V20'));add(n,'basic-rectangles',split?`方形${bottom?'上下':'左右'}分割`:`${bottom?'下':'左'}半方形`,'通过分割轴与留白明确半填充或双面板结构。',s)}
const dashBox=(x=4,y=4,w=16,h=16)=>l(`M${x+3} ${y}H${x+1}Q${x} ${y} ${x} ${y+1}V${y+3}M${x+w-3} ${y}H${x+w-1}Q${x+w} ${y} ${x+w} ${y+1}V${y+3}M${x+w} ${y+h-3}V${y+h-1}Q${x+w} ${y+h} ${x+w-1} ${y+h}H${x+w-3}M${x+3} ${y+h}H${x+1}Q${x} ${y+h} ${x} ${y+h-1}V${y+h-3}M${x+7} ${y}H${x+w-7}M${x+7} ${y+h}H${x+w-7}M${x} ${y+7}V${y+h-7}M${x+w} ${y+7}V${y+h-7}`);
add('rectangle-dashed','selection-outline','虚线矩形','横向矩形由分段圆头轮廓组成。',dashBox(3,6,18,12)+r('back',3,6,3,2,1));
add('triangle-dashed','selection-outline','虚线三角形','三角形由断续圆头线段闭合。',l('M10.7 5L12 3L13.3 5M15 8L17 11M19 14L20.5 16.5Q21.5 18.5 19 18.5M15 18.5H10M6 18.5H4Q2.5 18.5 3.5 16.5L5 14M7 11L9 8')+c('back',12,3,1));
const selectionExtras={selection:r('surface',8,8,8,8,1.5),'selection-all':r('back',6.5,6.5,11,11,1.4)+mark('check',12,12,1.1),'selection-background':r('back',6,6,9,9,1.3)+r('surface',10,10,9,9,1.3),'selection-foreground':r('surface',6,6,9,9,1.3)+r('back',10,10,9,9,1.3),'selection-inverse':p('back','M4 4H20V20H4ZM8 8V16H16V8Z'),'selection-plus':r('surface',7,7,10,10,1.3)+mark('plus',12,12,1.1),'selection-slash':r('surface',7,7,10,10,1.3)+l('M3 3L21 21')};
for(const[n,s]of Object.entries(selectionExtras))add(n,'selection-outline',{'selection':'选区','selection-all':'全选','selection-background':'选择背景','selection-foreground':'选择前景','selection-inverse':'反向选择','selection-plus':'增加选区','selection-slash':'取消选区'}[n],'统一断续边界内通过实心前后层或状态符号区分操作。',s+dashBox());
add('resize','vector-controls','调整尺寸','对角控制手柄与两条开放扩展边界。',p('surface','M4 11V4H20V20H13V11Z')+l('M4 9V4H20V20H15M10 14L17 7M12 7H17V12')+r('back',3,13,8,8,1.6));
add('signature','handwriting','签名','连续流畅的签字笔迹与短基线。',p('surface','M5 20Q13 18 21 20V21H5Z')+l('M3 16C14 5 15 1 11 3C7 5 6 20 11 17C13 16 12 11 14 12C16 13 14 17 17 16L21 12M14 21H21'));
for(const[n,three]of[['vector-two',false],['vector-three',true]])add(n,'vector-axis',three?'三维向量':'二维向量','箭形坐标轴与独立原点。',l(three?'M6 18V3M6 18H21M6 18L18 6M4 5L6 3L8 5M19 16L21 18L19 20M14 6H18V10':'M5 19V4M5 19H20M3 6L5 4L7 6M18 17L20 19L18 21')+bead(three?6:5,three?18:19));
for(const[n,d,cn]of[['wave-sine','M3 12C6-1 9-1 12 12C15 25 18 25 21 12','正弦波'],['wave-square','M3 18V6H12V18H21V6','方波'],['wave-triangle','M3 17L7.5 5L16.5 19L21 7','三角波'],['wave-sawtooth','M3 18L10 5V18L21 5V18','锯齿波']])add(n,'signal-wave',cn,'保留各波形的周期、斜率与台阶关系。',line('M3 12H21','surface')+l(d)+c('back',3,n==='wave-sine'?12:n==='wave-triangle'?17:18,1.25));
add('wheelchair','accessibility','轮椅','圆形车轮、柔软座面与明确的人体姿态。',c('surface',9,16,6)+l('M13.5 19A5.5 5.5 0 1 1 7 10.9M10 8V14H16L19 21H22M10 10H15')+c('back',10,4,2)+r('back',9,13,7,2,1));
add('wheelchair-motion','accessibility','运动轮椅','前倾躯干与车轮构成推进姿态。',c('surface',8.5,16.5,5.5)+l('M13.5 18.5A5.5 5.5 0 1 1 6 11.6M12 8L9 13H16L19 20H22M12 8L17 10L19 7')+c('back',14,4,2)+p('back','M10.5 7.5Q12 6 13 8L10 13H8Z'));
for(const entry of entries){if(!art.has(entry.name))throw Error('Missing '+entry.name);const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, #aa8bcf)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${art.get(entry.name)}</svg>`;fs.writeFileSync(`assets/regular/${entry.name}.svg`,roundSVG(svg).source)}
if(art.size!==entries.length)throw Error(`Unexpected artwork count ${art.size} vs ${entries.length}`);
fs.writeFileSync('design/redesign/notes/symbols-functional.json',JSON.stringify(notes,null,2)+'\n');console.log(`Drawn ${art.size} functional symbols.`);
