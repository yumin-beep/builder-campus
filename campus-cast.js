import * as THREE from './vendor/three.module.js';

export function makeCampusCast(scene){
 const materials=new Map();const mat=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.83}));return materials.get(color);};
 const mesh=(g,geo,color,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;};
 const box=(g,w,h,d,color,x=0,y=0,z=0)=>mesh(g,new THREE.BoxGeometry(w,h,d),color,x,y,z);
 const ball=(g,r,color,x,y,z)=>mesh(g,new THREE.IcosahedronGeometry(r,1),color,x,y,z);
 const rod=(g,a,b,r,color)=>{const delta=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),m=mesh(g,new THREE.CylinderGeometry(r,r,delta.length(),8),color);m.position.set(...a).addScaledVector(delta,.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;};
 function person({coat=0x436e5b,pants=0xcfc3a7,hair=0x3e382e,skin=0xe5b48b,elder=false,skirt=false}){
  const g=new THREE.Group();box(g,.62,.64,.4,coat,0,1.24,0);if(skirt)mesh(g,new THREE.CylinderGeometry(.27,.43,.48,9),coat,0,.8,0);else box(g,.53,.15,.38,pants,0,.9,0);
  ball(g,.29,skin,0,1.86,.03);ball(g,.285,hair,0,1.94,-.06);box(g,.46,.28,.19,skin,0,1.84,.21);
  for(const x of[-.105,.105])box(g,.042,.043,.04,0x263e35,x,1.89,.323);ball(g,.065,skin,0,1.8,.345);
  if(elder){for(const x of[-.09,.09])ball(g,.105,0xddddcc,x,1.735,.32);ball(g,.17,0xddddcc,0,1.65,.17);}else box(g,.105,.023,.02,0x925f48,0,1.72,.311);
  const arms=[],legs=[];for(const side of[-1,1]){const arm=new THREE.Group();arm.position.set(side*.4,1.5,0);g.add(arm);box(arm,.19,.46,.22,coat,0,-.2,0);ball(arm,.105,skin,0,-.48,0);arms.push(arm);const leg=new THREE.Group();leg.position.set(side*.17,.88,0);g.add(leg);box(leg,.22,.56,.25,pants,0,-.27,0);box(leg,.27,.16,.41,0x31443d,0,-.59,.06);legs.push(leg);}
  g.userData.rig={arms,legs};return g;
 }
 function envelope(g,x,y,z,w=.47){box(g,w,w*.64,.035,0xf2e4bf,x,y,z);rod(g,[x-w/2,y+w*.32,z+.024],[x,y-.025,z+.024],.012,0xa66e4a);rod(g,[x+w/2,y+w*.32,z+.024],[x,y-.025,z+.024],.012,0xa66e4a);}
 const postman=new THREE.Group();scene.add(postman);const wheels=[];
 for(const z of[-.92,.92]){const wheel=new THREE.Group();wheel.position.set(0,.56,z);postman.add(wheel);const tire=mesh(wheel,new THREE.TorusGeometry(.51,.065,8,22),0x31443e);tire.rotation.y=Math.PI/2;const rim=mesh(wheel,new THREE.TorusGeometry(.415,.018,6,22),0xd8d1b5);rim.rotation.y=Math.PI/2;for(let i=0;i<8;i++){const a=i*Math.PI/4;rod(wheel,[0,0,0],[0,Math.sin(a)*.42,Math.cos(a)*.42],.012,0xb4c3b2);}mesh(wheel,new THREE.CylinderGeometry(.07,.07,.2,8),0x687c6a).rotation.z=Math.PI/2;wheels.push(wheel);}
 const back=[0,.56,-.92],crank=[0,.62,-.07],seat=[0,1.2,-.35],head=[0,1.22,.58],front=[0,.56,.92];
 for(const[a,b]of[[back,seat],[seat,crank],[back,crank],[seat,head],[crank,head],[head,front]])rod(postman,a,b,.046,0x466e69);
 box(postman,.42,.1,.39,0x493d30,0,1.27,-.37);rod(postman,[0,1.18,.61],[0,1.56,.64],.034,0xd0c4a2);rod(postman,[-.41,1.56,.66],[.41,1.56,.66],.028,0x364f42);for(const x of[-.4,.4])box(postman,.13,.07,.25,0x514632,x,1.56,.68);
 const bell=mesh(postman,new THREE.SphereGeometry(.105,12,7),0xe5bc5e,-.25,1.62,.68);bell.scale.y=.5;
 const rider=person({coat:0x355876,pants:0x948975,hair:0xd8dacd,elder:true});rider.position.set(0,.57,-.22);rider.rotation.x=.12;postman.add(rider);box(rider,.55,.16,.49,0x355876,0,2.095,-.025);box(rider,.55,.055,.35,0xd4bc83,0,2.065,.3);box(rider,.47,.04,.12,0xd4bc83,0,2.13,.16);rider.userData.rig.arms.forEach(a=>a.rotation.x=-.9);
 box(postman,.7,.53,.6,0xa35940,0,1.03,-1.05);box(postman,.76,.07,.64,0xc98454,0,1.32,-1.05);envelope(postman,0,1.04,-.73,.45);box(postman,.65,.085,.67,0x657166,0,.73,-1.06);
 for(const side of[-1,1]){box(postman,.15,.38,.53,0xa35940,side*.37,.84,-1.08);box(postman,.17,.055,.56,0xdfbd89,side*.37,1.045,-1.08);}
 const crew=[person({coat:0xd5855b,pants:0x586d77,hair:0x403b32}),person({coat:0x83995d,pants:0xdac7a4,hair:0x322f2d,skin:0xc38d64}),person({coat:0x9a87b3,pants:0x465d65,hair:0x65483b})];
 crew.forEach((p,i)=>{scene.add(p);p.visible=false;box(p,.45,.39,.11,[0x315a51,0xdda45d,0xead5a5][i],0,1.15,.3);if(i===1){box(p,.55,.1,.51,0xe2ce84,0,2.1,0);box(p,.55,.06,.25,0xe2ce84,0,2.075,.31);}if(i===2){for(const x of[-.16,.16]){const lens=mesh(p,new THREE.TorusGeometry(.102,.018,5,14),0x3e393b,x,1.885,.34);}box(p,.1,.024,.024,0x3e393b,0,1.885,.34);}});
 const auntie=person({coat:0xc56c49,pants:0x5a5968,hair:0x686c69,skirt:true});scene.add(auntie);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ball(auntie,.115,0x74766e,Math.cos(a)*.26,2.03+Math.sin(a)*.08,-.07);}for(const y of[1.05,1.24,1.4])box(auntie,.042,.042,.02,0xecdcb4,0,y,.209);
 const rig=auntie.userData.rig;rig.arms[1].quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),new THREE.Vector3(.22,-.16,.43).normalize());
 const horn=new THREE.Group();horn.position.set(.62,1.52,.36);horn.rotation.y=.15;auntie.add(horn);const cone=mesh(horn,new THREE.CylinderGeometry(.34,.12,.65,18),0xe2d8b9,0,0,.24);cone.rotation.x=Math.PI/2;const mouth=mesh(horn,new THREE.CylinderGeometry(.295,.295,.027,18),0x495752,0,0,.575);mouth.rotation.x=Math.PI/2;const rim=mesh(horn,new THREE.TorusGeometry(.333,.033,6,20),0xc36341,0,0,.57);box(horn,.13,.3,.13,0x576655,0,-.21,.07);
 // A tote with folded flyers makes her part of the campus, rather than a signpost.
 box(auntie,.33,.46,.2,0xe2b86d,-.49,.86,.02);const strap=mesh(auntie,new THREE.TorusGeometry(.17,.026,5,12,Math.PI),0x996d43,-.49,1.14,.02);envelope(auntie,-.49,.89,.135,.25);
 return{postman,wheels,rider,crew,auntie,horn};
}
