
/* Requires Free Demo + v3 + v4 + v5. Load last. */
(function(){
'use strict';
const id=x=>document.getElementById(x);
const oldApply=applyCfg,oldFill=fillCfg;
const defaultClickSrc=clk.getAttribute('src')||'sounds/click.mp3';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let canvas,ctx,w=0,h=0,frameId=null,lastFrame=0;
const dots=Array.from({length:32},(_,i)=>({x:((i*89+13)%997)/997,y:((i*157+41)%991)/991,p:i*.67,r:1+(i%4)*.45}));
function theme(c){return c?.themePreset||(c?.xmasTheme?'christmas':'normal')}
const css=document.createElement('style');css.textContent=`
#ppExtraScene{position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%}
body.pp-cny{background:linear-gradient(145deg,#4a0d16,#831d24 65%,#350c14)!important}
body.pp-cny #ppFestivalScene{display:none!important}
body.pp-cny #bg,body.pp-normal-fireflies #bg{visibility:hidden!important}
body.pp-cny #ppStage .card{background:#fff7e6;border:1px solid #cfad58;box-shadow:0 15px 45px rgba(31,0,7,.28)}
body.pp-cny .logo{background:linear-gradient(90deg,#b9252d,#946814);-webkit-background-clip:text;background-clip:text}
body.pp-cny .topbar{border-bottom:1px solid #dec796}
body.pp-cny .primary{background:linear-gradient(100deg,#bd2d35,#a56c16);color:white}
body.pp-cny .success{background:linear-gradient(90deg,#a66c15,#845413);color:white}
body.pp-cny .message.success{background:#f8e9c7;color:#765019}
body.pp-cny .message.error{background:#f8dedd;color:#a52a35}
body.pp-cny .rail button.on{border-color:#b72c35!important;box-shadow:0 0 0 1px #b72c35}
body.pp-cny .pp-spark{color:#d5a62d}
body.pp-cny.pp-motion .screen.pp-enter{animation:pp-cny-enter 230ms ease-out!important}
body.pp-cny.pp-motion button:active{box-shadow:0 0 0 3px rgba(202,152,35,.28)}
.pp-cny-ring{position:fixed;pointer-events:none;z-index:9998;width:18px;height:18px;border:2px solid #d8aa3f;border-radius:50%;animation:pp-cny-ring 650ms ease-out forwards;box-sizing:border-box}
@keyframes pp-cny-ring{from{opacity:.85;transform:translate(-50%,-50%) scale(.4) rotate(0deg)}to{opacity:0;transform:translate(-50%,-50%) scale(2.8) rotate(60deg)}}
@keyframes pp-cny-enter{from{opacity:0;transform:translateY(6px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
#ppBackgroundHint{font-size:11px;line-height:1.4;text-align:left;color:var(--muted);margin:5px 0 0}
@media(prefers-reduced-motion:reduce){.pp-cny-ring{display:none!important}body.pp-cny .screen.pp-enter{animation:none!important}}
`;
document.head.appendChild(css);
function updateControl(){
 const select=id('cBg');if(!select)return;
 const field=select.closest('.field');if(field)field.hidden=theme(dc)!=='normal';
 // v4/v5 may queue their own control sync; keep this consistent with the draft.
 if(id('ppTheme'))id('ppTheme').value=theme(dc);
}
function laterControl(){Promise.resolve().then(updateControl)}
fillCfg=function(){oldFill();laterControl()};
function applyTheme(){
 const t=theme(cfg),cny=t==='cny',custom=t==='normal'&&cfg.bgStyle==='fireflies';
 document.body.classList.toggle('pp-cny',cny);document.body.classList.toggle('pp-normal-fireflies',custom);
 if(cny){const p={bg:'#fff2dc',card:'#fff7e6',text:'#5a2525',muted:'#876453',line:'#e1c999'};for(const [k,v]of Object.entries(p))document.documentElement.style.setProperty('--'+k,v);}
 const src=cny?'sounds/cny-click.wav':defaultClickSrc;
 if(clk.getAttribute('src')!==src){clk.pause();clk.src=src;}
 if(canvas)canvas.hidden=!(cny||custom);
 laterControl();draw(performance.now());
}
applyCfg=function(){oldApply();applyTheme()};
function resize(){if(!ctx)return;w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now())}
function lantern(x,y,s,t){
 ctx.save();ctx.translate(x+Math.sin(t*.35+x)*3,y);ctx.scale(s,s);
 ctx.strokeStyle='#d6b359';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-100);ctx.lineTo(0,-30);ctx.stroke();
 ctx.fillStyle='#b82e33';ctx.beginPath();ctx.ellipse(0,0,23,30,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#e6bd61';ctx.lineWidth=1;
 for(const rx of [9,17,23]){ctx.beginPath();ctx.ellipse(0,0,rx,29,0,0,Math.PI*2);ctx.stroke();}
 ctx.fillStyle='#dcb25c';ctx.fillRect(-12,-31,24,4);ctx.fillRect(-12,27,24,4);
 ctx.beginPath();ctx.moveTo(0,31);ctx.lineTo(0,43);ctx.stroke();
 for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*1.4,42);ctx.lineTo(i*2,53);ctx.stroke();}
 ctx.restore();
}
function cloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle='rgba(230,193,109,.28)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-55,10);ctx.bezierCurveTo(-32,10,-37,-9,-16,-5);ctx.bezierCurveTo(-9,-30,24,-29,28,-4);ctx.bezierCurveTo(44,-10,42,12,63,12);ctx.stroke();ctx.restore()}
function draw(now){
 if(!ctx)return;ctx.clearRect(0,0,w,h);
 const th=theme(cfg),custom=th==='normal'&&cfg.bgStyle==='fireflies';if(th!=='cny'&&!custom)return;
 const t=cfg.motionFx!==false&&!reduce.matches&&!document.hidden?now/1000:0;
 if(th==='cny'){
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#4a0d16');g.addColorStop(.6,'#7b1f28');g.addColorStop(1,'#350c14');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  lantern(w*.12,62,.8,t);lantern(w*.88,82,1,t);lantern(w*.5,29,.5,t);
  cloud(w*.15,h*.86,1.3);cloud(w*.83,h*.76,1);cloud(w*.6,h*.95,1.8);
  dots.slice(0,22).forEach(p=>{const x=p.x*w+Math.sin(t*.25+p.p)*7,y=(p.y*h-t*(1+p.r)+h*100)%h;ctx.globalAlpha=.18+.28*Math.abs(Math.sin(t*.5+p.p));ctx.fillStyle='#f1d38b';ctx.beginPath();ctx.arc(x,y,p.r*.6,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;
 }else{
  const c=cfg.color||'#38bdf8';const m=/^#([0-9a-f]{6})$/i.exec(c),n=m?parseInt(m[1],16):0x38bdf8;
  const rgb=((n>>16)&255)+','+((n>>8)&255)+','+(n&255);
  dots.forEach(p=>{const x=p.x*w+Math.sin(t*.2+p.p)*15,y=p.y*h+Math.cos(t*.16+p.p)*12,r=7+p.r*4;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+rgb+',.32)');g.addColorStop(1,'rgba('+rgb+',0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)});
 }
}
function loop(now){if(document.hidden){frameId=null;return;}if(now-lastFrame>40){if(canvas&&!canvas.hidden)draw(now);lastFrame=now;}frameId=requestAnimationFrame(loop)}
function ring(e){if(theme(cfg)!=='cny'||cfg.motionFx===false||reduce.matches)return;const b=e.target.closest('button');if(!b||b.disabled)return;const r=b.getBoundingClientRect(),p=document.createElement('span');p.className='pp-cny-ring';p.style.left=(e.clientX||r.left+r.width/2)+'px';p.style.top=(e.clientY||r.top+r.height/2)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),700)}
function start(){
 const select=id('ppTheme'),bg=id('cBg');if(!select||!bg){console.error('v6 requires v4 and v5 before this file');return;}
 if(!select.querySelector('[value="cny"]')){const op=document.createElement('option');op.value='cny';op.textContent='ตรุษจีนรับความเฮง';select.appendChild(op)}
 const oldChange=select.onchange;
 select.onchange=e=>{if(e.target.value==='cny'){dc.themePreset='cny';dc.xmasTheme=false;dc.color='#bd2d35';dc.bgm='cny';id('cColor').value=dc.color;id('cBgm').value='cny';dirty()}else oldChange.call(select,e);updateControl()};
 if(!bg.querySelector('[value="fireflies"]')){const op=document.createElement('option');op.value='fireflies';op.textContent='ละอองแสง';op.dataset.en='Fireflies';bg.appendChild(op)}
 const field=bg.closest('.field');if(field&&!id('ppBackgroundHint')){const p=document.createElement('p');p.id='ppBackgroundHint';p.textContent='เลือกได้ 5 แบบในสไตล์เดิม ส่วนธีมเทศกาลจะมีฉากของตัวเอง';field.appendChild(p)}
 if(!B.cny){B.cny=new Audio('sounds/cny-original.wav');B.cny.loop=true;}
 if(!id('cBgm').querySelector('[value="cny"]')){const op=document.createElement('option');op.value='cny';op.textContent='ตรุษจีน — โคมทองรับความสุข';id('cBgm').appendChild(op)}
 canvas=document.createElement('canvas');canvas.id='ppExtraScene';canvas.setAttribute('aria-hidden','true');document.body.insertBefore(canvas,document.body.firstChild);ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
 fillCfg();applyCfg();resize();frameId=requestAnimationFrame(loop);addEventListener('resize',resize);document.addEventListener('click',ring,{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frameId)cancelAnimationFrame(frameId);frameId=null;}else if(!frameId)frameId=requestAnimationFrame(loop)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
