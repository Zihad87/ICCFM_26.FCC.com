const menuToggle=document.querySelector("#menuToggle");
const nav=document.querySelector("#primaryNav");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(menuToggle&&nav){
  menuToggle.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded",String(open));
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
  }));
}

document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",event=>{
  const target=document.querySelector(link.getAttribute("href"));
  if(target){
    event.preventDefault();
    target.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"});
  }
}));

// Progressive reveal: content remains visible if IntersectionObserver is unavailable.
const revealTargets=document.querySelectorAll(
  ".section-head,.podium-card,.final-strip-left,.final-strip-right,.golden-boot,.scorer-card,.gallery-head,.photo,.values-band>*,.footer>*"
);
if(!reduceMotion&&"IntersectionObserver" in window){
  document.documentElement.classList.add("motion-ready");
  revealTargets.forEach((element,index)=>{
    element.classList.add("reveal-item");
    if(element.matches(".podium-card")&&index%2===0) element.classList.add("reveal-left");
    if(element.matches(".scorer-card")&&index%2===1) element.classList.add("reveal-right");
  });
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.12,rootMargin:"0px 0px -35px 0px"});
  revealTargets.forEach(element=>observer.observe(element));
}

// Gentle ambient light follows a mouse on desktop only; no pointer tracking on touch screens.
if(!reduceMotion&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  let pointerFrame=0;
  window.addEventListener("pointermove",event=>{
    if(pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame=requestAnimationFrame(()=>{
      document.documentElement.style.setProperty("--pointer-x",event.clientX+"px");
      document.documentElement.style.setProperty("--pointer-y",event.clientY+"px");
    });
  },{passive:true});
}
