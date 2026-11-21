
/* Demo only. Browser authorization is Firebase anonymous UID allowlisting, NOT LIFF identity verification. */
const legacyInit=init;
let demoUID='',demoOnline=false,demoKnown=false,demoBusy=false;
let demoLastSeen=0;

enter=function(){
 if(!me)return show('welcome');
 if(!me.pin)return openPin('set',enter);
 startBox();show('menu');
};
startForgot=function(){
 alert('รุ่นเดโม: ถ้าลืม PIN ให้เจ้าของ Firebase ลบเฉพาะ users/<LINE userId>/pin แล้วเปิด LIFF ใหม่ เพื่อตั้ง PIN อีกครั้ง');
};

function demoMsg(text,type=''){msg('box',text,type)}
init=async function(){
 try{
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  if(!firebase.auth().currentUser)await firebase.auth().signInAnonymously();
  demoUID=firebase.auth().currentUser.uid;
  let panel=$('demoAuthInfo');
  if(!panel){panel=document.createElement('div');panel.id='demoAuthInfo';panel.style='font-size:12px;overflow-wrap:anywhere;padding:8px;background:#10283e;color:#fff';$('card').prepend(panel)}
  panel.textContent='Firebase browser UID: '+demoUID;
  await db.ref('demoBox/state').get();
  await liff.init({liffId:'2012709163-l8Pbt2Ad'});
  if(!liff.isLoggedIn()){
   show('welcome');
   $('m-welcome').textContent='กรุณากดเข้าสู่ระบบ LINE';
   return;
  }
  const p=await liff.getProfile(),snap=await db.ref('users/'+p.userId).get();
  const u=snap.val()||{id:p.userId,avSrc:p.pictureUrl?'line':''};
  u.id=p.userId;u.name=p.displayName||'User';u.nick=u.nick||u.name;u.pic=p.pictureUrl||'';
  me=u;
  // Existing recovery questions are preserved. New demo users can set PIN immediately.
  signedIn(u);
 }catch(e){show('welcome');msg('welcome','Firebase: '+e.message+' | UID: '+(demoUID||'ยังไม่ได้สร้าง')+' — ถ้า Permission denied ให้นำ UID นี้ไปใส่ BROWSER_UID ใน Rules แล้ว Publish และเปิด LIFF ใหม่','error')}
};
notify=function(t,u){
 if(!me&&!u)return;
 db.ref('demoBox/notices').push({text:String(t).slice(0,800),createdAt:TS}).catch(e=>console.error(e));
};
startBox=function(){
 stopBox();bref=db.ref('demoBox/state');
 bref.on('value',s=>{
  const v=s.val()||{};demoKnown=!!v.lastSeen;demoLastSeen=v.lastSeen||0;demoOnline=Date.now()-demoLastSeen<20000;
  box={locked:v.locked!==false,hasParcel:!!v.parcelPending,updated:v.lastSeen||0,sensorActive:!!v.sensorActive};
  if($('box').classList.contains('active'))paintBox();
 },e=>demoMsg(e.message,'error'));
};
paintBox=function(){
 demoOnline=Date.now()-demoLastSeen<20000;
 $('pStat').textContent=box.hasParcel?'มีเหตุการณ์พัสดุรอยืนยันรับออก':'ไม่มีเหตุการณ์ค้าง (ไม่ใช่หลักฐานว่ากล่องว่าง)';
 $('bStat').textContent=!demoKnown?'ยังไม่มีข้อมูลจากบอร์ด':(box.locked?'สั่งตำแหน่งล็อก':'สั่งตำแหน่งปลดล็อก')+' / '+(demoOnline?'ออนไลน์':'ออฟไลน์');
 $('upd').textContent=box.updated?new Date(box.updated).toLocaleString('th-TH'):'-';
};
async function demoCommand(action){
 if(!me)throw Error('กรุณาเข้าสู่ระบบก่อน');
 if(demoBusy)throw Error('มีคำสั่งกำลังทำงาน');
 if(Date.now()-demoLastSeen>=20000)throw Error('บอร์ดออฟไลน์/ยังไม่มีข้อมูลจากบอร์ด');
 demoBusy=true;show('box');demoMsg('ส่งคำสั่งแล้ว กำลังรอบอร์ด...');
 try{
  const id=crypto.randomUUID(),now=Date.now();
  const r=await db.ref('demoBox/command').transaction(c=>c&&c.status==='pending'&&c.expiresAt>Date.now()?undefined:{id,action,status:'pending',createdAt:now,expiresAt:now+20000});
  if(!r.committed)throw Error('มีคำสั่งเดิมรออยู่ กรุณารอสักครู่');
  for(let n=0;n<25;n++){
   await new Promise(r=>setTimeout(r,1000));const c=(await db.ref('demoBox/command').get()).val();
   const result=(await db.ref('demoBox/result').get()).val();
   if(c?.id!==id)throw Error('คำสั่งถูกเปลี่ยนจากอีกหน้าต่าง');
   if(result?.id===id&&result.status==='done'){await db.ref('demoBox/command').transaction(v=>v?.id===id?{...v,status:'done'}:undefined);demoMsg('บอร์ดตอบรับทำคำสั่งแล้ว (ไม่มีเซนเซอร์ยืนยันกลอน)','success');return}
   if(c.status==='expired')throw Error('คำสั่งหมดอายุ');
  }
  throw Error('ไม่ได้รับผลยืนยัน โปรดตรวจบอร์ดก่อนสั่งซ้ำ');
 }finally{demoBusy=false}
}
unlockBox=async function(){try{await demoCommand('unlock')}catch(e){demoMsg(e.message,'error')}};
lockBox=async function(){try{await demoCommand('lock')}catch(e){demoMsg(e.message,'error')}};
checkParcel=async function(){try{await demoCommand('refresh')}catch(e){demoMsg(e.message,'error')}};
async function demoView(){
 if(!me)return;
 try{const s=await db.ref('demoBox/state').get(),v=s.val()||{};notify('ดูสถานะพัสดุ: '+(v.parcelPending?'มีเหตุการณ์พัสดุรอยืนยันรับออก':'ไม่มีเหตุการณ์ค้าง')+' | ข้อมูลล่าสุด '+(v.lastSeen?new Date(v.lastSeen).toLocaleString('th-TH'):'ยังไม่มีข้อมูล'));demoMsg('เข้าคิวแจ้งสถานะแล้ว ต้องให้บอร์ดออนไลน์เพื่อส่ง LINE','')}
 catch(e){demoMsg(e.message,'error')}
}
async function demoCollected(){if(!confirm('ยืนยันว่ารับพัสดุออกแล้ว?'))return;try{await demoCommand('collected')}catch(e){demoMsg(e.message,'error')}}
document.addEventListener('DOMContentLoaded',()=>{
 $('welcome').querySelectorAll('button').forEach(b=>b.remove());
 const loginButton=document.createElement('button');loginButton.className='primary full';loginButton.textContent='เข้าสู่ระบบ LINE';loginButton.onclick=()=>{if(liff.isLoggedIn())init();else liff.login({redirectUri:location.origin+location.pathname})};$('welcome').insertBefore(loginButton,$('m-welcome'));
 const a=document.createElement('button');a.className='full';a.textContent='ดูสถานะล่าสุดและแจ้ง LINE';a.onclick=demoView;
 const b=document.createElement('button');b.className='full';b.textContent='ยืนยันรับพัสดุออกแล้ว';b.onclick=demoCollected;
 $('box').insertBefore(a,$('m-box'));$('box').insertBefore(b,$('m-box'));
 const help=document.createElement('p');help.textContent='รุ่นเดโม: PIN ตรวจบนเว็บ สิทธิ์ Firebase ผูก UID เบราว์เซอร์ ไม่ใช่ระบบล็อกที่ใช้ป้องกันทรัพย์สินจริง';help.style.fontSize='11px';$('t-help').appendChild(help);
 setInterval(()=>{if($('box').classList.contains('active'))paintBox()},3000);
});
