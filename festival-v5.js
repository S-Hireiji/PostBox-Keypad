
/* Load after experience-v4.js. Requires Free Demo + v3 + v4. */
(function(){
'use strict';
const id=s=>document.getElementById(s);
const oldApply=applyCfg,oldFill=fillCfg;
let canvas,ctx,w=0,h=0,dpr=1,timer=null,lastFrame=0,scene='normal';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const particles=Array.from({length:28},(_,i)=>({x:((i*73+19)%997)/997,y:((i*131+71)%991)/991,r:1+(i%3)*.65,s:8+(i%7)*2,p:i*.71}));
const style=document.createElement('style');
style.textContent=`
#ppStage{z-index:2}
#ppStage>.card{padding:13px 14px!important}
#ppStage .topbar{display:grid!important;grid-template-columns:36px minmax(0,1fr) 36px!important;align-items:center!important;gap:4px!important;margin-bottom:8px!important;padding-bottom:7px!important}
#ppStage .topbar::after{content:none!important;display:none!important}
#ppStage .topbar>.logo{grid-column:2;justify-self:center!important;align-self:center;text-align:center!important;min-width:0;white-space:nowrap;font-size:21px;line-height:1.25}
#ppStage .topbar>button:first-child{grid-column:1;grid-row:1;justify-self:start}
#ppStage .topbar>button:last-child{grid-column:3;grid-row:1;justify-self:end}
#ppStage .card .iconbtn{width:34px;height:34px}
#ppStage .card h1{font-size:20px!important;margin:5px 0!important}
#ppStage .card h2{font-size:18px!important;margin:4px 0 8px!important;text-align:center!important}
#ppStage .card h3,#ppStage #setT{text-align:center!important;margin:0 0 8px!important;font-size:15px!important}
#ppStage .card p{margin-bottom:7px;font-size:13px;line-height:1.4}
#ppStage .card .field{margin-bottom:7px}
#ppStage .card label{font-size:12px;margin-bottom:3px}
#ppStage .card input,#ppStage .card select{height:35px!important;font-size:14px!important;padding-left:9px;padding-right:9px}
#ppStage .card input[type=range]{height:18px!important;padding:0}
#ppStage .card input[type=checkbox]{height:20px!important;width:20px!important}
#ppStage .card button{height:39px;font-size:15px!important}
#ppStage .card .menu{gap:6px}
#ppStage .card .menu button{height:42px!important}
#ppStage .card .link{height:29px!important;font-size:13px!important}
#ppStage .card .full{margin-top:6px}
#ppStage .card .message{min-height:29px;padding:6px;margin-top:7px;font-size:12px}
#ppStage .card .weather{gap:5px;margin-bottom:8px}
#ppStage .card .weather .box{padding:6px 8px}
#ppStage .card .weather .label{font-size:10px;margin-bottom:1px}
#ppStage .card .weather .value{font-size:13px;line-height:1.35}
#ppStage .card #dt{font-size:12px}
#ppStage .card .greet{padding:7px;gap:8px;margin-bottom:8px}
#ppStage .card #greet{font-size:13px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#ppStage .card .greet .av{width:35px;height:35px;font-size:18px}
#ppStage .card .gset{min-height:0!important;align-items:stretch;gap:7px}
#ppStage .card .rail{width:40px;flex:0 0 40px;gap:5px}
#ppStage .card .rail button{height:38px!important;width:40px;font-size:18px!important}
#ppStage .card .pane{max-height:min(310px,45vh)!important;max-height:min(310px,45dvh)!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;padding:10px!important;-webkit-overflow-scrolling:touch}
#ppStage .card .pane .av{width:60px;height:60px;margin-bottom:6px}
#ppStage #ppSettingsTitle{text-align:center;font-size:18px!important;line-height:1.3;margin:0 0 6px!important}
#ppStage #ppDraftNote{font-size:11px;margin-bottom:6px;line-height:1.35;text-align:center}
#ppStage .card .digit{height:44px;width:37px;font-size:20px}
#ppStage .card .keypad{gap:6px}
#ppStage .card .keypad button{height:40px}
#ppStage #ppWait{padding:8px;margin:7px 0;font-size:12px}
#ppStage #ppWait small{font-size:10px}
#ppStage .card #ppCancelWait{height:auto;min-height:34px}
#ppFestivalScene{position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%}
body.pp-festival #bg{visibility:hidden!important}
body.pp-loy{background:linear-gradient(#081b32,#123b4e 56%,#0a2f3d)!important}
body.pp-loy #ppStage .card{border:1px solid #8ba873;box-shadow:0 15px 40px rgba(0,0,0,.28)}
body.pp-loy .logo{background:linear-gradient(90deg,#a6e1c8,#ecd68c);-webkit-background-clip:text;background-clip:text}
body.pp-loy .primary{background:linear-gradient(100deg,#2c8479,#647944)}
body.pp-loy .rail button.on{border-color:#e0c779!important}
body.pp-loy .pp-spark{color:#eed78b}
body.pp-loy .screen.pp-enter{animation:pp-loy-enter 250ms ease-out!important}
body.pp-loy button:active{box-shadow:0 0 0 3px rgba(220,198,123,.22)}
.pp-water-tap{position:fixed;pointer-events:none;z-index:9998;width:22px;height:9px;border:1px solid #d9d697;border-radius:50%;transform:translate(-50%,-50%);animation:pp-water-tap 800ms ease-out forwards}
@keyframes pp-water-tap{from{opacity:.85;transform:translate(-50%,-50%) scale(.6)}to{opacity:0;transform:translate(-50%,-50%) scale(4)}}
@keyframes pp-loy-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.pp-water-tap{display:none!important}body.pp-loy .screen.pp-enter{animation:none!important}}
`;
document.head.appendChild(style);
function preset(c){return c?.themePreset||(c?.xmasTheme?'christmas':'normal')}
function sync(){const select=id('ppTheme');if(select)select.value=preset(dc)}
function scheduleSync(){Promise.resolve().then(sync)}
fillCfg=function(){oldFill();scheduleSync()};
function setPalette(){
 scene=preset(cfg);document.body.classList.toggle('pp-loy',scene==='loy');document.body.classList.toggle('pp-festival',scene!=='normal');
 if(scene==='loy'){
  const p={bg:'#102e3b',card:'#153d45',text:'#f5f0d8',muted:'#c1d5c7',line:'#40665f'};
  for(const [k,v]of Object.entries(p))document.documentElement.style.setProperty('--'+k,v);
 }
 if(canvas){canvas.hidden=scene==='normal';draw(performance.now());}
}
applyCfg=function(){oldApply();setPalette();scheduleSync()};
function resize(){if(!canvas)return;w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now())}
function star(x,y,r,color){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.closePath();ctx.fillStyle=color;ctx.fill()}
function tree(x,y,s){ctx.fillStyle='#274c3f';for(let i=0;i<3;i++){const yy=y-i*s*.24;ctx.beginPath();ctx.moveTo(x,yy-s*.62);ctx.lineTo(x-s*(.32-i*.06),yy);ctx.lineTo(x+s*(.32-i*.06),yy);ctx.closePath();ctx.fill()}star(x,y-s*1.1,s*.065,'#c8a553')}
function krathong(x,y,size,t){
 ctx.save();ctx.translate(x,y+Math.sin(t+x)*2);ctx.scale(size,size);
 ctx.strokeStyle='rgba(182,216,187,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,13,30,5,0,0,Math.PI*2);ctx.stroke();
 for(let k=-2;k<=2;k++){ctx.save();ctx.translate(k*8,0);ctx.rotate(k*.22);ctx.fillStyle=k%2?'#397e63':'#65a17b';ctx.beginPath();ctx.moveTo(-8,8);ctx.quadraticCurveTo(-12,-3,0,-13);ctx.quadraticCurveTo(12,-3,8,8);ctx.closePath();ctx.fill();ctx.restore()}
 ctx.fillStyle='#b98952';ctx.beginPath();ctx.ellipse(0,8,24,5,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#f2d2be';ctx.fillRect(-2,-16,4,19);
 ctx.fillStyle='#ffdf83';ctx.beginPath();ctx.ellipse(0,-22,3,6+Math.sin(t*2)*.7,0,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function draw(now){
 if(!ctx)return;ctx.clearRect(0,0,w,h);if(scene==='normal')return;
 const animate=cfg.motionFx!==false&&!reduce.matches&&!document.hidden;
 const t=animate?now/1000:0;
 if(scene==='christmas'){
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#f5eddf');g.addColorStop(1,'#e9f0e5');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  for(const p of particles){const y=(p.y*h+t*p.s)%(h+20)-10,x=p.x*w+Math.sin(t*.25+p.p)*10;ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill()}
  tree(w*.09,h+15,90);tree(w*.92,h+18,110);
  ctx.strokeStyle='#a39b6b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,13);ctx.quadraticCurveTo(w*.5,57,w,13);ctx.stroke();
  for(let i=0;i<10;i++){const x=(i+.5)*w/10,y=13+44*(x/w)*(1-x/w);star(x,y+7,3.5,i%2?'#b74b4d':'#b99a45')}
 }else if(scene==='loy'){
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#07172d');g.addColorStop(.55,'#163e4d');g.addColorStop(1,'#082c37');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#efdfac';ctx.beginPath();ctx.arc(w*.8,h*.13,25,0,Math.PI*2);ctx.fill();
  particles.slice(0,18).forEach(p=>{ctx.fillStyle='rgba(243,227,172,'+(.35+Math.abs(Math.sin(t*.4+p.p))*.4)+')';ctx.fillRect(p.x*w,p.y*h*.45,1.4,1.4)});
  for(let i=0;i<11;i++){const y=h*.58+i*h*.041;ctx.beginPath();ctx.strokeStyle='rgba(131,189,170,.15)';for(let x=0;x<=w;x+=12){const yy=y+Math.sin(x*.015+t*.4+i)*3;if(!x)ctx.moveTo(x,yy);else ctx.lineTo(x,yy)}ctx.stroke()}
  for(let i=0;i<5;i++){const x=((i*.23*w+t*(3+i*.2))%(w+100))-35,y=h*(.68+(i%3)*.105);krathong(x,y,.65+(i%2)*.18,t)}
 }
}
function frame(now){if(document.hidden){timer=null;return;}if(now-lastFrame>40){draw(now);lastFrame=now;}timer=requestAnimationFrame(frame)}
function waterTap(e){if(scene!=='loy'||cfg.motionFx===false||reduce.matches||!e.target.closest('button'))return;const button=e.target.closest('button');if(button.disabled)return;const r=button.getBoundingClientRect();const s=document.createElement('span');s.className='pp-water-tap';s.style.left=(e.clientX||r.left+r.width/2)+'px';s.style.top=(e.clientY||r.top+r.height/2)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),850)}
function start(){
 const select=id('ppTheme');if(!select){console.error('v5 requires experience-v4.js first');return;}
 if(!select.querySelector('[value="loy"]')){const op=document.createElement('option');op.value='loy';op.textContent='ลอยกระทงใต้แสงจันทร์';select.appendChild(op)}
 select.onchange=e=>{
  const value=e.target.value;dc.themePreset=value;dc.xmasTheme=value==='christmas';
  dc.color=value==='loy'?'#58b7a3':value==='christmas'?'#b43b49':'#38bdf8';
  dc.bgm=value==='loy'?'loy':value==='christmas'?'xmas':'happy';
  id('cColor').value=dc.color;id('cBgm').value=dc.bgm;dirty();
 };
 if(!B.loy){B.loy=new Audio('sounds/loy-original.wav');B.loy.loop=true;}
 if(!id('cBgm').querySelector('[value="loy"]')){const op=document.createElement('option');op.value='loy';op.textContent='ลอยกระทง — สายน้ำคืนเพ็ญ';id('cBgm').appendChild(op)}
 const separateBackground=id('cBg');if(separateBackground)separateBackground.closest('.field').hidden=true;
 if(!id('ppSettingsTitle')){const h=document.createElement('h2');h.id='ppSettingsTitle';h.textContent='ตั้งค่ามุมโปรดของคุณ';id('settings').insertBefore(h,id('settings').firstChild)}
 if(id('ppDraftNote'))id('ppDraftNote').textContent='ดูตัวอย่างได้ทันที กดยืนยันเพื่อเก็บไว้';
 canvas=document.createElement('canvas');canvas.id='ppFestivalScene';canvas.setAttribute('aria-hidden','true');document.body.insertBefore(canvas,document.body.firstChild);ctx=canvas.getContext('2d');
 if(!ctx){canvas.remove();return;}
 fillCfg();applyCfg();resize();timer=requestAnimationFrame(frame);
 addEventListener('resize',resize);document.addEventListener('click',waterTap,{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(timer)cancelAnimationFrame(timer);timer=null;}else if(!timer)timer=requestAnimationFrame(frame)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
