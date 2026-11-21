import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowUpRight, Instagram, Youtube, Linkedin, MapPin } from 'lucide-react';
import { CustomCursor } from './CustomCursor';

gsap.registerPlugin(ScrollTrigger);
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './style.css';

const img=(id:string,_w=900)=>`/assets/${id}.jpg`;
const photos={portrait:'/assets/calvin-portrait.png', car:img('photo-1503376780353-7e6692767b70'), city:'/assets/hkeoDW4miITxdO5PIHdUlMMMsQ.jpg', bubbles:img('photo-1507473885765-e6ed057f782c',1600), person1:'/assets/9ks0iJupS1dwbisA8qg57rpvew.png',person2:'/assets/0kOStRplO1Gt8W5IPYlhUi0pYw.png', person3:'/assets/juEkxEyXPBZsdbqUMmxoaqHp8o.jpg'};
const projects=['UX DESIGN ENHANCEMENT','CUSTOMER JOURNEY MAPPING','WEBSITE REDESIGN SUCCESS','INFLUENCER CAMPAIGN SUCCESS','PPC COST REDUCTION','SOCIAL MEDIA ENGAGEMENT','MOBILE APP ADOPTION','LEAD GENERATION FUNNEL','CLIENT RETENTION PROGRAM','EMAIL CONVERSION GROWTH'];
const projectImages=[img('photo-1558655146-9f40138edfeb'),photos.car,img('photo-1497366811353-6870744d04b2'),img('photo-1529139574466-a303027c1d8b'),img('photo-1460925895917-afdab827c52f'),img('photo-1493612276216-ee3925520721'),img('photo-1512941937669-90a1b58e7e9c'),img('photo-1551288049-bebda4e38f71'),img('photo-1552664730-d307ca884978'),img('photo-1557200134-90327ee9fafa')];
const services=[['01','CRÉATIVITÉ','Imaginer des concepts uniques qui sortent des standards.','/assets/5ZkT6AlpFJRBwNJvXSxWpnJtWc.jpg'],['02','RIGUEUR','Soigner chaque détail, de la première idée au résultat final.','/assets/gcDTrt0GckGsvlPPZIRG4JSFJss.jpg'],['03','ADAPTABILITÉ',"M’adapter à chaque projet, chaque univers et chaque défi.",'/assets/O7tcT1PSmutE1chUtA6UL38dpz4.jpg'],['04','AUTONOMIE','Gérer un projet de A à Z, avec méthode et efficacité.','/assets/XYBrw4J6vRc2jHJL46BHYqpA.png']];
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
    {createPortal(<header className="hero-nav">
      <div className="hero-available"><span/>DISPONIBLE POUR PROJET</div>
      <nav className="hero-nav-pill" aria-label="Navigation principale"><a href="#expertise">EXPERTISE</a><a href="#works">PROJETS</a><a href="#top" className="hero-brand" aria-label="Retour à l'accueil"><img src="/assets/calvin-logo.png" alt=""/></a><span className="hero-nav-pending">RÉFÉRENCES</span><a href="#about">À PROPOS</a></nav>
      <a className="hero-contact" href="mailto:contact@calvinvazquez.ch"><span>CONTACT@CALVINVAZQUEZ.CH</span><i><ArrowUpRight aria-hidden="true"/></i></a>
    </header>, document.body)}
    <div className="hero-meta"><span>BRANDING&nbsp; / &nbsp;PHOTO&nbsp; / &nbsp;VIDÉO&nbsp; / &nbsp;UI/UX&nbsp; / &nbsp;DÉVELOPPEMENT</span><span>PORTFOLIO 2026 — 2027</span></div>
    <h1>CALVIN VAZQUEZ</h1>
    <div className="hero-portrait"><div className="portrait-scroll"><div className="portrait-interaction"><div className="hero-arc"/><div className="hero-backdrop"/><div className="hero-photo-motion"><img className="hero-photo" src={photos.portrait} alt="Portrait de Calvin Vazquez"/></div><span className="hero-cross">+</span></div></div></div>
    <div className="hero-project"><div className="hero-project-label"><span/>DERNIER PROJET</div><a href="#works" className="hero-project-preview" aria-label="Voir les projets"><img src="/assets/zbHybmZwBDXCnPABQEo1UZwk.jpg" alt="Aperçu du projet de plateforme SaaS"/></a><div className="hero-project-caption"><span>Plateforme SaaS — Branding, UX/UI, Développement</span><a href="#works" aria-label="Voir les projets"><ArrowUpRight aria-hidden="true"/></a></div></div>
    <div className="hero-about" id="about"><span className="hero-badge"><i/>DESIGNER DIGITAL</span><p>Je donne vie aux idées<br/>{' '}à travers des expériences<br/>{' '}<em>créatives, uniques et mémorables.</em></p><a href="#contact" className="hero-cta">EN SAVOIR PLUS SUR MOI <ArrowUpRight aria-hidden="true"/></a></div>
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
  return <section className="capability" id="expertise" ref={section} aria-label="My expertise"><div className="cap-bg" aria-hidden="true">SKILLS &amp; EXPERTISE</div><div className="paper-stack">{expertise.map((item, i) => <article className="sheet main-sheet expertise-card" key={i}><small>MY EXPERTISE / 0{i + 1}—07</small><h2>{item.title}</h2><p>{item.description}</p><div className="paper-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div><p className="cap-caption">De la première idée à sa réalisation,<br/>je donne vie à vos projets à travers le design, la technologie et la créativité.</p></section>
}

function Works(){const [active,setActive]=useState<number | null>(null);const [lastActive,setLastActive]=useState(0);const selectProject=(i:number)=>{setLastActive(i);setActive(i)};const [imageOffset,setImageOffset]=useState(0);const listRef=useRef<HTMLDivElement>(null);useLayoutEffect(()=>{const list=listRef.current;if(!list)return;const update=()=>{const rows=list.querySelectorAll<HTMLElement>('.project-row');if(active !== null && rows[active] && rows[0])setImageOffset(rows[active].offsetTop-rows[0].offsetTop)};update();const observer=new ResizeObserver(update);observer.observe(list);return()=>observer.disconnect()},[active]);return <section className="works section-pad" id="works"><div className="works-heading"><h2>PROJETS<br/>À LA UNE</h2><p>PROJETS RÉALISÉS<br/><span>2021 — 2026</span></p></div><div className="project-list" ref={listRef} style={{"--image-offset": `${imageOffset}px`} as React.CSSProperties}><div className={`project-image ${active === null ? 'is-hidden' : ''}`} aria-hidden={active === null}><img src={projectImages[lastActive]} alt={`Featured project: ${projects[lastActive]}`}/><span>↗</span></div>{projects.map((p,i)=><button className={`project-row ${active===i?'active':''}`} key={p} onMouseEnter={()=>selectProject(i)} onMouseLeave={()=>setActive(null)} onFocus={()=>selectProject(i)} onBlur={()=>setActive(null)} onClick={()=>selectProject(i)}><span>{p} <sup>0{i+1}</sup></span><small>{i%2?'DESIGN':'STRATEGY'}</small></button>)}</div><a className="view-all" href="#contact">EXPLORE ALL WORKS ↗</a></section>}
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
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const animation = gsap.fromTo(panel, { xPercent: 100 }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
      return () => { animation.scrollTrigger?.kill(); animation.kill(); };
    });
    return () => media.revert();
  }, []);
  return <section className="services" id="services" ref={section}><h2>WHY CHOOSE<br/>MY SERVICE?</h2><div className="accordion">{services.map((item,i)=><ServiceCard item={item} index={i} key={item[0]}/>)}</div></section>
}

function Contact(){const [selected,setSelected]=useState<string[]>([]);const [status,setStatus]=useState(false);const tags=['BRANDING','WEBSITE DESIGN','UI/UX DESIGN','CREATIVE DIRECTION','DEVELOPMENT','OTHER'];return <section className="contact section-pad" id="contact"><h2>CRAFTING DIGITAL<br/>BRAND STORIES</h2><div className="contact-grid"><div><p className="form-label">WHAT TYPE OF PROJECT ARE YOU LOOKING TO START?</p><div className="tags">{tags.map(t=><button type="button" aria-pressed={selected.includes(t)} className={selected.includes(t)?'chosen':''} onClick={()=>setSelected(selected.includes(t)?selected.filter(x=>x!==t):[...selected,t])} key={t}>{t}</button>)}</div><form onSubmit={e=>{e.preventDefault();setStatus(true)}}><h3>TELL US ABOUT YOUR PROJECT</h3><p>Have a project in mind? Let's make something great together.</p><div className="fields"><label>NAME *<input required name="name" placeholder="Enter your name"/></label><label>YOUR PHONE *<input required name="phone" type="tel" placeholder="Enter your phone"/></label><label>EMAIL *<input required name="email" type="email" placeholder="Enter your email"/></label><label>PROJECT BUDGET *<input required name="budget" placeholder="Your budget"/></label></div><button className="black-button" type="submit">SEND A MESSAGE ↗</button>{status&&<p role="status" className="form-status">Your details are ready. This demo does not send messages.</p>}</form></div><img className="contact-image" src={photos.city} alt="A monochrome city scene" loading="lazy"/></div></section>}

function Footer(){return <footer><div className="footer-top"><nav><a href="#works">PROJECTS</a><a href="#services">MY SERVICES</a><a href="#contact">LET'S TALK</a></nav><a href="#top" aria-label="Back to top">↑</a></div><div className="footer-title">CALVIN VAZQUEZ</div><div className="footer-content"><div className="footer-intro"><h3>THANKS FOR<br/>VISITING MY<br/>CREATIVE<br/>PORTFOLIO</h3><p>Have a project in mind?<br/>Let's make something memorable.</p><a className="white-button" href="#contact">GET IN TOUCH ↗</a></div><div><b>EXPLORE</b><a href="#top">Home</a><a href="#works">Projects</a><a href="#services">Services</a></div><div><b>GENERAL</b><a href="#contact">About me</a><a href="#contact">Contact</a><a href="#contact">FAQ</a></div><div><b>SERVICES</b><a href="#services">Branding</a><a href="#services">Website design</a><a href="#services">Development</a></div><div><b>CONTACT</b><a href="mailto:hello@miranda.com">hello@miranda.com</a><span>Available worldwide</span><a href="#contact">Instagram ↗</a><a href="#contact">LinkedIn ↗</a></div></div><div className="copyright">© 2025 CALVIN VAZQUEZ — ALL RIGHTS RESERVED</div></footer>}
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
function App(){return <><SmoothScroll/><CustomCursor/><div id="top"/><Header/><main><Capability/><Works/><div className="works-services"><div className="transition-frame"><div className="logos-stage"><div className="logo-grid">{['◉ Logipsum','◈ Logipsum','◉ Logipsum','Logipsum','◉ Logipsum','▣ Logipsum','◉ Logipsum','◉ LOGOIPSUM','✥ logipsum'].map((x,i)=><div key={i} className={`logo logo-${i}`}>{x}</div>)}</div></div><Services/></div></div><Contact/></main><Footer/></>};

createRoot(document.getElementById('root')!).render(<App/>);
