import * as THREE from './vendor/three.module.js';
import {studioWorks,studioStations} from './studio-data.js?v=0b3273fb558a';

export function buildStudio(c,room){
 const s=room.scene;c.floor(room,0xe8e6dc,0xc5b196);
 for(let x=-9.5;x<10;x++)c.box(s,.025,.01,13.9,0xb49e83,x,.081,0);
 c.label(s,"BUILDER’S STUDIO",11,.78,'#e8e6dc','#293f53',0,5.85,-6.83,96);
 c.label(s,'IDEAS INTO EVERYDAY TOOLS',8,.3,'#e8e6dc','#7a817a',0,5.12,-6.83,55);
 // A tall window, material shelves and lamps make this a working studio.
 c.box(s,.06,3.8,5.4,0xa9c9cd,-9.84,3.5,1.2);
 for(const z of[-1.5,1.2,3.9])c.box(s,.16,4,.12,0xf9f1db,-9.72,3.5,z);
 c.box(s,.16,.12,5.5,0xf9f1db,-9.72,3.6,1.2);
 c.plant(room,-8.4,4.8);c.plant(room,8.7,4.4);
 room.stations=new Map();
 for(const station of studioStations){
  const {x,z}=station;c.table(room,x,z,5.3,2.35);c.chair(room,x,z+2.1,Math.PI);
  c.box(s,5.2,.025,3.9,station.color,x,.09,z+.6);
  c.label(s,station.label.toUpperCase(),4.65,.4,'#f0e7d5','#304857',x,1.32,z+1.19,75);
  const g=new THREE.Group();g.position.set(x,0,z-.5);s.add(g);
  c.box(g,4.7,2.82,.22,0x283b4a,0,3.47,0);c.box(g,.15,.42,.2,0x283b4a,0,1.91,0);c.box(g,1.4,.07,.65,0x283b4a,0,1.72,.1);
  const screen=c.label(g,'',4.43,2.49,'#18242e','#ffffff',0,3.47,.119);
  const work=studioWorks.find(w=>w.id===station.defaultId);c.photo(g,work.image,4.43,2.49,0,3.47,.128);
  c.interact(room,g,work.id,work.title);Object.assign(room.objects.get(work.id),{screen,workId:work.id,station:station.id});
  room.stations.set(station.id,{...station,screen});
  // A keyboard, notebook and articulated task lamp on each desk.
  c.box(s,1.65,.08,.52,0xe8e6d9,x-.25,1.75,z+.55);
  for(let row=0;row<3;row++)for(let col=0;col<10;col++)c.box(s,.1,.012,.09,0xaab2a9,x-.9+col*.14,1.798,z+.39+row*.13);
  c.box(s,.56,.04,.75,station.color,x+1.75,1.74,z+.6);
  c.cylinder(s,.24,.24,.07,0x536363,x-2.1,1.75,z-.3);c.box(s,.07,1.8,.07,0x536363,x-2.1,2.6,z-.3);c.box(s,.7,.07,.07,0x536363,x-1.79,3.5,z-.3);c.cylinder(s,.25,.14,.25,0xe2c092,x-1.5,3.37,z-.3);
 }
 function prop(id,title,stationId,x,y,z,draw,mode){
  const g=new THREE.Group();g.position.set(x,y,z);s.add(g);draw(g);c.interact(room,g,id,title);
  const station=room.stations.get(stationId);Object.assign(room.objects.get(id),{workId:id,screen:station.screen,station:stationId,mode});return g;
 }
 // Startup program board and a tiny table setting beside the product monitor.
 prop('modoo','Modoo Startup · Program board','startup',-6.25,4.5,-6.52,g=>{
  c.box(g,4.5,1.4,.12,0x976f4c);c.box(g,4.3,1.2,.06,0xf3e6c7,0,0,.09);
  c.label(g,'MODOO STARTUP / 2026',3.9,.33,'#f3e6c7','#3f5260',0,.26,.131,83);
  c.label(g,'ROUND 1 SELECTED',3.1,.3,'#d4dec2','#36513f',0,-.25,.135,105);
 });
 c.cylinder(s,.42,.42,.045,0xf8e9cd,-8.02,1.75,-2.8);c.cylinder(s,.3,.22,.22,0xb26343,-8.02,1.87,-2.8);
 // Microphone = On-Geul; small device screen = the shared widget project.
 prop('ongeul','On-Geul · Recording microphone','workbench',-1.95,1.75,.55,g=>{
  c.cylinder(g,.32,.32,.08,0x344956,0,.03,0);c.box(g,.09,.65,.09,0x344956,0,.37,0);c.cylinder(g,.19,.19,.6,0x879b9f,0,.89,0);for(let i=0;i<5;i++)c.box(g,.32,.025,.01,0x344956,0,.71+i*.09,.18);
 });
 prop('widget','Desktop Widget Designer · Device shelf','workbench',2.1,2.22,.45,g=>{
  c.box(g,1.25,.91,.12,0x263e4e);c.photo(g,studioWorks.find(w=>w.id==='widget').image,1.12,.7,0,0,.07);c.box(g,.7,.07,.4,0x263e4e,0,-.47,0);
 });
 // Practicum badge and server are independently selectable physical objects.
 prop('ncp-badge','CloudSquare · Practicum badge','industry',4.34,1.91,-2.78,g=>{
  c.box(g,.73,.06,1,0xd5e0e7);const badge=c.label(g,'CLOUDSQUARE',.66,.42,'#e9eff0','#294957',0,.04,0,87);badge.rotation.x=-Math.PI/2;
 },'role');room.objects.get('ncp-badge').workId='ncp';
 prop('ncp-server','NCP · Explore the architecture','industry',8.27,1.72,-3,g=>{
  c.box(g,.8,1.27,.9,0x293d4b,0,.64,0);for(let i=0;i<3;i++){c.box(g,.65,.23,.05,0x78919b,0,.29+i*.34,.47);c.box(g,.08,.065,.025,0xb2d99e,.22,.29+i*.34,.51);}
 },'architecture');room.objects.get('ncp-server').workId='ncp';
 c.label(s,'CLOUDSQUARE / JAN–FEB 2026',4.7,.4,'#e8e6dc','#506677',6.25,4.85,-6.82,67);
 c.label(s,'WEB  →  WAS  →  DB',4.4,.5,'#2c4559','#e7eddb',6.25,4.13,-6.78,104);
 c.box(s,4.2,.12,1,0xa0aaa0,0,.7,4.7);for(const x of[-1.65,1.65])c.box(s,.14,.68,.8,0x5c7067,x,.35,4.7);
 c.label(s,'MAKE IT USEFUL.',6,.35,'#c5b196','#536250',0,.095,3.3,91).rotation.x=-Math.PI/2;
}

export function architectureHTML(){return `<div class="studio-flow"><span class="flow-eyebrow">NCP / SIMPLIFIED ARCHITECTURE</span><h4>From request to record.</h4><div class="flow-row"><span><b>WEB</b>Nginx</span><i>→</i><span><b>WAS</b>Load balancer<br>Node.js / Express</span><i>→</i><span><b>DATA</b>MySQL</span></div><div class="flow-services"><span>KMS<br><b>Post encryption</b></span><span>Object Storage → Global Edge<br><b>Image delivery</b></span></div><p>GitHub Actions · Deployment</p></div>`;}
