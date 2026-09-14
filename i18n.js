import {koCampus} from './ko-campus.js?v=a9b8fda4d80d';
import {koRoom} from './ko-room.js?v=26265c8a435b';
import {koStudio} from './ko-studio.js?v=54171bfb585f';

const normalize=s=>String(s).replace(/\s+/g,' ').trim();
const extras={
 'Settings':'설정','Language':'언어','Language settings':'언어 설정','Close settings':'설정 닫기',
 'Choose your language.':'언어를 선택하세요.','Your choice applies throughout the campus and is saved for your next visit.':'선택한 언어는 캠퍼스 전체에 적용되며 다음 방문에도 유지됩니다.',
 'Original photographs and game screens keep their original text.':'원본 사진과 게임 화면 속 글자는 그대로 표시됩니다.',
 'Resume PDF':'영문 이력서 PDF','Resume PDF ↓':'영문 이력서 PDF ↓',
 'YUMIN CAMPUS — Yumin Kang':'유민 캠퍼스 — 강유민',
 'Yumin Kang · Builder Campus':'강유민 · 빌더 캠퍼스',
 'Explore Yumin Kang’s builder campus: games made with Claude, a student community, startup projects, personal tools and industry practice.':'강유민의 빌더 캠퍼스를 둘러보세요. Claude와 만든 게임, 동아리, 창업 프로젝트, 개인 개발 도구와 현장실습을 소개합니다.',
 'Games, useful tools and people who build. Explore my interactive portfolio campus.':'게임과 유용한 도구, 그리고 함께 만드는 사람들. 직접 걸으며 탐색하는 포트폴리오 캠퍼스입니다.'
};
const dictionary=new Map(Object.entries({...koCampus,...koRoom,...koStudio,...extras}).map(([a,b])=>[normalize(a),b]));
const folded=new Map([...dictionary].map(([a,b])=>[a.toLowerCase(),b]));
let language='en';try{const saved=localStorage.getItem('campus-language');language=saved==='ko'||saved==='en'?saved:(navigator.language??'').startsWith('ko')?'ko':'en';}catch{}
const sourceText=new WeakMap(),sourceAttributes=new WeakMap(),canvases=new Map();
const excluded='script,style,code,pre,kbd,[data-no-localize]';
let settings,opener,observer,initialized=false;
export const getLanguage=()=>language;

// Keys are the authored English copy; data, URLs and gameplay identifiers never change.
function korean(text,depth=0){
 const key=normalize(text);if(dictionary.has(key))return dictionary.get(key);if(folded.has(key.toLowerCase()))return folded.get(key.toLowerCase());if(depth>5||!/[A-Za-z]/.test(key))return text;
 const rec=value=>korean(value,depth+1);let m;
 if((m=key.match(/^(\d+) projects · Choose a work$/)))return `프로젝트 ${m[1]}개 · 작품을 골라보세요`;
 if((m=key.match(/^(\d+) of 3 little moments found$/)))return `작은 순간 3개 중 ${m[1]}개 발견`;
 if((m=key.match(/^(\d+) (?:entry|entries) in this edition\.$/)))return `이번 지면에 담긴 기록 ${m[1]}건`;
 if((m=key.match(/^(\d+) ENTRIES$/i)))return `${m[1]}건의 기록`;
 if((m=key.match(/^(PROJECT FILE|FILE(?: \d+)?|PROJECT ARCHIVES|SELECTED WORK) \/ (.+)$/)))return `${rec(m[1])} / ${rec(m[2])}`;
 if((m=key.match(/^View photo (\d+): (.+)$/)))return `사진 ${m[1]} 보기: ${rec(m[2])}`;
 if((m=key.match(/^Enter (.+)$/)))return `${rec(m[1])} 입장`;
 if((m=key.match(/^Open file (?:· )?(.+)$/)))return `${rec(m[1])} 파일 열기`;
 if((m=key.match(/^(.+?) (official artwork|project preview|preview)$/)))return `${rec(m[1])} ${m[2]==='official artwork'?'공식 이미지':'미리보기'}`;
 if((m=key.match(/^([“"‘])(.+)([”"’])$/)))return m[1]+rec(m[2])+m[3];
 if((m=key.match(/^(.+?)\s*([↗↓→←])$/)))return rec(m[1])+' '+m[2];
 if((m=key.match(/^([←↺♪])\s*(.+)$/)))return m[1]+' '+rec(m[2]);
 if((m=key.match(/^((?:0?\d+)(?:\s*\/\s*\d+)?)\s+(.+)$/)))return `${m[1]} ${rec(m[2])}`;
 if(key.includes(' · '))return key.split(' · ').map(rec).join(' · ');
 if(key.includes(' / '))return key.split(' / ').map(rec).join(' / ');
 if((m=key.match(/^(FILE|LOCKER|WHITEBOARD|SELECTED WORK|PROJECT FILE|PROJECT ARCHIVES|VHS|VOL\.)\s*(\d.*)$/)))return `${rec(m[1])} ${m[2]}`;
 return text;
}
export function t(value){const raw=String(value??'');if(language==='en'||!raw.trim())return raw;const translated=korean(raw.trim());return raw.match(/^\s*/)[0]+translated+raw.match(/\s*$/)[0];}

function translateNode(node){
 if(!node.parentElement||node.parentElement.closest(excluded)||(!node.data.trim()&&!sourceText.has(node)))return;
 let saved=sourceText.get(node);if(!saved||node.data!==saved.output)saved={source:node.data,output:node.data};
 const next=t(saved.source);if(node.data!==next)node.data=next;saved.output=next;sourceText.set(node,saved);
}
function translateAttributes(el){
 if(el.closest(excluded))return;let saved=sourceAttributes.get(el);if(!saved){saved=new Map();sourceAttributes.set(el,saved);}
 const names=['aria-label','alt','title','placeholder'];if(el.matches('meta[name="description"],meta[property="og:title"],meta[property="og:description"]'))names.push('content');
 for(const name of names){if(!el.hasAttribute(name))continue;const current=el.getAttribute(name);let item=saved.get(name);if(!item||current!==item.output)item={source:current,output:current};const next=t(item.source);if(current!==next)el.setAttribute(name,next);item.output=next;saved.set(name,item);}
}
function translateTree(root){
 if(root.nodeType===Node.TEXT_NODE){translateNode(root);return;}if(root.nodeType!==Node.ELEMENT_NODE||root.matches(excluded))return;
 translateAttributes(root);const walk=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let node;while((node=walk.nextNode())){if(node.nodeType===Node.TEXT_NODE)translateNode(node);else translateAttributes(node);}
}
// Use this for labels updated by the render loop: preserve their source without
// replacing text nodes on every frame or changing the current language back.
export function setLocalizedText(element,source){if(!element)return;const next=t(source);if(element.textContent!==next)element.textContent=next;if(element.childNodes.length===1&&element.firstChild.nodeType===Node.TEXT_NODE)sourceText.set(element.firstChild,{source,output:next});}

// Explicit redraw callbacks keep canvas labels in sync without rebuilding a room,
// changing the camera, or restarting its currently playing project media.
export function localizeCanvas(canvas,texture,draw){
 const update=()=>{draw();texture.needsUpdate=true;};canvases.set(canvas,update);update();texture.addEventListener?.('dispose',()=>canvases.delete(canvas));return update;
}
export function setLanguage(next){
 if(next!=='ko'&&next!=='en')return;language=next;try{localStorage.setItem('campus-language',next);}catch{}
 document.documentElement.lang=language;translateTree(document.documentElement);for(const redraw of canvases.values())redraw();syncControls();window.dispatchEvent(new CustomEvent('campus:languagechange',{detail:{language}}));
}
function syncControls(){
 document.querySelectorAll('[data-language-button]').forEach(b=>{const label=b.querySelector('[data-language-current]'),text=language==='ko'?'한국어':'EN';if(label&&label.textContent!==text)label.textContent=text;});
 settings?.querySelectorAll('[data-set-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setLanguage===language)));
}
export function languageButton(){return '<button type="button" class="language-trigger" data-language-button aria-label="Language settings" title="Language settings"><span aria-hidden="true">⚙</span><span data-language-current data-no-localize>EN</span></button>';}
export function initLocalization(){
 if(initialized)return;initialized=true;
 document.querySelectorAll('[data-language-slot]').forEach(slot=>{slot.outerHTML=languageButton();});
 settings=document.createElement('dialog');settings.id='language-dialog';settings.setAttribute('aria-labelledby','language-title');settings.innerHTML='<header><span>Settings</span><button type="button" data-close-language aria-label="Close settings">×</button></header><h2 id="language-title">Choose your language.</h2><div class="language-options" role="group" aria-label="Language"><button type="button" data-set-language="ko" aria-pressed="false" data-no-localize lang="ko"><b>가</b><span>한국어</span><i aria-hidden="true">✓</i></button><button type="button" data-set-language="en" aria-pressed="false" data-no-localize lang="en"><b>A</b><span>English</span><i aria-hidden="true">✓</i></button></div><p>Your choice applies throughout the campus and is saved for your next visit.</p><small>Original photographs and game screens keep their original text.</small>';
 document.body.appendChild(settings);
 document.addEventListener('click',e=>{const button=e.target.closest('[data-language-button]');if(button){opener=button;syncControls();settings.showModal();}const choice=e.target.closest('[data-set-language]');if(choice)setLanguage(choice.dataset.setLanguage);if(e.target.closest('[data-close-language]'))settings.close();});
 settings.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
 settings.addEventListener('click',e=>{if(e.target===settings){const r=settings.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)settings.close();}});
 observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData'){if(r.target.isConnected)translateNode(r.target);}else if(r.type==='attributes'){translateAttributes(r.target);}else for(const node of r.addedNodes)if(node.isConnected)translateTree(node);}syncControls();});
 observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','title','placeholder','content']});
 setLanguage(language);
}
