import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Download, Gamepad2, Mail, Menu, X } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import PixelFootball from './components/football/PixelFootball'
import './App.css'

const experience = [
  { date: 'OCT 2025 — NOW', role: 'Software Engineer', company: 'SokoFresh Agri Innovations East Africa', detail: 'Building and maintaining production software across backend services, payment workflows, authentication, APIs and integrations. Focused on reliable systems that support agricultural operations.', current: true },
  { date: 'MAR 2025 — OCT 2025', role: 'Software Engineer Intern', company: 'SokoFresh Agri Innovations East Africa', detail: 'Contributed across backend and frontend development, API integrations, debugging and software delivery in a production environment.' },
  { date: 'MAY 2024 — AUG 2024', role: 'IT Network Support Intern', company: 'Milimani Law Courts', detail: 'Supported court staff, configured workstations and helped resolve network issues.' },
]

const projects = [
  { id: '01', type: 'PRODUCTION EXPERIENCE', title: 'SokoPay', summary: 'Payment workflows built for the realities of agricultural commerce.', detail: 'A mobile payment experience involving a React Native client and backend APIs. Work spans authentication, OTP verification and payment flows. Company implementation details are intentionally kept high level.', href: 'https://sokopay.sokolink.co.ke/', linkLabel: 'Visit SokoPay', stack: ['React Native', 'Python', 'APIs', 'Authentication', 'OTP'] },
  { id: '02', type: 'BACKEND SYSTEMS', title: 'Notifications microservice', summary: 'A foundation for delivering messages across multiple channels.', detail: 'A service design using FastAPI, PostgreSQL, Celery and RabbitMQ to process WhatsApp, SMS and email notifications asynchronously, with retries and delivery tracking.', stack: ['FastAPI', 'PostgreSQL', 'Celery', 'RabbitMQ', 'Integrations'] },
  { id: '03', type: 'AI LAB · IN DEVELOPMENT', title: 'AI knowledge assistant', summary: 'Exploring grounded answers over a private document collection.', detail: 'A learning project in progress. The planned approach explores document ingestion, embeddings, vector search, retrieval augmented generation, source citations and evaluation. This is a direction of study, not a claimed production system.', stack: ['Python', 'FastAPI', 'LLMs', 'Embeddings', 'RAG'] },
  { id: '04', type: 'AGRITECH / OPERATIONS', title: 'Agritech business systems', summary: 'Software supporting day-to-day agricultural operations.', detail: 'Experience across operational systems for the agricultural sector, including asset and inventory workflows. Company implementation details are kept high level.', image: '/inventory-preview.jpg', imageAlt: 'SokoFresh inventory management product screen', stack: ['APIs', 'PostgreSQL', 'React', 'Operational workflows'] },
  { id: '05', type: 'PERSONAL PROJECT', title: 'AkibaFlow', summary: 'A budgeting app exploring practical personal finance workflows.', detail: 'A personal project built around SMS transaction ingestion and expense tracking, with a mobile-friendly interface and Python backend.', image: '/akibaflow-preview.jpg', imageAlt: 'AkibaFlow GitHub repository page', href: 'https://github.com/isMbumbu/AkibaFlow', linkLabel: 'View source on GitHub', stack: ['React Native', 'Python', 'PostgreSQL', 'SMS integrations'] },
  { id: '06', type: 'AGRITECH / E-COMMERCE', title: 'Agrimmerce', summary: 'A marketplace concept for agricultural products and services.', detail: 'A web project exploring online discovery and commerce for livestock, crops, seeds and machinery.', image: '/agrimmerce-preview.jpg', imageAlt: 'Agrimmerce agricultural marketplace interface', href: 'https://agrimmerce-1.onrender.com/', linkLabel: 'Open live project', stack: ['React', 'Node.js', 'MongoDB'] },
  { id: '07', type: 'E-COMMERCE / CREATIVE', title: 'Isoi Photography', summary: 'A digital storefront for a photography portfolio.', detail: 'A web experience for presenting photography and print offerings.', image: '/isoi-preview.jpg', imageAlt: 'Isoi photography storefront homepage', href: 'https://www.isoi-photography.co.ke/', linkLabel: 'Visit Isoi Photography', stack: ['React', 'Next.js', 'E-commerce'] },
]

const skills = [
  ['Backend', 'Python · FastAPI · Django · Flask · Node.js · REST APIs · JWT'],
  ['Frontend', 'React · Next.js · TypeScript · React Native'],
  ['Data & messaging', 'PostgreSQL · Redis · MongoDB · Celery · RabbitMQ'],
  ['Infrastructure', 'Docker · Git · GitHub Actions · AWS · CI/CD'],
  ['Applied AI · learning', 'LLMs · RAG · embeddings · vector search · AI integrations'],
]

const rotatingRoles = ['Backend Systems', 'Applied AI', 'Product Engineering']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [footballOpen, setFootballOpen] = useState(false)
  useEffect(() => {
    const targets = document.querySelectorAll('.section-heading, .project-row, .timeline-item, .about-intro, .about-copy, .skill-row, .ai-content > div, .education-grid article, .contact-copy, .contact-form, .football-heading, .football-game')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    targets.forEach((target) => target.classList.add('scroll-reveal'))
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        currentObserver.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % rotatingRoles.length), 3400)
    return () => window.clearInterval(timer)
  }, [])
  const closeMenu = () => setMenuOpen(false)

  async function submitContact(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    try {
      const response = await fetch('https://formspree.io/f/mdabjvkk', {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Could not send message')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return <>
    {footballOpen && <PixelFootball onClose={() => setFootballOpen(false)} />}
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={closeMenu}>AA<span>.</span></a>
      <button className="menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {['Work', 'Experience', 'About', 'AI Lab'].map((item) => <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={closeMenu}>{item}</a>)}
        <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15} /></a>
      </nav>
    </header>

    <main id="home">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> NAIROBI, KENYA <span className="eyebrow-rule" /> OPEN TO OPPORTUNITIES</div>
          <h1>Building intelligent<br />software for the <em>real world.</em></h1>
          <p className="hero-role">Full-Stack Software Engineer <span>·</span> <span className="role-rotate"><AnimatePresence mode="wait" initial={false}><motion.span key={rotatingRoles[roleIndex]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>{rotatingRoles[roleIndex]}</motion.span></AnimatePresence></span></p>
          <p className="hero-description">I’m Andrew Ambuka. I build production software across APIs, payment workflows, integrations and user-facing applications. Now I’m extending that foundation into applied AI.</p>
        <div className="hero-actions"><button className="button button-game" type="button" onClick={() => setFootballOpen(true)}><Gamepad2 size={17} /> Play Pixel Football <ArrowRight size={15} /></button><a className="button button-primary" href="#work">Explore selected work <ArrowDown size={16} /></a><a className="text-link" href="https://www.isoi-photography.co.ke/" target="_blank" rel="noreferrer">Visit Isoi Photography <ArrowUpRight size={16} /></a><a className="text-link" href="/resume.pdf" target="_blank" rel="noreferrer">View CV <ArrowUpRight size={16} /></a><a className="text-link cv-download" href="/resume.pdf" download>Download CV <Download size={15} /></a></div>
          <div className="social-links"><a href="https://github.com/isMbumbu" target="_blank" rel="noreferrer"><FaGithub size={16} /> GitHub <ArrowUpRight size={13} /></a><a href="https://linkedin.com/in/andrew-ambuka-9582152b0/" target="_blank" rel="noreferrer"><FaLinkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a><a href="mailto:andrewambuka9@gmail.com"><Mail size={16} /> Email <ArrowUpRight size={13} /></a></div>
        </div>
        <div className="hero-visual" aria-label="Portrait of Andrew Ambuka"><div className="portrait-hanging"><div className="portrait-frame"><img src="/home-removebg-preview.png" alt="Andrew Ambuka" fetchPriority="high" /></div></div></div>
        <div className="hero-bottom"><span>SOFTWARE THAT MOVES WORK FORWARD</span><a href="#work">SCROLL TO EXPLORE <ArrowDown size={13} /></a></div>
      </section>

      <section className="work-section section-wrap" id="work">
        <div className="section-heading"><div><span className="section-kicker">01 / SELECTED WORK</span><h2>Systems with a <em>purpose.</em></h2></div><p>Production experience and engineering explorations, described with care and without the noise.</p></div>
        <div className="project-list">{projects.map((project) => <article className="project-row" key={project.id}><div className="project-number">{project.id}</div><div className="project-main"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p className="project-summary">{project.summary}</p>{project.image && <img className="project-preview" style={{ display: 'block', width: '100%', maxWidth: '360px', height: 'auto', objectFit: 'contain' }} src={project.image} alt={project.imageAlt} loading="lazy" /> }<p className="project-detail">{project.detail}</p><div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.href && <div className="project-links"><a href={project.href} target="_blank" rel="noopener noreferrer">{project.linkLabel} <ArrowUpRight size={14} /></a></div>}</div><div className="project-mark"><Code2 size={22} /><span>ENGINEERING<br />CASE FILE</span></div></article>)}</div>
      </section>

      <section className="experience-section" id="experience"><div className="section-wrap"><div className="section-heading"><div><span className="section-kicker">02 / EXPERIENCE</span><h2>Built in <em>production.</em></h2></div><p>Working on software where reliability, clarity and real-world constraints matter.</p></div><div className="timeline">{experience.map((item) => <article className="timeline-item" key={item.role}><div className="timeline-date">{item.date}</div><div className="timeline-content"><div className="timeline-title"><h3>{item.role}</h3>{item.current && <span className="current-badge"><span className="live-dot" /> CURRENT</span>}</div><h4>{item.company}</h4><p>{item.detail}</p></div></article>)}</div></div></section>

      <section className="about-section section-wrap" id="about"><div className="about-intro"><span className="section-kicker">03 / ABOUT & TOOLKIT</span><h2>Curious about how<br />systems <em>fit together.</em></h2></div><div className="about-copy"><p className="about-lead">Computer Science graduate with hands-on experience shipping software in a production environment.</p><p>My work sits across backend and full-stack engineering: designing APIs, connecting services and building user-facing tools. I’m especially interested in systems that make essential operations work better, and in applying AI where it can solve a concrete problem.</p><p>I’m growing toward AI Engineering through practical exploration of LLM applications and retrieval systems, while continuing to deepen my foundations in software design and delivery.</p></div><div className="skill-table">{skills.map(([group, value]) => <div className="skill-row" key={group}><h3>{group}</h3><p>{value}</p></div>)}</div></section>

      <section className="ai-section" id="ai-lab"><div className="section-wrap ai-inner"><div className="ai-topline"><span className="section-kicker">04 / AI LAB</span><span className="lab-status"><span className="live-dot" /> IN PROGRESS</span></div><div className="ai-content"><div><h2>A new discipline.<br /><em>Built on solid foundations.</em></h2><p>I’m documenting the move from software engineering into applied AI through small, testable projects—learning in public, with a focus on useful systems and careful evaluation.</p><a className="text-link" href="https://github.com/isMbumbu" target="_blank" rel="noreferrer">Follow the work on GitHub <ArrowRight size={16} /></a></div><div className="lab-card"><div className="lab-card-head"><span>FIRST EXPLORATION</span><span>01</span></div><h3>Document-grounded<br />question answering</h3><p>Exploring ingestion, retrieval, citations and evaluation for an AI knowledge assistant.</p><div className="lab-progress"><span>LEARNING · BUILDING · EVALUATING</span><span><Check size={14} /> ACTIVE</span></div></div></div></div></section>

      <section className="education-section section-wrap" id="education"><div className="section-heading"><div><span className="section-kicker">05 / EDUCATION</span><h2>Strong <em>foundations.</em></h2></div></div><div className="education-grid"><article><span>DEC 2024</span><h3>BSc Computer Science</h3><p>Presbyterian University of East Africa</p><small>Second Class Honours, Upper Division</small></article><article><span>JUL 2025</span><h3>Software Engineering</h3><p>Moringa School</p><small>Web & mobile development</small></article><article><span>CERTIFICATIONS</span><h3>Continuous learning</h3><p>Kubernetes and Cloud Native Associate (KCNA)</p><small>Linux Foundation LFS250 · ALX AI Career Essentials</small></article></div></section>

      <section className="contact-section" id="contact"><div className="section-wrap contact-grid"><div className="contact-copy"><span className="section-kicker">06 / CONTACT</span><h2>Let’s build<br />something <em>useful.</em></h2><p>For software engineering opportunities, thoughtful collaborations or a good technical conversation.</p><a className="contact-email" href="mailto:andrewambuka9@gmail.com">andrewambuka9@gmail.com <ArrowUpRight size={17} /></a><div className="contact-social"><a href="https://github.com/isMbumbu" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://linkedin.com/in/andrew-ambuka-9582152b0/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div><form className="contact-form" onSubmit={submitContact}><label>Your name<input name="name" autoComplete="name" required placeholder="Name" /></label><label>Email address<input name="_replyto" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>What’s on your mind?<textarea name="message" rows="4" required placeholder="A little context goes a long way…" /></label><button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send a message'} <ArrowUpRight size={16} /></button>{status === 'sent' && <p className="form-status" role="status">Message sent. Thank you for reaching out.</p>}{status === 'error' && <p className="form-status error" role="alert">The message couldn’t be sent. Please email me directly instead.</p>}</form></div></section>
    </main>
    <footer className="site-footer section-wrap"><a className="wordmark" href="#home">AA<span>.</span></a><span>© {new Date().getFullYear()} Andrew Ambuka · Nairobi, Kenya</span><a href="#home">BACK TO TOP ↑</a></footer>
  </>
}

export default App
