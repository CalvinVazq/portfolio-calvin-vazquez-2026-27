import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowUpRight, Instagram, Youtube, Linkedin, MapPin } from 'lucide-react';
import { CustomCursor } from './CustomCursor';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ProjectPage, projectSlugs } from './ProjectPage';

gsap.registerPlugin(ScrollTrigger);
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './style.css';

const img=(id:string,_w=900)=>`/assets/${id}.jpg`;
const photos={portrait:'/assets/calvin-portrait.png', car:img('photo-1503376780353-7e6692767b70'), city:'/assets/hkeoDW4miITxdO5PIHdUlMMMsQ.jpg', bubbles:img('photo-1507473885765-e6ed057f782c',1600), person1:'/assets/9ks0iJupS1dwbisA8qg57rpvew.png',person2:'/assets/0kOStRplO1Gt8W5IPYlhUi0pYw.png', person3:'/assets/juEkxEyXPBZsdbqUMmxoaqHp8o.jpg'};
const projects=[
  {title:'BRANDING DE CAMPAGNE POLITIQUE', client:'Union Communale Lucens'},
  {title:'PHOTOGRAPHIE AUTOMOBILE', client:'Mercedes-AMG CLA 45 S'},
  {title:'DÉVELOPPEMENT D’UN CMS', client:'Aubore'},
  {title:'BRANDING FITNESS COACHING & SITE WEB', client:'Velia'},
  {title:'BRANDING STREET WORKOUT & SITE WEB', client:'Swiss Street Workout'},
  {title:'IDENTITÉ VISUELLE PREMIUM & SITE WEB', client:'Stilla Oils'},
  {title:'BRANDING SPORTIF & SITE WEB', client:'Tennis Club de Lucens'},
  {title:'PRODUCTION PHOTO ÉVÉNEMENTIELLE', client:"Soirée de gym d'Aubonne"},
  {title:'TRAILER VIDÉO CROSSFIT', client:'Swiss Police Throwdown'},
];
const projectImages=['/assets/ucl-apercu.png','/assets/mercedes-apercu.png','/assets/aubore-apercu.png','/assets/velia-apercu.png','/assets/street-workout-apercu.png','/assets/stilla-apercu.png','/assets/tennis-lucens-apercu.png','/assets/aubonne-apercu.png','/assets/crossfit-apercu.png',img('photo-1552664730-d307ca884978'),img('photo-1557200134-90327ee9fafa')];
const services=[['01','CRÉATIVITÉ','Imaginer des concepts uniques qui sortent des standards.','/assets/qualite-creativite.webp'],['02','RIGUEUR','Soigner chaque détail, de la première idée au résultat final.','/assets/qualite-rigueur.webp'],['03','ADAPTABILITÉ',"M’adapter à chaque projet, chaque univers et chaque défi.",'/assets/qualite-adaptabilite.webp'],['04','AUTONOMIE','Gérer un projet de A à Z, avec méthode et efficacité.','/assets/qualite-autonomie.webp']];
function Navbar({project=false}:{project?:boolean}){
  const prefix=project?'/':'';
  const [menuOpen,setMenuOpen]=useState(false);
  const menuRef=useRef<HTMLDivElement>(null);
  const toggleRef=useRef<HTMLButtonElement>(null);
  useLayoutEffect(()=>{
    if(!menuOpen)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setMenuOpen(false);toggleRef.current?.focus();return}
      if(event.key!=='Tab')return;
      const items=menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if(!items?.length)return;
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus()}
    };
    const onResize=()=>{if(window.innerWidth>700)setMenuOpen(false)};
    document.addEventListener('keydown',onKeyDown);
    window.addEventListener('resize',onResize);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',onKeyDown);window.removeEventListener('resize',onResize)};
  },[menuOpen]);
  const closeMenu=()=>setMenuOpen(false);
  return createPortal(<>
    <header className="hero-nav">
      <div className="hero-available"><span/><strong>DISPONIBLE POUR PROJET</strong></div>
      <nav className="hero-nav-pill" aria-label="Navigation principale"><a href={prefix+'#expertise'}>EXPERTISE</a><a href={prefix+'#works'}>PROJETS</a><a href={prefix+'#top'} className="hero-brand" aria-label="Retour à l'accueil"><img src="/assets/calvin-logo.png" alt=""/></a><a href={prefix+'#references'}>RÉFÉRENCES</a><a href={prefix+'#contact'}>CONTACT</a></nav>
      <a className="hero-contact" href="mailto:contact@calvinvazquez.ch"><span>CONTACT@CALVINVAZQUEZ.CH</span><i><ArrowUpRight aria-hidden="true"/></i></a>
      <button ref={toggleRef} className="mobile-menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(true)}><span/><span/><span/></button>
    </header>
    <span className="availability-dot" aria-hidden="true"/>
    <div ref={menuRef} id="mobile-menu" className={`mobile-menu${menuOpen?' is-open':''}`} role="dialog" aria-modal={menuOpen?true:undefined} aria-label="Menu de navigation" aria-hidden={!menuOpen} inert={!menuOpen} data-lenis-prevent>
      <div className="mobile-menu-top"><span>MENU</span><button className="mobile-menu-close" type="button" aria-label="Fermer le menu" onClick={()=>{closeMenu();toggleRef.current?.focus()}}><span/><span/></button></div>
      <nav className="mobile-menu-links" aria-label="Navigation mobile">
        <a href={prefix+'#expertise'} onClick={closeMenu}>Expertise <ArrowUpRight aria-hidden="true"/></a>
        <a href={prefix+'#works'} onClick={closeMenu}>Projets <ArrowUpRight aria-hidden="true"/></a>
        <a href={prefix+'#references'} onClick={closeMenu}>Références <ArrowUpRight aria-hidden="true"/></a>
        <a href={prefix+'#contact'} onClick={closeMenu}>Contact <ArrowUpRight aria-hidden="true"/></a>
      </nav>
      <div className="mobile-menu-bottom"><span>RÉSEAUX SOCIAUX</span><div><span>INSTAGRAM</span><span>TIKTOK</span><span>LINKEDIN</span></div></div>
    </div>
  </>,document.body)
}
function Header(){
  const heroRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({ trigger: root, start: 'bottom bottom', end: () => '+=' + window.innerHeight, pin: true, pinSpacing: false, invalidateOnRefresh: true });
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.from('.hero-meta, .hero h1', { y: 24, opacity: 0, duration: .8, stagger: .08 })
          .from('.hero-backdrop', { opacity: 0, scale: .96, duration: .7 }, '-=.55')
          .from('.hero-photo', { y: 35, rotation: 4, opacity: 0, duration: .9 }, '-=.6')
          .from('.hero-project, .hero-about, .hero-bottom', { y: 18, opacity: 0, stagger: .1, duration: .65 }, '-=.55');
        gsap.to('.portrait-scroll', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
      }, root);
      const layers = [
        { selector: '.hero-arc', distance: -18, duration: 1.1 },
        { selector: '.hero-backdrop', distance: 12, duration: .9 },
        { selector: '.hero-photo-motion', distance: 26, duration: .7 },
        { selector: '.hero-cross', distance: -32, duration: .6 },
      ].flatMap(({selector, distance, duration}) => {
        const element = root.querySelector<HTMLElement>(selector);
        if (!element) return [];
        return [{ element, distance, x: gsap.quickTo(element, 'x', {duration, ease: 'power3.out'}), y: gsap.quickTo(element, 'y', {duration, ease: 'power3.out'}) }];
      });
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const rect = root.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - .5;
        const py = (event.clientY - rect.top) / rect.height - .5;
        layers.forEach(layer => { layer.x(px * layer.distance); layer.y(py * layer.distance); });
      };
      const leave = () => layers.forEach(layer => { layer.x(0); layer.y(0); });
      root.addEventListener('pointermove', move); root.addEventListener('pointerleave', leave);
      return () => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave); layers.forEach(({element}) => { gsap.killTweensOf(element); gsap.set(element, {clearProps:'transform'}); }); ctx.revert(); };
    }, root);
    return () => media.revert();
  }, []);
  return <section className="hero" ref={heroRef}>
    <Navbar/>
    <div className="hero-meta"><span className="hero-disciplines"><span>BRANDING</span><i>/</i><span>PHOTO</span><i>/</i><span>VIDÉO</span><i>/</i><span>UI/UX</span><i>/</i><span>DÉVELOPPEMENT</span></span><span className="hero-meta-year">PORTFOLIO 2026 — 2027</span></div>
    <h1><span>CALVIN</span>{' '}<span>VAZQUEZ</span></h1>
    <div className="hero-portrait"><div className="portrait-scroll"><div className="portrait-interaction"><div className="hero-arc"/><div className="hero-backdrop"/><div className="hero-photo-motion"><img className="hero-photo" src={photos.portrait} alt="Portrait de Calvin Vazquez"/></div><span className="hero-cross">+</span></div></div></div>
    <div className="hero-project"><div className="hero-project-label"><span/>PROJET SÉLECTIONNÉ</div><a href="/projets/velia" className="hero-project-preview" aria-label="Voir le projet Velia"><img src="/assets/velia-apercu.png" alt="Aperçu du projet Velia"/></a><div className="hero-project-caption"><span>Velia — Branding fitness coaching &amp; site web</span><a href="/projets/velia" aria-label="Voir le projet Velia"><ArrowUpRight aria-hidden="true"/></a></div></div>
    <div className="hero-about" id="about"><span className="hero-badge"><i/>DESIGNER DIGITAL</span><p>Je donne vie aux idées<br/>{' '}à travers des expériences<br/>{' '}<em>créatives, uniques et mémorables.</em></p><a href="#expertise" className="hero-cta">MES EXPERTISES <ArrowUpRight aria-hidden="true"/></a></div>
    <div className="hero-bottom"><div className="hero-social" aria-label="Réseaux sociaux"><span title="Instagram — lien à renseigner"><Instagram aria-label="Instagram"/></span><span title="YouTube — lien à renseigner"><Youtube aria-label="YouTube"/></span><span title="TikTok — lien à renseigner"><svg role="img" aria-label="TikTok" viewBox="0 0 24 24" fill="currentColor"><path d="M16.7 2c.3 2.2 1.6 3.6 3.8 3.8v3.1a8.1 8.1 0 0 1-3.8-1v6.7c0 5.7-6.2 7.5-8.7 3.4-1.6-2.6-.6-7.1 4.5-7.3v3.2c-.4.1-.9.2-1.3.4-1.2.7-.9 2.7.5 3 1 .2 1.7-.4 1.7-1.7V2h3.3Z"/></svg></span><span title="LinkedIn — lien à renseigner"><Linkedin aria-label="LinkedIn" fill="currentColor"/></span></div><span className="hero-bottom-rule"/><div className="hero-location"><MapPin fill="currentColor" aria-hidden="true"/>VAUD, SUISSE</div></div>
  </section>
}
const expertise = [
  { title: <>UX/UI &<br/>DÉVELOPPEMENT WEB</>, description: "Conception et développement d'expériences digitales modernes, intuitives et sur mesure.", tags: ['UX/UI', 'SITES WEB', 'DÉVELOPPEMENT', 'EXPÉRIENCE UTILISATEUR'] },
  { title: <>APPLICATIONS &<br/>SOLUTIONS SAAS</>, description: "Création de plateformes digitales et d'applications sur mesure pour simplifier, automatiser et optimiser les activités professionnelles.", tags: ['SAAS', 'APPLICATIONS WEB', 'AUTOMATISATION', 'PLATEFORMES'] },
  { title: <>PHOTOGRAPHIE</>, description: "Capture d'instants authentiques à travers des compositions créatives, une lumière maîtrisée et un regard artistique.", tags: ['PORTRAIT', 'COMMERCIAL', 'SPORT', 'ÉVÉNEMENTIEL'] },
  { title: <>VIDÉO &<br/>MOTION DESIGN</>, description: 'Production de contenus audiovisuels immersifs, du tournage à la postproduction, pour donner vie aux idées.', tags: ['TOURNAGE', 'MONTAGE', 'ÉTALONNAGE', 'MOTION DESIGN'] },
  { title: <>DESIGN GRAPHIQUE &<br/>IDENTITÉ VISUELLE</>, description: "Création d'univers graphiques uniques et d'identités visuelles fortes pour valoriser les marques.", tags: ['BRANDING', 'LOGOTYPES', 'SUPPORTS IMPRIMÉS', 'DIRECTION ARTISTIQUE'] },
  { title: <>MARKETING DIGITAL &<br/>CAMPAGNES</>, description: "Conception de stratégies et de campagnes de communication complètes pour développer la visibilité et l'image des marques.", tags: ['STRATÉGIE', 'CAMPAGNES PUBLICITAIRES', 'COMMUNICATION', 'SEO'] },
  { title: <>CRÉATION DE CONTENU &<br/>RÉSEAUX SOCIAUX</>, description: 'Création de contenus engageants et de stratégies éditoriales pour développer les communautés et renforcer la présence digitale.', tags: ['INSTAGRAM', 'TIKTOK', 'REELS', 'PERSONAL BRANDING'] },
];

function Capability(){
  const section = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const scope = section.current;
    if (!scope) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.expertise-card', scope);
      const rotations = [-8, 5, -10, -3, 7, -6, 3];
      gsap.set(cards, { force3D: true });
      cards.forEach((card, i) => gsap.set(card, { rotation: rotations[i], zIndex: cards.length - i }));
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scope, start: 'top top', end: () => '+=' + window.innerHeight * (cards.length - 1) * 1.2,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      cards.slice(0, -1).forEach((card, i) => {
        const start = i * 1.3;
        const direction = i % 2 === 0 ? 1 : -1;
        timeline.to(card, { yPercent: 112, xPercent: direction * 5, rotation: rotations[i] + direction * 5, scale: 0.97, filter: 'drop-shadow(0 14px 12px rgba(0,0,0,0.22))', duration: 0.58 }, start)
          .to(cards[i + 1], { yPercent: -2, rotation: rotations[i + 1] - direction * 2, duration: 0.58 }, start + 0.08)
          .set(card, { zIndex: -1 - i }, start + 0.58)
          .to(card, { yPercent: 4 + i * 2, xPercent: direction * 2, rotation: rotations[i] + direction * 2, scale: 0.96, filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.12))', duration: 0.55 }, start + 0.58)
          .to(cards[i + 1], { yPercent: 0, rotation: rotations[i + 1], duration: 0.4 }, start + 0.58);
      });
      timeline.to({}, { duration: 0.45 });
      return () => timeline.scrollTrigger?.kill();
    }, scope);
    return () => media.revert();
  }, []);
  return <section className="capability" id="expertise" ref={section} aria-label="My expertise"><div className="cap-bg" aria-hidden="true">SKILLS &amp; EXPERTISE</div><div className="paper-stack">{expertise.map((item, i) => <article className="sheet main-sheet expertise-card" key={i}><small>MON EXPERTISE / 0{i + 1}—07</small><h2>{item.title}</h2><p>{item.description}</p><div className="paper-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div><p className="cap-caption">De la première idée à sa réalisation,<br/>je donne vie à vos projets à travers le design, la technologie et la créativité.</p></section>
}

function Works(){const navigate=useNavigate();const [active,setActive]=useState<number | null>(null);const [lastActive,setLastActive]=useState(0);const selectProject=(i:number)=>{setLastActive(i);setActive(i)};const [imageOffset,setImageOffset]=useState(0);const listRef=useRef<HTMLDivElement>(null);useLayoutEffect(()=>{const list=listRef.current;if(!list)return;const update=()=>{const rows=list.querySelectorAll<HTMLElement>('.project-row');if(active !== null && rows[active] && rows[0])setImageOffset(rows[active].offsetTop-rows[0].offsetTop)};update();const observer=new ResizeObserver(update);observer.observe(list);return()=>observer.disconnect()},[active]);return <section className="works section-pad" id="works"><div className="works-heading"><h2>PROJETS<br/>À LA UNE</h2><p>PROJETS RÉALISÉS<br/><span>2021 — 2026</span></p></div><div className="project-list" ref={listRef} style={{"--image-offset": `${imageOffset}px`} as React.CSSProperties}><div className={`project-image ${active === null ? 'is-hidden' : ''}`} aria-hidden={active === null}><img src={projectImages[lastActive]} alt={`Featured project: ${projects[lastActive].title}`}/><span>↗</span></div>{projects.map((p,i)=><button className={`project-row ${active===i?'active':''}`} key={p.title} id={`project-${i+1}`} onMouseEnter={()=>selectProject(i)} onMouseLeave={()=>setActive(null)} onFocus={()=>selectProject(i)} onBlur={()=>setActive(null)} onClick={()=>{selectProject(i);navigate('/projets/'+projectSlugs[i]);window.scrollTo(0,0)}}><img className="project-thumbnail" src={projectImages[i]} alt="" loading="lazy"/><span className="project-copy"><span className="project-title">{p.title} <sup>0{i+1}</sup></span><small>{p.client}</small></span><ArrowUpRight className="project-arrow" aria-hidden="true"/></button>)}</div><a className="view-all" href="#contact">DÉCOUVRIR TOUS LES PROJETS ↗</a></section>}
function ServiceCard({ item, index }: { item: string[]; index: number }) {
  const paperRef = useRef<HTMLDivElement>(null);
  const physics = useRef({ angle: 0, velocity: 0, force: 0, impulse: 0, frame: 0, time: 0, pointerX: 0, pointerTime: 0, active: false });

  useLayoutEffect(() => {
    const state = physics.current;
    const paper = paperRef.current;
    if (!paper) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (time: number) => {
      const dt = Math.min((time - state.time) / 1000 || 0, 1 / 30);
      state.time = time;
      // Angular motion about the pin: gravity, a restoring torque and drag.
      const gravity = 18;
      const stiffness = 48;
      const damping = 5.8;
      const acceleration = -gravity * Math.sin(state.angle) - stiffness * state.angle - damping * state.velocity + state.force + state.impulse;
      state.impulse *= Math.exp(-dt * 12);
      state.velocity += acceleration * dt;
      state.angle += state.velocity * dt;
      const limit = 5 * Math.PI / 180;
      if (Math.abs(state.angle) > limit) {
        state.angle = Math.sign(state.angle) * limit;
        state.velocity *= -0.15;
      }
      paper.style.transform = `rotate(${state.angle}rad)`;
      if (!state.active && Math.abs(state.angle) < 0.0001 && Math.abs(state.velocity) < 0.001) {
        state.angle = 0; state.velocity = 0; state.frame = 0;
        paper.style.transform = '';
      } else state.frame = requestAnimationFrame(update);
    };
    const start = () => { if (!state.frame) { state.time = performance.now(); state.frame = requestAnimationFrame(update); } };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches) return;
      const rect = paper.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
      const dt = (event.timeStamp - state.pointerTime) / 1000;
      const speed = state.active && dt > 0 && dt < .15 ? (event.clientX - state.pointerX) / dt : 0;
      state.pointerX = event.clientX; state.pointerTime = event.timeStamp; state.active = true;
      state.force = -x * 3.8;
      state.impulse = -Math.max(-1, Math.min(1, speed / 1400)) * 1.1;
      start();
    };
    const leave = () => { state.active = false; state.force = 0; start(); };
    const reset = () => {
      if (!motion.matches) return;
      cancelAnimationFrame(state.frame); state.frame = 0; state.active = false;
      state.angle = 0; state.velocity = 0; state.force = 0; state.impulse = 0; paper.style.transform = '';
    };
    paper.addEventListener('pointermove', move);
    paper.addEventListener('pointerleave', leave);
    motion.addEventListener('change', reset);
    return () => { cancelAnimationFrame(state.frame); paper.removeEventListener('pointermove', move); paper.removeEventListener('pointerleave', leave); motion.removeEventListener('change', reset); };
  }, []);

  return <article className={`fold fold-${index}`}><div className="paper-motion" ref={paperRef}><small>{item[1]}</small><h3>{item[2]}</h3><img src={item[3]} alt="" loading="lazy"/></div><span className="paper-pin" aria-hidden="true"/></article>;
}

function Services(){
  const section = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const panel = section.current;
    const wrapper = panel?.closest<HTMLElement>('.works-services');
    if (!panel || !wrapper) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      const animation = gsap.fromTo(panel, { xPercent: 100 }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
      return () => { animation.scrollTrigger?.kill(); animation.kill(); };
    });
    return () => media.revert();
  }, []);
  return <section className="services" id="services" ref={section}><h2>POURQUOI CHOISIR<br/>MES SERVICES ?</h2><div className="accordion">{services.map((item,i)=><ServiceCard item={item} index={i} key={item[0]}/>)}</div></section>
}

const contactTags=['IDENTITÉ VISUELLE','SITE WEB','UI/UX DESIGN','PHOTO / VIDÉO','DÉVELOPPEMENT SUR MESURE','AUTRE'];
function Contact(){
  const [selected,setSelected]=useState<string[]>([]);
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [selectionError,setSelectionError]=useState(false);
  const section=useRef<HTMLElement>(null);
  useLayoutEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{gsap.from('.contact-reveal',{y:18,opacity:0,duration:.7,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:section.current,start:'top 85%',once:true}})},section);
      return ()=>ctx.revert();
    });
    return ()=>media.revert();
  },[]);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!selected.length){setSelectionError(true);return}
    const form=e.currentTarget;
    const data=new FormData(form);
    setStatus('sending');
    try{
      const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:'00635e2a-3922-4c91-8be8-bbb156735686',subject:'Nouvelle demande de projet — portfolio',name:data.get('name'),email:data.get('email'),telephone:data.get('phone'),prestations:selected.join(', '),budget:data.get('budget'),message:data.get('project'),botcheck:data.has('botcheck')})});
      const result=await response.json();
      if(!response.ok || result.success!==true)throw new Error('Envoi impossible');
      form.reset();setSelected([]);setStatus('success');
    }catch{setStatus('error')}
  }
  return <section className="contact section-pad" id="contact" ref={section}>
    <h2 className="contact-reveal">DONNONS VIE<br/>À VOS IDÉES.</h2>
    <div className="contact-grid"><div className="contact-reveal">
      <form onSubmit={submit}>
        <fieldset className="contact-services" aria-describedby={selectionError?'services-error':undefined}>
          <legend className="form-label">QUEL TYPE DE PROJET AVEZ-VOUS EN TÊTE ? *</legend>
          <div className="tags">{contactTags.map(t=><button type="button" aria-pressed={selected.includes(t)} className={selected.includes(t)?'chosen':''} onClick={()=>{setSelected(selected.includes(t)?selected.filter(x=>x!==t):[...selected,t]);setSelectionError(false)}} key={t}>{t}</button>)}</div>
          {selectionError&&<p id="services-error" className="contact-error" role="alert">Choisissez au moins une prestation.</p>}
        </fieldset>
        <div className="contact-intro"><h3>PARLEZ-MOI DE VOTRE PROJET.</h3><p>Une idée, un projet ou une envie de collaboration ? Discutons ensemble de vos besoins.</p></div>
        <div className="fields">
          <label>NOM ET PRÉNOM *<input required maxLength={120} name="name" autoComplete="name" placeholder="Votre nom complet"/></label>
          <label>ADRESSE E-MAIL *<input required maxLength={254} name="email" type="email" autoComplete="email" placeholder="votre@email.ch"/></label>
          <label>TÉLÉPHONE<input name="phone" maxLength={40} type="tel" autoComplete="tel" placeholder="+41 79 000 00 00"/></label>
          <label>BUDGET ESTIMÉ<select name="budget" defaultValue=""><option value="">Sélectionnez un budget</option>{['Moins de 500 CHF',"500 à 1'000 CHF","1'000 à 2'500 CHF","2'500 à 5'000 CHF",'Plus de 5\'000 CHF','À définir ensemble'].map(b=><option key={b}>{b}</option>)}</select></label>
          <label className="project-field">VOTRE PROJET<textarea name="project" maxLength={5000} rows={2} placeholder="Décrivez votre idée en quelques mots..."/></label>
        </div>
        <div className="contact-honeypot" aria-hidden="true"><label>Ne pas cocher<input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off"/></label></div>
        <button className="black-button" type="submit" disabled={status==='sending'}>{status==='sending'?'ENVOI EN COURS...':status==='success'?'MESSAGE ENVOYÉ !':status==='error'?'UNE ERREUR EST SURVENUE':'ENVOYER MON PROJET ↗'}</button>
        <p role="status" aria-live="polite" className="form-status">{status==='success'?'Votre message a bien été envoyé !':status==='error'?"L’envoi a échoué. Vérifiez votre connexion et réessayez, ou écrivez à contact@calvinvazquez.ch.":''}</p>
      </form>
    </div><img className="contact-image contact-reveal" src="/assets/contact-cabine.png" alt="Cabine téléphonique sous la pluie, en noir et blanc" loading="lazy"/></div>
  </section>
}

function Footer(){return <footer><div className="footer-top"><nav><a href="#works">PROJETS</a><a href="#expertise">EXPERTISES</a><a href="#contact">CONTACT</a></nav><a href="#top" aria-label="Retour en haut de page">↑</a></div><div className="footer-title">CALVIN VAZQUEZ</div><div className="footer-content"><div className="footer-intro"><h3>MERCI POUR<br/>VOTRE VISITE<br/>SUR MON<br/>PORTFOLIO</h3><p>Un projet en tête ?<br/>Donnons vie à vos idées.</p><a className="white-button" href="#contact">ME CONTACTER ↗</a></div><div><b>EXPLORER</b><a href="#top">Accueil</a><a href="#works">Projets</a><a href="#references">Références</a></div><div><b>À DÉCOUVRIR</b><a href="#expertise">Expertises</a><a href="#services">Mes atouts</a><a href="#contact">Contact</a></div><div><b>PRESTATIONS</b><a href="#expertise">Identité visuelle</a><a href="#expertise">Photo / vidéo</a><a href="#expertise">UI/UX et développement web</a></div><div><b>CONTACT</b><a href="mailto:contact@calvinvazquez.ch">contact@calvinvazquez.ch</a><span>Vaud, Suisse</span></div></div><div className="copyright">© 2026 CALVIN VAZQUEZ — TOUS DROITS RÉSERVÉS</div></footer>}
function SmoothScroll(){
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.075, smoothWheel: true, syncTouch: false, anchors: true, allowNestedScroll: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); lenis.off('scroll', ScrollTrigger.update); lenis.destroy(); };
    });
    return () => media.revert();
  }, []);
  return null;
}
const referenceLogos=[['Vaudoise','reference-9.png','vaudoise'],['Union Communale Lucens','reference-1.png','ucl'],['Aubore','reference-3.png','aubore'],['Velia','velia-wordmark.png','velia'],['Swiss Street Workout','swiss-street-workout-rouge.png','street'],['Tennis Club de Lucens','reference-6.png','tennis'],['Stilla Oils','reference-5.png','stilla'],['FSG','reference-7.png','fsg'],['Piamotors','piamotors-detoure.png','piamotors']];
function Home(){useLayoutEffect(()=>{if(window.location.hash){requestAnimationFrame(()=>document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView())}},[]);return <><SmoothScroll/><CustomCursor/><div id="top"/><Header/><main><Capability/><Works/><div className="works-services" id="references"><div className="transition-frame"><div className="logos-stage"><div className="logos-intro"><span aria-hidden="true"/><h2>ILS M’ONT FAIT<br/>CONFIANCE</h2><p>Entreprises, marques et organisations avec lesquelles j’ai pu collaborer.</p></div><div className="logo-grid">{referenceLogos.map(([name,file,id],i)=><div key={id} className={`logo logo-${i} logo-${id}`}><img src={`/assets/logos/${file}`} alt={name} loading="lazy"/></div>)}</div></div><Services/></div></div><Contact/></main><Footer/></>};

function App(){return <BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/projets/:slug" element={<><SmoothScroll/><CustomCursor/><Navbar project/><ProjectPage/></>}/></Routes></BrowserRouter>}

createRoot(document.getElementById('root')!).render(<App/>);
