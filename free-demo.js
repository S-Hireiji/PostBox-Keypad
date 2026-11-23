
const PP_MESSAGES={"online": ["🟢 Postbox Ping ออนไลน์แล้ว! พร้อมเฝ้ารอพัสดุให้คุณ 📦", "📮 กล่องพิงตื่นแล้ว! เชื่อมต่อสำเร็จ พร้อมทำงาน 🟢", "✨ ระบบพร้อมแล้ว! ฝากหน้าที่ต้อนรับพัสดุไว้กับพิงได้เลย 📦", "🟢 เช็กอินจากกล่องพิง! พร้อมรับคำสั่งแล้วนะ 🎯", "📦 พิงประจำการแล้ว! ออนไลน์และพร้อมทำงานครับ 🟢"], "unlock": ["🔓 ปลดล็อกแล้ว! แวะรับพัสดุได้เลย 📦", "📮 เปิดทางให้แล้วนะ! บอร์ดทำคำสั่งปลดล็อกแล้ว 🔓", "✨ ปิ๊บ ปิ๊บ! สั่งปลดล็อกเรียบร้อยแล้ว 🔓", "🔓 กล่องพิงรับคำสั่งแล้ว พร้อมให้คุณเปิดกล่อง 📦", "🎉 ปลดล็อกตามคำสั่งแล้ว อย่าลืมล็อกหลังรับของนะ 🔒"], "lock": ["🔒 สั่งล็อกกล่องแล้ว! ขอบคุณที่แวะมาหาพิง 📮", "📦 รับคำสั่งล็อกเรียบร้อยแล้วนะ 🔒", "✨ ปี๊บบ ปี๊บบ! บอร์ดทำคำสั่งล็อกแล้ว 🔒", "🔒 กลับตำแหน่งล็อกแล้ว พิงรอพัสดุรอบต่อไป 📮", "📮 ล็อกตามคำสั่งแล้วครับ! ตรวจกลอนจริงอีกนิดเพื่อความชัวร์ 🔒"], "parcel": ["📦 มีอะไรผ่านช่องรับแล้ว! แวะเช็กพัสดุกันหน่อย 👀", "📮 ก๊อก ก๊อก! พิงตรวจพบวัตถุผ่านช่องรับพัสดุแล้ว ✨", "🎁 พัสดุมาหรือเปล่าน้า? เซนเซอร์ตรวจพบวัตถุแล้ว 📦", "📦 ปิ๊ง! มีเหตุการณ์รับพัสดุรอบใหม่ แวะดูได้เลย 👀", "🚚 มีผู้มาเยือนช่องรับพัสดุ! พิงแจ้งให้แล้วนะ 📮"], "login": ["👋 เข้าสู่ระบบแล้ว! ยินดีต้อนรับกลับมาหาพิง 📮", "✨ ล็อกอินสำเร็จ! พร้อมดูแลพัสดุกันหรือยัง 📦", "📮 สวัสดีอีกครั้ง! คุณเข้าสู่ระบบแล้ว 👋", "🎉 เข้ามาแล้ว! เมนูกล่องพิงรออยู่เลย 📦", "🟢 เข้าสู่ระบบเรียบร้อย ยินดีต้อนรับครับ 📮"], "logout": ["👋 ออกจากระบบแล้ว ไว้แวะมาใหม่กับพิงนะ 📮", "🌷 ออกจากระบบเรียบร้อย แล้วพบกันใหม่ครับ 👋", "📮 บ๊ายบาย! ออกจากระบบแล้วนะ ✨", "👋 จบเซสชันแล้ว ขอบคุณที่มาเช็กพัสดุ 📦", "✨ ออกจากระบบแล้ว เดินทางปลอดภัยนะครับ 👋"], "pin": ["🔑 บันทึก PIN แล้ว! เก็บรหัสไว้เป็นความลับนะ 🤫", "✨ ตั้งค่า PIN เรียบร้อย พิงไม่บอกรหัสให้ใครแน่นอน 🔑", "🔐 PIN อัปเดตแล้ว อย่าลืมรหัสใหม่ด้วยนะ 📮", "📮 บันทึกรหัส PIN สำเร็จแล้วครับ 🔑", "✅ อัปเดต PIN เรียบร้อย ไม่มีตัวเลขรหัสในข้อความนี้นะ 🔐"], "view": ["👀 แวะมาดูสถานะกล่องกัน!", "📦 เช็กสถานะพัสดุให้แล้วนะ", "📮 รายงานสถานะล่าสุดมาแล้วครับ", "✨ มาดูข่าวจากกล่องพิงกัน", "🔎 เปิดรายงานสถานะกล่องแล้วนะ"], "refresh": ["🔄 บอร์ดรับคำขอรีเฟรชแล้ว!", "✨ อัปเดตจากบอร์ดมาแล้วครับ", "📮 รีเฟรชข้อมูลรอบใหม่ให้แล้วนะ", "🔎 ข้อมูลสถานะจากบอร์ดพร้อมแล้ว", "📦 เช็กสดจากบอร์ดเรียบร้อยแล้ว"], "collected": ["📦 ยืนยันรับพัสดุออกแล้ว! ล้างรายการค้างให้แล้วครับ", "🎁 รับของเรียบร้อย! พิงล้างสถานะรอรับให้แล้ว", "📮 รับทราบว่ารับพัสดุออกแล้วครับ", "✨ เคลียร์เหตุการณ์พัสดุค้างแล้ว ขอบคุณที่แจ้งนะ", "✅ บันทึกการรับพัสดุออกแล้วครับ 📦"], "daily": ["☀️ สวัสดีวันใหม่! อย่าลืมเช็กพัสดุก่อนออกจากบ้านนะ 📦", "🌷 พิงแวะมาทักประจำวัน ขอให้วันนี้มีแต่เรื่องดี ๆ 📮", "✨ วันนี้ขอให้พัสดุมาถึงไวและวันของคุณราบรื่นนะ 📦", "📮 ข่าวจากพิงวันนี้: อย่าลืมดูแลตัวเอง แล้วแวะเช็กกล่องด้วยนะ 🌤️", "🌈 สวัสดีจากกล่องพิง! ขอให้วันนี้มีเซอร์ไพรส์ดี ๆ รออยู่ 🎁"]};
const PPmsg=k=>PP_MESSAGES[k][Math.floor(Math.random()*5)];
let demoUID='',demoSeen=0,demoBusy=false,demoKnown=false;
function pushNotice(text){return db.ref('demoBox/notices').push({text:String(text).slice(0,900),createdAt:TS})}
notify=function(text,u){if(!me&&!u)return Promise.resolve();const k=/PIN|รหัส/.test(text)?'pin':null;return pushNotice(k?PPmsg(k):text).catch(console.error)};
init=async function(){try{
 await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
 if(!firebase.auth().currentUser)await firebase.auth().signInAnonymously();
 demoUID=firebase.auth().currentUser.uid;
 let p=$('demoUid');if(!p){p=document.createElement('div');p.id='demoUid';p.style='font-size:11px;overflow-wrap:anywhere;padding:6px';$('card').prepend(p)}p.textContent='BROWSER_UID: '+demoUID;
 await db.ref('demoBox/state').get();
 await liff.init({liffId:'2012766453-sMrmwYD6'});
 if(!liff.isLoggedIn()){show('welcome');msg('welcome','กรุณาเข้าสู่ระบบ LINE','');return;}
 const profile=await liff.getProfile(),snap=await db.ref('users/'+profile.userId).get(),u=snap.val()||{id:profile.userId,avSrc:profile.pictureUrl?'line':''};
 u.id=profile.userId;u.name=profile.displayName||'User';u.nick=u.nick||u.name;u.pic=profile.pictureUrl||'';
 signedIn(u);pushNotice(PPmsg('login')).catch(console.error);
}catch(e){show('welcome');msg('welcome',e.message+' | BROWSER_UID: '+demoUID,'error')}};
enter=function(){if(!me)return show('welcome');if(!me.pin)return openPin('set',enter);startBox();show('menu')};
startForgot=function(){alert('รุ่นเดโม: ให้เจ้าของ Firebase ลบเฉพาะ users/<LINE userId>/pin แล้วเปิด LIFF ใหม่เพื่อตั้ง PIN')};
logout=async function(){try{await pushNotice(PPmsg('logout'))}catch(e){console.error(e)}stopBox();me=null;show('welcome')};
startBox=function(){stopBox();bref=db.ref('demoBox/state');bref.on('value',s=>{const v=s.val()||{};demoSeen=v.lastSeen||0;demoKnown=!!demoSeen;box={locked:v.locked!==false,hasParcel:!!v.parcelPending,updated:demoSeen,sensorActive:!!v.sensorActive};if($('box').classList.contains('active'))paintBox()},e=>msg('box',e.message,'error'))};
paintBox=function(){$('pStat').textContent=box.hasParcel?'มีเหตุการณ์พัสดุรอยืนยันรับออก':'ไม่มีเหตุการณ์ค้าง';$('bStat').textContent=demoKnown?(box.locked?'สั่งตำแหน่งล็อก 180°':'สั่งตำแหน่งปลดล็อก 90°')+' / '+(Date.now()-demoSeen<20000?'ออนไลน์':'ออฟไลน์'):'ยังไม่มีข้อมูลบอร์ด';$('upd').textContent=demoSeen?new Date(demoSeen).toLocaleString('th-TH'):'-'};
async function demoCommand(action){
 if(!me)throw Error('กรุณาเข้าสู่ระบบ');if(demoBusy)throw Error('กำลังทำคำสั่งเดิม');if(Date.now()-demoSeen>=20000)throw Error('บอร์ดออฟไลน์/ยังไม่มีข้อมูล');
 demoBusy=true;show('box');msg('box','กำลังส่งคำสั่ง รอผลจากบอร์ด...','');
 const id=crypto.randomUUID();let unsubscribe=null,timer=null;
 try{
  const r=await db.ref('demoBox/command').transaction(c=>c?.status==='pending'&&c.expiresAt>Date.now()?undefined:{id,action,status:'pending',createdAt:Date.now(),expiresAt:Date.now()+20000});
  if(!r.committed)throw Error('มีคำสั่งรออยู่ กรุณารอสักครู่');
  await new Promise((resolve,reject)=>{const ref=db.ref('demoBox/result');const fn=s=>{const v=s.val();if(v?.id===id&&v.status==='done')resolve()};unsubscribe=()=>ref.off('value',fn);ref.on('value',fn,reject);timer=setTimeout(()=>reject(Error('ยังไม่ได้ผลยืนยัน โปรดตรวจบอร์ดก่อนสั่งซ้ำ')),25000)});
  await db.ref('demoBox/command').transaction(c=>c?.id===id?{...c,status:'done'}:undefined);
  msg('box','บอร์ดทำคำสั่งแล้ว (ยังไม่มีเซนเซอร์ยืนยันกลอนจริง)','success');
 }finally{if(unsubscribe)unsubscribe();if(timer)clearTimeout(timer);demoBusy=false;}
}
unlockBox=async function(){try{await demoCommand('unlock')}catch(e){msg('box',e.message,'error')}};
lockBox=async function(){try{await demoCommand('lock')}catch(e){msg('box',e.message,'error')}};
checkParcel=async function(){try{await demoCommand('refresh')}catch(e){msg('box',e.message,'error')}};
async function demoView(){try{await pushNotice(PPmsg('view')+'\n📦 '+(box.hasParcel?'มีเหตุการณ์พัสดุรอยืนยันรับออก':'ไม่มีเหตุการณ์ค้าง')+'\n🕒 ข้อมูลล่าสุด '+(demoSeen?new Date(demoSeen).toLocaleString('th-TH'):'ยังไม่มีข้อมูล'));msg('box','เข้าคิว LINE แล้ว ต้องให้บอร์ดออนไลน์เพื่อส่ง','')}catch(e){msg('box',e.message,'error')}}
async function demoCollected(){if(!confirm('รับพัสดุออกแล้วใช่ไหม?'))return;try{await demoCommand('collected')}catch(e){msg('box',e.message,'error')}}
document.addEventListener('DOMContentLoaded',()=>{
 $('welcome').querySelectorAll('button').forEach(b=>b.remove());const b=document.createElement('button');b.className='primary full';b.textContent='เข้าสู่ระบบ LINE';b.onclick=()=>liff.isLoggedIn()?init():liff.login({redirectUri:location.origin+location.pathname});$('welcome').insertBefore(b,$('m-welcome'));
 for(const [label,fn] of [['ดูสถานะล่าสุดและแจ้ง LINE',demoView],['ยืนยันรับพัสดุออกแล้ว',demoCollected]]){const b=document.createElement('button');b.className='full';b.textContent=label;b.onclick=fn;$('box').insertBefore(b,$('m-box'));}
 setInterval(()=>{if($('box').classList.contains('active'))paintBox()},3000);
});
