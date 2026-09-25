import * as THREE from './vendor/three.module.js';
import {languageButton,setLocalizedText} from './i18n.js?v=2e590cf41e8e';
import {makeCampusCast} from './campus-cast.js?v=5923599a2e7f';
import {CampusSound} from './campus-sound.js?v=730d707576fa';

const people={
 postman:{name:'The campus postman',title:'Special delivery',icon:'✉',hint:'Listen for a bicycle on the lane around the studio.',lines:['Ring ring! A delivery for the next person with a strange idea.','No bills today. Just a reminder to finish that prototype.','One postcard, three bugs, and a very promising first draft.']},
 crew:{name:'The LEVEL0 crew',title:'Caught playtesting',icon:'✦',hint:'Someone might be hiding behind the clubhouse…',lines:['Psst… new teammate? We were definitely playtesting. Definitely.','Come inside. There’s room for one more builder.','We said one more round. That was three rounds ago.']},
 auntie:{name:'The neighborhood announcer',title:'A very important announcement',icon:'♪',hint:'Someone near the clubhouse has a lot to say.',lines:['Attention, attention! Ask someone to play your game.','The arcade is open. Your excuses are closed.','A first prototype doesn’t have to be perfect.']}
};
function path(points,scale,closed=false){const pts=points.map(([x,z])=>new THREE.Vector3(x*scale,0,z*scale));if(closed)pts.push(pts[0].clone());const lengths=pts.slice(1).map((p,i)=>p.distanceTo(pts[i]));return{pts,lengths,total:lengths.reduce((a,b)=>a+b,0)};}
function sample(route,distance){let d=THREE.MathUtils.clamp(distance,0,route.total);for(let i=0;i<route.lengths.length;i++){const length=route.lengths[i];if(d<=length||i===route.lengths.length-1){const direction=route.pts[i+1].clone().sub(route.pts[i]).normalize();return{position:route.pts[i].clone().lerp(route.pts[i+1],d/length),yaw:Math.atan2(direction.x,direction.z)};}d-=length;}}
function face(actor,yaw,dt,reduced){const delta=Math.atan2(Math.sin(yaw-actor.rotation.y),Math.cos(yaw-actor.rotation.y));actor.rotation.y+=delta*(reduced?1:Math.min(1,dt*8));}

export class CampusEncounters{
 constructor({scene,scale,world,onPause}){
  this.scale=scale;this.world=world;this.onPause=onPause;this.cast=makeCampusCast(scene);this.sound=new CampusSound();this.time=0;this.active=false;this.found=new Set();this.lineIndex={postman:0,crew:0,auntie:0};this.nearest=null;this.toastUntil=0;this.toastOwner=null;this.pending=[];this.lastBell=-30;this.postStop=0;this.postDistance=0;this.crewCycle=null;this.crewReady=true;this.crewCooldown=0;this.reduced=false;this.camera=null;
  this.postRoute=path([[5.2,5.3],[-2.8,5.3],[-2.8,14.5],[5.2,14.5]],scale,true);
  this.crewRoutes=[[-7.1,-6.9],[-8.1,-6.9],[-9.1,-6.9]].map((start,i)=>path([start,[-4.45,-6.9],[-4.45,-1.8],[-4.6,-1.4],[-4.6,.35],[-5.7,.35],[[-6.6,3.05],[-5.6,2.5],[-6.1,1.65]][i]],scale));
  this.floor=.4*scale-.21;this.bikeFloor=.415*scale+.015;
  this.cast.postman.position.set(5.2*scale,this.bikeFloor,5.3*scale);this.cast.postman.rotation.y=-Math.PI/2;
  this.cast.auntie.position.set(-10.4*scale,this.floor,3.1*scale);this.cast.auntie.rotation.y=1.181;
  this.actorRoots=[this.cast.postman,...this.cast.crew,this.cast.auntie];this.actorRoots.forEach((actor,i)=>actor.userData.encounter=i===0?'postman':i===4?'auntie':'crew');
  this.createUI();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause();});window.addEventListener('pagehide',()=>this.pause());
 }
 get isJournalOpen(){return this.journal.open;}
 unlock(){this.sound.unlock();}
 createUI(){
  this.hud=document.createElement('div');this.hud.className='campus-moments';this.hud.hidden=true;
  this.hud.innerHTML='<div class="moments-tools"><button type="button" class="moments-sound"></button><button type="button" class="moments-book">Little moments <b>0 / 3</b></button></div><div class="moment-toast" hidden><div class="moment-stamp" aria-hidden="true"></div><div class="moment-copy" role="status" aria-live="polite" aria-atomic="true"></div><button type="button" class="moment-dismiss" aria-label="Dismiss the conversation">×</button></div><button type="button" class="moment-hello" hidden><kbd>F</kbd><span></span><span aria-hidden="true">↗</span></button>';
  document.querySelector('#campus').appendChild(this.hud);this.toast=this.hud.querySelector('.moment-toast');this.copy=this.hud.querySelector('.moment-copy');this.hello=this.hud.querySelector('.moment-hello');this.soundButton=this.hud.querySelector('.moments-sound');this.book=this.hud.querySelector('.moments-book');
  this.soundButton.onclick=()=>{this.sound.toggle();this.syncSound();};this.syncSound();
  this.hud.querySelector('.moment-dismiss').onclick=()=>{this.toastUntil=0;this.toast.hidden=true;this.toastOwner=null;};
  this.hello.onclick=()=>this.interact();this.book.onclick=()=>this.openJournal();
  this.journal=document.createElement('dialog');this.journal.id='moments-dialog';this.journal.setAttribute('aria-labelledby','moments-title');document.body.appendChild(this.journal);
  this.journal.addEventListener('close',()=>{this.world.focus({preventScroll:true});});
  this.journal.addEventListener('click',e=>{if(e.target.closest('[data-close-moments]'))this.journal.close();if(e.target===this.journal){const r=this.journal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)this.journal.close();}});
 }
 syncSound(){this.soundButton.textContent=this.sound.enabled?'♪ Sound on':'♪ Sound off';this.soundButton.setAttribute('aria-pressed',String(this.sound.enabled));this.soundButton.setAttribute('aria-label',this.sound.enabled?'Mute campus sounds':'Enable campus sounds');}
 openJournal(){this.onPause();this.pause();this.journal.innerHTML=`<header class="moments-journal-header"><span>NOTES FROM A WALK</span><div class="moments-journal-actions">${languageButton()}<button type="button" data-close-moments aria-label="Close little moments">×</button></div></header><h2 id="moments-title">People make<br>a campus.</h2><p class="moments-journal-intro">Small encounters, somewhere between projects.<br><strong>${this.found.size} of 3 little moments found</strong></p><div class="moments-entries">${Object.entries(people).map(([id,p],i)=>`<article class="moment-entry ${this.found.has(id)?'is-found':''}"><span class="moment-entry-no">0${i+1}</span><div><span class="moment-entry-label">${this.found.has(id)?p.name:'Still out there'}</span><h3>${this.found.has(id)?p.title:'An unwritten page'}</h3><p>${this.found.has(id)?'“'+p.lines[0]+'”':p.hint}</p></div><span class="moment-entry-icon" aria-hidden="true">${this.found.has(id)?p.icon:'?'}</span></article>`).join('')}</div><button type="button" class="moments-return" data-close-moments>Back to the walk <span aria-hidden="true">↗</span></button>`;this.journal.showModal();}
 pause(){this.onPause();this.active=false;this.hud.hidden=true;this.sound.quiet();}
 discover(id){if(this.found.has(id))return false;this.found.add(id);this.book.querySelector('b').textContent=`${this.found.size} / 3`;return true;}
 speak(id,{automatic=false}={}){
  const fresh=this.discover(id);if(automatic&&this.toastUntil>this.time){if(!this.pending.includes(id))this.pending.push(id);return;}
  const p=people[id],line=p.lines[this.lineIndex[id]++%p.lines.length];this.copy.innerHTML=`<span class="moment-speaker">${p.name}${fresh?' · New moment':''}</span><p>${line}</p>`;this.hud.querySelector('.moment-stamp').textContent=p.icon;this.toast.hidden=false;this.toastUntil=this.time+8;this.toastOwner=id;
  if(id==='postman'){this.sound.bell();this.lastBell=this.time;this.postStop=this.time+3;}if(id==='crew')this.sound.chatter();if(id==='auntie'){this.sound.megaphone();this.auntieGesture=this.time+3;}
 }
 interact(id=this.nearest){if(!this.active||!id)return false;this.unlock();this.speak(id);return true;}
 hit(ray){if(!this.active)return null;const hits=ray.intersectObjects(this.actorRoots.filter(a=>a.visible),true);if(!hits.length)return null;let actor=hits[0].object;while(actor&&!actor.userData.encounter)actor=actor.parent;return actor?{id:actor.userData.encounter,distance:hits[0].distance}:null;}
 update(dt,{player,camera,width,height,active,reduced}){
  this.reduced=reduced;this.camera=camera;this.width=width;this.height=height;
  if(!active||this.isJournalOpen){this.pause();return;}this.active=true;this.hud.hidden=false;this.sound.audible();this.time+=dt;
  if(this.toastUntil<=this.time){this.toast.hidden=true;this.toastOwner=null;if(this.pending.length)this.speak(this.pending.shift(),{automatic:true});}
  this.updatePostman(dt,player);this.updateCrew(dt,player);this.updateAuntie(dt,player);
  let best=4.6;this.nearest=null;for(const actor of this.actorRoots){if(!actor.visible)continue;const distance=Math.hypot(actor.position.x-player.position.x,actor.position.z-player.position.z);if(distance<best){best=distance;this.nearest=actor.userData.encounter;}}
  this.hello.hidden=!this.nearest;if(this.nearest)setLocalizedText(this.hello.querySelector('span'),`Say hello · ${this.nearest==='postman'?'Postman':this.nearest==='crew'?'LEVEL0 crew':'Announcer'}`);
 }
 updatePostman(dt,player){
  const {postman,wheels,rider}=this.cast;const distance=postman.position.distanceTo(player.position);
  // Yield around the whole bicycle, including the wheel ahead of the rider.
  const dx=player.position.x-postman.position.x,dz=player.position.z-postman.position.z,fx=Math.sin(postman.rotation.y),fz=Math.cos(postman.rotation.y),along=THREE.MathUtils.clamp(dx*fx+dz*fz,-1.1,1.1);
  const yielding=Math.hypot(dx-fx*along,dz-fz*along)<.9;const speed=this.reduced||this.time<this.postStop||yielding?0:2.65*(distance<2.2?.35:1);
  this.postDistance=(this.postDistance+dt*speed)%this.postRoute.total;const pose=sample(this.postRoute,this.postDistance);postman.position.copy(pose.position);postman.position.y=this.bikeFloor;face(postman,pose.yaw,dt,this.reduced);
  for(const wheel of wheels)wheel.rotation.x+=dt*speed/.51;for(const[i,leg]of rider.userData.rig.legs.entries())leg.rotation.x=-.7+(speed?Math.sin(this.postDistance*4+i*Math.PI)*.38:0);
  if(distance<6&&this.time-this.lastBell>25){if(!this.found.has('postman')){this.lastBell=this.time;this.speak('postman',{automatic:true});}else{this.sound.bell();this.lastBell=this.time;}}
 }
 updateCrew(dt,player){
  const proximity=Math.hypot(player.position.x+8*this.scale,player.position.z-.6*this.scale)/this.scale;
  if(proximity>8&&!this.crewCycle&&this.time>=this.crewCooldown)this.crewReady=true;
  if(proximity<4.5&&this.crewReady&&!this.crewCycle&&this.time>=this.crewCooldown){this.crewCycle={start:this.time,announced:false};this.crewReady=false;}
  if(!this.crewCycle)return;
  const age=this.time-this.crewCycle.start;let finished=0;
  this.cast.crew.forEach((actor,i)=>{const route=this.crewRoutes[i],duration=route.total/4.4,t=age-i*.8;let d=0,walking=false,returning=false;
   if(this.reduced){actor.visible=true;d=route.total;}else if(t<0){actor.visible=false;return;}else if(t<duration){actor.visible=true;d=t*4.4;walking=true;}else if(t<duration+7){actor.visible=true;d=route.total;}else if(t<duration*2+7){d=route.total-(t-duration-7)*4.4;walking=true;returning=true;}else{actor.visible=false;finished++;return;}
   const pose=sample(route,d);actor.position.copy(pose.position);actor.position.y=this.floor;const yaw=walking?pose.yaw+(returning?Math.PI:0):Math.atan2(player.position.x-actor.position.x,player.position.z-actor.position.z);face(actor,yaw,dt,this.reduced);
   const rig=actor.userData.rig;for(let j=0;j<2;j++){const angle=walking?Math.sin(t*9+j*Math.PI)*.5:0;rig.legs[j].rotation.x=angle;rig.arms[j].rotation.x=-angle;}rig.arms[1].rotation.z=!walking?(this.reduced?2.35:2.35+Math.sin(t*7)*.2):0;
   if(d>route.total-3&&!this.crewCycle.announced){this.crewCycle.announced=true;this.speak('crew',{automatic:true});}
  });
  if(finished===3||(this.reduced&&age>10)){this.cast.crew.forEach(a=>a.visible=false);this.crewCycle=null;this.crewCooldown=this.time+25;}
 }
 updateAuntie(dt,player){const {auntie,horn}=this.cast,distance=auntie.position.distanceTo(player.position);if(distance<4.8&&!this.found.has('auntie'))this.speak('auntie',{automatic:true});if(distance<7)face(auntie,Math.atan2(player.position.x-auntie.position.x,player.position.z-auntie.position.z),dt,this.reduced);horn.rotation.x=!this.reduced&&this.time<this.auntieGesture?Math.sin(this.time*9)*.06:0;}
 coversLabel(id,rect){if(!this.active)return false;if(id==='community'&&this.crewCycle)return true;return this.actorRoots.some(actor=>{if(!actor.visible)return false;const p=actor.position.clone();p.y+=1.5;p.project(this.camera);const x=(p.x*.5+.5)*this.width,y=(-p.y*.5+.5)*this.height;return x>rect.left-22&&x<rect.right+22&&y>rect.top-40&&y<rect.bottom+40;});}
}
