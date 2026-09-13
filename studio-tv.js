import {favoriteGames} from './favorite-games.js?v=0c87dde84cf3';

export function televisionScreen(game){
 const i=favoriteGames.indexOf(game);
 return `<div class="tv-picture"><img src="${game.image}" alt="${game.title} official artwork"><div class="tv-screen-bar"><span>YUMIN'S FAVORITES</span><span>${String(i+1).padStart(2,'0')} / 06</span></div><div class="tv-screen-title">${game.title}</div><div class="tv-screen-grain" aria-hidden="true"></div></div>`;
}
export function televisionLibrary(game){
 return `<div class="tv-library-heading"><span>OFF THE CLOCK / MY FAVORITE GAMES</span><h3 id="tv-game-title" tabindex="-1">${game.title}</h3><a href="${game.url}" target="_blank" rel="noopener noreferrer">Official game page ↗</a></div><div class="tv-game-grid" role="group" aria-label="Choose a favorite game">${favoriteGames.map(g=>`<button data-tv-game="${g.id}" aria-pressed="${g.id===game.id}"><img src="${g.image}" alt=""><span>${g.shortTitle??g.title}</span></button>`).join('')}</div>`;
}
