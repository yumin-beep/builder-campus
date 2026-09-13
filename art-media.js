export const hasArtworkMotion=art=>Boolean(art.video||art.animation||art.slides?.length>1);

export function artworkMediaHTML(art,animate=false){
 const src=animate?(art.animation??art.slides?.[0]??art.image):art.image;
 const label=art.imageAlt??`${art.title} project preview`;
 const media=animate&&art.video
  ? `<video data-art-video src="${art.video}" poster="${art.image}" autoplay muted loop playsinline preload="auto" aria-label="${label}"></video>`
  : `<img data-art-image src="${src}" alt="${art.layers?'':label}">`;
 const layers=(art.layers??[]).map(layer=>`<img class="art-layer" src="${layer.src}" alt="" style="left:${layer.x*100}%;top:${layer.y*100}%;width:${layer.w*100}%;height:${layer.h*100}%">`).join('');
 return `<div class="art-preview" data-art-id="${art.id}"${art.layers?` role="img" aria-label="${label}"`:''}>${media}${layers}</div>`;
}

// Each surface owns its playback, so moving away from an artwork does not stop
// the selected project's preview. Disposing it releases its timer and video.
export function mountArtworkMedia(host,art,{animate=true}={}){
 host.innerHTML=artworkMediaHTML(art,animate);
 const video=host.querySelector('[data-art-video]');
 const picture=host.querySelector('[data-art-image]');
 let timer=null,index=0,disposed=false;
 const stop=()=>{clearInterval(timer);timer=null;video?.pause();};
 const start=()=>{
  if(disposed||!animate||document.hidden)return;
  if(video){video.muted=true;video.play().catch(()=>{});return;}
  if(art.animation){picture.src=art.animation;return;}
  if(art.slides?.length>1&&!timer){
   timer=setInterval(()=>{
    index=(index+1)%art.slides.length;
    picture.src=art.slides[index];
   },art.slideDuration??1500);
  }
 };
 const onVisibility=()=>{
  if(document.hidden){stop();if(art.animation&&picture)picture.src=art.image;}
  else start();
 };
 if(animate)document.addEventListener('visibilitychange',onVisibility);
 start();
 return ()=>{
  disposed=true;stop();document.removeEventListener('visibilitychange',onVisibility);
  if(video){video.removeAttribute('src');video.load();}
  host.replaceChildren();
 };
}
