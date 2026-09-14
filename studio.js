import * as THREE from './vendor/three.module.js';
import {t as translate,localizeCanvas} from './i18n.js?v=69559cf56307';
import {studioWorks} from './studio-data.js?v=1e02eecdf638';
import {favoriteGames} from './favorite-games.js?v=0c87dde84cf3';
import {buildNewspaper,tickNewspaper} from './studio-news.js?v=0d7fd89062ea';

const COLORS=[0xc96b47,0x667f9c,0xb8955a,0x547d76,0x687bb1,0xb17f78];
function roundBox(c,parent,w,h,d,color,x=0,y=0,z=0,r=.12){
 r=Math.min(r,w/3,h/3,d/3);const shape=new THREE.Shape(),a=-w/2,b=-h/2;
 shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:d-2*r,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:r,bevelThickness:r,curveSegments:6});geo.translate(0,0,-d/2+r);
 const mesh=new THREE.Mesh(geo,c.material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function rod(c,parent,a,b,r,color){const delta=b.clone().sub(a),mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),12),c.material(color));mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh;}
function coverTexture(c,work,color){
 const canvas=document.createElement('canvas');canvas.width=600;canvas.height=920;const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const poster=new Image();
 const draw=()=>{
  ctx.fillStyle='#'+color.toString(16);ctx.fillRect(0,0,600,920);ctx.fillStyle='#192c2b';ctx.fillRect(0,0,600,70);
  ctx.fillStyle='#e7edb8';ctx.font='700 24px sans-serif';ctx.fillText(translate('YUMIN / PROJECT ARCHIVES'),30,44);
  ctx.fillStyle='#e9dfc8';ctx.fillRect(25,100,550,480);
  if(poster.naturalWidth){const scale=Math.min(530/poster.naturalWidth,445/poster.naturalHeight);ctx.drawImage(poster,300-poster.naturalWidth*scale/2,340-poster.naturalHeight*scale/2,poster.naturalWidth*scale,poster.naturalHeight*scale);}
  ctx.fillStyle='#f4e8ce';ctx.font='700 47px sans-serif';let line='',y=650;
  for(const word of translate(work.title).replace('Babsangmeori / ','').replace(' · First Cohort','').split(' ')){if(ctx.measureText(line+' '+word).width>525){ctx.fillText(line,32,y);y+=56;line=word;}else line+=(line?' ':'')+word;}ctx.fillText(line,32,y);
  ctx.fillStyle='#192c2b';ctx.fillRect(25,814,550,78);ctx.fillStyle='#e7edb8';ctx.font='700 24px monospace';ctx.fillText(translate('VHS / FILE '+work.no),44,862);
  for(let i=0;i<24;i++)ctx.fillRect(397+i*6,832,i%3+1,38);texture.needsUpdate=true;
 };
 poster.onload=draw;poster.src=work.image;localizeCanvas(canvas,texture,draw);return texture;
}

export function buildStudio(c,room){
 const s=room.scene;room.tapes=[];room.tapeState='idle';room.archivePosition=new THREE.Vector3(-.7,3.45,-3.4);
 // A cutaway home: a living room, a video archive, and a bedroom behind a low partition.
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
 // A separate TV and docked handheld console for favorite games.
 roundBox(c,s,6.3,1.27,1.7,0x906540,-7.35,.79,-6.85,.1);
 for(const x of[-9.5,-7.35,-5.2]){c.box(s,1.96,.9,.08,0x483e34,x,.92,-5.965);c.box(s,.5,.055,.05,0xbda375,x,1.18,-5.91);}
 for(const x of[-8.65,-5.75])roundBox(c,s,.8,.42,.83,0x483e34,x,1.62,-6.66,.05);
 const tv=new THREE.Group();tv.position.set(-7.2,3.29,-6.66);s.add(tv);roundBox(c,tv,4.85,2.94,1.05,0xb57543,0,0,0,.16);roundBox(c,tv,4.14,2.54,.09,0x252f32,-.22,0,.54,.16);
 room.tvScreen=new THREE.Mesh(new THREE.PlaneGeometry(3.9,2.22),new THREE.MeshBasicMaterial({map:c.texture(favoriteGames[0].image),toneMapped:false}));room.tvScreen.position.set(-.22,0,.605);tv.add(room.tvScreen);
 for(const y of[-.45,.52]){const dial=c.cylinder(tv,.16,.16,.13,0x363a34,2.14,y,.63);dial.rotation.x=Math.PI/2;}
 for(let i=0;i<5;i++)c.box(tv,.33,.035,.025,0x513e2f,2.14,-1.07+i*.1,.55);
 rod(c,tv,new THREE.Vector3(-.5,1.45,0),new THREE.Vector3(-1.6,2.5,0),.023,0x999783);rod(c,tv,new THREE.Vector3(.4,1.45,0),new THREE.Vector3(1.4,2.16,0),.023,0x999783);
 c.interact(room,tv,'home-tv','TV · My favorite games');
 const console=new THREE.Group();console.position.set(-9.15,1.71,-5.75);s.add(console);roundBox(c,console,1.42,.75,.18,0x202b2b,0,0,0,.07);roundBox(c,console,.25,.77,.22,0x66bfc4,-.75,0,0,.08);roundBox(c,console,.25,.77,.22,0xd76f59,.75,0,0,.08);roundBox(c,console,1.24,.47,.36,0x303d3c,0,-.21,.1,.05);c.label(console,'SWITCH',.87,.19,'#303d3c','#e7dcc3',0,-.15,.294,100);c.interact(room,console,'home-console','Console · My favorite games');
 const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(-9.1,1.45,-6.0),new THREE.Vector3(-8.6,1.5,-6.6),new THREE.Vector3(-7.8,1.8,-6.65)]);s.add(new THREE.Mesh(new THREE.TubeGeometry(cable,20,.028,6,false),c.material(0x202c2c)));
 const remote=roundBox(c,s,.23,.06,.66,0x263f3b,-6.03,1.025,.25,.03);for(let i=0;i<3;i++)c.cylinder(s,.035,.035,.01,0xd5bc85,-6.03,1.065,.08+i*.14);c.interact(room,remote,'home-remote','Remote · My favorite games');
 for(const x of[-10.4,-4.25]){roundBox(c,s,1.05,1.6,.83,0x263739,x,2.06,-6.5,.07);for(const y of[1.68,2.29]){const speaker=c.cylinder(s,.31,.31,.08,0x82968e,x,y,-6.03);speaker.rotation.x=Math.PI/2;const cone=c.cylinder(s,.17,.17,.085,0x243337,x,y,-5.98);cone.rotation.x=Math.PI/2;}}
 // A video-store bookcase: thick portrait cases, reel windows and labelled spines.
 const shelfX=-.1;for(const x of[-3.76,3.56])c.box(s,.2,6.2,1.35,0x6b4f39,x,3.1,-8.1);
 for(const y of[.34,2.95,5.56,6.2])c.box(s,7.5,.17,1.48,0x9c7852,shelfX,y,-8.1);c.box(s,7.38,5.86,.1,0x3d3b32,shelfX,3.13,-8.78);
 c.label(s,'THE VIDEO ARCHIVE',6.45,.38,'#263f42','#ead9b9',-.1,6.62,-8.8,78);
 studioWorks.forEach((work,i)=>{
  const x=-2.56+(i%3)*2.45,y=i<3?4.27:1.66,tape=new THREE.Group();tape.position.set(x,y,-7.3);s.add(tape);
  roundBox(c,tape,1.55,2.35,.41,0x182a2b,0,0,0,.05);c.box(tape,1.45,2.23,.43,COLORS[i],.025,0,0);
  const cover=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2.15),new THREE.MeshBasicMaterial({map:coverTexture(c,work,COLORS[i]),toneMapped:false}));cover.position.set(.04,0,.226);tape.add(cover);
  const spine=c.label(tape,'FILE '+work.no+' / '+work.title,2.15,.31,'#192c2b','#e5d8bc',-.76,0,0,47);spine.rotation.y=-Math.PI/2;spine.rotation.z=Math.PI/2;
  // The cassette is visible at the opening and on the back of its case.
  c.box(tape,1.24,2.09,.04,0x111f22,0,0,-.241);for(const y of[-.54,.54]){const reel=c.cylinder(tape,.3,.3,.04,0x9faaa2,0,y,-.277,28);reel.rotation.x=Math.PI/2;const hub=c.cylinder(tape,.13,.13,.045,0x223536,0,y,-.3,14);hub.rotation.x=Math.PI/2;}
  c.interact(room,tape,work.id,'Open file · '+work.title);const data={id:work.id,group:tape,home:tape.position.clone(),homeQ:tape.quaternion.clone(),work};room.tapes.push(data);Object.assign(room.objects.get(work.id),{workId:work.id,tape:data});
  for(let j=0;j<4;j++){const spine=c.box(s,.15,2.1,.66,[0x765447,0x42636b,0xa5946c,0xc8b590][j],x+.93+j*.11,y,-8.0);spine.rotation.z=-.06;}
 });
 // A clear route in front of the archive, with a low storage bench.
 roundBox(c,s,4.8,.6,1.2,0x6d796c,0,.65,.8,.1);for(const x of[-2.0,2.0])c.box(s,.14,.39,.84,0x343f35,x,.23,.8);
 c.box(s,.7,.09,.8,0xb18357,-1.4,1,.72);c.box(s,.67,.07,.78,0xddd2b5,-1.34,1.08,.72);
 // One personal desk, a lamp, pencil pot, notebook and bedroom storage.
 c.table(room,8,2.47,5.3,2.35);c.chair(room,8,4.45,Math.PI);roundBox(c,s,2.18,1.37,.15,0x354b4c,7.87,2.6,1.92,.08);c.photo(s,studioWorks.find(w=>w.id==='widget').image,1.99,1.13,7.87,2.6,2.01);c.box(s,1.4,.06,.58,0x42605c,7.87,1.75,2.3);
 const deskObject=c.box(s,.98,.08,.76,0xc89552,9.9,1.76,2.75);c.interact(room,deskObject,'home-desk','Notebook · Desktop Widget Designer');room.objects.get('home-desk').workId='widget';
 c.cylinder(s,.14,.14,.38,0x4f6864,5.78,1.93,2.57);for(let i=0;i<4;i++)rod(c,s,new THREE.Vector3(5.71+i*.04,1.99,2.57),new THREE.Vector3(5.67+i*.07,2.45,2.54),.015,0xd9b266);
 rod(c,s,new THREE.Vector3(10.12,1.72,1.95),new THREE.Vector3(10.12,2.81,1.95),.033,0x3e5250);c.cylinder(s,.2,.32,.32,0xc9b28a,10.12,2.93,1.95);
 buildNewspaper(c,room);
 // Pendant, scattered books, and plants with stems rooted inside their pots.
 c.cylinder(s,.035,.035,1.6,0x2e3b3b,-6.5,6.24,.6);c.cylinder(s,.22,.85,.65,0xa94e33,-6.5,5.16,.6);c.cylinder(s,.78,.78,.035,0xf2ce8b,-6.5,4.83,.6);
 const pendant=new THREE.PointLight(0xffce8c,18,12,2);pendant.position.set(-6.5,4.65,.6);s.add(pendant);
 for(const x of[5.65,9.96]){c.box(s,1.5,.12,.8,0x8b6b45,x,5.72,-8.35);for(let i=0;i<5;i++)c.box(s,.16,.63,.48,[0x7a4e3e,0xaba077,0x426a6b,0xa46441,0xd4b57d][i],x-.48+i*.23,6.08,-8.36);}
 c.plant(room,-10.73,5.2,1.05);c.plant(room,10.76,6.7,.85);

}

export function returnTape(room){
 if(!room?.tapes)return;for(const tape of room.tapes){tape.group.position.copy(tape.home);tape.group.quaternion.copy(tape.homeQ);tape.group.scale.setScalar(1);}room.activeTape=null;room.tapeState='idle';
}
export function pickTape(room,id,reduced){
 returnTape(room);room.activeTape=room.tapes.find(t=>t.id===id);room.tapeState='pulling';room.tapeStarted=performance.now();room.tapeReduced=reduced;
}
export function tickStudio(c,room,now,dt,ease){
 tickNewspaper(c,room,now,ease);
 for(const tape of room.tapes){if(tape===room.activeTape)continue;const hover=tape.id===c.hovered&&!c.reduced;tape.group.position.lerp(tape.home.clone().add(new THREE.Vector3(0,hover?.06:0,hover?.45:0)),ease);tape.group.rotation.y=THREE.MathUtils.lerp(tape.group.rotation.y,hover?-.18:0,ease);}
 if(!room.activeTape)return;
 const tape=room.activeTape,t=room.tapeReduced?1:Math.min((now-room.tapeStarted)/950,1),smooth=t*t*(3-2*t);
 tape.group.position.lerpVectors(tape.home,room.archivePosition,smooth);tape.group.position.y+=Math.sin(Math.PI*t)*.32;tape.group.rotation.set(.025*smooth,-.28*smooth,-.06*smooth);tape.group.scale.setScalar(1+.48*smooth);
 if(t===1)room.tapeState='open';
}

export function architectureHTML(){return `<div class="studio-flow"><span class="flow-eyebrow">NCP / SIMPLIFIED ARCHITECTURE</span><h4>From request to record.</h4><div class="flow-row"><span><b>WEB</b>Nginx</span><i>→</i><span><b>WAS</b>Load balancer<br>Node.js / Express</span><i>→</i><span><b>DATA</b>MySQL</span></div><div class="flow-services"><span>KMS<br><b>Post encryption</b></span><span>Object Storage → Global Edge<br><b>Image delivery</b></span></div><p>GitHub Actions · Deployment</p></div>`;}
