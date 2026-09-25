import {artworks} from './room-data.js?v=213f48ccc11f';

// The widget is the same case and media object in both rooms.
const widget=artworks.find(work=>work.id==='widget');
export const studioProjects=[
 {id:'searchprice',no:'07',title:'Babsangmeori / SearchPrice',station:'startup',type:'Team project · Five-food prototype',tools:'Food classification · Recipe data · KAMIS',image:'./assets/studio/searchprice-prototype.png',status:'Five-food prototype',
  description:'A food photograph becomes an estimate of its ingredient costs.',
  problem:'Ingredient costs are hard to judge from a finished dish or a delivery menu.',
  role:'I contributed food classification, recipe data and KAMIS price integration to connect a recognized dish with an ingredient-cost estimate.',
  result:'A prototype covering five Korean foods, developed alongside the 2026 Modoo Startup program. The output is an estimate, not an exact purchase cost.',
  detail:'Original prototype screenshot. The percentage shown is one example’s classification confidence.',
  url:'https://app.notion.com/p/3d2cea20cae181948da8fe7ba33ceb27',link:'Read the project record',links:[['Visit the landing page','https://babsangmeori.pages.dev/']]},
 {id:'stayfinder',no:'08',title:'StayFinder',station:'workbench',type:'Personal project · Sole developer',tools:'Search · Availability · Filters · Caching',image:'./assets/studio/stayfinder.jpg',status:'Completed for personal use',
  description:'One place to compare accommodation across multiple sources.',
  problem:'Checking prices and available dates meant repeatedly switching between accommodation websites.',
  role:'I built the tool independently, normalizing results from multiple sources and implementing calendar availability, filters and caching.',
  result:'A completed personal comparison tool for finding stays that match a location and travel dates.',
  detail:'Original search interface. Open the project record for the implementation notes.',
  url:'https://app.notion.com/p/3d2cea20cae181d1ab6bf1ced5d0c562',link:'Read the project record'},
 {id:'ongeul',no:'09',title:'On-Geul',station:'workbench',type:'Team project · Team lead & backend',tools:'Speech-to-text · Gemini · FastAPI',image:'./assets/studio/on-geul.jpg',status:'Google AI Agent Challenge submission',
  description:'Turn recordings into structured documents.',
  problem:'Useful conversations and voice notes still require time to transcribe, organize and turn into a usable document.',
  role:'As team lead and backend developer, I implemented speech-to-text, Gemini document generation, FastAPI integration and document status handling.',
  result:'A team submission to the Google AI Agent Challenge. The prototype connects audio input to document generation; persistence work remains.',
  detail:'Original audio-upload and document-type selection screen.',
  url:'https://app.notion.com/p/3d2cea20cae1819eaeccddb8da37f3d0',link:'Read the project record',links:[['Explore the code','https://github.com/Exxising/on-geul']]},
 {id:'ncp',no:'10',title:'NCP 3-Tier Architecture PoC',station:'industry',type:'CloudSquare practicum · Individual assignment',tools:'Nginx · Node.js / Express · MySQL',image:'./assets/studio/ncp-board.png',status:'Completed training PoC · Jan–Feb 2026',
  description:'Build and deploy a bulletin board across three cloud tiers.',
  problem:'A cloud application needs clear boundaries between its web layer, application logic and data.',
  role:'During my CloudSquare practicum, I designed the Web / WAS / DB structure and implemented authentication, posts, uploads, security settings and deployment.',
  result:'A completed individual NCP training PoC, with GitHub Actions deployment. Production monitoring, recovery and autoscaling were outside the assignment’s scope.',
  detail:'Original bulletin board screenshot. The architecture tab explains the cloud setup.',
  url:'https://app.notion.com/p/eedcea20cae182c6a77581abc2ad4b9d',link:'Read the practicum record',links:[['Explore the code','https://github.com/yumin-beep/ncp-3tier-architecture']]}
];
export const startupProgram={
  "id": "modoo",
  "no": "2026",
  "title": "Modoo Startup · From Plan to Product",
  "station": "startup",
  "activity": true,
  "type": "Startup programs · 2026",
  "tools": "Business plan · Pitch research · Development",
  "image": "./assets/studio/startup-2026/team.jpg",
  "slides": [
    "./assets/studio/startup-2026/team.jpg",
    "./assets/studio/startup-2026/schedule.jpg",
    "./assets/studio/startup-2026/theme.jpg",
    "./assets/studio/startup-2026/festival.jpg"
  ],
  "status": "Second intake · University League Round 2 confirmed",
  "description": "A game-studio venture centered on Debug Master, currently in prototype planning. My work spans business planning and pitch preparation, with development responsibilities assigned.",
  "problem": "Turn a game-studio idea into a business plan and a pitch the team can present, while contributing as a developer.",
  "role": "I wrote the business plan, researched and structured the pitch deck, and supported the team leader with pitch preparation and rehearsals. I am also assigned a development role; specific features and technologies have not been finalized. In the earlier Babsangmeori venture, I worked on the prototype, landing page, business plan and activity reports.",
  "result": "이게제프 secured Round 2 advancement in the second intake of Modoo Startup’s University League. Separately, Babsangmeori was selected for Round 1 in the earlier intake, completed its submission, and did not advance to Round 2. Debug Master remains in prototype planning; implementation details and individual development deliverables are not yet confirmed.",
  "detail": "University Startup Festival: team photo, presentation schedule, hackathon theme and opening event.",
  "url": "https://app.notion.com/p/3e6cea20cae18185977ec259e0682295",
  "link": "Read the university league record",
  "links": [
    [
      "Read the Babsangmeori program record",
      "https://app.notion.com/p/3d2cea20cae181a390d1d1e2cd51d3f6"
    ]
  ]
};
export const studioWorks=[...studioProjects,startupProgram,widget];
export function studioStory(work){return work.id==='widget'?[
 ['The idea','A visual editor for composing and shaping desktop widgets.'],
 ['My role',work.description],
 ['The result',work.detail]
 ]:[['The problem',work.problem],['My role',work.role],['The result',work.result]];}
export function studioLinks(work){return [...(work.links??[]),[work.link,work.url]].map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('');}
