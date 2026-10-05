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

// Perić Sistemi favicon
if(document.head&&!document.querySelector('link[rel="icon"]')){
  const favicon=document.createElement("link");
  favicon.rel="icon";
  favicon.type="image/svg+xml";
  favicon.href="/favicon.svg?v=1";
  document.head.appendChild(favicon);
}

/* SEO entity / structured-data layer */
(function(){
  const site="https://pericsistemi.rs";
  const youtube="https://www.youtube.com/@pericsistemi";
  const instagram="https://www.instagram.com/peric.sistemi/";

  function addJsonLd(data){
    const s=document.createElement("script");
    s.type="application/ld+json";
    s.textContent=JSON.stringify(data);
    document.head.appendChild(s);
  }

  // Strengthen the existing homepage Organization entity with real external profiles.
  document.querySelectorAll('script[type="application/ld+json"]').forEach(s=>{
    try{
      const data=JSON.parse(s.textContent);
      if(!data||!data["@graph"])return;
      let changed=false;
      data["@graph"].forEach(item=>{
        if(item["@type"]==="Organization"&&item["@id"]===site+"/#organization"){
          item.sameAs=Array.from(new Set([...(item.sameAs||[]),instagram,youtube]));
          item.email="milosperic93@gmail.com";
          changed=true;
        }
      });
      if(changed)s.textContent=JSON.stringify(data);
    }catch(e){}
  });

  // Make the site's real external profiles discoverable from every page.
  document.querySelectorAll("footer .footer").forEach(footer=>{
    const columns=footer.querySelectorAll(":scope > div");
    if(!columns.length)return;
    const contact=columns[1]||columns[0];
    if(!contact)return;
    const wrap=document.createElement("p");
    wrap.className="seo-social-links";
    wrap.innerHTML=`YouTube: <a href="${youtube}" target="_blank" rel="me noopener">@pericsistemi</a><br>Instagram: <a href="${instagram}" target="_blank" rel="me noopener">@peric.sistemi</a>`;
    if(!contact.querySelector('a[href*="youtube.com/@pericsistemi"]'))contact.appendChild(wrap);
  });

  // Add a ProfessionalService entity without inventing a street address.
  if(!document.querySelector('script[data-peric-service-schema]')){
    const s=document.createElement("script");
    s.type="application/ld+json";
    s.dataset.pericServiceSchema="true";
    s.textContent=JSON.stringify({
      "@context":"https://schema.org",
      "@type":"ProfessionalService",
      "@id":site+"/#service",
      "name":"PERIĆ SISTEMI – Automatika i Elektroinstalacije",
      "url":site+"/",
      "logo":site+"/images/logo.png",
      "telephone":"+381655764215",
      "email":"milosperic93@gmail.com",
      "priceRange":"€€",
      "areaServed":{"@type":"Country","name":"Serbia"},
      "knowsAbout":["ugradnja motora za kapije","motori za klizne kapije","motori za dvokrilne kapije","automatika za kapije","servis automatike","fotocelije za kapije","elektroinstalacije"],
      "sameAs":[instagram,youtube]
    });
    document.head.appendChild(s);
  }

  // Add BreadcrumbList only where the page does not already provide one.
  const hasBreadcrumb=[...document.querySelectorAll('script[type="application/ld+json"]')].some(s=>s.textContent.includes('BreadcrumbList'));
  const path=window.location.pathname.replace(/^\/+|\/+$/g,"");
  if(path && !hasBreadcrumb){
    const h1=document.querySelector("h1");
    const name=(h1?h1.textContent:document.title.split("|")[0]).trim();
    addJsonLd({
      "@context":"https://schema.org",
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Početna","item":site+"/"},
        {"@type":"ListItem","position":2,"name":name,"item":site+"/"+path}
      ]
    });
  }

  // Improve image semantics where the HTML has no useful alt text; decorative images remain untouched.
  document.querySelectorAll("img").forEach(img=>{
    if(img.getAttribute("aria-hidden")==="true")return;
    const alt=(img.getAttribute("alt")||"").trim();
    if(!alt){
      const src=img.getAttribute("src")||"";
      const file=(src.split("/").pop()||"").replace(/\.[^.]+$/,"" ).replace(/[-_]+/g," ").replace(/\s+/g," ").trim();
      if(file)img.setAttribute("alt",`Perić Sistemi – ${file}`);
    }
    if(!img.hasAttribute("loading")&&!img.closest(".hero"))img.setAttribute("loading","lazy");
  });

  // Useful, genuine FAQ content on the homepage. It is intentionally not added to every page.
  if(path==="" && !document.querySelector(".seo-faq")){
    const faq=document.createElement("section");
    faq.className="knowledge seo-faq";
    faq.setAttribute("aria-labelledby","seo-faq-title");
    faq.innerHTML=`<div class="container"><h2 id="seo-faq-title">Česta pitanja o ugradnji motora za kapije</h2><p class="subtitle">Odgovori na najčešća pitanja pre izbora i ugradnje automatike.</p><div class="knowledge-grid"><div><strong>Koliko košta ugradnja motora za kapiju?</strong><span>Cena zavisi od tipa i težine kapije, dužine, mehanike, intenziteta korišćenja i izabrane opreme. Za kapije do 400 kg cena usluge sa opremom može početi od 550 € kada konkretna konfiguracija to omogućava.</span></div><div><strong>Da li Perić Sistemi radi širom Srbije?</strong><span>Da. Ugradnja i servis rade se na terenu širom Srbije, uz prethodnu procenu uslova na objektu.</span></div><div><strong>Kako se bira odgovarajući motor?</strong><span>Ne gleda se samo masa kapije. Bitni su i dužina, stanje mehanike, nagib, broj ciklusa i uslovi korišćenja.</span></div><div><strong>Da li radite pripremu instalacije?</strong><span>Da. Moguće je planirati napajanje, kablove za motor, fotocelije, signalnu lampu i druge elemente pre završetka radova na objektu.</span></div><div><strong>Da li servisirate postojeću automatiku?</strong><span>Da. Radi se dijagnostika, podešavanje, programiranje i otklanjanje kvarova, u zavisnosti od sistema i dostupnosti delova.</span></div></div></div>`;
    const main=document.querySelector("main");
    if(main)main.appendChild(faq);
    addJsonLd({
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"Koliko košta ugradnja motora za kapiju?","acceptedAnswer":{"@type":"Answer","text":"Cena zavisi od tipa i težine kapije, dužine, mehanike, intenziteta korišćenja i izabrane opreme. Za kapije do 400 kg cena može početi od 550 € kada konkretna konfiguracija to omogućava."}},
        {"@type":"Question","name":"Da li Perić Sistemi radi širom Srbije?","acceptedAnswer":{"@type":"Answer","text":"Da. Ugradnja i servis rade se na terenu širom Srbije, uz prethodnu procenu uslova na objektu."}},
        {"@type":"Question","name":"Kako se bira odgovarajući motor?","acceptedAnswer":{"@type":"Answer","text":"Pored mase kapije važni su dužina, stanje mehanike, nagib, broj ciklusa i uslovi korišćenja."}},
        {"@type":"Question","name":"Da li radite pripremu instalacije?","acceptedAnswer":{"@type":"Answer","text":"Da. Moguće je planirati napajanje i kablove za motor, fotocelije, signalnu lampu i druge elemente automatike."}},
        {"@type":"Question","name":"Da li servisirate postojeću automatiku?","acceptedAnswer":{"@type":"Answer","text":"Da. Radi se dijagnostika, podešavanje, programiranje i otklanjanje kvarova, u zavisnosti od sistema i dostupnosti delova."}}
      ]
    });
  }
})();
