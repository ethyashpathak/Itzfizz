import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 58, suffix: '%', label: 'Increase in engagement' },
  { value: 23, suffix: '%', label: 'Reduced bounce rate' },
  { value: 120, suffix: '+', label: 'Global projects delivered' },
  { value: 40, suffix: '%', label: 'Faster load times' },
];

export default function App() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* ── INTRO : letters stagger in on load ── */
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
        '.hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut', delay: 1.2 }
      );

      gsap.fromTo(
        '.scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.5 }
      );

      /* ── SCROLL : pin hero, fade headline out, bring reveal in ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: '+=1500',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // Fade out headline + sub
      // Using fromTo so position-0 is always the VISIBLE state,
      // even though the intro animation hasn't run yet when this is created.
      tl.fromTo('.letter',
        { y: 0, opacity: 1 },
        { y: -80, opacity: 0, stagger: 0.02, duration: 1 }, 0);
      tl.fromTo('.hero-sub',
        { y: 0, opacity: 1 },
        { y: -40, opacity: 0, duration: 0.5 }, 0);
      tl.fromTo('.hero-line',
        { scaleX: 1, opacity: 1 },
        { scaleX: 0, opacity: 0, duration: 0.4 }, 0);
      tl.fromTo('.scroll-hint',
        { opacity: 1 },
        { opacity: 0, duration: 0.3 }, 0);
      tl.fromTo('.hero-glow',
        { scale: 1, opacity: 1 },
        { scale: 3, opacity: 0, duration: 1 }, 0);

      // Fade in the reveal section
      tl.fromTo(
        '.reveal',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.6
      );

      /* ── STATS : simple scroll-triggered entrance ── */
      gsap.utils.toArray('.stat').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* ── COUNTERS : animate numbers when visible ── */
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

      /* ── FOOTER : fade in ── */
      gsap.fromTo(
        '.footer-inner',
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

  const headline = 'WELCOME ITZFIZZ';

  return (
    <div ref={mainRef} className="main">
      {/* ─── NAV ─── */}
      <nav className="nav">
        <div className="logo">● ITZFIZZ</div>
        <div className="nav-right">
          <a href="#stats" className="nav-link">Work</a>
          <a href="#footer" className="nav-link">About</a>
          <button className="nav-btn">Let's Talk</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-glow" />

        <h1 className="headline">
          {headline.split('').map((ch, i) => (
            <span key={i} className="letter">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h1>

        <p className="hero-sub">Digital Experiences That Leave an Impression</p>
        <div className="hero-line" />

        <div className="reveal">
          <span className="tag">SCROLL EXPERIENCE</span>
          <h2 className="reveal-title">
            We Build <em>Unforgettable</em> Brands
          </h2>
          <p className="reveal-desc">
            Pushing the boundaries of digital creativity — one pixel at a time.
          </p>
        </div>

        <div className="scroll-hint">
          <div className="scroll-bar" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="stats" id="stats">
        <p className="section-label">IMPACT</p>
        <h2 className="section-title">Numbers That Speak</h2>

        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat">
              <span
                className="counter-num"
                data-end={s.value}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <h2 className="footer-title">
            Ready to Create Something <em>Extraordinary?</em>
          </h2>
          <button className="cta">Start a Project</button>
          <div className="footer-divider" />
          <p className="footer-note">Built with React · Tailwind · GSAP</p>
        </div>
      </footer>
    </div>
  );
}