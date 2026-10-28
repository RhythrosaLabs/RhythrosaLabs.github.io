(function(){
const films=[...document.querySelectorAll('.proof-media video')];
const hero=document.querySelector('.proof-feature video');
if(!hero)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=false,automaticPause=false;
hero.addEventListener('pause',()=>{if(automaticPause)automaticPause=false;else userPaused=true;});
function pauseHero(){if(!hero.paused){automaticPause=true;hero.pause();}}
films.forEach(v=>v.addEventListener('play',()=>{if(v!==hero)pauseHero();films.forEach(other=>{if(other!==v&&other!==hero)other.pause()});}));
new IntersectionObserver(entries=>{entries.forEach(e=>{if(reduced.matches||!e.isIntersecting)pauseHero();else if(e.intersectionRatio>.6&&!userPaused)hero.play().catch(()=>{});});},{threshold:[0,.6]}).observe(hero);
reduced.addEventListener('change',()=>{if(reduced.matches)pauseHero();});
})();