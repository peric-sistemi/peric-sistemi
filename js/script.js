/* PERIĆ SISTEMI – site interactions */
const header=document.querySelector("header");
window.addEventListener("scroll",()=>{if(!header)return;if(window.scrollY>50){header.style.background="rgba(8,8,8,.96)";header.style.padding="0"}else{header.style.background="rgba(10,10,10,.85)"}});

const navToggle=document.querySelector(".nav-toggle");
const mainNav=document.querySelector("#main-nav");
if(navToggle&&mainNav){
  navToggle.addEventListener("click",()=>{
    const open=mainNav.classList.toggle("mobile-open");
    navToggle.setAttribute("aria-expanded",String(open));
    navToggle.setAttribute("aria-label",open?"Zatvori meni":"Otvori meni");
  });
  mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    mainNav.classList.remove("mobile-open");
    navToggle.setAttribute("aria-expanded","false");
    navToggle.setAttribute("aria-label","Otvori meni");
  }));
}

const sections=document.querySelectorAll(".service,.brand,.box,.item,.why-grid div,.process-grid>div,.knowledge-grid a");
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.style.opacity="1";entry.target.style.transform="translateY(0)";observer.unobserve(entry.target)}
    });
  },{threshold:.12});
  sections.forEach(section=>{section.style.opacity="0";section.style.transform="translateY(28px)";section.style.transition="opacity .6s ease,transform .6s ease";observer.observe(section)});
}else{sections.forEach(section=>{section.style.opacity="1"})}

document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",function(e){
  const target=document.querySelector(this.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
}));

const copy=document.querySelector(".copyright");
if(copy)copy.innerHTML=`© ${new Date().getFullYear()} Perić Sistemi. Sva prava zadržana.`;
