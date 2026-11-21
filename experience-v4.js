
/* Load AFTER free-demo.js AND ui-update.js (v3). Keep compat-liff.js before SDKs. */
(function(){
'use strict';
const byId=id=>document.getElementById(id);
let savedSnapshot=null,hasDraft=false,layoutPending=false;
const copy=v=>JSON.parse(JSON.stringify(v));
const defaults=c=>({xmasTheme:false,starFx:true,motionFx:true,...c});
const previousApply=applyCfg,previousShow=show,previousSave=saveCfg;
const css=document.createElement('style');
css.textContent=`
body{padding:0!important;overflow-x:hidden!important;display:block!important;min-height:100vh;min-height:100dvh}
#ppStage{position:relative;margin-left:auto;margin-right:auto;box-sizing:content-box}
#ppStage>.card{position:absolute!important;top:0!important;left:0!important;margin:0!important;box-sizing:border-box!important;transform-origin:top left!important;zoom:1!important;font-size:15px!important;padding:18px!important;max-width:none!important}
#ppStage .card button,#ppStage .card input,#ppStage .card select{font-family:var(--font)!important}
#ppStage .card input,#ppStage .card select{font-size:15px!important}
#ppStage .card button{font-size:17px!important}
#ppStage .card .rail button{font-size:20px!important}
#ppStage .card .row button{font-size:14px!important}
#ppStage .card .link{font-size:14px!important}
#ppStage .card h1{font-size:22px!important}#ppStage .card h2{font-size:19px!important}#ppStage .card h3{font-size:16px!important}
#ppStage .card .num input[type=number]{width:64px;flex-basis:64px}
#ppStage .card .iconbtn{font-size:18px!important}
body.pp-xmas{background:radial-gradient(circle at 15% 20%,rgba(201,164,75,.18),transparent 35%),radial-gradient(circle at 85% 80%,rgba(45,104,70,.13),transparent 35%),#fff8ed!important}
body.pp-xmas #ppStage .card{border:1px solid #ddc99b;box-shadow:0 15px 45px rgba(63,76,47,.14)}
body.pp-xmas .topbar{padding-bottom:12px;border-bottom:1px dashed #d3b86e}
body.pp-xmas .topbar::after{content:'✦';color:#bb9344;margin-left:5px}
body.pp-xmas .logo{background:linear-gradient(90deg,#aa3540,#2f704f);-webkit-background-clip:text;background-clip:text}
body.pp-xmas .primary{background:linear-gradient(100deg,var(--accent),#2f704f)}
body.pp-xmas .success{background:linear-gradient(90deg,#35714c,#23533b)}
body.pp-xmas .message.success{background:#e7f1e5;color:#275438}
body.pp-xmas .message.error{background:#f9e5e3;color:#9e3542}
body.pp-xmas .pane{box-shadow:inset 0 0 0 1px rgba(191,161,78,.15)}
.pp-spark{position:fixed;z-index:9999;pointer-events:none;color:#c69b39;font-size:13px;line-height:1;animation:pp-spark-out 650ms ease-out forwards}
@keyframes pp-spark-out{from{transform:translate(0,0) scale(.6);opacity:1}to{transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(.1);opacity:0}}
@keyframes pp-screen-enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
body.pp-motion .screen.pp-enter{animation:pp-screen-enter 190ms ease-out}
body.pp-motion button{transition:transform 100ms,filter 150ms,box-shadow 150ms}
body.pp-motion button:active{transform:scale(.96)}
#ppDraftNote{font-size:12px;line-height:1.5;margin:0 0 10px;color:var(--muted)}
@media(prefers-reduced-motion:reduce){.pp-spark{display:none!important}.screen.pp-enter{animation:none!important}button{transition:none!important}}
`;
document.head.appendChild(css);
function stage(){
 let st=byId('ppStage');const card=byId('card');if(!st&&card){st=document.createElement('div');st.id='ppStage';card.parentNode.insertBefore(st,card);st.appendChild(card)}return st;
}
function setStyle(el,key,value,priority=''){if(el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value,priority)}
function scheduleLayout(){if(layoutPending)return;layoutPending=true;requestAnimationFrame(()=>{layoutPending=false;layout()})}
function layout(){
 const st=stage(),card=byId('card');if(!st||!card)return;
 const v=Math.max(0,Math.min(100,Number(cfg.ui??50)));
 const scale=.65+.007*v; // 0=65%, 50=100%, 100=135%.
 const viewport=window.innerWidth||document.documentElement.clientWidth;
 const baseWidth=Math.min(420,Math.max(180,(viewport-28)/scale));
 setStyle(card,'width',baseWidth.toFixed(2)+'px','important');
 setStyle(card,'transform','scale('+scale.toFixed(3)+')','important');
 const h=card.offsetHeight*scale,w=baseWidth*scale;
 setStyle(st,'width',w.toFixed(2)+'px');setStyle(st,'height',Math.ceil(h)+'px');
 const vh=window.visualViewport?.height||window.innerHeight;
 const margin=Math.max(24,(vh-h)/2);
 setStyle(st,'margin-top',Math.round(margin)+'px');setStyle(st,'margin-bottom','32px');
 document.documentElement.style.setProperty('--ui','1');
}
function palette(){
 const christmas=!!cfg.xmasTheme;
 document.body.classList.toggle('pp-xmas',christmas);
 document.body.classList.toggle('pp-motion',cfg.motionFx!==false);
 const values=christmas?{bg:'#fff8ed',card:'#fffdf7',text:'#313d32',muted:'#6b7467',line:'#dfd5bd'}:{bg:'#0f172a',card:'#1e293b',text:'#e2e8f0',muted:'#94a3b8',line:'#334155'};
 for(const [k,v]of Object.entries(values))document.documentElement.style.setProperty('--'+k,v);
}
applyCfg=function(){cfg=defaults(cfg);previousApply();palette();document.documentElement.style.setProperty('--ui','1');scheduleLayout()};
function syncExtraControls(){if(byId('ppTheme'))byId('ppTheme').value=dc.xmasTheme?'christmas':'normal';if(byId('ppStars'))byId('ppStars').checked=dc.starFx!==false;if(byId('ppMotion'))byId('ppMotion').checked=dc.motionFx!==false;}
function restoreDraft(){
 if(hasDraft&&savedSnapshot){cfg=copy(savedSnapshot);dc=copy(savedSnapshot);applyCfg();fillCfg();syncExtraControls();}
 hasDraft=false;if(byId('cbar'))byId('cbar').style.display='none';
}
function beginDraft(){savedSnapshot=copy(defaults(cfg));dc=copy(savedSnapshot);hasDraft=false;fillCfg();syncExtraControls();byId('cbar').style.display='none'}
dirty=function(){
 if(!savedSnapshot)savedSnapshot=copy(defaults(cfg));
 hasDraft=true;cfg=defaults(copy(dc));applyCfg();
 byId('cbar').style.display='flex';msg('settings','กำลังดูตัวอย่าง ยังไม่ได้บันทึก กดยืนยันเมื่อถูกใจได้เลย','');scheduleLayout();
};
cfgOk=function(){
 cfg=defaults(copy(dc));savedSnapshot=copy(cfg);hasDraft=false;applyCfg();previousSave();
 byId('cbar').style.display='none';msg('settings','บันทึกแล้ว ครั้งหน้าจะเปิดมาพร้อมสไตล์นี้','success');scheduleLayout();
};
cfgNo=function(){restoreDraft();dc=copy(cfg);fillCfg();syncExtraControls();msg('settings','กลับไปใช้ค่าที่บันทึกไว้แล้ว','');scheduleLayout()};
leaveSet=function(){restoreDraft();show(me?'menu':'welcome')};
show=function(id){
 const leaving=byId('settings')?.classList.contains('active')&&id!=='settings';
 if(leaving)restoreDraft();
 const entering=id==='settings'&&!byId('settings')?.classList.contains('active');
 if(entering)beginDraft();
 previousShow(id);
 const current=byId(id);
 if(current&&cfg.motionFx!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches){current.classList.remove('pp-enter');void current.offsetWidth;current.classList.add('pp-enter');}
 scheduleLayout();
};
// Never persist preview even if an older component calls saveCfg while settings is open.
saveCfg=function(){if(hasDraft)return;previousSave()};
function addControls(){
 const look=byId('t-look');
 if(look&&!byId('ppTheme')){
  const box=document.createElement('div');box.className='field';box.innerHTML='<label>บรรยากาศ</label><select id="ppTheme"><option value="normal">สไตล์เดิม</option><option value="christmas">คริสต์มาสอบอุ่น</option></select>';
  look.insertBefore(box,look.firstChild);
  byId('ppTheme').onchange=e=>{dc.xmasTheme=e.target.value==='christmas';if(dc.xmasTheme){dc.color='#b43b49';byId('cColor').value=dc.color;}dirty()};
  const extras=document.createElement('div');extras.innerHTML='<label style="display:flex;align-items:center;gap:8px;margin:10px 0"><input id="ppStars" type="checkbox" style="width:20px;height:20px">ดาวเล็ก ๆ ตอนแตะปุ่ม</label><label style="display:flex;align-items:center;gap:8px;margin:10px 0"><input id="ppMotion" type="checkbox" style="width:20px;height:20px">การเคลื่อนไหวตอนเปลี่ยนหน้า</label>';
  look.appendChild(extras);
  byId('ppStars').onchange=e=>{dc.starFx=e.target.checked;dirty()};byId('ppMotion').onchange=e=>{dc.motionFx=e.target.checked;dirty()};
 }
 if(!B.xmas){B.xmas=new Audio('sounds/christmas-original.wav');B.xmas.loop=true;}
 if(!byId('cBgm').querySelector('option[value="xmas"]')){const op=document.createElement('option');op.value='xmas';op.textContent='คริสต์มาส — Little Parcel Waltz';byId('cBgm').appendChild(op);}
 if(!byId('ppDraftNote')){const p=document.createElement('p');p.id='ppDraftNote';p.textContent='ลองปรับได้เลย ภาพและเสียงจะเปลี่ยนเป็นตัวอย่าง กดยืนยันเพื่อเก็บไว้';byId('settings').insertBefore(p,byId('settings').firstChild);}
 fillCfg();syncExtraControls();
}
function stars(e){
 if(cfg.starFx===false||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const b=e.target.closest('button');if(!b||b.disabled)return;
 const r=b.getBoundingClientRect();const x=e.clientX||r.left+r.width/2,y=e.clientY||r.top+r.height/2;
 for(let i=0;i<5;i++){const s=document.createElement('span');s.className='pp-spark';s.textContent=i%2?'✦':'★';s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--sx',(-30+Math.random()*60)+'px');s.style.setProperty('--sy',(-18-Math.random()*48)+'px');s.style.setProperty('--sr',(-60+Math.random()*120)+'deg');document.body.appendChild(s);setTimeout(()=>s.remove(),700)}
}
function start(){
 cfg=defaults(cfg);dc=defaults(dc);stage();addControls();applyCfg();
 window.addEventListener('resize',scheduleLayout);window.visualViewport?.addEventListener('resize',scheduleLayout);
 if(window.ResizeObserver)new ResizeObserver(scheduleLayout).observe(byId('card'));
 else new MutationObserver(scheduleLayout).observe(byId('card'),{subtree:true,childList:true,characterData:true});
 document.addEventListener('click',stars,{capture:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
