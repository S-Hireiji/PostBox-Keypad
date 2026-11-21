
/* For Postbox Free Demo v1/v2. Load AFTER free-demo.js, not connected.js. */
(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
  html{min-height:100%;overflow-x:hidden}
  body{display:block!important;min-height:100vh;min-height:100dvh;overflow-x:hidden;overflow-y:auto!important;align-items:initial!important;justify-content:initial!important;padding: max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(20px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))!important}
  .card{zoom:1!important;transform:none!important;width:100%!important;max-width:460px;min-width:0;margin:12px auto;overflow:visible!important;padding:calc(16px * var(--ui,1));font-size:calc(15px * var(--ui,1))}
  .card button,.card input,.card select{font-family:var(--font)!important;font-size:1em;min-width:0}
  .card h1{font-size:1.45em}.card h2{font-size:1.25em}.card h3{font-size:1.1em}
  .gset,.pane,.tab,.box,.greet{min-width:0;box-sizing:border-box;overflow-wrap:anywhere}
  .pane{border:1px solid var(--accent)!important;flex:1;overflow:visible!important}
  .rail{width:46px;flex:0 0 46px}.gset{width:100%;gap:8px}.rail button{border:2px solid var(--line)}
  .rail button.on{background:var(--card)!important;border-color:var(--accent)!important;box-shadow:0 0 0 1px var(--accent)}
  .weather{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cwin{max-width:calc(100vw - 24px);height: min(460px,65vh);height:min(460px,65dvh)}
  .num input[type=number]{width:64px;flex:0 0 64px}.num input[type=range]{min-width:0;flex:1}
  #ppWait{margin:10px 0;padding:12px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--bg);line-height:1.6}
  #ppWait progress{width:100%;height:10px;accent-color:var(--accent)}
  #ppWait button{height:auto;min-height:40px;font-size:.9em}
  button:disabled{opacity:.55;cursor:wait}
  @media(max-width:350px){.card{padding:12px}.pane{padding:8px}.gset{gap:5px}.rail{width:40px;flex-basis:40px}.rail button{width:40px;height:40px}}
  `;
  document.head.appendChild(style);
  const say = (text,type='') => { if(typeof msg==='function') msg('box',text,type); };
  const storageKey = id => 'pp_settings_v3_'+id;
  function localRead(id){try{return JSON.parse(localStorage.getItem(storageKey(id))||'null')}catch(e){return null}}
  let saveTimer=null, pendingSave=null;
  async function flush(){
    if(!pendingSave||!me)return;
    const p=pendingSave;
    try{
      await db.ref('users/'+p.id).update({cfg:p.cfg,cfgSavedAt:p.at});
      if(pendingSave===p)pendingSave=null;
    }catch(e){if($('settings')?.classList.contains('active'))msg('settings','จำค่าไว้ในเครื่องแล้ว กำลังรอเชื่อมต่อเพื่อบันทึกให้ครบ','');console.error('[settings sync]',e)}
  }
  saveCfg=function(){
    const at=Date.now(), copy=JSON.parse(JSON.stringify(cfg));
    try{localStorage.pp_cfg=JSON.stringify(copy);if(me)localStorage.setItem(storageKey(me.id),JSON.stringify({cfg:copy,at}));}catch(e){msg('settings','พื้นที่เก็บข้อมูลในเครื่องเต็ม กรุณาลดขนาดรูปโปรไฟล์','error')}
    if(me){me.cfg=copy;me.cfgSavedAt=at;pendingSave={id:me.id,cfg:copy,at};clearTimeout(saveTimer);saveTimer=setTimeout(flush,700);}
  };
  const previousSignedIn=signedIn;
  signedIn=function(u){
    const local=localRead(u.id),remoteAt=Number(u.cfgSavedAt||0);
    if(local?.cfg&&local.at>=remoteAt){u.cfg=local.cfg;u.cfgSavedAt=local.at;}
    else if(u.cfg){try{localStorage.setItem(storageKey(u.id),JSON.stringify({cfg:u.cfg,at:remoteAt}));localStorage.pp_cfg=JSON.stringify(u.cfg)}catch(e){console.error(e)}}
    previousSignedIn(u);
    if(local?.cfg&&local.at>remoteAt){pendingSave={id:u.id,cfg:local.cfg,at:local.at};flush();}
  };
  // This edition autosaves settings; no extra Confirm click is required.
  dirty=function(){cfg={...dc};applyCfg();saveCfg();$('cbar').style.display='none';msg('settings','จำค่าที่เลือกให้แล้ว','success')};
  const oldApply=applyCfg;
  applyCfg=function(){oldApply();const color=cfg.color||'#38bdf8';if(!window.CSS||!CSS.supports||!CSS.supports('color','color-mix(in srgb, red, blue)'))document.documentElement.style.setProperty('--accent2',color)};
  window.addEventListener('online',flush);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
  const pretty = [
    ['บอร์ดทำคำสั่งแล้ว (ยังไม่มีเซนเซอร์ยืนยันกลอนจริง)','จัดการคำขอให้แล้วนะ กรุณาตรวจว่าปิดหรือเปิดกล่องได้ตามต้องการ'],
    ['บอร์ดทำคำสั่งแล้ว (ยังไม่มีเซนเซอร์ยืนยันกลอน)','จัดการคำขอให้แล้วนะ กรุณาตรวจกล่องอีกครั้ง'],
    ['สั่งตำแหน่งล็อก 180°','โหมดล็อกตามคำขอ'],['สั่งตำแหน่งปลดล็อก 90°','โหมดเปิดตามคำขอ'],
    ['ไม่มีเหตุการณ์พัสดุค้าง (ไม่ใช่หลักฐานว่ากล่องว่าง)','ยังไม่มีพัสดุรอรับในรายการ'],
    ['ไม่มีเหตุการณ์พัสดุค้าง','ยังไม่มีพัสดุรอรับในรายการ'],['ไม่มีเหตุการณ์ค้าง','ยังไม่มีพัสดุรอรับในรายการ'],
    ['มีเหตุการณ์พัสดุรอยืนยันรับออก','มีพัสดุรอคุณมารับ'],['ยังไม่มีข้อมูลบอร์ด','กำลังรอน้องพิงมาทักทาย'],
    ['ยังไม่มีข้อมูลจากบอร์ด','กำลังรอน้องพิงมาทักทาย'],
    ['รีเฟรชข้อมูลจากบอร์ด (แจ้ง LINE)','อัปเดตข่าวจากน้องพิง'],
    ['บอร์ดออฟไลน์/ยังไม่มีข้อมูล','น้องพิงยังไม่พร้อม ลองเช็กการเชื่อมต่อก่อนนะ'],
    ['เข้าคิว LINE แล้ว ต้องให้บอร์ดออนไลน์เพื่อส่ง','ฝากข้อความไว้แล้ว น้องพิงจะส่งให้เมื่อพร้อม'],
    ['Firebase browser UID:','รหัสเครื่องสาธิต:'],['BROWSER_UID:','รหัสเครื่องสาธิต:']
  ];
  function prettify(node){
    if(node.nodeType!==Node.TEXT_NODE||!node.nodeValue?.trim())return;
    const p=node.parentElement;if(!p||p.closest('script,style,pre,code,#cmsgs,#cin'))return;
    let t=node.nodeValue;for(const [a,b] of pretty)t=t.split(a).join(b);
    if(t!==node.nodeValue)node.nodeValue=t;
  }
  function scan(el){if(el.nodeType===Node.TEXT_NODE)return prettify(el);const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())prettify(n)}
  const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')prettify(r.target);else for(const n of r.addedNodes)scan(n)}});
  let active=null;
  function ensureWait(){let w=$('ppWait');if(!w){w=document.createElement('div');w.id='ppWait';w.hidden=true;w.innerHTML='<div id="ppWaitText"></div><progress id="ppProgress" max="20" value="0"></progress><button id="ppCancelWait" type="button">เลิกรอคำขอนี้</button><small>เลิกรอไม่ได้หยุดการขยับที่เริ่มไปแล้ว กรุณาตรวจกล่องก่อนสั่งใหม่</small>';$('box').appendChild(w);}return w;}
  function enableButtons(disabled){document.querySelectorAll('#box button,.menu button').forEach(b=>{if(b.id!=='ppCancelWait'){if(disabled){b.dataset.ppOldDisabled=b.disabled?'1':'0';b.disabled=true;}else if('ppOldDisabled'in b.dataset){b.disabled=b.dataset.ppOldDisabled==='1';delete b.dataset.ppOldDisabled;}}})}
  function setStatus(t){$('ppWaitText').textContent=t;}

  function showPrevious(c){
    const w=ensureWait();w.hidden=false;enableButtons(true);
    let done=false,interval=null;const resultRef=db.ref('demoBox/result');
    const finish=()=>{if(done)return;done=true;clearInterval(interval);resultRef.off('value',onResult);enableButtons(false);w.hidden=true;};
    const onResult=s=>{if(s.val()?.id===c.id&&s.val()?.status==='done'){finish();say('คำขอก่อนหน้าจบแล้ว กดคำขอใหม่ได้เลย','success')}};
    const update=()=>{const secs=Math.max(0,Math.ceil((c.expiresAt-Date.now())/1000));setStatus('คำขอก่อนหน้ายังอยู่ระหว่างรอ อีกไม่เกิน '+secs+' วินาทีก่อนหมดอายุ');$('ppProgress').value=Math.max(0,20-secs);if(!secs){finish();say('คำขอเดิมหมดอายุแล้ว ตรวจกล่องก่อนสั่งอีกครั้ง','')}};
    $('ppCancelWait').onclick=async()=>{if(!confirm('ล้างรายการรอนี้หรือไม่? การขยับที่เริ่มไปแล้วจะไม่หยุด กรุณาตรวจกล่องก่อนสั่งใหม่'))return;try{await db.ref('demoBox/command').transaction(v=>v?.id===c.id&&v.status==='pending'?{...v,status:'cancel_requested'}:undefined);finish();say('ล้างรายการรอแล้ว กรุณาตรวจกล่องก่อนสั่งใหม่','')}catch(e){say(e.message,'error')}};
    resultRef.on('value',onResult);interval=setInterval(update,250);update();
  }
  demoCommand=async function(action){
    if(!me)throw Error('เข้าสู่ระบบก่อนนะ');
    if(active)throw Error('น้องพิงกำลังจัดการคำขอก่อนหน้า ดูเวลารอด้านล่างได้เลย');
    const s=(await db.ref('demoBox/state').get()).val()||{};
    if(Date.now()-(s.lastSeen||0)>=20000)throw Error('น้องพิงยังไม่ออนไลน์ ลองเช็กการเชื่อมต่อก่อนนะ');
    if(active)throw Error('มีคำขออื่นกำลังเริ่มทำงาน');
    const id=crypto.randomUUID(),start=Date.now(),expires=start+20000;
    const ctx={id,cancelled:false};active=ctx;demoBusy=true;
    const w=ensureWait();w.hidden=false;enableButtons(true);
    show('box');say('รับคำขอแล้ว กำลังติดต่อให้นะ');
    let stop=null,timer=null,timeout=null,rejectWait=null;
    function cancelWait(){ctx.cancelled=true;if(rejectWait)rejectWait(Error('เลิกรอแล้ว คำขอที่เริ่มทำไปอาจยังทำงานอยู่ กรุณาตรวจกล่องก่อนสั่งใหม่'));}
    $('ppCancelWait').onclick=cancelWait;
    try{
      const r=await db.ref('demoBox/command').transaction(c=>{
        if(c?.status==='pending'&&Number(c.expiresAt)>Date.now())return;
        return {id,action,status:'pending',createdAt:start,expiresAt:expires};
      });
      if(!r.committed){const c=(await db.ref('demoBox/command').get()).val();ctx.previous=c;const seconds=Math.max(0,Math.ceil(((c?.expiresAt||Date.now())-Date.now())/1000));throw Error('คำขอก่อนหน้ายังมีอายุอีกประมาณ '+seconds+' วินาที ลองอีกครั้งหลังจากนั้น');}
      if(ctx.cancelled)throw Error('เลิกรอแล้ว กรุณาตรวจกล่องก่อนสั่งใหม่');
      timer=setInterval(()=>{const remaining=Math.max(0,Math.ceil((expires-Date.now())/1000));$('ppProgress').value=Math.min(20,(Date.now()-start)/1000);setStatus(remaining?'กำลังจัดการให้ รอผลตอบกลับได้อีก '+remaining+' วินาที':'ครบเวลารับคำขอแล้ว กำลังตรวจผลอีกไม่เกิน 5 วินาที');},200);
      await new Promise((resolve,reject)=>{
        rejectWait=reject;const ref=db.ref('demoBox/result');const fn=s=>{const v=s.val();if(v?.id===id&&v.status==='done')resolve()};stop=()=>ref.off('value',fn);ref.on('value',fn,reject);timeout=setTimeout(()=>reject(Error('ยังยืนยันผลไม่ได้ กรุณาตรวจกล่องก่อนลองใหม่')),Math.max(0,expires+5000-Date.now()));
      });
      await db.ref('demoBox/command').transaction(c=>c?.id===id?{...c,status:'done'}:undefined);
      say(action==='unlock'?'น้องพิงจัดการคำขอเปิดให้แล้วนะ':action==='lock'?'น้องพิงจัดการคำขอล็อกให้แล้วนะ':'อัปเดตให้แล้วนะ','success');
    }catch(e){
      // This expires only this ID. It cannot undo a command already fetched by the device.
      await db.ref('demoBox/command').transaction(c=>c?.id===id&&c.status==='pending'?{...c,status:ctx.cancelled?'cancel_requested':'expired'}:undefined).catch(console.error);
      throw e;
    }finally{if(stop)stop();clearInterval(timer);clearTimeout(timeout);if(active===ctx)active=null;demoBusy=false;enableButtons(false);w.hidden=true;if(ctx.previous?.expiresAt>Date.now())showPrevious(ctx.previous);}
  };
  function start(){scan(document.body);observer.observe(document.body,{childList:true,subtree:true,characterData:true});applyCfg();ensureWait();
    const note=document.createElement('p');note.style.fontSize='11px';note.textContent='สถานะแสดงตามคำขอที่ได้รับ กรุณาตรวจการเปิด–ปิดจริงด้วยนะ';$('box').appendChild(note);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
