import * as THREE from './vendor/three.module.js';
import {studioWorks} from './studio-data.js?v=08b3b963c97a';

const COLORS=[0xc96b47,0x667f9c,0xb8955a,0x547d76,0x687bb1,0xb17f78];
function roundBox(c,parent,w,h,d,color,x=0,y=0,z=0,r=.12){
 r=Math.min(r,w/3,h/3,d/3);const shape=new THREE.Shape(),a=-w/2,b=-h/2;
 shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:d-2*r,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:r,bevelThickness:r,curveSegments:6});geo.translate(0,0,-d/2+r);
 const mesh=new THREE.Mesh(geo,c.material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function rod(c,parent,a,b,r,color){const delta=b.clone().sub(a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),12),c.material(color));mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh;}
function recordLabel(c,work,color){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');ctx.fillStyle='#'+color.toString(16).padStart(6,'0');ctx.fillRect(0,0,512,512);
 ctx.fillStyle='#fff1d3';ctx.textAlign='center';ctx.font='600 24px sans-serif';ctx.fillText('YUMIN / PERSONAL PRESSING',256,118);
 ctx.font='700 37px sans-serif';const words=work.title.replace('Babsangmeori / ','').split(' ');let line='',y=207;for(const word of words){if(ctx.measureText(line+' '+word).width>390){ctx.fillText(line,256,y);y+=44;line=word;}else line+=(line?' ':'')+word;}ctx.fillText(line,256,y);
 ctx.font='500 23px sans-serif';ctx.fillText('SIDE A   •   '+work.no,256,374);ctx.beginPath();ctx.arc(256,285,8,0,Math.PI*2);ctx.fillStyle='#181b1a';ctx.fill();
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function makeVinyl(c,work,color){
 const record=new THREE.Group();c.cylinder(record,1.38,1.38,.055,0x111819,0,0,0,96);
 for(const radius of[.6,.67,.75,.84,.95,1.05,1.17,1.28,1.34]){const groove=new THREE.Mesh(new THREE.TorusGeometry(radius,.007,4,96),new THREE.MeshStandardMaterial({color:0x34403b,roughness:.42,metalness:.18}));groove.rotation.x=Math.PI/2;groove.position.y=.031;record.add(groove);}
 const label=new THREE.Mesh(new THREE.CircleGeometry(.52,64),new THREE.MeshBasicMaterial({map:recordLabel(c,work,color),toneMapped:false}));label.rotation.x=-Math.PI/2;label.position.y=.032;record.add(label);
 c.cylinder(record,.043,.043,.064,0xb1afa0,0,.02,0);return record;
}

export function buildStudio(c,room){
 const s=room.scene;room.records=[];room.recordState='idle';room.recordPause=false;
 // A cutaway home: a living room, a record wall, and a bedroom behind a low partition.
 c.box(s,24,.65,18,0x343c3d,0,-.4,0);c.box(s,24,.14,18,0x82684c,0,0,0);
 for(let x=-11.5;x<12;x++){c.box(s,.035,.014,17.95,0x594938,x,.083,0);for(let z=-8;z<9;z+=3)c.box(s,.97,.015,.025,0x67513b,x,.085,z+(Math.round(x)%2?1.5:0));}
 c.box(s,24,7,.28,0x2c494c,0,3.42,-9);c.box(s,.28,7,18,0x344b4e,-12,3.42,0);
 for(const y of[.25,.55]){c.box(s,23.8,.1,.14,0x9e8764,0,y,-8.78);c.box(s,.14,.1,17.8,0x9e8764,-11.8,y,0);}
 // Brick joints and a generous window with blinds.
 for(let y=.9;y<6.9;y+=.45){c.box(s,.015,.022,7,0x263e41,-11.84,y,-4.6);for(let z=-8;z<-1.6;z+=.85)c.box(s,.018,.4,.025,0x293f40,-11.83,y+.2,z+(Math.round(y*10)%2?.4:0));}
 c.box(s,.12,3.8,4.75,0x122d39,-11.77,4.22,-4.8);c.box(s,.05,3.45,4.42,0x698f93,-11.67,4.22,-4.8);
 for(let y=2.65;y<5.95;y+=.25)c.box(s,.2,.13,4.43,0xa6aaa0,-11.55,y,-4.8);
 for(const z of[-7.17,-2.43])c.box(s,.28,4,.15,0xb8aa8b,-11.54,4.22,z);c.box(s,.55,.14,5.05,0xb8aa8b,-11.5,2.2,-4.8);
 // Bedroom has a raised threshold, upholstered bed and a bedside light.
 c.box(s,7.6,.2,8.15,0x796951,8.05,.15,-4.65);c.box(s,.18,2.85,6.9,0x64736b,4.18,1.6,-5.47);c.box(s,.35,.14,7.05,0x9e8966,4.18,3.05,-5.47);
 roundBox(c,s,4.0,.65,5.75,0x5b4435,8,.64,-5.4,.15);roundBox(c,s,3.75,.42,5.4,0xe4d9bd,8,1.15,-5.4,.18);
 roundBox(c,s,4.1,1.72,.35,0x766456,8,1.57,-8.07,.13);roundBox(c,s,3.75,.18,3.8,0x728785,8,1.43,-4.58,.09);
 for(const x of[7.08,8.9])roundBox(c,s,1.52,.29,.93,0xdfc8a1,x,1.53,-7.19,.15);
 for(let z=-6.25;z<-2.8;z+=.27)c.box(s,3.7,.018,.026,0x8f9c8f,8,1.536,z);
 roundBox(c,s,1.42,1.25,1.35,0xa17b50,10.52,.9,-7.18,.08);c.box(s,.53,.07,.53,0x263939,10.52,1.59,-7.18);c.cylinder(s,.036,.036,.55,0xb39866,10.52,1.87,-7.18);c.cylinder(s,.33,.46,.55,0xdcbb81,10.52,2.34,-7.18);
 const bedside=new THREE.PointLight(0xffc889,12,7,2);bedside.position.set(10.5,2.47,-7.1);s.add(bedside);
 // Sofa faces the television; cushions, a blanket and a rug keep the room lived in.
 const sofa=new THREE.Group();sofa.position.set(-7.65,0,3.85);s.add(sofa);
 for(const x of[-2.6,2.6])for(const z of[-.8,.8])c.cylinder(sofa,.08,.11,.38,0x382c28,x,.23,z);
 roundBox(c,sofa,6.2,.74,2.3,0x7d4331,0,.83,0,.22);roundBox(c,sofa,6.25,1.57,.42,0x9b553a,0,1.61,.97,.2);
 for(const x of[-2.95,2.95])roundBox(c,sofa,.52,1.27,2.25,0xa65d40,x,1.19,0,.21);
 for(const x of[-1.85,0,1.85])roundBox(c,sofa,1.73,.27,1.82,0xb96e48,x,1.31,-.18,.13);
 const pillow=roundBox(c,sofa,.95,.87,.29,0xd7b764,-1.9,1.85,.64,.18);pillow.rotation.z=.17;
 const pillow2=roundBox(c,sofa,.85,.79,.34,0x416c6b,1.93,1.82,.63,.15);pillow2.rotation.z=-.19;
 c.box(sofa,1.15,.035,1.9,0x647e80,.2,1.48,-.13);c.box(sofa,1.15,.75,.035,0x647e80,.2,1.08,-1.04);for(let i=0;i<5;i++)c.box(sofa,.035,.01,1.87,0xd0c7a4,-.25+i*.21,1.506,-.13);
 roundBox(c,s,7.3,.04,5.85,0x9e633e,-7.25,.105,1.6,.1);roundBox(c,s,6.8,.01,5.32,0xccad73,-7.25,.14,1.6,.1);roundBox(c,s,6.43,.015,4.95,0x456568,-7.25,.154,1.6,.1);
 // Low coffee table, everyday objects, and an ottoman.
 roundBox(c,s,3.6,.16,1.65,0x624936,-7.15,.9,.3,.16);for(const x of[-8.55,-5.75])c.box(s,.13,.79,1.2,0x2a3738,x,.46,.3);
 c.cylinder(s,.23,.22,.34,0xd8c7a2,-6.7,1.17,.36);const handle=new THREE.Mesh(new THREE.TorusGeometry(.14,.035,8,16),c.material(0xd8c7a2));handle.position.set(-6.45,1.2,.36);s.add(handle);
 c.box(s,.9,.1,.64,0xc0794f,-7.7,1.05,.1);c.label(s,'AFTER HOURS',.78,.4,'#c0794f','#f3d4aa',-7.7,1.108,.1,90).rotation.x=-Math.PI/2;
 roundBox(c,s,1.3,.62,1.25,0x94785a,-4.15,.46,2.1,.21);
 // Vintage TV cabinet and stereo. The TV holds the current project screen.
 roundBox(c,s,6.3,1.27,1.7,0x906540,-7.35,.79,-6.85,.1);
 for(const x of[-9.5,-7.35,-5.2]){c.box(s,1.96,.9,.08,0x483e34,x,.92,-5.965);c.box(s,.5,.055,.05,0xbda375,x,1.18,-5.91);}
 const tv=new THREE.Group();tv.position.set(-7.2,2.84,-6.66);s.add(tv);roundBox(c,tv,4.85,2.94,1.05,0xb57543,0,0,0,.16);roundBox(c,tv,4.14,2.54,.09,0x252f32,-.22,0,.54,.16);
 room.tvScreen=c.label(tv,'PICK A RECORD',3.9,2.22,'#152f35','#d6caaa',-.22,0,.605,74);
 for(const y of[-.45,.52]){const dial=c.cylinder(tv,.16,.16,.13,0x363a34,2.14,y,.63);dial.rotation.x=Math.PI/2;}
 for(let i=0;i<5;i++)c.box(tv,.33,.035,.025,0x513e2f,2.14,-1.07+i*.1,.55);
 rod(c,tv,new THREE.Vector3(-.5,1.45,0),new THREE.Vector3(-1.6,2.5,0),.023,0x999783);rod(c,tv,new THREE.Vector3(.4,1.45,0),new THREE.Vector3(1.4,2.16,0),.023,0x999783);
 c.interact(room,tv,'home-tv','TV · Play a record');room.objects.get('home-tv').workId='searchprice';
 for(const x of[-10.4,-4.25]){roundBox(c,s,1.05,1.6,.83,0x263739,x,2.06,-6.5,.07);for(const y of[1.68,2.29]){const speaker=c.cylinder(s,.31,.31,.08,0x82968e,x,y,-6.03);speaker.rotation.x=Math.PI/2;const cone=c.cylinder(s,.17,.17,.085,0x243337,x,y,-5.98);cone.rotation.x=Math.PI/2;}}
 // Shelves filled with books, record spines and six real project sleeves.
 const shelfX=-.1;for(const x of[-3.76,3.56])c.box(s,.2,6.2,1.35,0x6b4f39,x,3.1,-8.1);
 for(const y of[.34,2.95,5.56,6.2])c.box(s,7.5,.17,1.48,0x9c7852,shelfX,y,-8.1);c.box(s,7.38,5.86,.1,0x3d3b32,shelfX,3.13,-8.78);
 c.label(s,'THE RECORD COLLECTION',6.45,.38,'#263f42','#ead9b9',-.1,6.62,-8.8,78);
 studioWorks.forEach((work,i)=>{
  const x=-2.56+(i%3)*2.45,y=i<3?4.27:1.66;const jacket=new THREE.Group();jacket.position.set(x,y,-7.34);s.add(jacket);
  roundBox(c,jacket,2.02,2.22,.13,COLORS[i],0,0,0,.03);c.box(jacket,1.82,1.79,.015,0xe7dac0,0,.035,.08);c.photo(jacket,work.image,1.7,1.15,0,.14,.093);
  c.label(jacket,work.title.replace('Babsangmeori / ','').replace(' · First Cohort',''),1.79,.39,'#e7dac0','#2b3e3c',0,-.64,.104,90);
  c.label(jacket,'Y / '+work.no+'     SIDE A',1.78,.18,'#'+COLORS[i].toString(16),'#fff1d3',0,.97,.081,77);
  c.interact(room,jacket,work.id,'Play '+work.title);const data={id:work.id,jacket,home:jacket.position.clone(),homeQ:jacket.quaternion.clone(),color:COLORS[i],work};room.records.push(data);Object.assign(room.objects.get(work.id),{workId:work.id,record:data});
  // Back row spines stay in the cubby when the front sleeve is taken out.
  for(let j=0;j<5;j++){const spine=c.box(s,.12,1.83,.88,[0x765447,0x42636b,0xa5946c,0x995c4d,0xc8b590][j],x-.67+j*.29,y,-8.02);spine.rotation.z=(j-2)*.025;}
 });
 // A low record console and a complete turntable, with grooves, spindle and tonearm.
 const deck=new THREE.Group();deck.position.set(-.48,0,-3.05);s.add(deck);room.deck=deck;
 roundBox(c,deck,5.45,1.22,2.8,0x6b513b,0,.74,0,.1);for(const x of[-2.48,2.48])c.box(deck,.13,.34,2.35,0x253637,x,.18,0);
 for(const x of[-1.62,0,1.62]){c.box(deck,1.43,.78,.07,0x363b32,x,.78,1.44);for(let i=0;i<5;i++)c.box(deck,.17,.62,.09,[0xc29a65,0x886b57,0x456c6a,0xa56645,0xd8c9a4][i],x-.53+i*.26,.74,1.5);}
 roundBox(c,deck,4.75,.24,2.62,0xb18e5d,0,1.54,0,.12);c.cylinder(deck,1.47,1.47,.1,0x5c6660,-.48,1.72,0,96);c.cylinder(deck,1.4,1.4,.06,0x171d1c,-.48,1.8,0,96);c.cylinder(deck,.045,.045,.18,0xc9c5b3,-.48,1.91,0);
 room.platter=new THREE.Vector3(-.96,1.875,-3.05);
 c.cylinder(deck,.14,.14,.12,0x313d3b,1.74,1.8,-.89);const arm=new THREE.Group();arm.position.set(1.74,1.96,-.89);deck.add(arm);rod(c,arm,new THREE.Vector3(0,0,0),new THREE.Vector3(-.13,0,1.54),.036,0xbbb5a0);c.box(arm,.2,.09,.28,0x303e3d,-.13,-.04,1.58);room.tonearm=arm;
 const speed=c.cylinder(deck,.13,.13,.08,0x303c37,1.95,1.73,.88);c.label(deck,'33⅓',.45,.22,'#b18e5d','#283d3b',1.41,1.671,1.04,139).rotation.x=-Math.PI/2;
 c.interact(room,deck,'home-player','Turntable · Choose a record');room.objects.get('home-player').workId='searchprice';
 // One personal desk, a lamp, pencil pot, notebook and bedroom storage.
 c.table(room,8,2.47,5.3,2.35);c.chair(room,8,4.45,Math.PI);roundBox(c,s,2.18,1.37,.15,0x354b4c,7.87,2.6,1.92,.08);c.photo(s,studioWorks.find(w=>w.id==='widget').image,1.99,1.13,7.87,2.6,2.01);c.box(s,1.4,.06,.58,0x42605c,7.87,1.75,2.3);
 const deskObject=c.box(s,.98,.08,.76,0xc89552,9.9,1.76,2.75);c.interact(room,deskObject,'home-desk','Notebook · Desktop Widget Designer');room.objects.get('home-desk').workId='widget';
 c.cylinder(s,.14,.14,.38,0x4f6864,5.78,1.93,2.57);for(let i=0;i<4;i++)rod(c,s,new THREE.Vector3(5.71+i*.04,1.99,2.57),new THREE.Vector3(5.67+i*.07,2.45,2.54),.015,0xd9b266);
 rod(c,s,new THREE.Vector3(10.12,1.72,1.95),new THREE.Vector3(10.12,2.81,1.95),.033,0x3e5250);c.cylinder(s,.2,.32,.32,0xc9b28a,10.12,2.93,1.95);
 c.box(s,3.9,1.55,.17,0x9b7752,8,4.16,-8.74);for(let i=0;i<4;i++){const frame=new THREE.Group();frame.position.set(6.8+(i%2)*2.3,4.58-Math.floor(i/2)*.8,-8.6);frame.rotation.z=(i%2?.06:-.09);s.add(frame);c.box(frame,1.25,.68,.03,0xe3d6bb);c.photo(frame,studioWorks[i].image,1.16,.59,0,0,.025);}
 // Pendant, scattered books, and plants with stems rooted inside their pots.
 c.cylinder(s,.035,.035,1.6,0x2e3b3b,-6.5,6.24,.6);c.cylinder(s,.22,.85,.65,0xa94e33,-6.5,5.16,.6);c.cylinder(s,.78,.78,.035,0xf2ce8b,-6.5,4.83,.6);
 const pendant=new THREE.PointLight(0xffce8c,18,12,2);pendant.position.set(-6.5,4.65,.6);s.add(pendant);
 for(const x of[5.65,9.96]){c.box(s,1.5,.12,.8,0x8b6b45,x,5.72,-8.35);for(let i=0;i<5;i++)c.box(s,.16,.63,.48,[0x7a4e3e,0xaba077,0x426a6b,0xa46441,0xd4b57d][i],x-.48+i*.23,6.08,-8.36);}
 c.plant(room,-10.73,5.2,1.05);c.plant(room,10.76,6.7,.85);
 room.makeVinyl=(work,color)=>makeVinyl(c,work,color);
}

export function stopRecord(room){
 if(!room?.records)return;for(const record of room.records){record.jacket.position.copy(record.home);record.jacket.quaternion.copy(record.homeQ);record.jacket.scale.setScalar(1);}
 if(room.vinyl){room.scene.remove(room.vinyl);room.vinyl.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.material.map)o.material.map.dispose();o.material.dispose();}});room.vinyl=null;}
 room.recordState='idle';room.recordPause=false;room.activeRecord=null;if(room.tonearm)room.tonearm.rotation.set(0,0,0);
}
export function pickRecord(room,id,reduced){
 stopRecord(room);const record=room.records.find(r=>r.id===id);room.activeRecord=record;room.recordState='lifting';room.recordStarted=performance.now();room.recordReduced=reduced;
 room.vinyl=room.makeVinyl(record.work,record.color);room.vinyl.position.copy(record.home);room.vinyl.rotation.x=Math.PI/2;room.vinyl.visible=false;room.scene.add(room.vinyl);
}
export function tickStudio(c,room,now,dt,ease){
 for(const rec of room.records){if(rec===room.activeRecord)continue;const hover=rec.id===c.hovered;rec.jacket.position.lerp(rec.home.clone().add(new THREE.Vector3(0,hover?.09:0,hover?.34:0)),ease);rec.jacket.rotation.y=THREE.MathUtils.lerp(rec.jacket.rotation.y,hover?-.12:0,ease);}
 if(!room.activeRecord)return;
 const rec=room.activeRecord,t=room.recordReduced?1:Math.min((now-room.recordStarted)/1900,1),smooth=t*t*(3-2*t);
 const sleeveEnd=new THREE.Vector3(1.75,3.07,-3.15);
 rec.jacket.position.lerpVectors(rec.home,sleeveEnd,smooth);rec.jacket.position.y+=Math.sin(Math.PI*t)*1.35;rec.jacket.rotation.y=-.18*smooth;rec.jacket.scale.setScalar(1+.15*smooth);
 const move=THREE.MathUtils.clamp((t-.16)/.84,0,1),k=move*move*(3-2*move);room.vinyl.visible=t>.16||room.recordReduced;
 room.vinyl.position.lerpVectors(rec.home.clone().add(new THREE.Vector3(.9,.2,.48)),room.platter,k);room.vinyl.position.y+=Math.sin(Math.PI*move)*1.6;room.vinyl.rotation.x=Math.PI/2*(1-k);
 room.tonearm.rotation.y=THREE.MathUtils.lerp(0,-.66,THREE.MathUtils.clamp((t-.8)/.2,0,1));
 if(t===1){room.recordState='playing';if(!c.reduced&&!room.recordPause)room.vinyl.rotation.y+=dt*1.35;}
}

export function architectureHTML(){return `<div class="studio-flow"><span class="flow-eyebrow">NCP / SIMPLIFIED ARCHITECTURE</span><h4>From request to record.</h4><div class="flow-row"><span><b>WEB</b>Nginx</span><i>→</i><span><b>WAS</b>Load balancer<br>Node.js / Express</span><i>→</i><span><b>DATA</b>MySQL</span></div><div class="flow-services"><span>KMS<br><b>Post encryption</b></span><span>Object Storage → Global Edge<br><b>Image delivery</b></span></div><p>GitHub Actions · Deployment</p></div>`;}
