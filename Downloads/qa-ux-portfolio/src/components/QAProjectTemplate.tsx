import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  CheckCircle2, 
  XCircle,
  Bug, 
  Layout, 
  Target, 
  ListChecks,
  Mail, 
  Linkedin, 
  Github,
  LucideIcon,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Copy,
  Terminal,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { 
  Header, 
  ContactForm, 
  ParticleBackground, 
  translations 
} from '../shared';
 
const ProjectSection = ({ children, id, theme, className = "", delay = 0 }: { children: React.ReactNode, id: string, theme: 'dark' | 'light', className?: string, delay?: number }) => (
  <section 
    id={id} 
    className={`w-full relative min-h-screen flex flex-col justify-center overflow-hidden ${className}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-10%" }}
      className="z-10 w-full max-w-[1100px] mx-auto px-6 md:px-12 py-32 md:py-48"
    >
      {children}
    </motion.div>
  </section>
);
 
interface BugCardProps {
  id?: string;
  testCaseId?: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  type?: string;
  description?: string;
  steps: string[];
  expected: string;
  actual: string;
  evidence?: string | string[];
  theme: 'dark' | 'light';
  lang: 'en' | 'es';
  onViewEvidence?: (url: string | string[]) => void;
}
 
const BugCard: React.FC<BugCardProps> = ({ id, testCaseId, title, severity, type, description, steps, expected, actual, evidence, theme, lang, onViewEvidence }) => {
  const isDark = theme === 'dark';
 
  const severityStyles = {
    High: {
      badge: isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-500/20 text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      button: 'text-red-400 bg-red-500/10 hover:bg-red-500/20',
    },
    Medium: {
      badge: isDark ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      dot: 'bg-yellow-400',
      button: 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20',
    },
    Low: {
      badge: 'bg-green-500/20 text-green-400 border-green-500/30',
      dot: 'bg-green-500',
      button: isDark ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20' : 'text-green-400 bg-green-500/20 hover:bg-green-500/30',
    }
  }[severity];
 
 
  return (
    <div className={`rounded-2xl border flex flex-col h-full overflow-hidden transition-all duration-500
      ${isDark
        ? 'bg-[#161616] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/20'
        : 'bg-[#121212] border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-black text-white'
      }`}>
 
      {/* ── TOP BAR: ID left · SEVERITY right ── */}
      <div className={`flex items-center justify-between px-5 pt-5 pb-4`}>
        {id ? (
          <span className={`font-mono text-[11px] font-bold tracking-widest uppercase
            ${isDark ? 'text-white/30' : 'text-white'}`}>
            {id}
          </span>
        ) : <span />}
 
        <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${severityStyles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${severityStyles.dot}`} />
          {lang === 'es' ? (
            severity === 'High' ? 'GRAVE' : severity === 'Medium' ? 'MEDIO' : 'LEVE'
          ) : severity}
        </span>
      </div>
 
      {/* ── DIVIDER ── */}
      <div className={`mx-5 h-px ${isDark ? 'bg-white/6' : 'bg-white/10'}`} />
 
      {/* ── BODY ── */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-4">
 
        {/* Title */}
        <h4 className="text-sm md:text-base font-bold leading-snug tracking-tight text-white">
          {title}
        </h4>
 
        {/* Description */}
        {description && (
          <p className={`text-[14px] leading-relaxed font-light
            ${isDark ? 'text-white/50' : 'text-white/70'}`}>
            {description}
          </p>
        )}
 
        {/* Steps */}
        <div className="flex-1">
          <span className={`block mb-1.5 text-[11px] uppercase tracking-widest font-bold
            ${isDark ? 'text-white/30' : 'text-white/50'}`}>
            {lang === 'es' ? 'Pasos' : 'Steps'}
          </span>
          <ol className={`list-decimal list-inside space-y-1.5 text-[14px] font-light
            ${isDark ? 'text-white/50' : 'text-white/70'}`}>
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
 
        {/* Expected / Actual */}
        <div className={`mt-auto pt-5 border-t
          ${isDark ? 'border-white/6' : 'border-white/15'}`}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className={`block mb-1 text-[11px] uppercase tracking-widest font-bold
                ${isDark ? 'text-white/30' : 'text-white/50'}`}>
                {lang === 'es' ? 'Esperado' : 'Expected'}
              </span>
              <p className={`text-[14px] font-light leading-relaxed
                ${isDark ? 'text-white/50' : 'text-white/70'}`}>
                {expected}
              </p>
            </div>
            <div>
              <span className={`block mb-1 text-[11px] uppercase tracking-widest font-bold
                ${isDark ? 'text-white/30' : 'text-white/50'}`}>
                {lang === 'es' ? 'Actual' : 'Actual'}
              </span>
              <p className="text-[14px] font-semibold text-red-400 leading-relaxed">{actual}</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* ── FOOTER TAGS: TC · TYPE ── */}
      {(testCaseId || type || evidence) && (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-t
          ${isDark ? 'border-white/6 bg-white/[0.02]' : 'border-white/10 bg-white/[0.03]'}`}>
          
          <div className="flex flex-wrap gap-2 items-center">
            {testCaseId && (
              <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md
                ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-500/20 text-orange-300'}`}>
                {testCaseId}
              </span>
            )}
            {type && (
              <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md
                ${isDark ? 'bg-white/6 text-white/40' : 'bg-white/10 text-white/40'}`}>
                {type}
              </span>
            )}
          </div>

          {evidence && (
            <button 
              onClick={() => onViewEvidence?.(evidence)}
              className={`sm:ml-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] transition-all duration-200 group ${isDark ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {lang === 'es' ? 'VER INCIDENCIA' : 'VIEW EVIDENCE'}
            </button>
          )}
        </div>
      )}
 
    </div>
  );
};
 
export interface QAProjectProps {
  theme: 'dark' | 'light';
  lang?: 'en' | 'es';
  toggleLang?: () => void;
  toggleTheme?: () => void;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  tools: string[];
  objective: string;
  platform: string;
  platformLabel?: string;
  features?: string[];
  featuresTitle?: string;
  featureMockup: string;
  testingStrategyTitle?: string;
  testingTypes?: { name: string, description?: string, icon: LucideIcon }[];
  testScenarios?: {
    title: string;
    description?: string;
    table: { id: string, feature?: string, scenario: string, objective?: string }[];
    idHeader?: string;
    featureHeader?: string;
    scenarioHeader?: string;
    footer?: string;
  };
  testScenarios2?: {
    title: string;
    description?: string;
    table: { id: string, feature?: string, scenario: string, objective?: string }[];
    idHeader?: string;
    featureHeader?: string;
    scenarioHeader?: string;
    footer?: string;
  };
  validations?: {
    title: string;
    items: {
      title: string;
      description?: string;
      code: string;
      language?: string;
      evidence?: string;
    }[];
  };
  testCasesDesc?: string;
  testCasesSummary?: {
    title: string;
    description?: string;
    headers: string[];
    table: { scenario: string, testCase: string, functionality: string, status: string, bug?: string }[];
  };
  testCasesIntro?: {
    p1: string;
    p2: string;
  };
  testCasesTitle?: string;
  testCases: { 
    id: string, 
    scenarioId?: string,
    feature: string, 
    scenario: string, 
    result: string,
    status?: 'pass' | 'fail',
    bug?: string,
    details?: {
      precondition: string;
      steps: string[];
      evidence?: {
        request: string;
        response: string;
      };
    }
  }[];
  bugsTitle?: string;
  bugsDescription?: string;
  bugs?: { 
    id?: string,
    testCaseId?: string,
    title: string, 
    severity: 'High' | 'Medium' | 'Low', 
    type?: string,
    description?: string,
    steps: string[], 
    expected: string, 
    actual: string,
    evidence?: string 
  }[];
  uxImprovementsTitle?: string;
  uxImprovements?: string[];
  automation?: {
    title: string;
    description?: string;
  };
  conclusion?: {
    title: string;
    content: string;
  };
  testScenariosTable?: {
    title: string;
    table: {
      id: string;
      feature: string;
      scenario: string;
      objective: string;
    }[];
  };
  statsTable?: {
    title: string;
    description?: string;
    headers: string[];
    rows: string[][];
  };
  mockupType?: 'mobile' | 'laptop';
  fullWidthUX?: boolean;
  heroBg?: string;
  certification?: {
    title: string;
    image: string;
  };
}
 
const QAProjectTemplate: React.FC<QAProjectProps> = ({
  theme,
  lang = 'es',
  toggleLang,
  toggleTheme,
  title,
  subtitle,
  description,
  heroImage,
  tools,
  objective,
  platform,
  platformLabel,
  features,
  featuresTitle,
  featureMockup,
  testingStrategyTitle,
  testingTypes,
  testScenarios,
  testScenarios2,
  validations,
  testCasesDesc,
  testCasesSummary,
  testCasesIntro,
  testCasesTitle,
  testCases,
  bugsTitle,
  bugsDescription,
  bugs,
  uxImprovementsTitle,
  uxImprovements,
  automation,
  conclusion,
  statsTable,
  testScenariosTable,
  mockupType = 'mobile',
  certification,
  heroBg,
  fullWidthUX = false
}) => {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | string[] | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false,
    slidesToScroll: 1,
  }, []);
  
  const { scrollYProgress } = useScroll();
  
  const rotate = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  const t = translations[lang];
  const isDark = theme === 'dark';
 
  let currentSection = 1;
  const getSectionNumber = () => {
    const num = currentSection.toString().padStart(2, '0');
    currentSection++;
    return num;
  };
 
  return (
    <div className={`${theme === 'dark' ? 'theme-dark' : 'theme-light'} transition-colors duration-500 font-sans relative`}>
      <motion.div 
        className={`fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left ${theme === 'dark' ? 'bg-white/50' : 'bg-black/30'}`}
        style={{ scaleX }}
      />
 

 
      <main className="relative z-10">
        
        {/* 1. HERO */}
        <section id="hero" className="w-full relative min-h-screen flex items-center overflow-hidden">
 
          <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 1, 
                y: [0, -15, 0],
              }}
              transition={{ 
                opacity: { duration: 1 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative flex justify-center items-center order-2 md:order-1"
            >
              {mockupType === 'laptop' ? (
                <div className="relative w-full max-w-[380px] md:max-w-[460px] aspect-[1.4/1] perspective-[3000px]">
                  <div 
                    className="relative w-full h-full"
                    style={{ 
                      transform: 'rotateY(-28deg) rotateX(18deg) rotateZ(4deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Base / Keyboard Area */}
                    <div 
                      className={`absolute bottom-[10%] left-0 w-full h-[70%] rounded-xl transition-colors ${isDark ? 'bg-[#2a2a2a] border-t border-white/10' : 'bg-[#e5e5e5] border-t border-black/10'}`}
                      style={{
                        transform: 'rotateX(90deg)',
                        transformOrigin: 'bottom',
                        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.6)' : '0 10px 40px rgba(0,0,0,0.1)',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      {/* Keyboard Representation - Rows */}
                      <div className="absolute top-[12%] left-[8%] right-[8%] bottom-[35%] flex flex-col gap-1.5 opacity-20">
                        {Array.from({ length: 5 }).map((_, rowIdx) => (
                          <div key={rowIdx} className="flex gap-1.5 h-full">
                            {Array.from({ length: 14 }).map((_, keyIdx) => (
                              <div key={keyIdx} className={`flex-1 rounded-[1px] ${isDark ? 'bg-white' : 'bg-black'}`} />
                            ))}
                          </div>
                        ))}
                      </div>
                      
                      {/* Trackpad */}
                      <div className={`absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[38%] h-[22%] rounded-lg border ${isDark ? 'bg-black/10 border-white/5' : 'bg-black/5 border-black/5'}`} />
                      
                      {/* Chassis Thickness (Sides) */}
                      <div className={`absolute -bottom-[6px] left-0 w-full h-[6px] rounded-b-xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#ccc]'}`} />
                    </div>
 
                    {/* Screen / Lid */}
                    <div 
                      className={`absolute bottom-[10%] left-0 w-full h-[88%] rounded-xl border-2 overflow-hidden transition-colors shadow-2xl ${isDark ? 'border-[#333] bg-[#0a0a0a]' : 'border-[#d1d1d1] bg-gray-100'}`}
                      style={{ 
                        transform: 'rotateX(-15deg)', 
                        transformOrigin: 'bottom',
                        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.8)' : '0 20px 50px rgba(0,0,0,0.15)',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="absolute inset-[1.5%]">
                        <div className={`w-full h-full rounded-md overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
                          <img 
                            src={heroImage} 
                            alt={`${title} Screen`} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      {/* Camera */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/60 border border-white/10" />
                    </div>
                  </div>
                  
                  {/* Shadow/Reflect below */}
                  <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-[95%] h-16 blur-[70px] rounded-full transition-opacity duration-1000 ${isDark ? 'bg-white/5 opacity-40' : 'bg-black/10 opacity-30'}`} />
                </div>
              ) : (
                /* Smartphone Mockup */
                <motion.div 
                  className="relative w-[180px] md:w-[210px] aspect-[1/2] perspective-[2000px]"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
                  animate={{ opacity: 1, scale: 1, rotateY: -15 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                >
                  <div 
                    className="relative w-full h-full"
                    style={{ 
                      transform: 'rotateX(5deg) rotateZ(-2deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Phone Body */}
                    <div 
                      className={`absolute inset-0 rounded-[45px] border-[10px] overflow-hidden transition-colors shadow-2xl ${isDark ? 'border-[#222] bg-[#0a0a0a]' : 'border-[#121212] bg-white'}`}
                      style={{
                        boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.8)' : '0 30px 60px rgba(0,0,0,0.2)',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      {/* Notch */}
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[30px] rounded-b-2xl z-20 ${isDark ? 'bg-[#222]' : 'bg-[#121212]'}`}></div>
                      
                      {/* Screen Content */}
                      <div className="absolute inset-0">
                        <img 
                          src={heroImage} 
                          alt={`${title} Mobile Screen`} 
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
 
                    {/* Side Buttons */}
                    <div className={`absolute top-[20%] -left-[12px] w-[4px] h-[40px] rounded-l-md ${isDark ? 'bg-[#333]' : 'bg-[#121212]'}`} />
                    <div className={`absolute top-[30%] -left-[12px] w-[4px] h-[60px] rounded-l-md ${isDark ? 'bg-[#333]' : 'bg-[#121212]'}`} />
                    <div className={`absolute top-[25%] -right-[12px] w-[4px] h-[80px] rounded-r-md ${isDark ? 'bg-[#333]' : 'bg-[#121212]'}`} />
                  </div>
                  
                  {/* Shadow/Reflect below */}
                  <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-12 blur-[60px] rounded-full transition-opacity duration-1000 ${isDark ? 'bg-white/5 opacity-30' : 'bg-black/10 opacity-20'}`} />
                </motion.div>
              )}
            </motion.div>
 
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left order-1 md:order-2 flex flex-col items-center md:items-start"
            >
              <h1 className="project-title font-bold tracking-tight mb-6 leading-[1.1]">
                {title}
              </h1>
              <p className={`text-base md:text-lg font-light tracking-tight leading-relaxed max-w-md mx-auto md:mx-0 mb-10 whitespace-pre-line ${isDark ? 'opacity-50' : 'opacity-70'}`}>
                {subtitle}
              </p>
 
              {certification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-lg mb-12 border border-black/5"
                >
                  <img 
                    src={certification.image} 
                    alt={certification.title} 
                    className="h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-orange-500 font-bold text-sm tracking-tight">
                    {certification.title}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
 
        {/* 2. DESCRIPCIÓN */}
        <ProjectSection id="overview" theme={theme}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-80'}`}>
                {getSectionNumber()} / {lang === 'es' ? 'DESCRIPCIÓN' : 'DESCRIPTION'}
              </span>
              <p className={`text-base md:text-lg font-light leading-relaxed whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {description}
              </p>
              {tools && tools.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-5">
                  {tools.map((tool, i) => (
                    <button 
                      key={i} 
                      className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all duration-300
                      ${isDark 
                        ? 'bg-[#161616] border-white/10 hover:border-white/20' 
                        : 'bg-[#121212] text-white border-transparent hover:bg-black'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              )}
            </div>
 
            <div className="space-y-10 lg:pt-16">
              <div className={`border-l pl-5 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                <h4 className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-3 ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Objetivo' : 'Objective'}</h4>
                <p className="text-sm md:text-base font-light leading-relaxed">{objective}</p>
              </div>
              <div className={`border-l pl-5 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                <h4 className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-3 ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                  {platformLabel || (lang === 'es' ? 'Plataforma' : 'Platform')}
                </h4>
                <p className="text-sm md:text-base font-light leading-relaxed whitespace-pre-line">{platform}</p>
              </div>
            </div>
          </div>
        </ProjectSection>
        
        {/* 2. FUNCIONES PRINCIPALES */}
        {features && features.length > 0 && (
          <ProjectSection id="features" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-80'}`}>
              {getSectionNumber()} / {featuresTitle || (lang === 'es' ? 'Funciones Principales' : 'Main Features')}
            </span>
 
            <div className="relative w-full flex flex-col md:flex-row items-center justify-center min-h-[420px] gap-8 md:gap-12">
              {/* MOBILE ONLY: TOP 2 FUNCTIONS */}
              <div className="flex flex-col gap-6 md:hidden w-full">
                {features.slice(0, 2).map((feature, i) => (
                  <div key={i} className="text-center">
                    <p className="text-lg font-bold">{feature}</p>
                    <div className={`w-[1px] h-6 mx-auto mt-2 ${isDark ? 'bg-white/20' : 'bg-black'}`}></div>
                  </div>
                ))}
              </div>
 
              {/* MOCKUP */}
              <div className="relative">
                {mockupType === 'mobile' && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                  </div>
                )}
                <motion.img
                  src={featureMockup}
                  alt="Project mockup"
                  className={`${
                    mockupType === 'laptop' 
                      ? 'w-[280px] md:w-[360px] lg:w-[280px] rounded-xl border-[4px]' 
                      : 'w-[150px] md:w-[170px] lg:w-[190px] rounded-[40px] border-[6px]'
                  } relative z-10 drop-shadow-2xl mt-10 md:mt-16 ${isDark ? "border-white/15" : "border-[#121212]/15"}`}
                  initial={{ rotate: mockupType === 'laptop' ? 0 : -4, y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
 
              {/* DESKTOP ONLY FUNCTIONS */}
              <div className="hidden md:block">
                {/* LEFT SIDE (3 FUNCTIONS) */}
                {features.slice(0, 3).map((feature, i) => {
                  const tops = ["10%", "42%", "74%"];
                  const offset = mockupType === 'laptop' ? '220px' : '140px';
                  return (
                    <div 
                      key={i} 
                      className="absolute flex items-center justify-end gap-3 w-[220px] lg:w-[280px]" 
                      style={{ 
                        top: tops[i], 
                        right: `calc(50% + ${offset})` 
                      }}
                    >
                      <p className="text-sm md:text-base lg:text-lg font-bold text-right leading-tight">{feature}</p>
                      <div className={`w-6 lg:w-10 h-[1px] shrink-0 ${isDark ? 'bg-white/20' : 'bg-black'}`}></div>
                    </div>
                  );
                })}

                {/* RIGHT SIDE (2 FUNCTIONS) */}
                {features.slice(3, 5).map((feature, i) => {
                  const tops = ["25%", "60%"];
                  const offset = mockupType === 'laptop' ? '220px' : '140px';
                  return (
                    <div 
                      key={i} 
                      className="absolute flex items-center justify-start gap-3 w-[220px] lg:w-[280px]" 
                      style={{ 
                        top: tops[i], 
                        left: `calc(50% + ${offset})` 
                      }}
                    >
                      <div className={`w-6 lg:w-10 h-[1px] shrink-0 ${isDark ? 'bg-white/20' : 'bg-black'}`}></div>
                      <p className="text-sm md:text-base lg:text-lg font-bold leading-tight">{feature}</p>
                    </div>
                  );
                })}
              </div>
 
              {/* MOBILE ONLY: BOTTOM 3 FUNCTIONS */}
              <div className="flex flex-col gap-6 md:hidden w-full">
                {features.slice(2).map((feature, i) => (
                  <div key={i} className="text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                        ${isDark ? 'bg-white/10' : 'bg-white/10 text-white'}`}>
                        <span className="text-[12px] font-bold">{i + 1}</span>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </ProjectSection>
        )}
        
        {/* 3. TIPOS DE TESTING */}
        {statsTable && (
          <ProjectSection id="stats-table" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-80'}`}>{getSectionNumber()} / {statsTable.title}</span>
            {statsTable.description && (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {statsTable.description}
              </p>
            )}
            <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-transparent bg-[#121212] text-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-white/10'}`}>
                      {statsTable.headers.map((header, i) => (
                        <th key={i} className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[14px] md:text-sm">
                    {statsTable.rows.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-white/5 hover:bg-white/[0.02]'}`}>
                        {row.map((cell, j) => (
                          <td key={j} className={`py-3 px-4 md:px-6 ${j === 0 ? 'font-bold' : 'font-light opacity-70'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ProjectSection>
        )}
        
        {/* 3. TIPOS DE TESTING */}
        {testingTypes && testingTypes.length > 0 && (
          <ProjectSection id="testing-types" theme={theme}>
            <div className={`p-8 md:p-12 rounded-[24px] backdrop-blur-md ${isDark ? "bg-white/90 text-[#121212]" : "bg-[#121212] text-white"}`}>
              <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-80'}`}>{getSectionNumber()} / {testingStrategyTitle || (lang === 'es' ? 'Tipos de Testing' : 'Testing Types')}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {testingTypes.map((type, i) => (
                  <div key={i} className="flex flex-col items-start gap-3 text-left">
                    <type.icon className={`w-8 h-8 shrink-0 mb-2 ${isDark ? 'text-black' : 'text-white'}`} />
                    <span className={`text-[15px] md:text-[18px] font-bold uppercase tracking-[0.2em] leading-tight ${isDark ? 'text-black' : 'text-white'}`}>{type.name}</span>
                    {type.description && (
                      <p className={`text-[14px] md:text-[16px] font-light leading-relaxed ${isDark ? 'text-black/70' : 'text-white/70'}`}>
                        {type.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ProjectSection>
        )}
 
        {/* 5. ESCENARIOS DE PRUEBA */}
        {testScenarios && (
          <ProjectSection id="test-scenarios" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {testScenarios.title}</span>
            {testScenarios.description && (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {testScenarios.description}
              </p>
            )}
            <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-transparent bg-[#121212] text-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-white/10'}`}>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                        {testScenarios.idHeader || (lang === 'es' ? 'Escenario ID' : 'Scenario ID')}
                      </th>
                      {testScenarios.table[0].feature && (
                        <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                          {testScenarios.featureHeader || (lang === 'es' ? 'Función' : 'Feature')}
                        </th>
                      )}
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                        {testScenarios.scenarioHeader || (lang === 'es' ? 'Escenario de Prueba' : 'Test Scenario')}
                      </th>
                      {testScenarios.table[0].objective && <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Objetivo' : 'Objective'}</th>}
                    </tr>
                  </thead>
                  <tbody className="text-[14px] md:text-sm">
                    {testScenarios.table.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-white/5 hover:bg-white/[0.02]'}`}>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px]">
                          {(() => {
                            let colorClass = '';
                            switch (row.id.toUpperCase()) {
                              case 'GET': colorClass = 'text-emerald-500 font-bold'; break;
                              case 'PUT': colorClass = 'text-blue-500 font-bold'; break;
                              case 'POST': case 'PUSH': colorClass = 'text-orange-500 font-bold'; break;
                              case 'DELETE': colorClass = 'text-red-500 font-bold'; break;
                              case 'PATCH': colorClass = 'text-purple-500 font-bold'; break;
                            }
                            return <span className={colorClass || (isDark ? 'opacity-50' : 'opacity-70')}>{row.id}</span>;
                          })()}
                        </td>
                        {row.feature && <td className="py-3 px-4 md:px-6 font-bold tracking-tight text-[14px] md:text-sm">{row.feature}</td>}
                        <td className="py-3 px-4 md:px-6 font-light opacity-70 text-[14px] md:text-sm">{row.scenario}</td>
                        {row.objective && <td className="py-3 px-4 md:px-6 font-medium text-[14px] md:text-sm">{row.objective}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {testScenarios.footer && (
              <p className={`mt-6 text-[14px] font-light opacity-40`}>{testScenarios.footer}</p>
            )}
          </ProjectSection>
        )}
 
        {/* 5.5 ESCENARIOS DE PRUEBA 2 */}
        {testScenarios2 && (
          <ProjectSection id="test-scenarios-2" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {testScenarios2.title}</span>
            {testScenarios2.description && (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {testScenarios2.description}
              </p>
            )}
            <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-transparent bg-[#121212] text-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-white/10'}`}>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                        {testScenarios2.idHeader || (lang === 'es' ? 'Escenario ID' : 'Scenario ID')}
                      </th>
                      {testScenarios2.table[0].feature && (
                        <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                          {testScenarios2.featureHeader || (lang === 'es' ? 'Función' : 'Feature')}
                        </th>
                      )}
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                        {testScenarios2.scenarioHeader || (lang === 'es' ? 'Escenario de Prueba' : 'Test Scenario')}
                      </th>
                      {testScenarios2.table[0].objective && <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Objetivo' : 'Objective'}</th>}
                    </tr>
                  </thead>
                  <tbody className="text-[14px] md:text-sm">
                    {testScenarios2.table.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-white/5 hover:bg-white/[0.02]'}`}>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px]">
                          {(() => {
                            let colorClass = '';
                            switch (row.id.toUpperCase()) {
                              case 'GET': colorClass = 'text-emerald-500 font-bold'; break;
                              case 'PUT': colorClass = 'text-blue-500 font-bold'; break;
                              case 'POST': case 'PUSH': colorClass = 'text-orange-500 font-bold'; break;
                              case 'DELETE': colorClass = 'text-red-500 font-bold'; break;
                              case 'PATCH': colorClass = 'text-purple-500 font-bold'; break;
                            }
                            return <span className={colorClass || (isDark ? 'opacity-50' : 'opacity-70')}>{row.id}</span>;
                          })()}
                        </td>
                        {row.feature && <td className="py-3 px-4 md:px-6 font-bold tracking-tight text-[14px] md:text-sm">{row.feature}</td>}
                        <td className="py-3 px-4 md:px-6 font-light opacity-70 text-[14px] md:text-sm">{row.scenario}</td>
                        {row.objective && <td className="py-3 px-4 md:px-6 font-medium text-[14px] md:text-sm">{row.objective}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {testScenarios2.footer && (
              <p className={`mt-6 text-[14px] font-light opacity-40`}>{testScenarios2.footer}</p>
            )}
          </ProjectSection>
        )}

        {/* 5.6 TEST SCENARIOS TABLE (RYANAIR) */}
        {testScenariosTable && (
          <ProjectSection id="test-scenarios-table" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {testScenariosTable.title}</span>
            <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-transparent bg-[#121212] text-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-white/10'}`}>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>ID</th>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'FUNCIÓN' : 'FEATURE'}</th>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'ESCENARIO' : 'SCENARIO'}</th>
                      <th className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'OBJETIVO' : 'OBJECTIVE'}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] md:text-sm">
                    {testScenariosTable.table.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-white/5 hover:bg-white/[0.02]'}`}>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px] opacity-50">{row.id}</td>
                        <td className="py-3 px-4 md:px-6 font-bold tracking-tight text-[14px] md:text-sm">{row.feature}</td>
                        <td className="py-3 px-4 md:px-6 font-light opacity-70 text-[14px] md:text-sm">{row.scenario}</td>
                        <td className="py-3 px-4 md:px-6 font-medium text-[14px] md:text-sm">{row.objective}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ProjectSection>
        )}
 
        {/* TEST CASES SUMMARY TABLE */}
        {testCasesSummary && (
          <ProjectSection id="test-cases-summary" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {testCasesSummary.title}</span>
            {testCasesSummary.description && (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {testCasesSummary.description}
              </p>
            )}
            <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-transparent bg-[#121212] text-white'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10' : 'border-white/10'}`}>
                      {testCasesSummary.headers.map((header, i) => (
                        <th key={i} className={`py-4 px-4 md:px-6 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[14px] md:text-sm">
                    {testCasesSummary.table.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 transition-colors ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-white/5 hover:bg-white/[0.02]'}`}>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px] opacity-50">{row.scenario}</td>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px] opacity-50">{row.testCase}</td>
                        <td className="py-3 px-4 md:px-6 font-bold tracking-tight text-[14px] md:text-sm">{row.functionality}</td>
                        <td className="py-3 px-4 md:px-6">
                          <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                            row.status.toLowerCase() === 'paso' || row.status.toLowerCase() === 'pass'
                              ? (isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500 text-white')
                              : (isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-500 text-white')
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6 font-mono text-[14px] text-red-500">{row.bug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ProjectSection>
        )}
 
        {/* 6. TEST CASES */}
        <ProjectSection id="test-cases" theme={theme}>
          <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {testCasesTitle || (lang === 'es' ? 'CASOS DE PRUEBA' : 'TEST CASES')}</span>
          
          {testCasesIntro && (
            <div className="mb-8 space-y-4 md:max-w-[80%]">
              <p className={`text-sm md:text-base leading-relaxed font-bold ${isDark ? 'opacity-80' : 'opacity-100'}`}>
                {testCasesIntro.p1}
              </p>
              <p className={`text-sm md:text-base leading-relaxed font-light ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {testCasesIntro.p2}
              </p>
            </div>
          )}
 
          {testCasesDesc && (
            <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] ${isDark ? 'opacity-60' : 'opacity-100'}`}>
              {testCasesDesc}
            </p>
          )}
          <div className={`border rounded-2xl overflow-hidden backdrop-blur-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/10' : 'border-black'}`}>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'ID de Prueba' : 'Test ID'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Escenario' : 'Scenario'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Función' : 'Feature'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Caso de Prueba' : 'Test Case'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Resultado Esperado' : 'Expected Result'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Estado' : 'Status'}</th>
                    <th className={`py-4 px-3 md:px-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold ${isDark ? 'opacity-40' : 'opacity-60'}`}>{lang === 'es' ? 'Bug' : 'Bug'}</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] md:text-[14px]">
                  {testCases.map((row, i) => (
                    <React.Fragment key={i}>
                      <tr 
                        className={`border-b last:border-0 transition-colors ${row.details ? 'cursor-pointer' : ''} ${isDark ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black hover:bg-black/[0.01]'}`}
                        onClick={() => row.details && setExpandedCase(expandedCase === row.id ? null : row.id)}
                      >
                        <td className={`py-3 px-3 md:px-4 font-mono whitespace-nowrap ${isDark ? 'opacity-50' : 'opacity-70'}`}>
                          <div className="flex items-center gap-2">
                            {row.details && (
                              expandedCase === row.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                            {row.id}
                          </div>
                        </td>
                        <td className={`py-3 px-3 md:px-4 font-mono whitespace-nowrap ${isDark ? 'opacity-50' : 'opacity-70'}`}>
                          {row.scenarioId || '-'}
                        </td>
                        <td className="py-3 px-3 md:px-4 font-bold tracking-tight">
                          {(() => {
                            const parts = row.feature.split(' ');
                            if (parts.length >= 2) {
                              const method = parts[0];
                              const path = parts.slice(1).join(' ');
                              let colorClass = '';
                              switch (method.toUpperCase()) {
                                case 'GET': colorClass = 'text-emerald-500'; break;
                                case 'PUT': colorClass = 'text-blue-500'; break;
                                case 'POST': case 'PUSH': colorClass = 'text-orange-500'; break;
                                case 'DELETE': colorClass = 'text-red-500'; break;
                                case 'PATCH': colorClass = 'text-purple-500'; break;
                              }
                              return (
                                <span className="whitespace-nowrap">
                                  <span className={colorClass}>{method}</span> {path}
                                </span>
                              );
                            }
                            return row.feature;
                          })()}
                        </td>
                        <td className="py-3 px-3 md:px-4 font-light opacity-70 min-w-[120px]">{row.scenario}</td>
                        <td className="py-3 px-3 md:px-4 font-light opacity-70 min-w-[150px]">{row.result}</td>
                        <td className="py-3 px-3 md:px-4">
                          {row.status === 'pass' ? (
                            <div className="flex items-center gap-2 text-emerald-500 font-bold">
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden md:inline uppercase text-[9px] tracking-widest">{lang === 'es' ? 'Paso' : 'Pass'}</span>
                            </div>
                          ) : row.status === 'fail' ? (
                            <div className="flex items-center gap-2 text-red-500 font-bold">
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden md:inline uppercase text-[9px] tracking-widest">{lang === 'es' ? 'Fallo' : 'Fail'}</span>
                            </div>
                          ) : null}
                        </td>
                        <td className="py-3 px-3 md:px-4">
                          {row.bug ? (
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>
                              {row.bug}
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                      {row.details && expandedCase === row.id && (
                        <tr className={`${isDark ? 'bg-white/[0.02]' : 'bg-white/[0.02]'}`}>
                          <td colSpan={7} className="py-6 px-4 md:px-6">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-6"
                            >
                              {row.details.precondition && row.details.precondition !== '-' && (
                                <div>
                                  <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold block mb-2">{lang === 'es' ? 'Precondición' : 'Precondition'}</span>
                                  <p className="font-light text-sm leading-relaxed">{row.details.precondition}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold block mb-2">{lang === 'es' ? 'Pasos' : 'Steps'}</span>
                                <ul className="list-decimal list-inside space-y-1.5 font-light text-sm opacity-70">
                                  {row.details.steps.map((step, si) => <li key={si}>{step}</li>)}
                                </ul>
                              </div>
 
                              {row.details.evidence && (
                                <div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImage(row.details?.evidence?.response || row.details?.evidence?.request || null);
                                    }}
                                    className="flex items-center gap-2 text-[14px] font-bold text-orange-500 hover:text-orange-600 transition-colors group"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </div>
                                    {lang === 'es' ? 'VER EVIDENCIA' : 'VIEW EVIDENCE'}
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ProjectSection>
 
        {/* 6.5 VALIDACIONES REALIZADAS */}
        {validations && (
          <ProjectSection id="validations" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {validations.title}</span>
            <div className="space-y-10">
              {validations.items.map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-base md:text-lg font-bold tracking-tight">{item.title}</h4>
                    {item.description && (
                      <p className={`text-[14px] font-light opacity-60`}>{item.description}</p>
                    )}
                  </div>
                  <div className={`relative group rounded-2xl overflow-hidden border ${isDark ? 'bg-[#181818] border-white/10' : 'bg-[#121212] text-white border-transparent'}`}>
                    <div className={`flex items-center justify-between px-5 py-2.5 border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-white/10 bg-white/5'}`}>
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 opacity-40" />
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{item.language || 'code'}</span>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.code)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Copy className="w-3 h-3 opacity-40" />
                      </button>
                    </div>
                    <pre className="p-6 overflow-x-auto md:overflow-x-auto whitespace-pre-wrap md:whitespace-pre font-mono text-[10px] md:text-sm leading-relaxed">
                      <code className="text-emerald-400">
                        {item.code}
                      </code>
                    </pre>
                    {item.evidence && (
                      <div className={`px-5 py-3 border-t ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                        <button 
                          onClick={() => setSelectedImage(item.evidence || null)}
                          className="flex items-center gap-2 text-[14px] font-bold text-orange-500 hover:text-orange-600 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                          {lang === 'es' ? 'VER EVIDENCIA' : 'VIEW EVIDENCE'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ProjectSection>
        )}
 
        {/* 7. BUGS DETECTADOS */}
        {bugs && bugs.length > 0 && (
          <ProjectSection id="bugs" theme={theme}>
            <div className="flex justify-between items-center mb-8">
              <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>
                {getSectionNumber()} / {bugsTitle || (lang === 'es' ? 'BUGS DETECTADOS' : 'REPORTED BUGS')}
              </span>
              <div className="flex items-center gap-3">
                {/* Dots */}
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.ceil(bugs.length / 2) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i * 2)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isDark ? 'bg-white/20 hover:bg-white/60' : 'bg-black/20 hover:bg-black/60'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => emblaApi?.scrollPrev()}
                  className={`p-2.5 rounded-full border transition-all ${
                    isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => emblaApi?.scrollNext()}
                  className={`p-2.5 rounded-full border transition-all ${
                    isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
 
            {bugsDescription && (
              <p className={`text-sm md:text-base leading-relaxed mb-8 font-light md:max-w-[60%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {bugsDescription}
              </p>
            )}
 
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-0">
                {bugs.map((bug, i) => (
                  <div key={i} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 px-2 flex">
                    <div className="w-full">
                      <BugCard 
                        theme={theme}
                        lang={lang}
                        id={bug.id}
                        testCaseId={bug.testCaseId}
                        title={bug.title}
                        severity={bug.severity}
                        type={bug.type}
                        description={bug.description}
                        steps={bug.steps}
                        expected={bug.expected}
                        actual={bug.actual}
                        evidence={bug.evidence}
                        onViewEvidence={setSelectedImage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProjectSection>
        )}
 
        {/* 8. UX IMPROVEMENTS */}
        {uxImprovements && uxImprovements.length > 0 && (
          <ProjectSection id="ux-improvements" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {uxImprovementsTitle || (lang === 'es' ? 'MEJORAS DE UX' : 'UX IMPROVEMENTS')}</span>
            <ul className={`${fullWidthUX ? 'w-full' : 'md:max-w-[70%]'} space-y-4`}>
              {uxImprovements.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm md:text-base font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />              
                  <span className={isDark ? 'opacity-70' : 'opacity-100'}>{item}</span>
                </li>
              ))}
            </ul>
          </ProjectSection>
        )}
 
        {/* 8.5 AUTOMATION */}
        {automation && (
          <ProjectSection id="automation" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {automation.title}</span>
            {automation.description && (
              <p className={`text-lg md:text-xl leading-relaxed mb-12 font-light md:max-w-[60%] ${isDark ? 'opacity-60' : 'opacity-100'}`}>
                {automation.description}
              </p>
            )}
          </ProjectSection>
        )}
 
        {/* 8.6 CONCLUSION */}
        {conclusion && (
          <ProjectSection id="conclusion" theme={theme}>
            <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {conclusion.title}</span>
            <p className={`text-lg md:text-xl leading-relaxed font-light md:max-w-[80%] whitespace-pre-line ${isDark ? 'opacity-60' : 'opacity-100'}`}>
              {conclusion.content}
            </p>
          </ProjectSection>
        )}
 
        {/* 9. CONTACT */}
        <ProjectSection id="contact" theme={theme} className="items-center text-center">
          <span className={`section-subheading ${isDark ? 'opacity-50' : 'opacity-60'}`}>{getSectionNumber()} / {t.contact}</span>
          <h2 className="font-bold mb-16 tracking-tighter leading-[0.85] text-center w-full">{t.contactTitle}</h2>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center mt-12 pb-16">
            <a href="mailto:daiana.ciaramella@gmail.com" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
              <Mail className="w-5 h-5" />
              <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">Email</span>
            </a>
            <a href="https://www.linkedin.com/in/ciaramellad/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
              <Linkedin className="w-5 h-5" />
              <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">LinkedIn</span>
            </a>
            <a href="https://github.com/ciaramellad" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-lg hover:opacity-100 transition-opacity font-medium">
              <Github className="w-5 h-5" />
              <span className="border-b border-transparent group-hover:border-current transition-all pb-0.5">GitHub</span>
            </a>
          </div>
 
          <div className={`mt-8 text-[14px] uppercase tracking-[0.5em] font-medium ${isDark ? 'opacity-30' : 'opacity-50'}`}>
            {t.footer}
          </div>
        </ProjectSection>
 
      </main>
 
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-7xl w-full max-h-full flex flex-col items-center justify-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold"
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
            
            <div className="w-full h-full flex flex-wrap items-center justify-center gap-6 overflow-y-auto max-h-[85vh] p-4">
              {(Array.isArray(selectedImage) ? selectedImage : [selectedImage]).map((img, idx) => (
                <div key={idx} className="relative max-w-full">
                  {img.toLowerCase().endsWith('.mp4') ? (
                    <video 
                      src={img} 
                      controls 
                      autoPlay={idx === 0}
                      className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
                    />
                  ) : (
                    <img 
                      src={img} 
                      alt={`Evidence ${idx + 1}`} 
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
 
export default QAProjectTemplate;
