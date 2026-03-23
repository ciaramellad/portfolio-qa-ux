import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink, 
  ChevronRight,
  Code2,
  Layout,
  Accessibility,
  Database,
  Smartphone,
  Zap
} from 'lucide-react';
import { 
  Header, 
  Section, 
  ParticleBackground, 
  ContactForm, 
  translations 
} from '../shared';
import { Link } from 'react-router-dom';

const Home = ({ theme, toggleTheme, lang, toggleLang }: { theme: 'dark' | 'light', toggleTheme: () => void, lang: 'en' | 'es', toggleLang: () => void }) => {
  const t = translations[lang];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-white text-[#121212]'}`}>
      <ParticleBackground theme={theme} />
      <Header theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} t={t} />

      {/* Hero Section */}
      <Section id="hero" theme={theme} className="pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]">
            {t.heroTitle.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 pt-8">
            <p className="text-sm uppercase tracking-[0.3em] font-light opacity-60">
              {t.heroSub}
            </p>
            <div className={`hidden md:block w-12 h-[1px] ${theme === 'dark' ? 'bg-white/20' : 'bg-[#121212]/20'}`} />
            <p className="text-sm uppercase tracking-[0.3em] font-light opacity-60">
              UX UI DESIGNER
            </p>
          </div>
        </motion.div>
      </Section>

      {/* About Section */}
      <Section id="about" theme={theme}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
              {t.aboutTitle}
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-light opacity-80 leading-relaxed">
              <p>{t.aboutP1}</p>
              <p>{t.aboutP2}</p>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end">
            <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#121212]/10 bg-black/5'}`}>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-4">Location</p>
              <p className="text-lg font-medium">Buenos Aires, Argentina</p>
              <div className="h-8" />
              <p className="text-xs uppercase tracking-widest opacity-50 mb-4">Experience</p>
              <p className="text-lg font-medium">3+ Years</p>
            </div>
          </div>
        </div>
      </Section>

      {/* QA Projects Section */}
      <Section id="projects-qa" theme={theme}>
        <div className="space-y-12">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.projectsQATitle}</h2>
            <p className="text-sm uppercase tracking-widest opacity-50 mb-2">04 Projects</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {t.qaProjects.map((project, i) => (
              <Link 
                key={i}
                to={project.link}
                className={`group block p-8 md:p-12 rounded-[2rem] border transition-all duration-500 hover:scale-[1.01] ${theme === 'dark' ? 'border-white/10 hover:bg-white hover:text-[#121212]' : 'border-[#121212]/10 hover:bg-[#121212] hover:text-white'}`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono opacity-50">0{i + 1}</span>
                      <h3 className="text-2xl md:text-4xl font-bold tracking-tight">{project.title}</h3>
                    </div>
                    <p className="text-lg opacity-70 leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 ${theme === 'dark' ? 'border-white/20' : 'border-[#121212]/20'}`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* UX UI Projects Section */}
      <Section id="projects-ux-ui" theme={theme}>
        <div className="space-y-12">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.projectsUXTitle}</h2>
            <p className="text-sm uppercase tracking-widest opacity-50 mb-2">04 Projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.visualProjects.map((project, i) => (
              <div key={i} className="group space-y-6">
                <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-neutral-100 relative">
                  <img 
                    src={project.img} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button className="bg-white text-black px-8 py-3 rounded-full font-bold tracking-widest uppercase text-xs">
                      {t.view}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 px-2">
                  <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed max-w-md">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section id="skills" theme={theme}>
        <div className="space-y-12">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t.skillsTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-ryanair-blue">
                <Layout className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-sm">QA Manual</h3>
              </div>
              <ul className="space-y-3 text-lg font-light opacity-70">
                <li>Test Case Design</li>
                <li>Defect Reporting</li>
                <li>Regression Testing</li>
                <li>Exploratory Testing</li>
                <li>Agile Methodologies</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-ryanair-blue">
                <Code2 className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-sm">Technical</h3>
              </div>
              <ul className="space-y-3 text-lg font-light opacity-70">
                <li>Postman / API Testing</li>
                <li>SQL Basics</li>
                <li>Git / GitHub</li>
                <li>Vercel / Deployment</li>
                <li>Chrome DevTools</li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-ryanair-blue">
                <Accessibility className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-sm">UX & Accessibility</h3>
              </div>
              <ul className="space-y-3 text-lg font-light opacity-70">
                <li>Figma / UX UI Design</li>
                <li>WCAG 2.1 Guidelines</li>
                <li>Axe DevTools</li>
                <li>Usability Testing</li>
                <li>Heuristic Evaluation</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" theme={theme} className="pb-32">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            {t.contactTitle}
          </h2>
          <p className="text-xl opacity-60 max-w-xl mx-auto">
            Ready to improve your software quality? Let's talk about your next project.
          </p>
          <ContactForm theme={theme} t={t} />
        </div>
      </Section>

      <footer className={`py-12 border-t text-center ${theme === 'dark' ? 'border-white/10' : 'border-[#121212]/10'}`}>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default Home;
