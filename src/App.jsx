import React, { useState, useEffect, useRef, Component } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import BirdCanvas from './components/BirdCanvas';

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

      {/* NAVBAR — highest priority */}
      <nav className="fixed top-2 w-full z-50 px-6 py-0 pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center pointer-events-auto gap-4">
          {/* Box 1: Logo */}
          <div className={`transition-all duration-700 ease-in-out px-4 py-0 rounded-xl border ${isScrolled ? 'bg-white/40 backdrop-blur-xl border-white/40 shadow-lg' : 'bg-transparent border-transparent'}`}>
            <a href="/" className="flex items-center text-[#0f172a]">
              <img src="/logo.png" alt="Delichon" className="h-20" />
            </a>
          </div>

          {/* Box 2: Navigation Menu */}
          <div className={`transition-all duration-700 ease-in-out px-6 py-3 rounded-xl border ${isScrolled ? 'bg-white/40 backdrop-blur-xl border-white/40 shadow-lg' : 'bg-transparent border-transparent'}`}>
            <ul className="flex space-x-10 font-sans text-[14px] font-medium text-[#0f172a]">
              <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Work</li>
              <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Services</li>
              <li className="cursor-pointer hover:text-[#0f172a] transition-colors">About</li>
              <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Approach</li>
              <li className="cursor-pointer hover:text-[#0f172a] transition-colors">Contact</li>
            </ul>
          </div>

          <button className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-black/5 px-6 py-2.5 rounded-xl text-[14px] font-medium text-[#0f172a] shadow-sm hover:bg-white transition-all duration-700 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex items-center px-10 pt-32 pb-10 max-w-[1400px] mx-auto">
          <div className="w-full flex relative">
            {/* Left Column - Typography */}
            <div className="w-[55%] flex flex-col justify-center pointer-events-auto">
              <h1 className="flex flex-col mb-8 select-none">
                <span className="font-serif text-[95px] leading-[1] text-[#0f172a] tracking-[-0.03em]">Engineered</span>
                <span className="font-serif text-[75px] leading-[0.8] text-[#0f172a] italic ml-2">with</span>
                <span className="font-sans font-semibold text-[115px] leading-[0.9] text-[#0f172a] tracking-[-0.04em] mt-2">Precision</span>
              </h1>

              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/70 max-w-[380px] mb-10">
                We design and build digital systems — <br />
                websites and applications — tailored precisely <br />
                to the needs of each client.
              </p>

              <div className="pointer-events-auto">
                <button className="group flex items-center space-x-4 bg-[#0f172a] text-white px-8 py-4 rounded-xl font-sans text-[13px] font-medium tracking-wide hover:bg-[#1e293b] transition-all">
                  <span>Explore Our Work</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-24 flex items-center space-x-3 text-[13px] text-[#0f172a]/60">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></div>
                <span>Scroll to explore</span>
              </div>
            </div>
            {/* Right column — space for 3D elements (empty because canvas is global now) */}
            <div className="w-[45%]"></div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="relative w-full py-32 px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex gap-16">
            {/* Left Content */}
            <div className="w-[30%]">
              <div className="text-[#38bdf8] text-[13px] font-medium mb-6">What We Do</div>
              <h2 className="font-serif text-[42px] leading-[1.1] text-[#0f172a] tracking-tight mb-8">
                Solutions crafted<br />to solve real problems.
              </h2>
              <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/70 mb-10">
                From concept to deployment, we deliver scalable and secure digital solutions that drive business forward.
              </p>
              <a href="#" className="flex items-center space-x-2 text-[#38bdf8] text-[14px] font-medium group">
                <span>View all services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right Cards */}
            <div className="w-[70%] grid grid-cols-3 gap-6">
              {[
                { title: "Web Development", desc: "High performance websites built with modern technologies, focused on speed, scalability and experience.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
                { title: "Application Development", desc: "Custom web and mobile applications engineered to fit your workflow and scale with your business.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { title: "Digital Experience Design", desc: "Thoughtful design that blends clarity, aesthetics and usability to create impactful digital experiences.", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }
              ].map((card, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md border border-white p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors flex flex-col h-[400px]">
                  <div className="w-10 h-10 mb-auto text-[#38bdf8]">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={card.icon}></path></svg>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-sans font-bold text-[18px] text-[#0f172a] mb-4 pr-4">{card.title}</h3>
                    <p className="font-sans text-[13px] leading-relaxed text-[#0f172a]/60 mb-8">{card.desc}</p>
                    <ArrowRight className="w-5 h-5 text-[#0f172a]/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK SECTION — Card Stacking Animation */}
        <section className="relative w-full py-32 px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-[30%] lg:sticky lg:top-32 h-fit">
              <div className="text-[#38bdf8] text-[13px] font-medium mb-6">Selected Work</div>
              <h2 className="font-serif text-[42px] leading-[1.1] text-[#0f172a] tracking-tight mb-10">
                Building things<br />that matter.
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
                <div 
                  key={i} 
                  className="work-card sticky origin-top flex flex-col md:flex-row gap-8 bg-white/70 backdrop-blur-xl border border-white rounded-[32px] p-8 md:p-12 shadow-[0_-10px_50px_rgba(0,0,0,0.03)]"
                  style={{ top: `${100 + i * 40}px`, zIndex: 10 + i }}
                >
                  {/* Left Side: Visual */}
                  <div className={`w-full md:w-1/2 h-[300px] md:h-[400px] rounded-[24px] bg-gradient-to-br ${work.color} border border-white/40 flex items-center justify-center relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
                     <h3 className="text-[#0f172a]/10 font-bold text-[64px] select-none">{work.title}</h3>
                  </div>

                  {/* Right Side: Content */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
                    <div className="w-12 h-12 bg-[#0f172a]/5 rounded-xl flex items-center justify-center mb-8 border border-black/5">
                      <div className="text-[#0f172a]/60">{work.icon}</div>
                    </div>
                    <div className="text-[#38bdf8] text-[13px] font-medium mb-3">{work.cat}</div>
                    <h3 className="font-serif text-[32px] text-[#0f172a] mb-6">{work.title}</h3>
                    <p className="font-sans text-[15px] leading-relaxed text-[#0f172a]/60 mb-10 pr-6">
                      {work.desc}
                    </p>
                    <button className="flex items-center space-x-3 text-[#0f172a] text-[14px] font-bold group w-fit">
                      <span>View Case Study</span>
                      <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#0f172a] group-hover:text-white transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT & STATS SECTION */}
        <section className="relative w-full py-20 px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex gap-6 h-[480px]">
            {/* Left Dark Block */}
            <div className="w-[60%] bg-[#0f172a] rounded-[32px] p-16 flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10 w-[70%]">
                <div className="text-[#38bdf8] text-[13px] font-medium mb-6">About Delichon</div>
                <h2 className="font-serif text-[38px] leading-[1.2] text-white mb-8">
                  We believe software should not only function — it should endure.
                </h2>
                <p className="font-sans text-[15px] leading-relaxed text-white/60 mb-10 max-w-[400px]">
                  Delichon is built on the principle of clarity, structure and long-term reliability. We approach every project with precision and care.
                </p>
                <button className="flex items-center space-x-4 border border-white/20 text-white px-6 py-3 rounded-xl font-sans text-[13px] hover:bg-white/10 transition-colors w-fit">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Stats Block */}
            <div className="w-[40%] bg-white/60 backdrop-blur-md border border-white rounded-[32px] p-16 grid grid-cols-2 grid-rows-2 gap-8 relative overflow-hidden">
              <div className="flex flex-col justify-center border-b border-r border-[#0f172a]/5 pb-8 pr-8">
                <div className="text-[#0f172a]/40 text-[13px] mb-2">Projects</div>
                <div className="font-serif text-[48px] text-[#0f172a] leading-none mb-2">50+</div>
                <div className="text-[#0f172a]/60 text-[13px]">Delivered</div>
              </div>
              <div className="flex flex-col justify-center border-b border-[#0f172a]/5 pb-8 pl-8">
                <div className="text-[#0f172a]/40 text-[13px] mb-2 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mr-2"></div>Clients</div>
                <div className="font-serif text-[48px] text-[#0f172a] leading-none mb-2">30+</div>
                <div className="text-[#0f172a]/60 text-[13px]">Trusted</div>
              </div>
              <div className="flex flex-col justify-center border-r border-[#0f172a]/5 pt-8 pr-8">
                <div className="text-[#0f172a]/40 text-[13px] mb-2 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mr-2"></div>Team</div>
                <div className="font-serif text-[48px] text-[#0f172a] leading-none mb-2">8</div>
                <div className="text-[#0f172a]/60 text-[13px]">Builders</div>
              </div>
              <div className="flex flex-col justify-center pt-8 pl-8">
                <div className="text-[#0f172a]/40 text-[13px] mb-2">Focus</div>
                <div className="font-serif text-[48px] text-[#0f172a] leading-none mb-2">100%</div>
                <div className="text-[#0f172a]/60 text-[13px]">Quality</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="relative w-full py-32 px-10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm border border-white/60 p-16 rounded-[32px]">
            <div className="w-1/3">
              <h2 className="font-serif text-[48px] leading-[1.1] text-[#0f172a] tracking-tight">
                Let's build<br />something great<br />together.
              </h2>
            </div>

            <div className="w-1/3 flex flex-col justify-center">
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

            <div className="w-1/3 flex justify-end">
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-[20px] p-6 flex items-center space-x-4 border border-white">
                <div className="w-12 h-12 bg-[#0f172a] rounded-[12px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <div className="font-sans font-bold text-[#0f172a] text-[15px]">hello@delichon.com</div>
                  <div className="text-[12px] text-[#0f172a]/50">We typically reply within 24 hours.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-10 px-10 border-t border-[#0f172a]/10 max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex justify-between items-center text-[13px] text-[#0f172a]/50">
            <a href="/" className="flex items-center text-[#0f172a] hover:opacity-70 transition-opacity">
              <img src="/logo.png" alt="Delichon" className="h-8 grayscale opacity-80" />
            </a>

            <div>&copy; 2024 Delichon Technologies. All rights reserved.</div>

            <div className="flex items-center space-x-8">
              <a href="#" className="hover:text-[#0f172a] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0f172a] transition-colors">Terms of Use</a>
              <div className="flex space-x-4 text-[#0f172a]">
                <a href="#" className="hover:text-[#38bdf8]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>
                <a href="#" className="hover:text-[#38bdf8]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></a>
                <a href="#" className="hover:text-[#38bdf8]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
