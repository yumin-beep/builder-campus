import * as THREE from './vendor/three.module.js';
import {t as translate,localizeCanvas} from './i18n.js?v=6da7fdff2806';
import {newsItems} from './news-data.js?v=d82bf9f04928';

const sections=[['front','Front page'],['certifications','Certifications'],['learning','Learning'],['honors','Honors'],['fieldwork','Fieldwork']];
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=category=>sections.find(s=>s[0]===category)?.[1]??category;
const source=item=>`<a class="news-source" href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.link??'Read the source')} <span aria-hidden="true">↗</span></a>`;
function article(item,lead=false){return `<article class="news-article${lead?' news-lead':''}"><div class="news-dateline"><span>${escape(label(item.category))}</span><time>${escape(item.date)}</time></div><h3>${escape(item.headline??item.title)}</h3><p class="news-issuer">${escape(item.title)}${item.issuer?` · ${escape(item.issuer)}`:''}</p>${item.image?`<figure class="news-photo"><img src="${escape(item.image)}" alt="${escape(item.imageAlt??item.title)}" loading="lazy">${item.caption?`<figcaption>${escape(item.caption)}</figcaption>`:''}</figure>`:''}<p class="news-deck">${escape(item.summary)}</p>${(item.details??[]).map(t=>`<p>${escape(t)}</p>`).join('')}<footer><span class="news-stamp">${escape(item.status)}</span>${source(item)}</footer></article>`;}
export function newspaperEdition(category='front'){
 const items=category==='front'?newsItems:newsItems.filter(n=>n.category===category);
 if(category==='front'){
  const lead=items.find(n=>n.category==='fieldwork')??items[0],briefs=items.filter(n=>n!==lead);
  return `<div class="news-front-grid">${article(lead,true)}<div class="news-dispatches"><div class="news-section-label">MORE FROM THE STUDIO</div>${briefs.slice(0,2).map(n=>article(n)).join('')}</div></div><div class="news-lower"><h3>On the record.</h3><p>Qualifications, learning and milestones — collected in one place.</p><div class="news-index">${sections.slice(1).filter(([id])=>newsItems.some(n=>n.category===id)).map(([id,title])=>`<section><h4>${title}</h4>${newsItems.filter(n=>n.category===id).map(n=>`<button data-news-section="${id}"><span>${escape(n.title)}</span><small>${escape(n.date)} ↗</small></button>`).join('')}</section>`).join('')}</div></div>`;
 }
 return `<div class="news-edition-heading"><span>THE BUILDER POST / ${escape(label(category)).toUpperCase()}</span><h3>${escape(label(category))}</h3><p>${items.length} ${items.length===1?'entry':'entries'} in this edition.</p></div><div class="news-article-grid">${items.map(n=>article(n)).join('')}</div>`;
}
export function newspaperHTML(){return `<div class="news-utility"><span>YUMIN KANG / PERSONAL ARCHIVE</span><button data-close-news aria-label="Put the newspaper back">Close paper <span aria-hidden="true">×</span></button></div><header class="news-masthead"><span class="news-edition-mark">CAREER<br>EDITION</span><div><p>THE</p><h2 id="news-masthead" tabindex="-1">BUILDER POST</h2></div><span class="news-edition-mark">DAEGU<br>EST. 2026</span></header><div class="news-breaking"><b>EXTRA! EXTRA!</b><span>LEARNING. MAKING. SHOWING UP.</span><span>VOL. 01</span></div><nav class="news-sections" aria-label="Newspaper sections">${sections.filter(([id])=>id==='front'||newsItems.some(n=>n.category===id)).map(([id,title])=>`<button data-news-section="${id}" aria-pressed="${id==='front'}">${title}</button>`).join('')}</nav><div id="news-edition-content">${newspaperEdition()}</div><footer class="news-colophon"><b>THE BUILDER POST</b><span>Yumin Kang · Beyond the projects</span><span>END OF EDITION ◼</span></footer>`;}

export function buildNewspaper(c,room){
 const s=room.scene;const board=c.box(s,5.8,3.15,.2,0x987044,8,4.06,-8.72);c.interact(room,board,'home-news-board','The Builder Post · Credentials & milestones');
 const group=new THREE.Group();group.position.set(8,4.06,-8.53);s.add(group);
 for(let i=2;i>=0;i--){const sheet=c.box(group,5.4,2.92,.018,i%2?0xd3c4a4:0xe8dcc3,i*.035,-i*.027,-i*.025);sheet.rotation.z=(i-1)*.012;}
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=880;const x=canvas.getContext('2d'),tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;localizeCanvas(canvas,tex,()=>{x.fillStyle='#e8dcc3';x.fillRect(0,0,1600,880);
 x.fillStyle='#24372f';x.fillRect(38,40,1524,10);x.fillRect(38,224,1524,8);x.font='bold 30px monospace';x.fillText(translate('YUMIN KANG / CAREER EDITION'),48,92);x.font='bold 125px Georgia';x.fillText(translate('THE BUILDER POST'),48,205);
 x.fillStyle='#ae442f';x.fillRect(40,249,1520,58);x.fillStyle='#f7eacb';x.font='bold 32px sans-serif';x.fillText(translate('EXTRA! EXTRA!   /   BEYOND THE PROJECTS'),60,290);
 x.fillStyle='#24372f';x.font='bold 72px Georgia';x.fillText(translate('Learning. Making.'),52,397);x.fillText(translate('Showing up.'),52,479);x.fillRect(1010,339,3,480);x.font='bold 36px sans-serif';x.fillText(translate('ON THE RECORD'),1060,390);
 const labels=sections.slice(1).filter(([id])=>newsItems.some(n=>n.category===id));labels.forEach(([id,title],i)=>{x.font='bold 32px Georgia';x.fillText(translate(title),1060,456+i*96);x.font='23px monospace';x.fillText(translate(String(newsItems.filter(n=>n.category===id).length)+' ENTRIES'),1060,489+i*96);});
 x.strokeStyle='#24372f';x.lineWidth=6;x.strokeRect(55,532,899,214);x.font='bold 33px monospace';x.fillText(translate('FIELD NOTES / IN PROGRESS'),82,582);for(let i=0;i<3;i++){x.strokeRect(83+i*291,614,234,84);x.font='bold 33px sans-serif';x.fillText(translate(['LEARN','BUILD','SHARE'][i]),118+i*291,670);if(i<2)x.fillText(translate('→'),328+i*291,670);}
 x.font='24px monospace';x.fillText(translate('OPEN THE PAPER  /  READ THE STORIES INSIDE'),54,807);x.fillRect(38,841,1524,5);
 });
 const page=new THREE.Mesh(new THREE.PlaneGeometry(5.32,2.926),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));page.position.z=.025;group.add(page);
 for(const xPos of[-2.32,2.32]){c.box(s,.29,.22,.08,0x334440,8+xPos,5.48,-8.38);c.box(s,.2,.05,.1,0xc5b58c,8+xPos,5.58,-8.34);}
 c.interact(room,group,'home-news','The Builder Post · Read the newspaper');room.news={group,home:group.position.clone(),read:new THREE.Vector3(7.6,4.1,-3.8),active:false};
}
export function returnNewspaper(room){if(!room?.news)return;const n=room.news;n.active=false;n.group.position.copy(n.home);n.group.rotation.set(0,0,0);n.group.scale.setScalar(1);}
export function pickNewspaper(room,reduced){const n=room.news;n.active=true;n.started=performance.now();n.reduced=reduced;}
export function tickNewspaper(c,room,now,ease){const n=room.news;if(!n)return;if(n.active){const t=n.reduced?1:Math.min((now-n.started)/780,1),v=t*t*(3-2*t);n.group.position.lerpVectors(n.home,n.read,v);n.group.rotation.z=-.025*Math.sin(Math.PI*t);n.group.scale.setScalar(1+.15*v);}else{const hover=['home-news','home-news-board'].includes(c.hovered)&&!c.reduced;n.group.position.z=THREE.MathUtils.lerp(n.group.position.z,n.home.z+(hover?.18:0),ease);n.group.rotation.z=THREE.MathUtils.lerp(n.group.rotation.z,hover?-.02:0,ease);}}
