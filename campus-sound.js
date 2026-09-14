export class CampusSound{
 constructor(){this.enabled=true;try{this.enabled=localStorage.getItem('campus-sounds')!=='off';}catch{}this.ctx=null;this.master=null;}
 unlock(){if(!this.enabled)return;try{if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=.055;this.master.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}catch{}}
 toggle(){this.enabled=!this.enabled;try{localStorage.setItem('campus-sounds',this.enabled?'on':'off');}catch{}if(this.master)this.master.gain.setValueAtTime(this.enabled?.055:0,this.ctx.currentTime);if(this.enabled)this.unlock();return this.enabled;}
 tone(frequency,delay,duration,gain=1,type='sine'){
  if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;const start=this.ctx.currentTime+delay,osc=this.ctx.createOscillator(),env=this.ctx.createGain();osc.type=type;osc.frequency.value=frequency;env.gain.setValueAtTime(0,start);env.gain.linearRampToValueAtTime(gain,start+.008);env.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(env);env.connect(this.master);osc.start(start);osc.stop(start+duration+.02);osc.onended=()=>{osc.disconnect();env.disconnect();};
 }
 bell(){for(const delay of[0,.19]){this.tone(1760,delay,.7,.7);this.tone(2637,delay,.48,.25);this.tone(3520,delay,.3,.12);}}
 chatter(){this.tone(520,0,.14,.28,'triangle');this.tone(660,.13,.18,.3,'triangle');this.tone(780,.29,.24,.22,'triangle');}
 megaphone(){this.tone(440,0,.2,.2,'triangle');this.tone(587,.18,.28,.2,'triangle');}
 quiet(){if(this.master)this.master.gain.setValueAtTime(0,this.ctx.currentTime);}
 audible(){if(this.master)this.master.gain.setValueAtTime(this.enabled?.055:0,this.ctx.currentTime);}
}
