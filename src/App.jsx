import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, UserCheck, Globe, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 58, suffix: '%', label: 'Increase in engagement', Icon: TrendingUp },
  { value: 23, suffix: '%', label: 'Reduced bounce rate', Icon: UserCheck },
  { value: 120, suffix: '+', label: 'Global projects delivered', Icon: Globe },
  { value: 40, suffix: '%', label: 'Faster load times', Icon: Zap },
];

export default function App() {
  const mainRef = useRef(null);
  const headlineRef = useRef(null);


  useEffect(() => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;


    const xDotSetter = gsap.quickSetter(cursorDot, "x", "px");
    const yDotSetter = gsap.quickSetter(cursorDot, "y", "px");
    const xOutlineSetter = gsap.quickTo(cursorOutline, "x", { duration: 0.4, ease: "power3.out" });
    const yOutlineSetter = gsap.quickTo(cursorOutline, "y", { duration: 0.4, ease: "power3.out" });

    const moveCursor = (e) => {
      xDotSetter(e.clientX);
      yDotSetter(e.clientY);
      xOutlineSetter(e.clientX);
      yOutlineSetter(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);


    const addHover = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');

    const interactiveEls = document.querySelectorAll('a, button');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(
        '.letter',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.fromTo(
        '.hero-sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1 }
      );

      gsap.fromTo(
        '.scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.5 }
      );


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-wrapper',
          start: 'top top',
          end: '+=2000',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });


      tl.to('.headline', { scale: 1.1, opacity: 0, duration: 2 }, 0);
      tl.to('.hero-sub', { opacity: 0, y: -20, duration: 1 }, 0);
      tl.to('.scroll-hint', { opacity: 0, duration: 0.5 }, 0);
      tl.to('.hero-glow', { scale: 3, opacity: 0, duration: 2 }, 0);


      tl.fromTo('.hero-reveal',
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', duration: 4, ease: 'power2.inOut' },
        1
      );


      tl.fromTo('.reveal-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: 'power2.out' },
        3
      );


      gsap.fromTo('.stat-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );


      gsap.utils.toArray('.counter-num').forEach((el) => {
        const end = parseInt(el.dataset.end, 10);
        const suffix = el.dataset.suffix || '';
        const obj = { val: 0 };

        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      });


      const cards = document.querySelectorAll('.stat-card');
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });


      gsap.fromTo('.footer-inner',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.footer-inner',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);


  const handleHeroMouseMove = (e) => {
    if (!headlineRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;


    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;

    gsap.to(headlineRef.current, {
      rotationY: xPos * 10,
      rotationX: -yPos * 10,
      x: xPos * 20,
      y: yPos * 20,
      ease: 'power2.out',
      duration: 1
    });
  };

  const resetHeroMouse = () => {
    if (!headlineRef.current) return;
    gsap.to(headlineRef.current, {
      rotationY: 0,
      rotationX: 0,
      x: 0,
      y: 0,
      ease: 'power3.out',
      duration: 1
    });
  };

  const headline = 'WELCOME ITZFIZZ';

  return (
    <div ref={mainRef} className="main relative bg-[#060606]">

      <div className="cursor-dot" />
      <div className="cursor-outline" />


      <div className="noise-overlay" />


      <nav className="nav">
        <div className="logo">● ITZFIZZ</div>
        <div className="nav-right">
          <a href="#stats" className="nav-link">Work</a>
          <a href="#footer" className="nav-link">About</a>
          <button className="nav-btn">Let's Talk</button>
        </div>
      </nav>


      <section
        className="hero-wrapper"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetHeroMouse}
      >
        <div className="hero-base">
          <div className="hero-glow" />

          <h1 className="headline" ref={headlineRef}>
            {headline.split('').map((ch, i) => (
              <span key={i} className="letter">
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          <p className="hero-sub">Digital Experiences That Leave an Impression</p>

          <div className="scroll-hint">
            <div className="scroll-bar" />
            <span>SCROLL</span>
          </div>
        </div>


        <div className="hero-reveal">
          <div className="reveal-bg" />
          <div className="reveal-content">
            <span className="tag">THE NEW ERA</span>
            <h2 className="reveal-title">
              We Build <em>Stunning</em> Futures
            </h2>
            <p className="reveal-desc">
              Immerse yourself in fluid geometries and premium interactions designed to elevate your brand presence globally.
            </p>
          </div>
        </div>
      </section>


      <section className="stats" id="stats">
        <p className="section-label">OUR IMPACT</p>
        <h2 className="section-title">Numbers That Speak</h2>

        <div className="stats-grid">
          {STATS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div key={i} className="stat-card">
                <Icon className="stat-icon" size={32} strokeWidth={1.5} />
                <span
                  className="counter-num"
                  data-end={s.value}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>


      <footer className="footer" id="footer">
        <div className="footer-inner">
          <h2 className="footer-title">
            Ready to Create Something <em>Extraordinary?</em>
          </h2>
          <button className="cta">Start a Project</button>
          <div className="footer-divider" />
          <p className="footer-note">Built with Love(For Itzfizz)</p>
        </div>
      </footer>
    </div>
  );
}