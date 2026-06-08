"use client";

import React, { useState, useEffect, useRef, Component } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import BirdCanvas to disable SSR, preventing WebGL/window errors during next build
const BirdCanvas = dynamic(() => import('../components/BirdCanvas'), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function App() {
  const containerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.work-card');
    
    const handleCardStack = () => {
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];

        const currentRect = currentCard.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();

        const currentHeight = currentCard.offsetHeight;
        const distance = nextRect.top - currentRect.top;

        const maxDistance = currentHeight;
        const minDistance = 40;

        if (distance < maxDistance) {
          let progress = (maxDistance - distance) / (maxDistance - minDistance);
          progress = Math.max(0, Math.min(1, progress));

          const blurAmount = progress * 8;
          const scaleAmount = 1 - (progress * 0.05);
          const opacityAmount = 1 - (progress * 0.3);

          currentCard.style.filter = `blur(${blurAmount}px)`;
          currentCard.style.transform = `scale(${scaleAmount})`;
          currentCard.style.opacity = opacityAmount.toString();
        } else {
          currentCard.style.filter = 'blur(0px)';
          currentCard.style.transform = 'scale(1)';
          currentCard.style.opacity = '1';
        }
      }
    };

    window.addEventListener('scroll', handleCardStack);
    return () => window.removeEventListener('scroll', handleCardStack);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#f5f7fa] text-[#0f172a] font-sans selection:bg-[#38bdf8]/30">

      {/* GLOBAL 3D CANVAS — sits above content (z-10) but below Navbar (z-50) */}
      <div className="fixed inset-0 w-screen h-screen z-20 pointer-events-none">
        <ErrorBoundary>
          {/* We pass the containerRef as eventSource to allow interaction even with pointer-events-none on the wrapper */}
          <BirdCanvas eventSource={containerRef} />
        </ErrorBoundary>
      </div>

      {/* HEADER & NAVBAR — highest priority */}
      <header className="fixed top-0 w-full z-50 pointer-events-none">
        <nav className="fixed top-2 w-full px-4 sm:px-6 py-0 pointer-events-none">
          <div className="max-w-[1400px] mx-auto flex justify-between items-center pointer-events-auto gap-2">
            {/* Box 1: Logo */}
            <div className={`transition-all duration-700 ease-in-out px-2 sm:px-4 py-0 rounded-xl border ${isScrolled ? 'bg-white/40 backdrop-blur-xl border-white/40 shadow-lg' : 'bg-transparent border-transparent'}`}>
              <a href="/" className="flex items-center text-[#0f172a]">
                <img src="/logo.png" alt="Delichon" className="h-14 sm:h-20 transition-all" />
              </a>
            </div>

            {/* Box 2: Navigation Menu */}
            <div className={`hidden lg:block transition-all duration-700 ease-in-out px-6 py-3 rounded-xl border ${isScrolled ? 'bg-white/40 backdrop-blur-xl border-white/40 shadow-lg' : 'bg-transparent border-transparent'}`}>
              <ul className="flex space-x-10 font-sans text-[14px] font-medium text-[#0f172a]">
                <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Work</li>
                <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Services</li>
                <li className="cursor-pointer hover:text-[#0f172a] transition-colors">About</li>
                <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Approach</li>
                <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Contact</li>
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <button className={`hidden sm:flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-black/5 px-6 py-2.5 rounded-xl text-[14px] font-medium text-[#0f172a] shadow-sm hover:bg-white transition-all duration-700 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
                <span>Let's Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex lg:hidden items-center justify-center bg-white/80 backdrop-blur-sm border border-black/5 p-3 rounded-xl text-[#0f172a] shadow-sm hover:bg-white transition-all pointer-events-auto"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 top-[70px] sm:top-[90px] w-full bg-white/90 backdrop-blur-2xl border-t border-black/5 transition-all duration-500 ease-in-out z-40 flex flex-col px-6 py-8 pointer-events-auto lg:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}>
            <ul className="flex flex-col space-y-6 font-sans text-[20px] font-semibold text-[#0f172a]">
              <li className="cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Work</li>
              <li className="cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</li>
              <li className="cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</li>
              <li className="cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Approach</li>
              <li className="cursor-pointer hover:text-[#38bdf8] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</li>
            </ul>
            <div className="mt-auto pt-8 border-t border-black/5 flex flex-col gap-4">
              <button className="flex items-center justify-center space-x-2 bg-[#0f172a] text-white px-6 py-3.5 rounded-xl text-[15px] font-medium shadow-sm w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Let's Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex items-center px-6 sm:px-10 pt-20 lg:pt-32 pb-10 max-w-[1400px] mx-auto">
          <div className="w-full flex flex-col lg:flex-row relative gap-8 lg:gap-0">
            {/* Right column — space for 3D elements (empty because canvas is global now) */}
            {/* On mobile, this spacer is rendered first at the top of the landing page. On desktop (lg), it is placed on the right side. */}
            <div className="w-full lg:w-[45%] h-[30vh] sm:h-[35vh] lg:h-auto order-first lg:order-last"></div>

            {/* Left Column - Typography */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center pointer-events-auto order-last lg:order-first">
              <h1 className="flex flex-col mb-4 lg:mb-8 select-none">
                <span className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[95px] leading-[1] text-[#0f172a] tracking-[-0.03em]">Engineered</span>
                <span className="font-serif text-4xl xs:text-5xl sm:text-5.5xl md:text-6xl lg:text-[75px] leading-[0.8] text-[#0f172a] italic ml-2">with</span>
                <span className="font-sans font-semibold text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[115px] leading-[0.9] text-[#0f172a] tracking-[-0.04em] mt-2">Precision</span>
              </h1>

              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/70 max-w-[420px] mb-6 lg:mb-10">
                We are a digital product engineering partner. We build custom software development platforms, high-performance web development, and mobile application development for startups and global enterprises seeking technical excellence.
              </p>

              <div className="pointer-events-auto">
                <button className="group flex items-center space-x-4 bg-[#0f172a] text-white px-8 py-4 rounded-xl font-sans text-[13px] font-medium tracking-wide hover:bg-[#1e293b] transition-all">
                  <span>Explore Our Portfolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-6 lg:mt-20 flex items-center space-x-3 text-[13px] text-[#0f172a]/60">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
                <span>Scroll to explore</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST INDICATOR STRIP */}
        <section className="relative w-full border-y border-[#0f172a]/5 bg-white/30 backdrop-blur-sm py-8 px-6 sm:px-10 pointer-events-auto">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-6 text-[11px] sm:text-[12px] font-sans font-medium tracking-wider text-[#0f172a]/60 uppercase">
            <span>Custom Software Development</span>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
            <span>Web Applications</span>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
            <span>Mobile Applications</span>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
            <span>Product Engineering</span>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
            <span>UI/UX Design</span>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-[30%]">
              <div className="text-[#38bdf8] text-[13px] font-medium mb-6">What We Do</div>
              <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#0f172a] tracking-tight mb-8">
                Custom Software,<br />Web & Mobile App<br />Development Services.
              </h2>
              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/70 mb-10">
                We engineer scalable, secure, and high-performance digital systems tailored to the exact requirements of startups, businesses, and enterprises worldwide.
              </p>
              <a href="#" className="flex items-center space-x-2 text-[#38bdf8] text-[14px] font-medium group">
                <span>View all services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right Cards */}
            <div className="w-full lg:w-[70%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Front-End Development", 
                  desc: "High-performance, accessible, and interactive user interfaces built with React, Next.js, and modern tools for flawless digital experiences.", 
                  icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                },
                { 
                  title: "Full-Stack Development", 
                  desc: "End-to-end web applications engineered with secure backend systems, database scalability, and robust cloud integration.", 
                  icon: "M4 7v10c0 2 16 2 16 0V7c0-2-16-2-16 0z M4 12c0 2 16 2 16 0" 
                },
                { 
                  title: "Custom Software Development", 
                  desc: "Tailored business applications and enterprise software platforms designed to solve complex operations and scale with your growth.", 
                  icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" 
                },
                { 
                  title: "Android & iOS Applications", 
                  desc: "Native and cross-platform mobile app development delivering premium user experiences on both iOS and Android devices.", 
                  icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                },
                { 
                  title: "UI/UX Design", 
                  desc: "Strategic user-experience architecture and sophisticated interface designs that blend minimalism with clear customer journeys.", 
                  icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                },
                { 
                  title: "Product Engineering", 
                  desc: "Complete digital product engineering from conceptual blueprint to cloud architecture, deployment, and long-term maintenance.", 
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                }
              ].map((card, i) => (
                <article key={i} className="bg-white/60 backdrop-blur-md border border-white p-6 sm:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors flex flex-col h-auto min-h-[350px] lg:h-[400px]">
                  <div className="w-10 h-10 mb-8 lg:mb-auto text-[#38bdf8]">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={card.icon}></path></svg>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-sans font-bold text-[18px] text-[#0f172a] mb-4 pr-4">{card.title}</h3>
                    <p className="font-sans text-[13px] leading-relaxed text-[#0f172a]/60 mb-8">{card.desc}</p>
                    <ArrowRight className="w-5 h-5 text-[#0f172a]/40" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto border-t border-[#0f172a]/5">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-[35%]">
              <div className="text-[#38bdf8] text-[13px] font-medium mb-6">Our Authority</div>
              <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#0f172a] tracking-tight">
                Engineering Long-Term Technology Partnerships.
              </h2>
            </div>
            <div className="w-full lg:w-[65%] flex flex-col justify-center">
              <p className="font-sans text-[16px] leading-relaxed text-[#0f172a]/80 mb-6">
                Based in the emerging technology hub of Kerala, India, Delichon functions as a high-fidelity digital product engineering partner for ambitious brands worldwide. We reject generic templates, focusing instead on structural integrity, clean code, and predictable system performance.
              </p>
              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/60">
                Our team is comprised of technical builders rather than marketers. We prioritize engineering quality over volume, maintaining selective partnerships to ensure that every codebase we deliver is maintainable, highly scalable, and optimized for speed.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto border-t border-[#0f172a]/5">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="text-[#38bdf8] text-[13px] font-medium mb-6">Why Delichon</div>
            <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#0f172a] tracking-tight">
              Why Global Brands Choose Delichon for Software Development
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              { title: "Precision Engineering", desc: "We write clean, modular, and extensively documented code focused on structural integrity and standard compliance." },
              { title: "Scalable Architecture", desc: "We design cloud-ready systems and database structures that gracefully handle user growth and traffic spikes." },
              { title: "Modern Technology Stack", desc: "We leverage industry-proven languages and frameworks (React, Next.js, Node, Three.js) to build future-proof products." },
              { title: "User-Centered Design", desc: "Our UI/UX strategies place the target user at the core, minimizing friction to maximize conversions." },
              { title: "Performance Optimization", desc: "Every asset and script is audited and compiled for lightning-fast speeds and search visibility." },
              { title: "Long-Term Maintainability", desc: "We engineer codebases designed to be easily tested, extended, and maintained for years to come." }
            ].map((item, i) => (
              <article key={i} className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0f172a]/5 flex items-center justify-center text-[#38bdf8] font-bold text-[15px]">
                  0{i + 1}
                </div>
                <h3 className="font-sans font-bold text-[18px] text-[#0f172a]">{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed text-[#0f172a]/60">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto border-t border-[#0f172a]/5">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="text-[#38bdf8] text-[13px] font-medium mb-6">Our Methodology</div>
            <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#0f172a] tracking-tight">
              Our Software Engineering Process
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { num: "01", name: "Discover", desc: "We audit system requirements, perform user research, and outline technical scope." },
              { num: "02", name: "Design", desc: "We map user journeys and create intuitive, high-fidelity UI/UX design blueprints." },
              { num: "03", name: "Develop", desc: "We construct secure backends, clean APIs, and interactive client frontends." },
              { num: "04", name: "Optimize", desc: "We run quality assurance, optimize asset performance, and align SEO code structures." },
              { num: "05", name: "Scale", desc: "We deploy cloud systems, monitor active servers, and extend system functionality." }
            ].map((step, i) => (
              <article key={i} className="bg-white/40 backdrop-blur-md border border-white p-6 sm:p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[220px]">
                <div className="text-[#0f172a]/20 font-serif text-[32px] leading-none">{step.num}</div>
                <div>
                  <h3 className="font-sans font-bold text-[16px] text-[#0f172a] mb-2">{step.name}</h3>
                  <p className="font-sans text-[12px] leading-relaxed text-[#0f172a]/60">{step.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WORK SECTION — Card Stacking Animation */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto border-t border-[#0f172a]/5">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-[30%] lg:sticky lg:top-32 h-fit">
              <div className="text-[#38bdf8] text-[13px] font-medium mb-6">Selected Work</div>
              <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-[#0f172a] tracking-tight mb-8 lg:mb-10">
                Selected Software Development Projects & Web Portfolio
              </h2>
              <a href="#" className="flex items-center space-x-2 text-[#38bdf8] text-[14px] font-medium group">
                <span>View all projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="w-full lg:w-[70%] flex flex-col gap-10">
              {[
                { 
                  title: "Finova", 
                  cat: "Finance Platform", 
                  desc: "A comprehensive digital banking ecosystem designed for the next generation of financial services.",
                  color: "from-blue-500/20 to-indigo-500/5",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                },
                { 
                  title: "Aster Clinics", 
                  cat: "Healthcare Website", 
                  desc: "Streamlining patient care with a high-performance, accessible, and intuitive healthcare portal.",
                  color: "from-emerald-500/20 to-teal-500/5",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                },
                { 
                  title: "Nexa Analytics", 
                  cat: "Analytics Dashboard", 
                  desc: "Real-time data visualization platform that turns complex metrics into actionable business intelligence.",
                  color: "from-orange-500/20 to-yellow-500/5",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                }
              ].map((work, i) => (
                <article 
                  key={i} 
                  className="work-card sticky origin-top flex flex-col md:flex-row gap-6 md:gap-8 bg-white/70 backdrop-blur-xl border border-white rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-[0_-10px_50px_rgba(0,0,0,0.03)]"
                  style={{ '--stack-top': `${100 + i * 40}px`, zIndex: 10 + i }}
                >
                  {/* Left Side: Visual */}
                  <div className={`w-full md:w-1/2 aspect-video rounded-[18px] md:rounded-[24px] bg-gradient-to-br ${work.color} border border-white/40 flex items-center justify-center relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
                     <h3 className="text-[#0f172a]/10 font-bold text-4xl sm:text-[64px] select-none">{work.title}</h3>
                  </div>

                  {/* Right Side: Content */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
                    <div className="w-12 h-12 bg-[#0f172a]/5 rounded-xl flex items-center justify-center mb-6 md:mb-8 border border-black/5">
                      <div className="text-[#0f172a]/60">{work.icon}</div>
                    </div>
                    <div className="text-[#38bdf8] text-[13px] font-medium mb-3">{work.cat}</div>
                    <h3 className="font-serif text-[28px] sm:text-[32px] text-[#0f172a] mb-4 md:mb-6">{work.title}</h3>
                    <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/60 mb-6 md:mb-10 pr-0 md:pr-6">
                      {work.desc}
                    </p>
                    <button className="flex items-center space-x-3 text-[#0f172a] text-[14px] font-bold group w-fit">
                      <span>View Case Study</span>
                      <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#0f172a] group-hover:text-white transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="relative w-full py-20 lg:py-32 px-6 sm:px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 justify-between items-center bg-white/40 backdrop-blur-sm border border-white/60 p-8 sm:p-16 rounded-[24px] lg:rounded-[32px]">
            <div className="w-full lg:w-1/3 text-center lg:text-left">
              <h2 className="font-serif text-[32px] sm:text-[48px] leading-[1.1] text-[#0f172a] tracking-tight">
                Let's build<br className="hidden lg:block" /> something great<br className="hidden lg:block" /> together.
              </h2>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/70 mb-6">
                Have a project in mind?<br />
                We'd love to hear about it<br />
                and explore how we can help.
              </p>
              <a href="#" className="flex items-center space-x-2 text-[#38bdf8] text-[14px] font-medium group w-fit">
                <span>Start a conversation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-[20px] p-6 flex items-center space-x-4 border border-white w-full max-w-[340px]">
                <div className="w-12 h-12 bg-[#0f172a] rounded-[12px] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div className="overflow-hidden">
                  <div className="font-sans font-bold text-[#0f172a] text-[14px] sm:text-[15px] truncate">hello@delichon.com</div>
                  <div className="text-[12px] text-[#0f172a]/50 truncate">We reply within 24 hours.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-16 px-6 sm:px-10 border-t border-[#0f172a]/10 max-w-[1400px] mx-auto pointer-events-auto bg-[#f5f7fa]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Logo & Trust Statement */}
          <div className="flex flex-col gap-6">
            <a href="/" className="flex items-center text-[#0f172a] hover:opacity-70 transition-opacity w-fit">
              <img src="/logo.png" alt="Delichon" className="h-8 grayscale opacity-80" />
            </a>
            <p className="font-sans text-[13px] leading-relaxed text-[#0f172a]/60">
              We engineer digital systems that endure, blending structural clarity with technical craftsmanship.
            </p>
            <p className="font-sans text-[12px] text-[#0f172a]/40">
              Based in Kerala, India. Serving clients worldwide.
            </p>
          </div>
          
          {/* Col 2: Services */}
          <div>
            <h4 className="font-sans font-bold text-[14px] text-[#0f172a] mb-6 uppercase tracking-wider">Services</h4>
            <ul className="flex flex-col space-y-4 font-sans text-[13px] text-[#0f172a]/60">
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Custom Software Development</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Web Application Development</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Mobile App Development</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Digital Product Engineering</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">UI/UX Design Services</a></li>
            </ul>
          </div>
          
          {/* Col 3: Company */}
          <div>
            <h4 className="font-sans font-bold text-[14px] text-[#0f172a] mb-6 uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col space-y-4 font-sans text-[13px] text-[#0f172a]/60">
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">About Our Agency</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Our Portfolio</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Why Choose Us</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Engineering Process</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Col 4: Resources */}
          <div>
            <h4 className="font-sans font-bold text-[14px] text-[#0f172a] mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="flex flex-col space-y-4 font-sans text-[13px] text-[#0f172a]/60 mb-6">
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Technology Hub Blog</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Case Studies Portfolio</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#0f172a] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#0f172a]/5 text-[12px] text-[#0f172a]/40 gap-4">
          <div>&copy; {new Date().getFullYear()} Delichon Technologies. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#0f172a] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#0f172a] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#0f172a] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
