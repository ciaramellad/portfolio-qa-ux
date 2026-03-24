/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DailyAppProject from './pages/DailyAppProject';
import TestingAPIProject from './pages/TestingAPIProject';
import EcommerceTestingProject from './pages/EcommerceTestingProject';
import UXTestingProject from './pages/UXTestingProject';
import { 
  ParticleBackground, 
  Header, 
  Section, 
  translations
} from './shared';
import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  ExternalLink, 
  CheckCircle2, 
  Mail, 
  Linkedin, 
  Github,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
 
// --- Components ---

// ─── Loading bar shown on initial page load ───────────────────
const LoadingBar = () => {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return <div className="page-loading-bar" />;
};

// ─── UX/UI Carousel ───────────────────────────────────────────
 
const UXUICarousel = ({ isDark }) => {
 
  const mockups = [
    { title: "Onus", desc: "Digital assets management interface", img: "/img/onus-proyectouxui.png" },
    { title: "Uminti", desc: "Interactive educational system", img: "/img/uminti-proyectouxui.png" },
    { title: "Hay equipo! App", desc: "Personal wellness dashboard", img: "/img/app-futfem.png" },
    { title: "Grinplug", desc: "IoT control center design", img: "/img/grinplug-proyectouxui.png" }
  ];
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockups.map((mockup, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-xl transition-colors duration-300`}
          style={{ height: '360px' }}
        >
 
          <img 
            src={mockup.img} 
            alt={mockup.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 group-hover:blur-sm"
            referrerPolicy="no-referrer"
          />
 
          {/* Desktop Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:flex flex-col justify-center items-center text-center p-6 backdrop-blur-md
          ${isDark
            ? "bg-white/80 text-[#121212]"
            : "bg-black/60 text-white"
          }`}>
 
            <h3 className="text-lg font-bold mb-1 tracking-tight">
              {mockup.title}
            </h3>
 
            <p className="text-xs opacity-80 font-light">
              {mockup.desc}
            </p>
 
          </div>
 
 
          {/* Mobile / Tablet */}
          <div className={`lg:hidden absolute bottom-0 left-0 right-0 p-3 backdrop-blur-sm
          ${isDark
            ? "bg-gradient-to-t from-white/80 to-transparent text-[#121212]"
            : "bg-gradient-to-t from-black/70 to-transparent text-white"
          }`}>
 
            <h3 className="text-base font-bold tracking-tight">
              {mockup.title}
            </h3>
 
            <p className="text-[12px] opacity-80 font-light">
              {mockup.desc}
            </p>
 
          </div>
 
        </div>
      ))}
    </div>
  );
};

const ProjectCard: React.FC<{ title: string, description: string, theme: 'dark' | 'light', lang: 'en' | 'es', link?: string }> = ({ title, description, theme, lang, link }) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        navigate(link);
      }
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={handleClick}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group border p-6 md:p-8 transition-all duration-300 cursor-pointer h-full flex flex-col hover:shadow-2xl rounded-2xl backdrop-blur-sm
        ${isDark 
          ? 'border-white/10 text-white bg-white/5 hover:bg-white hover:text-[#121212] hover:border-[#121212]/20 hover:shadow-white/5' 
          : 'border-black/10 text-[#121212] bg-black/5 hover:bg-[#121212] hover:text-white hover:border-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]'
        }`}
    >
      <div className="flex justify-between items-start mb-6">
        <CheckCircle2 className={`w-5 h-5 transition-opacity ${isDark ? 'opacity-40 group-hover:opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
      </div>

      <h3 className="mb-3 tracking-tight">{title}</h3>

      <p className={`text-sm opacity-70 leading-relaxed transition-opacity group-hover:opacity-100`}>
        {description}
      </p>

      {link && (
        <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
          {lang === 'es' ? 'VER PROYECTO' : 'VIEW PROJECT'}
          <ExternalLink className="w-3 h-3" />
        </div>
      )}

    </motion.div>
  );
};

 
const AppleVisualSlider: React.FC<{ projects: any[], theme: 'dark' | 'light', t: any }> = ({ projects, theme }) => {
 
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
 
  const isDark = theme === "dark"
 
  const next = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }
 
  const prev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }
 
  const variants = {
    enter: (direction:number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction:number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }
 
  const project = projects[currentIndex]
 
  return (
 
    <div className="w-full rounded-xl overflow-hidden border border-white/10">
 
      <AnimatePresence mode="wait" custom={direction}>
 
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration:0.45 }}
          className={`flex flex-col md:flex-row ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}
        >
 
          {/* IMAGE */}
 
          <div className="w-full md:w-3/5 h-[220px] md:h-[360px] relative overflow-hidden rounded-l-xl">
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
 
          {/* TEXT */}
 
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center">
 
            <span className="text-xs tracking-[0.2em] uppercase font-medium opacity-50 mb-4 block">
              {translations[theme === 'dark' ? 'en' : 'es'].common.caseStudy}
            </span>
 
            <h3 className="mb-4">
              {project.title}
            </h3>
 
            <p className="opacity-70 leading-relaxed mb-8">
              {project.desc}
            </p>
 
            <div className="flex gap-3">
 
              <button
                onClick={prev}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-white hover:text-black transition"
              >
                <ChevronLeft size={15}/>
              </button>
 
              <button
                onClick={next}
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-white hover:text-black transition"
              >
                <ChevronRight size={15}/>
              </button>
 
            </div>
 
          </div>
 
        </motion.div>
 
      </AnimatePresence>
 
    </div>
 
  )
};
 
// --- Main App ---
 
export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'es'>('es');
 
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
 
  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };
 
  const t = translations[lang];
 
  return (
    <div className={`${theme === 'dark' ? 'theme-dark bg-[#121212] text-white' : 'theme-light bg-white text-[#121212]'} transition-colors duration-500 font-sans min-h-screen`}>
      <LoadingBar />
      <ParticleBackground theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} t={t} />

      
      <Routes>
        <Route path="/proyectos-qa/daily_app" element={<DailyAppProject theme={theme} lang={lang} toggleLang={toggleLang} toggleTheme={toggleTheme} />} />
        <Route path="/proyectos-qa/testing-api-postman" element={<TestingAPIProject theme={theme} lang={lang} toggleLang={toggleLang} toggleTheme={toggleTheme} />} />
        <Route path="/proyectos-qa/ecommerce-testing" element={<EcommerceTestingProject theme={theme} lang={lang} toggleLang={toggleLang} toggleTheme={toggleTheme} />} />
        <Route path="/ux-testing" element={<UXTestingProject theme={theme} lang={lang} toggleLang={toggleLang} toggleTheme={toggleTheme} />} />
        <Route path="/" element={
          <main className="relative z-10 w-full">
            
            {/* SECTION 1 — HERO */}
            <Section id="hero" theme={theme} className="items-center text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="font-bold tracking-tighter text-center">
                  <span className="block">Daiana</span>
                  <span className="block">Ciaramella</span>
                </h1>
                <p className={`section-subheading !normal-case !tracking-[0.3em] !mb-4 ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>
                  {t.heroSub}
                </p>
                {/* Skills: single line with bullet separators */}
                <p className={`text-xs md:text-sm font-medium tracking-[0.15em] uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-4 ${theme === 'dark' ? 'opacity-35' : 'opacity-50'}`}>
                  Manual Testing&nbsp;&nbsp;•&nbsp;&nbsp;Bug Reporting&nbsp;&nbsp;•&nbsp;&nbsp;UX-Oriented QA&nbsp;&nbsp;•&nbsp;&nbsp;Web App Testing
                </p>
              </div>

              <motion.div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
              >
                <span className={`text-xs uppercase tracking-[0.3em] font-medium ${theme === 'dark' ? 'opacity-40' : 'opacity-60'}`}>{t.common.scroll}</span>
                <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'opacity-40' : 'opacity-60'}`} />
              </motion.div>
            </Section>
 
            {/* SECTION 2 — ABOUT */}
            <Section id="about" theme={theme}>
              <div className="w-full">

                <span className={`section-subheading ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>
                  01 / {t.about}
                </span>

                <h2 className="font-bold mb-16 tracking-tight">
                  {t.aboutTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                  <p className={`leading-[1.85] font-light ${theme === 'dark' ? 'opacity-70' : 'opacity-90'}`}>
                    {t.aboutP1}
                  </p>

                  <p className={`leading-[1.85] font-light ${theme === 'dark' ? 'opacity-70' : 'opacity-90'}`}>
                    {t.aboutP2}
                  </p>
                </div>

              </div>
            </Section>
 
            {/* SECTION 3 — PROJECTS QA */}
            <Section id="projects-qa" theme={theme}>
              <span className={`section-subheading ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>02 / {t.projectsQA}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                {t.qaProjects.map((project: any, i: number) => (
                  <ProjectCard 
                    key={i}
                    theme={theme}
                    lang={lang}
                    title={project.title} 
                    description={project.description}
                    link={project.link}
                  />
                ))}
              </div>
            </Section>
 
            {/* SECTION 3B — VISUAL PROJECTS QA */}
            <Section id="projects-ux-ui" theme={theme}>
              <span className={`section-subheading ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>03 / {t.visualProjectsTitle}</span>
              <AppleVisualSlider projects={t.visualProjects} theme={theme} t={t} />
            </Section>

            {/* SECTION 5 — SKILLS */}
            <Section id="skills" theme={theme}>
              <span className={`section-subheading ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>04 / {t.skills}</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-12">
                {[
                  "Manual Testing", "API Testing (Postman)", "Test Case Design", "Bug Reporting",
                  "Exploratory Testing", "UX/UI Testing", "Chrome DevTools", "Jira",
                  "TestRail", "Figma", "Git / GitHub", "Agile / Scrum"
                ].map((skill, i) => (
                  <div key={i} className="group">
                    <div className={`h-[1px] w-full mb-3 transition-colors ${theme === 'dark' ? 'bg-white/10 group-hover:bg-white/40' : 'bg-[#121212] group-hover:bg-[#121212]'}`} />
                    <span className="text-sm tracking-wide">{skill}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* SECTION 6 — CONTACT */}
            <Section id="contact" theme={theme} className="items-center text-center">
              <span className={`section-subheading ${theme === 'dark' ? 'opacity-50' : 'opacity-60'}`}>05 / {t.contact}</span>
              <h2 className="font-bold mb-16 tracking-tighter leading-[0.85] text-center w-full">
                <span className="block">{lang === 'es' ? 'TRABAJEMOS' : "LET'S WORK"}</span>
                <span className="block">{lang === 'es' ? 'JUNTOS.' : 'TOGETHER.'}</span>
              </h2>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center mt-12 pb-16">
                <a href="mailto:daiana.ciaramella@gmail.com" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
                  <Mail className="w-5 h-5" />
                  <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">{t.common.email}</span>
                </a>
                <a href="#" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
                  <Linkedin className="w-5 h-5" />
                  <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">{t.common.linkedin}</span>
                </a>
                <a href="#" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
                  <Github className="w-5 h-5" />
                  <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">{t.common.github}</span>
                </a>
              </div>

              <div className={`mt-20 text-xs uppercase tracking-[0.5em] font-medium ${theme === 'dark' ? 'opacity-30' : 'opacity-50'}`}>
                {t.footer}
              </div>
            </Section>
 
          </main>
        } />
      </Routes>
    </div>
  );
}
