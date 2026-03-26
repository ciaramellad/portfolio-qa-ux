import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Menu,
  X,
  Download
} from 'lucide-react';

export const ParticleBackground = ({ theme }: { theme: 'dark' | 'light' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 120;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.size = 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRef.current.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const directionX = forceDirectionX * force * 15;
          const directionY = forceDirectionY * force * 15;

          this.x -= directionX;
          this.y -= directionY;
        }

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.9)';
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

export const Header = ({ theme, toggleTheme, lang, toggleLang, t }: { theme: 'dark' | 'light', toggleTheme: () => void, lang: 'en' | 'es', toggleLang: () => void, t: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t.home, href: '/#hero' },
    { name: t.about, href: '/#about' },
    { name: t.projectsQA, href: '/#projects-qa' },
    { name: t.projectsUX, href: '/#projects-ux-ui' },
    { name: t.skills, href: '/#skills' },
    { name: t.contact, href: '/#contact', bold: true },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6 backdrop-blur-2xl border-b h-20 transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#121212]/60' : 'border-black/5 bg-white/60'}`}>
        <a href="/" className="text-xl md:text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity">DC</a>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className={`text-[10px] font-bold hover:opacity-50 transition-opacity px-3 py-1 border rounded-full tracking-widest ${theme === 'dark' ? 'border-white/20' : 'border-[#121212]'}`}
          >
            {lang.toUpperCase()}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-current/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 z-50 relative"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className={`fixed inset-y-0 right-0 z-40 flex flex-col justify-center items-start px-12 md:px-24 w-full md:w-[500px] gap-8 backdrop-blur-3xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#121212]/95 border-l border-white/10' : 'bg-white/95 border-l border-black/10 shadow-2xl'}`}
      >
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`text-2xl md:text-3xl lg:text-4xl hover:opacity-50 transition-opacity text-left tracking-tighter ${item.bold ? 'font-bold' : 'font-light'}`}
          >
            {item.name}
          </a>
        ))}
        <div className="mt-4 border-t border-current/10 pt-8 w-full">
          <a
            href="/cv.pdf"
            download
            className={`flex items-center gap-3 text-xl md:text-2xl lg:text-3xl hover:opacity-50 transition-opacity font-light tracking-tighter`}
          >
            <Download className="w-6 h-6" />
            {lang === 'es' ? 'Descarga mi CV' : 'Download my CV'}
          </a>
        </div>
      </motion.nav>
    </>
  );
};

export const ContactForm = ({ theme, t }: { theme: 'dark' | 'light', t: any }) => {
  return (
    <form
      action="mailto:daiana.ciaramella@gmail.com"
      method="post"
      encType="text/plain"
      className="w-full max-w-xl mx-auto mt-12 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 text-left">
          <label className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'opacity-50' : 'opacity-100 font-bold'}`}>{t.formName}</label>
          <input
            type="text"
            name="name"
            required
            className={`bg-transparent border-b py-2 outline-none focus:border-current transition-colors ${theme === 'dark' ? 'border-white/20' : 'border-[#121212]'}`}
          />
        </div>
        <div className="flex flex-col gap-2 text-left">
          <label className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'opacity-50' : 'opacity-100 font-bold'}`}>{t.formEmail}</label>
          <input
            type="email"
            name="email"
            required
            className={`bg-transparent border-b py-2 outline-none focus:border-current transition-colors ${theme === 'dark' ? 'border-white/20' : 'border-[#121212]'}`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 text-left">
        <label className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'opacity-50' : 'opacity-100 font-bold'}`}>{t.formMessage}</label>
        <textarea
          name="message"
          rows={4}
          required
          className={`bg-transparent border-b py-2 outline-none focus:border-current transition-colors resize-none ${theme === 'dark' ? 'border-white/20' : 'border-[#121212]'}`}
        ></textarea>
      </div>
      <button
        type="submit"
        className={`w-full py-4 border border-current hover:bg-white hover:text-[#121212] transition-all duration-300 font-bold tracking-widest uppercase text-sm rounded-full`}
      >
        {t.formSubmit}
      </button>
    </form>
  );
};

export const Section = ({ children, id, theme, className = "", fullHeight = false }: { children: React.ReactNode, id: string, theme: 'dark' | 'light', className?: string, fullHeight?: boolean }) => (
  <section
    id={id}
    className={`w-full relative min-h-screen flex flex-col justify-center ${theme === 'dark' ? 'text-white' : 'text-[#121212]'} ${className}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-8%" }}
      className="w-full max-w-[1100px] mx-auto px-6 md:px-12 py-28 md:py-40"
    >
      {children}
    </motion.div>
  </section>
);

export const translations = {
  en: {
    home: "Home",
    about: "About",
    projectsQA: "QA Projects",
    projectsUX: "UX/UI Projects",
    skills: "Skills",
    contact: "Contact me!",
    contactSectionLabel: "contact",
    heroTitle: "Daiana Ciaramella",
    heroSub: "QA Tester Manual - UX/UI",
    aboutTitle: "Bridging the gap between design and software quality",
    aboutP1: "With a background in UX/UI design and Frontend development, I possess a unique perspective in the QA field: I understand how products are built, which allows me to anticipate where they might fail. This holistic approach enables me to identify not only functional defects but also experience inconsistencies that impact end-user satisfaction.",
    aboutP2: "With over 3 years of experience in digital product environments, I specialize in functional testing, test case design and execution, regression testing, and defect management. I thrive in agile teams, ensuring that every release meets both technical specifications and user expectations.",
    projectsQATitle: "QA Portfolio",
    projectsUXTitle: "UX/UI Design",
    skillsTitle: "Technical Skills",
    contactTitle: "LET'S WORK TOGETHER.",
    footer: "© 2026 DAIANA CIARAMELLA - QA TESTER | UX UI",
    visualProjectsTitle: "UX/UI CASE STUDIES",
    view: "View",
    common: {
      caseStudy: "CASE STUDY",
      viewAnalysis: "View analysis",
      scroll: "Scroll",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      back: "Back",
      tools: "Tools & Technologies",
      objective: "Objective",
      platform: "Platform",
      features: "Features",
      strategy: "Testing Strategy",
      scenarios: "Test Scenarios",
      cases: "Test Cases",
      bugs: "Bug Reports",
      improvements: "UX Improvements",
      pass: "Pass",
      fail: "Fail",
      severity: "Severity",
      type: "Type",
      steps: "Steps to Reproduce",
      expected: "Expected Result",
      actual: "Actual Result",
      evidence: "Evidence",
      precondition: "Precondition",
      description: "Description",
      viewEvidence: "VIEW EVIDENCE",
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    visualProjects: [
      {
        title: "Onus",
        desc: "Visual identity and user experience design for Onus Solutions, including brand definition, color palette, and web design focused on content clarity and navigation. This approach allows me to evaluate visual coherence, interface consistency, and detect friction in the user experience.",
        img: "/img/onus-proyectouxui.png"
      },
      { title: "Grinplug", desc: "Comprehensive design of an electric charging platform, defining product flows and architecture. This experience allows me to anticipate edge cases in complex business rules and validate consistency in products with multiple user profiles.", img: "/img/grinplug-proyectouxui.png" },
      { title: "Uminti", desc: "Visual identity and web experience design for a specialized service, focused on communication clarity and conversion flow optimization. This allows me to validate critical processes from the user's perspective and detect friction points in the interaction.", img: "/img/uminti-proyectouxui.png" },
      { title: "HAY EQUIPO! – App", desc: "Research, product definition, and UX/UI design of an app for organizing football matches and community building. Includes research, flow definition, wireframes, and visual design, strengthening my user-centered testing approach.", img: "/img/app-futfem.png" }
    ],
    qaProjects: [
      {
        title: "DAILY – App",
        description: "QA Testing · Financial Web App (PWA) — Functional testing of a multi-currency financial application (ARS, USD, EUR), validating critical daily-use flows, error handling, and data consistency.",
        link: "/proyectos-qa/daily_app"
      },
      {
        title: "UX & Accessibility - Ryanair",
        description: "Accessibility & UX Testing · Web Audit — Accessibility and usability evaluation of the Ryanair website using Axe DevTools, identifying WCAG barriers, navigation issues, and user experience improvements.",
        link: "/ux-testing"
      },
      {
        title: "API Testing - Postman",
        description: "API Testing · E-commerce — Validation of an e-commerce REST API using Postman, analyzing product and cart endpoints, HTTP responses, data structure, and error handling.",
        link: "/proyectos-qa/testing-api-postman"
      },
      {
        title: "E-commerce Testing",
        description: "Analysis and functional testing of an e-commerce purchase flow, validating user registration, shopping cart, and checkout.",
        link: "/proyectos-qa/ecommerce-testing"
      }
    ],
    daily_app: {
      title: "DAILY – App",
      subtitle: "Multi-currency financial management application designed to centralize accounts, record transactions, and visualize balances in real time.",
      description: "DAILY was born from a real need: no app on the market offered multi-currency financial management adapted to those who operate simultaneously with ARS, USD, and EUR in different countries. The app centralizes multiple bank accounts and virtual wallets, calculates consolidated totals by currency in real-time, and allows linking expenses to trips with budget tracking. \n\nI tested the app under real daily use conditions, which allowed me to detect behaviors that only emerge with real data and genuine usage flows.",
      objective: "Validate the correct functioning of the application's main flows, ensuring financial balance consistency and a clear user experience on mobile devices.",
      platform: "PWA (Progressive Web App), published on Vercel, optimized for Android and iOS.",
      featuresTitle: "TESTING SCOPE",
      featuresList: [
        "Authentication (PIN / fingerprint)",
        "Transaction CRUD (expenses and income)",
        "Account and budget management",
        "Travel and debt module",
        "Dashboard and charts",
        "Validations and error handling",
        "Multi-currency support"
      ],
      testingStrategyTitle: "TESTING STRATEGY",
      testingStrategyList: [
        { name: "Functional Testing", description: "Validation of critical flows: transactions, balances, budgets, and debts." },
        { name: "Exploratory Testing", description: "Real daily use to detect unexpected behaviors in secondary flows." },
        { name: "UI Testing", description: "Correct visualization of components, forms, and feedback on mobile." },
        { name: "Edge Case Testing", description: "Limit scenarios: empty amounts, zero, incomplete data in forms." }
      ],
      testScenariosTitle: "TEST SCENARIOS",
      testScenariosDesc: "Based on the main functionalities of the application, different test scenarios were defined to validate the critical flows of the system.",
      testScenariosTable: [
        { id: "TS-001", feature: "Authentication", scenario: "Access via PIN or biometrics", objective: "Validate correct authentication and handling of invalid attempts with clear feedback", priority: "Critical" },
        { id: "TS-002", feature: "Accounts", scenario: "Multi-currency account management", objective: "Verify account creation and data consistency between currencies", priority: "Critical" },
        { id: "TS-003", feature: "Transactions", scenario: "Transaction recording", objective: "Validate impact of income and expenses on balances and views", priority: "Critical" },
        { id: "TS-004", feature: "Multi-currency", scenario: "Totals by currency", objective: "Verify independence of calculations between currencies", priority: "Critical" },
        { id: "TS-005", feature: "Dashboard", scenario: "Visual data representation", objective: "Validate currency symbols and visual consistency", priority: "High" },
        { id: "TS-006", feature: "Travels", scenario: "Travel management", objective: "Verify expense association and progress update", priority: "High" },
        { id: "TS-007", feature: "Travels", scenario: "Trip budget", objective: "Validate behavior when exceeding limits and UX feedback", priority: "Critical" },
        { id: "TS-008", feature: "Debts", scenario: "Debt management", objective: "Validate correct recording and visualization of debts", priority: "High" },
        { id: "TS-009", feature: "Budgets", scenario: "Monthly budget", objective: "Verify calculation of accumulated spending and percentage", priority: "High" },
        { id: "TS-010", feature: "Validations", scenario: "Input validations", objective: "Validate handling of invalid data without inconsistencies", priority: "Critical" }
      ],
      testScenariosFooter: "",
      testCasesDesc: "Each test case is linked to its corresponding scenario. The statuses reflect the results obtained during execution.",
      testCasesTable: [
        {
          id: "TC-001", scenarioId: "TS-003",
          feature: "Register a new expense associated with an account",
          scenario: "Authenticated user. Active ARS account with balance > $0. At least one category available.",
          result: "Expense saved correctly. Balance goes from $2000 to $1500 and is reflected consistently in dashboard and transactions.",
          status: "fail", bug: "BUG-002", tipo: "Functional",
          details: {
            precondition: "Authenticated user. Active ARS account with balance > $0. At least one category available.",
            steps: [
              "Go to Transactions → New transaction",
              "Select type: Expense",
              "Select ARS account",
              "Enter amount: $500",
              "Select category: Food",
              "Save",
              "Verify balance",
              "Verify dashboard"
            ],
            testData: "Account: ARS, initial balance: $2000 / Expense: $500 / Category: Food"
          }
        },
        {
          id: "TC-002", scenarioId: "TS-003",
          feature: "Register an income and verify balance impact",
          scenario: "Authenticated user. Active ARS account.",
          result: "Income registered correctly. Balance goes from $1000 to $4000 and is reflected in all views.",
          status: "pass", tipo: "Functional",
          details: {
            precondition: "Authenticated user. Active ARS account.",
            steps: [
              "Go to Transactions → New transaction",
              "Select type: Income",
              "Select ARS account",
              "Enter amount: $3000",
              "Save",
              "Verify balance",
              "Verify dashboard and transactions"
            ],
            testData: "Account: ARS, initial balance: $1000 / Income: $3000"
          }
        },
        {
          id: "TC-003", scenarioId: "TS-002",
          feature: "Create new account in EUR",
          scenario: "Authenticated user. No previous EUR account.",
          result: "Account created correctly with € symbol and no impact on other accounts.",
          status: "pass", tipo: "Functional / Integration",
          details: {
            precondition: "Authenticated user. No previous EUR account.",
            steps: [
              "Go to Accounts → New account",
              "Enter name: \"Europe Account\"",
              "Select currency: EUR",
              "Save",
              "Verify list",
              "Verify other accounts remain unchanged"
            ],
            testData: "Name: Europe Account / Currency: EUR / Initial balance: €0"
          }
        },
        {
          id: "TC-004", scenarioId: "TS-004",
          feature: "USD expense does not affect EUR and ARS totals",
          scenario: "Authenticated user. Active accounts in USD, EUR and ARS with balance.",
          result: "Only USD total updates. EUR and ARS remain unchanged. No inconsistencies.",
          status: "pass", tipo: "Integration / Multi-currency",
          details: {
            precondition: "Authenticated user. Active accounts in USD, EUR and ARS with balance.",
            steps: [
              "Go to Transactions",
              "Select USD account",
              "Register $50 expense",
              "Save",
              "Check dashboard",
              "Verify all currency totals"
            ],
            testData: "USD: $200 → $150 / EUR: €150 / ARS: $5000"
          }
        },
        {
          id: "TC-005", scenarioId: "TS-005",
          feature: "Verify EUR symbol representation in the system",
          scenario: "Authenticated user. Active EUR account.",
          result: "System correctly shows € symbol in all components (dashboard, charts and views).",
          status: "fail", bug: "BUG-004", tipo: "UX / Visual",
          details: {
            precondition: "Authenticated user. Active EUR account.",
            steps: [
              "Go to Dashboard",
              "View EUR account",
              "Verify symbol in charts, list and detail"
            ],
            testData: "EUR account: €200"
          }
        },
        {
          id: "TC-006", scenarioId: "TS-006",
          feature: "Expense associated with trip and progress update",
          scenario: "Authenticated user. Active trip with budget and previous expense.",
          result: "Expense correctly linked. Total updates to €250 (50%) and reflects in all modules.",
          status: "fail", bug: "BUG-003", tipo: "Functional / Integration",
          details: {
            precondition: "Authenticated user. Active trip with budget and previous expense.",
            steps: [
              "Go to Trips",
              "Select trip",
              "Register €50 expense",
              "Save",
              "Verify progress",
              "Verify account and dashboard"
            ],
            testData: "Budget: €500 / Prev. expense: €200"
          }
        },
        {
          id: "TC-007", scenarioId: "TS-007",
          feature: "Exceed trip budget and validate feedback",
          scenario: "Authenticated user. Trip with budget nearly reached.",
          result: "System shows alert when exceeding budget. Reflected correctly ($1050) and visually indicated.",
          status: "fail", bug: "BUG-006", tipo: "Functional / UX / Edge",
          details: {
            precondition: "Authenticated user. Trip with budget nearly reached.",
            steps: [
              "Go to Trips",
              "Add $100 expense",
              "Save",
              "Verify notification",
              "Verify bar and values"
            ],
            testData: "Budget: $1000 / Prev. expense: $950"
          }
        },
        {
          id: "TC-008", scenarioId: "TS-008",
          feature: "Register “They Owe Me” debt",
          scenario: "Authenticated user. No previous debts.",
          result: "Debt registered correctly in \"They Owe Me\" view and does not appear in \"I Owe\".",
          status: "pass", tipo: "Functional",
          details: {
            precondition: "Authenticated user. No previous debts.",
            steps: [
              "Go to Debts",
              "New debt",
              "Select \"They Owe Me\"",
              "Enter data",
              "Save",
              "Verify view"
            ],
            testData: "Name: Juan / Amount: $300"
          }
        },
        {
          id: "TC-009", scenarioId: "TS-009",
          feature: "Monthly budget usage percentage calculation",
          scenario: "Authenticated user. Active budget with expenses.",
          result: "System correctly calculates percentage (90%) and shows proximity to limit.",
          status: "pass", tipo: "Functional / Calculation",
          details: {
            precondition: "Authenticated user. Active budget with expenses.",
            steps: [
              "Go to Budgets",
              "Check current expense",
              "Add expense",
              "Verify percentage"
            ],
            testData: "Budget: $5000 / Expense: $3500 → $4500"
          }
        },
        {
          id: "TC-010", scenarioId: "TS-010",
          feature: "Empty amount field validation",
          scenario: "Authenticated user. Active account.",
          result: "System blocks action, shows error and does not save data or modify balances.",
          status: "fail", bug: "BUG-005", tipo: "Validation / Negative",
          details: {
            precondition: "Authenticated user. Active account.",
            steps: [
              "Go to Transactions",
              "Leave amount empty",
              "Attempt to save"
            ],
            testData: "Empty amount"
          }
        },
        {
          id: "TC-011", scenarioId: "TS-001",
          feature: "Validate authentication with incorrect PIN",
          scenario: "Registered user with PIN configured",
          result: "System blocks access and shows clear error message without allowing entry.",
          status: "fail", bug: "BUG-001", tipo: "Security / Validation",
          details: {
            precondition: "Registered user with PIN configured",
            steps: [
              "Open app",
              "Enter incorrect PIN",
              "Confirm"
            ],
            testData: "Incorrect PIN"
          }
        }
      ],
      bugsTitle: "BUG REPORTS",
      bugsDescription: "The following critical defects were identified and documented during the testing execution.",
      bugs: [
        {
          id: "BUG-001",
          title: "Missing feedback when entering incorrect PIN",
          severity: "Medium",
          type: "Authentication",
          description: "Precondition: User with configured PIN. [TS-001 / TC-011]",
          steps: ["Open the application", "Enter an incorrect PIN", "Confirm access"],
          expected: "The system blocks access and shows a clear message indicating that the PIN is incorrect",
          actual: "Access is blocked but no error message is displayed",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-002",
          title: "Temporal data desynchronization on dashboard",
          severity: "Low",
          type: "Dashboard",
          description: "Precondition: Authenticated user with active accounts. [TS-003 / TC-001]",
          steps: ["Register a new expense", "Go immediately to the dashboard", "Verify values shown"],
          expected: "The dashboard immediately reflects the change in balances",
          actual: "Some values take time to update until the view is manually refreshed",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-003",
          title: "Expenses cannot be edited from trip view",
          severity: "High",
          type: "Travels",
          description: "Precondition: User with active trip and registered expenses. [TS-006 / TC-006]",
          steps: ["Go to Travels", "Select a trip", "Attempt to edit a registered expense"],
          expected: "The user can edit the expense from the trip view",
          actual: "It is not possible to edit the expense from that view",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-004",
          title: "Incorrect currency symbol on dashboard (EUR)",
          severity: "Medium",
          type: "Visual / Dashboard",
          description: "Precondition: User with EUR account. [TS-005 / TC-005]",
          steps: ["Go to dashboard", "View EUR account", "Review symbol shown"],
          expected: "The system displays the '€' symbol correctly",
          actual: "The system displays '$' instead of '€' in some components",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-005",
          title: "Saving transaction with empty amount is allowed",
          severity: "High",
          type: "Validation",
          description: "Precondition: Authenticated user with active account. [TS-010 / TC-010]",
          steps: ["Go to new transaction", "Leave amount field empty", "Attempt to save"],
          expected: "The system blocks the action and shows an error message",
          actual: "The transaction is saved without an amount or generates inconsistent behavior",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-006",
          title: "Missing clear alert when exceeding trip budget",
          severity: "Medium",
          type: "UX / Alerts",
          description: "Precondition: Active trip with budget close to the limit. [TS-007 / TC-007]",
          steps: ["Register expense that exceeds the budget", "Confirm operation", "Verify system feedback"],
          expected: "The system shows a clear alert indicating that the budget has been exceeded",
          actual: "The system allows the operation but does not show clear or visible feedback",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        }
      ],
      uxImprovements: [
        "Feedback and system status: When completing an operation (registering an expense, creating an account, settling a debt), the app does not visually confirm that the action was performed. A brief message or micro-animation would reduce user uncertainty and prevent duplicate registrations due to lack of confirmation.",
        "User profiles: The app currently does not differentiate between users. Incorporating a basic profile would allow personalizing preferences (default currency, frequent categories) and would open the door to multi-user functionalities in the future.",
        "Custom account creation: Allowing the user to create accounts or virtual wallets with their own name, currency, and icon would make the app adaptable to different financial contexts (payroll account, savings, crypto, etc.).",
        "Transfers between accounts: Today, moving funds between accounts requires manually registering an expense in one and an income in another. A direct transfer functionality would reduce errors and simplify the management of multiple accounts.",
        "Smart filtering by currency: When registering a transaction, showing only the accounts that match the selected currency would avoid assignment errors and make the registration flow faster and less prone to mistakes."
      ]
    },
    api_testing: {
      title: "API Testing with Postman",
      subtitle: "E-commerce REST API Validation",
      certification: {
        title: "Postman Student Expert Certification",
        image: "/img/img-postman-api/Postman - Postman API Fundamentals Student Expert - 2026-02-21 (2).png"
      },
      description: "This project consists of the validation of an e-commerce REST API using Postman. The tests focused on analyzing the behavior of different endpoints related to products and shopping carts, verifying the correct functioning of server responses, data structure, and error handling.",
      objective: "Verify the correct functioning of the API endpoints related to products and shopping carts, validating HTTP response codes, the JSON data structure, and the system's behavior in positive and negative scenarios.",
      platform: "DummyJSON API via POSTMAN",
      endpoints: {
        title: "Endpoints Analyzed",
        idHeader: "HTTP",
        description: "Different API endpoints were analyzed to ensure the expected behavior of the system and data integrity within the e-commerce flow.",
        table: [
          { id: "GET", feature: "/products", scenario: "Get the list of available products" },
          { id: "GET", feature: "/products/{id}", scenario: "Get information for a specific product by ID" },
          { id: "PUT", feature: "/products/{id}", scenario: "Update information for an existing product" },
          { id: "POST", feature: "/carts/add", scenario: "Create a shopping cart with products" },
          { id: "DELETE", feature: "/carts/{id}", scenario: "Delete an existing shopping cart" }
        ]
      },
      testScenarios: {
        title: "Test Scenarios",
        table: [
          { id: "TS-001", scenario: "Get product list" },
          { id: "TS-002", scenario: "Get product by valid ID" },
          { id: "TS-003", scenario: "Get product with non-existent ID" },
          { id: "TS-004", scenario: "Create cart with products" },
          { id: "TS-005", scenario: "Get list of carts" },
          { id: "TS-006", scenario: "Delete existing cart" }
        ]
      },
      testCases: {
        title: "Test Cases",
        intro: {
          p1: "Different test cases were defined and executed using Postman, utilizing common HTTP methods in REST APIs such as GET, POST, PUT, and DELETE.",
          p2: "Each test case verifies key aspects such as HTTP response codes, JSON data structure, and response times. The table includes details of the tests performed along with evidence of their execution."
        },
        table: [
          {
            id: "TC-001",
            feature: "GET /products",
            scenario: "Get product list",
            result: "Status code 200 OK - JSON of products",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Open Postman",
                "Create GET request",
                "Enter endpoint URL",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-001-get-products.png",
                response: "/img/img-postman-api/tc-001-get-products.png"
              }
            }
          },
          {
            id: "TC-002",
            feature: "GET /products/1",
            scenario: "Get product by ID",
            result: "Status 200 OK - JSON response - ID field = 1",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Create GET request",
                "Enter endpoint /products/1",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-002-get-products-1.png",
                response: "/img/img-postman-api/tc-002-get-products-1.png"
              }
            }
          },
          {
            id: "TC-003",
            feature: "PUT /products/1",
            scenario: "Update product information",
            result: "Status 200 OK - API returns updated product - Title field has new value",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Create PUT request",
                "Enter endpoint /products/1",
                "Go to body -> raw -> JSON",
                "{\"title\": \"Update Product Name\"}",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-003-put-update1.png",
                response: "/img/img-postman-api/tc-003-put-update1.png"
              }
            }
          },
          {
            id: "TC-004",
            feature: "GET /products",
            scenario: "Validate that the endpoint responds within an acceptable time",
            result: "Status 200 OK - Response time < 1000 ms",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Create GET request",
                "Enter endpoint /products",
                "Send request",
                "Observe response time"
              ],
              evidence: {
                request: "/img/img-postman-api/TC-004-response-time-products.png",
                response: "/img/img-postman-api/TC-004-response-time-products.png"
              }
            }
          },
          {
            id: "TC-005",
            feature: "POST /carts/add",
            scenario: "Create a new cart with products",
            result: "Status 200 OK - JSON with cart information - Presence of cart id field",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Open Postman",
                "Create POST request",
                "Enter endpoint /carts/add",
                "Go to body->raw-> JSON",
                "Enter the following JSON: {\"userId\": 1, \"products\": [{\"id\": 1, \"quantity\": 2}]}",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-005-post-create-cart.png",
                response: "/img/img-postman-api/tc-005-post-create-cart.png"
              }
            }
          },
          {
            id: "TC-006",
            feature: "DELETE /carts/1",
            scenario: "Delete existing cart using ID",
            result: "Status 200 OK - JSON response confirming deletion",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Create DELETE request",
                "Enter endpoint /carts/1",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-006-delete-cart.png",
                response: "/img/img-postman-api/tc-006-delete-cart.png"
              }
            }
          },
          {
            id: "TC-007",
            feature: "DELETE /carts/9999",
            scenario: "Delete non-existent cart (Negative Test)",
            result: "API returns error or message that the product does not exist",
            status: "fail",
            details: {
              precondition: "-",
              steps: [
                "Create DELETE request",
                "Enter endpoint /carts/9999",
                "Send request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-007-delete-cart-negative.png",
                response: "/img/img-postman-api/tc-007-delete-cart-negative.png"
              }
            }
          }
        ]
      },
      automations: {
        title: "Postman Automations",
        description: "Automatic validations were added in Postman to automatically verify the status code, response structure, and response time.",
        items: [
          {
            title: "Status code",
            code: "pm.test(\"Status code is 200\", function () {\n    pm.response.to.have.status(200);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-status-code.png"
          },
          {
            title: "Product validation",
            code: "pm.test(\"Products length is 5\", function () {\n    const response = pm.response.json();\n    pm.expect(response.products.length).to.eql(5);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-limit-parameter.png"
          },
          {
            title: "Response time",
            code: "pm.test(\"Response time is less than 1000ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(1000);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-time-response.png"
          }
        ]
      },
    },
    ecommerce_testing: {
      title: "E-commerce Testing",
      subtitle: "Manual testing of an e-commerce platform to validate key purchase interactions.",
      description: "Manual testing project applied to an e-commerce platform. Test scenarios and cases were designed to validate key functionalities such as login, product navigation, cart management, and checkout. During the testing process, functional defects and possible improvements in the user experience were identified.",
      objective: "The main objective of these tests was to identify potential problems and ensure that the purchase flow works correctly from login to order confirmation.",
      platformLabel: "ENVIRONMENT",
      platform: "Device: Laptop HP\nOperating System: Windows 11 Home\nBrowser: Chrome\nWeb: https://www.saucedemo.com/\nTest Type: Manual Testing\nConnectivity: Wi-Fi",
      features: [],
      testingStrategyTitle: "TESTING STRATEGY",
      testingStrategyList: [
        { name: "Functional Testing", description: "Validation of the main e-commerce functionalities." },
        { name: "Exploratory Testing", description: "System exploration to detect unexpected behaviors." },
        { name: "UI Testing", description: "Verification of the correct visualization and functioning of the interface." },
        { name: "Validation Testing", description: "Tests with invalid or incomplete data to validate error messages." }
      ],
      testScenariosTitle: "TEST SCENARIOS",
      testScenariosDesc: "To ensure the quality of the e-commerce platform, several test scenarios were defined covering the most critical user flows, from product discovery to the final checkout process.",
      testScenariosIdHeader: "scenario id",
      testScenariosFeatureHeader: "Scenario",
      testScenariosScenarioHeader: "Test cases",
      testScenariosTable: [
        { id: "TS-001", feature: "Login", scenario: "valid login / invalid login" },
        { id: "TS-002", feature: "Products", scenario: "view catalog / view detail" },
        { id: "TS-003", feature: "Cart", scenario: "add product / remove product" },
        { id: "TS-004", feature: "Cart", scenario: "cart persistence" },
        { id: "TS-005", feature: "Checkout", scenario: "valid checkout / checkout with errors" }
      ],
      testScenariosFooter: "",
      testCasesSummary: {
        title: "TEST CASES SUMMARY",
        headers: ["Scenario", "Test Case", "Functionality", "Status", "Detected Bug"],
        table: [
          { scenario: "TS-001", testCase: "TC-001", functionality: "Valid Login", status: "Pass", bug: "-" },
          { scenario: "TS-001", testCase: "TC-002", functionality: "Invalid Login", status: "Pass", bug: "-" },
          { scenario: "TS-002", testCase: "TC-003", functionality: "View Catalog", status: "Fail", bug: "BUG-002, BUG-004" },
          { scenario: "TS-002", testCase: "TC-004", functionality: "View Detail", status: "Pass", bug: "-" },
          { scenario: "TS-003", testCase: "TC-005", functionality: "Add Product", status: "Fail", bug: "BUG-003" },
          { scenario: "TS-003", testCase: "TC-006", functionality: "Add Multiple", status: "Pass", bug: "-" },
          { scenario: "TS-003", testCase: "TC-007", functionality: "Remove Product", status: "Pass", bug: "-" },
          { scenario: "TS-004", testCase: "TC-008", functionality: "Empty Cart", status: "Fail", bug: "BUG-001" },
          { scenario: "TS-005", testCase: "TC-009", functionality: "Valid Checkout", status: "Pass", bug: "-" },
          { scenario: "TS-005", testCase: "TC-010", functionality: "Invalid Checkout", status: "Pass", bug: "-" }
        ]
      },
      testCasesDesc: "Based on the previously defined test scenarios, the following test cases were designed to validate the behavior of the main functionalities of the app.",
      testCasesTable: [
        {
          id: "TC-001",
          feature: "Login",
          scenario: "Login with valid credentials",
          result: "User successfully accesses the product catalog",
          status: "pass",
          details: {
            precondition: "The user is on the login page.\nuser: standard_user\npass: secret_sauce",
            steps: [
              "Enter valid username",
              "Enter valid password",
              "Press the 'Login' button"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-001-login.png"
            }
          }
        },
        {
          id: "TC-002",
          feature: "Login",
          scenario: "Login with incorrect password",
          result: "System shows an error message indicating incorrect credentials",
          status: "pass",
          details: {
            precondition: "The user is on the login page.\nuser: standard_user\npass: user_12345",
            steps: [
              "Enter valid username",
              "Enter incorrect password",
              "Press the 'Login' button"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-002-pass-incorrecta.png"
            }
          }
        },
        {
          id: "TC-003",
          feature: "Products",
          scenario: "View product list",
          result: "System correctly displays the list of available products",
          status: "fail",
          details: {
            precondition: "The user has logged in correctly.",
            steps: [
              "Log in to the application",
              "Access the products page"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-003-catalogo.png"
            }
          }
        },
        {
          id: "TC-004",
          feature: "Products",
          scenario: "View product detail",
          result: "System shows detailed information of the selected product",
          status: "pass",
          details: {
            precondition: "The user has logged in.",
            steps: [
              "Access the product catalog",
              "Select a product from the list"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-004-info-producto.png"
            }
          }
        },
        {
          id: "TC-005",
          feature: "Cart",
          scenario: "Add product to cart",
          result: "Product is correctly added to the shopping cart",
          status: "fail",
          details: {
            precondition: "The user has logged in.",
            steps: [
              "Access the product catalog",
              "Select a product",
              "Press the 'Add to cart' button"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-005-agregar-producto.png"
            }
          }
        },
        {
          id: "TC-006",
          feature: "Cart",
          scenario: "Add multiple products to cart",
          result: "Cart shows all added products",
          status: "pass",
          details: {
            precondition: "The user has logged in.",
            steps: [
              "Access the product catalog",
              "Add a product to the cart",
              "Add a second product to the cart",
              "Access the shopping cart"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-006-agregar-producto2.png"
            }
          }
        },
        {
          id: "TC-007",
          feature: "Cart",
          scenario: "Remove product from cart",
          result: "Product is correctly removed from the cart",
          status: "pass",
          details: {
            precondition: "The user has at least one product in the cart.",
            steps: [
              "Access the shopping cart",
              "Locate the added product",
              "Press the 'Remove' button"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-007-eliminar-producto.png"
            }
          }
        },
        {
          id: "TC-008",
          feature: "Cart",
          scenario: "Verify empty cart after removing products",
          result: "The cart appears empty",
          status: "fail",
          details: {
            precondition: "The user has products in the cart.",
            steps: [
              "Access the shopping cart",
              "Remove all products",
              "Verify cart status"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-008-carrito-vacio.png"
            }
          }
        },
        {
          id: "TC-009",
          feature: "Checkout",
          scenario: "Checkout with valid data",
          result: "System shows a successful purchase confirmation",
          status: "pass",
          details: {
            precondition: "The user has at least one product in the cart.",
            steps: [
              "Access the shopping cart",
              "Press the 'Checkout' button",
              "Enter first name, last name, and zip code",
              "Press 'Continue'",
              "Confirm the purchase"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-009-Checkout.mp4"
            }
          }
        },
        {
          id: "TC-010",
          feature: "Checkout",
          scenario: "Checkout with empty required fields",
          result: "System shows an error message indicating required fields must be completed",
          status: "pass",
          details: {
            precondition: "The user has products in the cart.",
            steps: [
              "Access the cart",
              "Press 'Checkout'",
              "Leave one or more required fields empty",
              "Press 'Continue'"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-010-Checkout-campo-vacio.mp4"
            }
          }
        }
      ],
      bugsTitle: "BUGS REPORT",
      bugsDescription: "",
      bugsList: [
        {
          id: "BUG-001",
          testCaseId: "TC-008",
          title: "The cart does not show a message when it is empty",
          severity: "Medium",
          type: "UI / Feedback",
          description: "When the user removes all products from the shopping cart, the page remains empty and does not show any message indicating that the cart is empty. This can cause confusion as there is no visual feedback.",
          steps: [
            "Log in to the application",
            "Add one or more products to the cart",
            "Access the shopping cart",
            "Remove all products from the cart"
          ],
          expected: "The system should display a message indicating that the cart is empty (e.g., 'Your cart is empty').",
          actual: "The cart remains empty without showing any message or visual indication of the status.",
          evidence: "/img/img-saucedemo/TC-008-carrito-vacio.png"
        },
        {
          id: "BUG-002",
          testCaseId: "TC-003",
          title: "Product image distortion in mobile view",
          severity: "Medium",
          type: "UI / Responsive",
          description: "In the mobile version of the site, product images do not maintain their original aspect ratio and appear visually distorted (squashed vertically).",
          steps: [
            "Access the site in mobile view or use responsive mode",
            "Log in to the application",
            "Navigate to the product catalog",
            "Observe the product images"
          ],
          expected: "Images should maintain their original aspect ratio and adapt correctly to the container.",
          actual: "Images appear vertically squashed, losing their original proportion.",
          environment: "Device: Mobile Simulation (Samsung Galaxy S20 Ultra)\nBrowser: Google Chrome\nTest Type: Responsive testing",
          evidence: "/img/img-saucedemo/TC-003-catalogo.png"
        },
        {
          id: "BUG-003",
          testCaseId: "Exploratory testing / UI review",
          title: "Excessive empty space in the cart view",
          severity: "Low",
          type: "UI / Layout",
          description: "In the shopping cart view, there is a considerable empty space between the product description and the action buttons, creating an unbalanced visual distribution.",
          steps: [
            "Log in to the application",
            "Add one or more products to the cart",
            "Access the cart page",
            "Observe the separation between description and buttons"
          ],
          expected: "The interface should maintain a balanced distribution with proper separation.",
          actual: "There is excessive empty space between the description and buttons.",
          evidence: "/img/img-saucedemo/TC-008-carrito-vacio.png"
        },
        {
          id: "BUG-004",
          testCaseId: "TC-003",
          title: "Inconsistent navigation to the product catalog",
          severity: "Medium",
          type: "Navigation / UX",
          description: "After accessing the shopping cart, the user cannot easily return to the full product catalog using the 'All Items' link in the side menu.",
          steps: [
            "Log in to the application",
            "Add products to the cart",
            "Access the shopping cart",
            "Open the side menu",
            "Select 'All Items'"
          ],
          expected: "The system should redirect the user back to the full product catalog.",
          actual: "Navigation does not correctly return to the product listing.",
          evidence: "/img/img-saucedemo/TC-003-catalogo.png"
        }
      ],
      uxImprovements: [
        "Implement a 'Remember Me' function on the login page to facilitate access for frequent users.",
        "Add a show/hide password toggle to verify correct input during login.",
        "Add a search bar in the product catalog to allow users to find specific items or categories quickly.",
        "Allow adding multiple units of the same product to the cart, updating the quantity selected.",
        "Include product reviews and ratings to help users make informed purchase decisions.",
        "Implement real-time validation in the checkout form to detect errors before submission.",
        "Add a new section in the side menu called 'My Orders' or 'Purchase History'.",
        "Add the product image next to the name and description in the shopping cart."
      ]
    },
    ux_audit: {
      title: "UX & Accessibility Audit of Ryanair.es",
      subtitle: "UX and accessibility audit of the Ryanair website, evaluating three critical pages of the booking flow: home, flight results, and checkout process.",
      description: "UX and accessibility audit of the Ryanair website, evaluating three critical pages of the booking flow: home, flight results, and checkout process. The analysis combined heuristic evaluation based on Nielsen's 10 heuristics with automated accessibility testing using Axe DevTools under the WCAG 2.1 AA standard.",
      buttons: ["Axe DevTools", "Chrome DevTools", "WCAG 2.1 AA"],
      objective: "Identify accessibility barriers, usability issues, and improvement opportunities in the main flight booking flow, focusing on the real impact on the user.",
      platform: "Web Desktop and Mobile",
      statsTable: {
        title: "DETECTED INCIDENTS",
        headers: ["Page", "Total", "Critical", "Serious", "Moderate"],
        rows: [
          ["Home", "34", "0", "9", "24"],
          ["Flight Results", "20", "0", "2", "18"],
          ["Checkout - Luggage", "38", "12", "5", "21"],
          ["Total", "92", "12", "16", "63"]
        ]
      },
      testingStrategyTitle: "TESTING STRATEGY",
      testingStrategyList: [
        { name: "Heuristic Evaluation", description: "Evaluation of Nielsen's 10 heuristics on the main flows: search, flight selection, and checkout." },
        { name: "Accessibility", description: "Automated scanning with Axe DevTools (WCAG 2.1 AA) on the three critical pages of the booking flow." },
        { name: "Exploratory Testing", description: "Free navigation through the complete booking flow to detect unexpected behaviors not covered by automated scans." },
        { name: "Functional Testing", description: "End-to-end flow validation: search → flight selection → luggage selection, verifying consistency between steps." }
      ],
      testScenariosTitle: "TEST SCENARIO",
      testScenariosTable: {
        title: "TEST SCENARIO",
        table: [
          { id: "TS-001", feature: "Accessibility", scenario: "Axe DevTools scan on home", objective: "Detect WCAG 2.1 AA issues on main page", precondition: "Updated Chrome. Axe DevTools 4.11.1 installed and active.", priority: "Critical" },
          { id: "TS-002", feature: "Accessibility", scenario: "Axe DevTools scan on checkout", objective: "Detect WCAG 2.1 AA issues in payment flow", precondition: "Chrome. Axe DevTools installed. flight search done.", priority: "Critical" },
          { id: "TS-003", feature: "Keyboard", scenario: "Tab navigation on home", objective: "Verify focus visibility and logical tab order on home", precondition: "Chrome. No extensions modifying styles. Home loaded.", priority: "Critical" },
          { id: "TS-004", feature: "Keyboard", scenario: "Tab navigation on results and checkout", objective: "Verify focus is visible and functional throughout the flow", precondition: "Search executed. Results visible.", priority: "Critical" },
          { id: "TS-005", feature: "Keyboard", scenario: "Login modal behavior with keyboard", objective: "Verify the modal closes with Escape and focus returns to trigger", precondition: "Chrome. Home loaded. User not logged in.", priority: "Critical" },
          { id: "TS-006", feature: "Structure", scenario: "Semantic structure: headings and landmarks on home, results and checkout", objective: "Verify logical H1-H6 hierarchy without duplicates, and presence of <main> landmark", precondition: "Chrome. DevTools open. Header analysis extension. Access to 3 pages.", priority: "Critical" },
          { id: "TS-007", feature: "Localization", scenario: "Special assistance video language", objective: "Verify video is shown in interface language", precondition: "Interface set to Spanish (es-ES). Special assistance section accessible.", priority: "High" },
          { id: "TS-008", feature: "Localization", scenario: "Navigation menu language", objective: "Verify all menu options are translated to interface language", precondition: "Interface set to Spanish (es-ES). Home loaded.", priority: "High" },
          { id: "TS-009", feature: "Usability", scenario: "Origin and destination selection flow", objective: "Verify the search engine clearly guides the user on destination selection", precondition: "Home loaded. Search engine visible.", priority: "High" },
          { id: "TS-010", feature: "Usability", scenario: "Content consistency on home", objective: "Verify no duplicate sections or inconsistent naming", precondition: "Home page fully loaded. No cache.", priority: "Medium" },
          { id: "TS-011", feature: "Functional", scenario: "Home load and main elements", objective: "Validate logo, search engine and menu load and are interactive", precondition: "Chrome. Active connection. No active session.", priority: "Critical" },
          { id: "TS-012", feature: "Functional", scenario: "Flight search engine — date selection", objective: "Validate calendar allows selecting outbound and return dates", precondition: "Home loaded. Search engine visible.", priority: "Critical" },
          { id: "TS-013", feature: "Functional", scenario: "Main menu — expansion and navigation", objective: "Validate 'Plan' menu expands and items are navigable", precondition: "Home loaded. Menu visible in header.", priority: "High" },
          { id: "TS-014", feature: "Functional", scenario: "Flight search results", objective: "Validate flights with prices are shown and filters respond", precondition: "Origin/destination/date search executed from home.", priority: "Critical" }
        ]
      },
      testCasesTitle: "TEST CASES",
      testCases: [
        {
          id: "TC-001", scenarioId: "TS-001", feature: "Accessibility",
          scenario: "Run Axe DevTools on home under WCAG 2.1 AA",
          status: "fail", bug: "BUG-001",
          result: "0 critical or serious issues under WCAG 2.1 AA.",
          details: {
            precondition: "Updated Chrome. Axe DevTools 4.11.1 installed. Home loaded without cache.",
            steps: [
              "Open ryanair.com/en/en",
              "Wait for full load",
              "Open Axe DevTools → 'Overview'",
              "Click 'Rerun scan'",
              "Review results panel — filter by Serious and Moderate"
            ],
            testData: "Chrome 120+\nAxe DevTools 4.11.1\nWCAG 2.1 AA enabled\nURL: ryanair.com/en/en"
          }
        },
        {
          id: "TC-002", scenarioId: "TS-005", feature: "Keyboard",
          scenario: "Open login modal and close with Escape",
          status: "fail", bug: "BUG-011",
          result: "Modal closes on Escape key. Focus automatically returns to trigger button (WCAG 2.1 SC 2.4.3).",
          details: {
            precondition: "Chrome. Home loaded. User not logged in.",
            steps: [
              "Go to Ryanair home",
              "Click 'Log in'",
              "Verify modal opens",
              "Press Escape",
              "Verify modal closes",
              "Verify focus returns to 'Log in' button"
            ],
            testData: "Chrome\nSession: not started\nNavigation: keyboard only"
          }
        },
        {
          id: "TC-003", scenarioId: "TS-001", feature: "Accessibility",
          scenario: "Validate contrast of text, buttons and links on home",
          status: "fail", bug: "BUG-002 / BUG-010",
          result: "All text meets 4.5:1 ratio. Links are distinguishable without color alone.",
          details: {
            precondition: "Chrome. Axe DevTools installed. Home loaded.",
            steps: [
              "Run Axe DevTools on home",
              "Filter by 'color-contrast' and 'link-in-text-block'",
              "Identify elements marked as fail",
              "Verify 'Search' button: inspect color with DevTools Color Picker",
              "Verify ratio with WebAIM Contrast Checker"
            ],
            testData: "Chrome\nAxe DevTools\nDevTools Color Picker\nURL: ryanair.com/en/en"
          }
        },
        {
          id: "TC-004", scenarioId: "TS-003", feature: "Keyboard",
          scenario: "Verify tab order on home",
          status: "fail", bug: "BUG-012",
          result: "Focus follows logical and predictable order. Outline visible on all interactive elements.",
          details: {
            precondition: "Chrome without extensions modifying CSS. Home loaded.",
            steps: [
              "Press Tab from URL bar",
              "Document focus order element by element",
              "Verify visible outline at each step",
              "Verify logical order: header → search → content → footer"
            ],
            testData: "Chrome\nCSS: native unmodified\nPage: full home"
          }
        },
        {
          id: "TC-005", scenarioId: "TS-008", feature: "Localization",
          scenario: "Verify 'Plan' menu options in Spanish",
          status: "fail", bug: "BUG-004",
          result: "All 'Plan' menu options are in Spanish. No English text is shown.",
          details: {
            precondition: "Interface in es-ES. Home loaded.",
            steps: [
              "Open home in Spanish",
              "Click 'Planear' in header",
              "Review every sub-menu option (EXPLORE and TRAVEL EXTRAS sections)",
              "Identify any text in another language"
            ],
            testData: "Language: es-ES\nChrome\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-006", scenarioId: "TS-009", feature: "Usability",
          scenario: "Select destination in search engine and verify options hierarchy",
          status: "fail", bug: "BUG-005",
          result: "Selector clearly guides the user. Disabled countries have a visible explanation.",
          details: {
            precondition: "Home loaded. Search engine visible. Origin: Barcelona-El Prat.",
            steps: [
              "Click 'Destination' field",
              "Observe displayed selector",
              "Identify greyed out countries (disabled)",
              "Click a greyed out country (e.g., Cyprus)",
              "Verify if there is an explanatory message"
            ],
            testData: "Chrome\nOrigin: Barcelona-El Prat\nURL: ryanair.com/en/en"
          }
        },
        {
          id: "TC-007", scenarioId: "TS-006", feature: "Structure",
          scenario: "Verify heading hierarchy and landmark on home, results and checkout",
          status: "fail", bug: "BUG-006 / BUG-007 / BUG-009",
          result: "1 H1 per page. Logical hierarchy without jumps. <main> element present on each page.",
          details: {
            precondition: "Chrome. DevTools + header analysis extension. Access to 3 pages.",
            steps: [
              "Open home → activate header extension → note H1-H6 count",
              "Run Axe → filter 'landmark' → verify <main> presence",
              "Repeat on flight results page",
              "Repeat on checkout step 1"
            ],
            testData: "Chrome\nExtension: SEO Meta in 1 Click\nAxe DevTools\nPages: home + results + checkout"
          }
        },
        {
          id: "TC-008", scenarioId: "TS-007", feature: "Localization",
          scenario: "Verify special assistance video language",
          status: "fail", bug: "BUG-008",
          result: "Video is shown in Spanish. Overlaid text and subtitles are in Spanish.",
          details: {
            precondition: "Interface in es-ES. Special assistance section accessible.",
            steps: [
              "Navigate to help.ryanair.com → Special assistance",
              "Locate 'Booking special assistance' video",
              "Play video",
              "Observe language of overlaid text and subtitles"
            ],
            testData: "Language: es-ES\nChrome\nURL: help.ryanair.com/hc/en-gb/.../Special-assistance"
          }
        },
        {
          id: "TC-009", scenarioId: "TS-001", feature: "Accessibility",
          scenario: "Validate alt text on images and banners of home",
          status: "fail", bug: "BUG-003",
          result: "Informatice images with descriptive alt. Banners with relevant info exposed as accessible text.",
          details: {
            precondition: "Chrome. Axe DevTools installed. Home loaded.",
            steps: [
              "Run Axe DevTools → filter by 'image-alt'",
              "Inspect main banner with DevTools",
              "Verify alt attribute on destination images",
              "Verify banners: is text in DOM or image only?"
            ],
            testData: "Chrome\nAxe DevTools\nDevTools Inspector\nURL: ryanair.com/en/en"
          }
        },
        {
          id: "TC-010", scenarioId: "TS-011", feature: "Functional",
          scenario: "Verify home load",
          status: "pass", bug: "-",
          result: "Logo, search engine and menu visible and functional without blocking errors.",
          details: {
            precondition: "Chrome. Active connection. No session.",
            steps: [
              "Open ryanair.com/en/en",
              "Wait for full load",
              "Verify logo, search engine and menu visible",
              "Verify menu responds to click"
            ],
            testData: "Chrome\nConnection: normal\nSession: not started"
          }
        },
        {
          id: "TC-011", scenarioId: "TS-012", feature: "Functional",
          scenario: "Verify flight search engine date selector",
          status: "pass", bug: "-",
          result: "Functional calendar. Outbound and return dates selectable and visible in fields.",
          details: {
            precondition: "Home loaded. Search engine visible.",
            steps: [
              "Click date field",
              "Verify calendar opens",
              "Select outbound date",
              "Select return date",
              "Verify both dates show in fields"
            ],
            testData: "Chrome\nDates: future (>7 days)"
          }
        },
        {
          id: "TC-012", scenarioId: "TS-014", feature: "Functional",
          scenario: "Verify flight search results",
          status: "pass", bug: "-",
          result: "Flights available with prices. Filters functional.",
          details: {
            precondition: "Origin, destination and dates selected.",
            steps: [
              "Complete search: London → Madrid",
              "Click 'Search'",
              "Verify results load",
              "Verify flights with visible prices",
              "Verify filters respond"
            ],
            testData: "Chrome\nRoute: STN → MAD\nDate: next 30 days"
          }
        },
        {
          id: "TC-013", scenarioId: "TS-013", feature: "Functional",
          scenario: "Verify main menu expansion",
          status: "pass", bug: "-",
          result: "'Plan' menu expands. Items navigable and functional.",
          details: {
            precondition: "Home loaded. Menu visible in header.",
            steps: [
              "Click 'Plan'",
              "Verify sub-menu expands",
              "Click an item",
              "Verify correct navigation"
            ],
            testData: "Chrome\nLanguage: en-EN"
          }
        }
      ],
      bugsTitle: "BUGS FOUND",
      bugs: [
        {
          id: "BUG-001",
          testCaseId: "TS-001 / TC-001",
          title: "34 accessibility issues detected on home",
          severity: "High",
          description: "Axe detects 34 issues: 9 serious, 24 moderate, 1 minor. Includes: ARIA commands must have an accessible name (1), Links must be distinguishable without relying on color (1), Links must have discernible text (1), Interactive controls must not be nested (6), Headings should not be empty (1), Document should have one main landmark (1).",
          precondition: "Chrome. Axe DevTools 4.11.1 installed. Home ryanair.com/en/en loaded.",
          steps: [
            "Open ryanair.com/en/en in Chrome",
            "Open Axe DevTools → Overview",
            "Click 'Rerun scan'",
            "Review results panel"
          ],
          expected: "0 automatic issues under WCAG 2.1 AA.",
          actual: "Axe detects 34 issues: 9 serious, 24 moderate, 1 minor.",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-002",
          testCaseId: "TS-001 / TC-003",
          title: "Links not distinguishable without color",
          severity: "High",
          description: "Axe reports 1 issue: at least one link on home only differs from surrounding text by color, without underline or any other visual indicator.",
          precondition: "Chrome. Axe DevTools installed. Home loaded.",
          steps: [
            "Run Axe DevTools on home",
            "Expand 'Links must be distinguishable without relying on color' issue",
            "Identify affected element",
            "Visually verify if link has indicator besides color"
          ],
          expected: "Links differ from normal text via underline or other indicator besides color (WCAG 2.1 SC 1.4.1).",
          actual: "Axe reports 1 issue: link only differs by color.",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-003",
          testCaseId: "TS-001 / TC-009",
          title: "Banners with informational text embedded in image without accessible alternative",
          severity: "High",
          description: "Banner shows promotional text embedded in image: 'STAYS FOR LESS THAN €99 PER NIGHT', side labels ('CAR HIRE', 'RYANAIR ROOMS', 'IMPORTANT NOTICE', 'PRIVATE TRANSFERS') without equivalent accessible alt text.",
          precondition: "Chrome. Home ryanair.com/en/en fully loaded.",
          steps: [
            "Open ryanair.com/en/en",
            "View main rotating banner",
            "Observe visible text inside images",
            "Inspect with DevTools if text exists in DOM"
          ],
          expected: "Relevant banner information is available as text in DOM or in a descriptive alt attribute.",
          actual: "Banner shows promotional text embedded in image without equivalent accessible alt text.",
          evidence: "/img/img-ryanair/BUG-003-home-banners.png"
        },
        {
          id: "BUG-004",
          testCaseId: "TS-008 / TC-005",
          title: "'Try Somewhere New' and 'Travel Agent Direct' in English in Spanish menu",
          severity: "Medium",
          description: "Items 'Try Somewhere New' and 'Travel Agent Direct' appear in English within the 'EXPLORE' sub-menu, while all other items are in Spanish.",
          precondition: "Interface set to es-ES. Home loaded.",
          steps: [
            "Open ryanair.com/es/es in Spanish",
            "Click 'Planear' in header",
            "Review sub-menu 'EXPLORAR' section",
            "Locate English items"
          ],
          expected: "All 'Plan' menu items translated to Spanish.",
          actual: "Items 'Try Somewhere New' and 'Travel Agent Direct' appear in English.",
          evidence: "/img/img-ryanair/BUG-004-home-menu-en.png"
        },
        {
          id: "BUG-005",
          testCaseId: "TS-009 / TC-006",
          title: "Greyed out countries in destination selector without visible explanation",
          severity: "High",
          description: "10+ countries appear in light grey (Cyprus, Finland, Bosnia & Herzegovina, Montenegro, Norway, Netherlands, Romania, Serbia, Switzerland, Turkey) without any message or indicator why they are disabled.",
          precondition: "Home loaded. Origin: London-Stansted. Search engine visible.",
          steps: [
            "Click 'Destination' field",
            "Observe country list",
            "Identify light grey countries",
            "Try clicking a grey country (e.g., Cyprus)",
            "Verify if there is an explanatory message"
          ],
          expected: "Countries without available flights are clearly marked with a message or tooltip explaining why.",
          actual: "10+ countries greyed out without any message or indicator.",
          evidence: "/img/img-ryanair/BUG-005-home-seleccionar-destino.png"
        },
        {
          id: "BUG-006",
          testCaseId: "TS-006 / TC-007",
          title: "Document without main landmark defined",
          severity: "Medium",
          description: "Axe reports 'Document should have one main landmark' (1 issue). Document does not define a main region, preventing screen reader users from jumping directly to content.",
          precondition: "Chrome. Axe DevTools installed. Home loaded.",
          steps: [
            "Run Axe DevTools on home",
            "Locate 'Document should have one main landmark' issue",
            "Inspect HTML with DevTools: search for <main> or role='main'"
          ],
          expected: "Document has exactly one <main> element delimiting main content.",
          actual: "Axe reports 'Document should have one main landmark' (1 issue).",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-007",
          testCaseId: "TS-006 / TC-007",
          title: "Home with 4 H1 elements — incorrect heading hierarchy",
          severity: "High",
          description: "Home contains 4 H1 elements (last detected: 'Sign up and save'). Final count: H1:4 · H2:22 · H3:1 · H4:0 · H5:0 · H6:0.",
          precondition: "Chrome. Home ryanair.com/en/en loaded. SEO Meta in 1 Click extension active.",
          steps: [
            "Open ryanair.com/en/en",
            "Activate header analysis extension",
            "Go to 'HEADERS' tab",
            "Review count and heading list"
          ],
          expected: "Exactly 1 H1 per page. Logical and continuous hierarchy (H1 → H2 → H3).",
          actual: "Home contains 4 H1 elements.",
          evidence: "/img/img-ryanair/BUG-007-home-headers.png"
        },
        {
          id: "BUG-008",
          testCaseId: "TS-007 / TC-008",
          title: "Special assistance video in Catalan with Spanish interface",
          severity: "Medium",
          description: "Video shown entirely in Catalan: title 'VIATGE ASSISTIT', text '48 HORES ABANS DE LA SORTIDA' and subtitles.",
          precondition: "Interface in es-ES. URL: help.ryanair.com → Special assistance.",
          steps: [
            "Navigate to Special Assistance section of Help Centre",
            "Locate 'Booking special assistance' video",
            "Play video",
            "Observe language of overlaid text and subtitles"
          ],
          expected: "Video shown in Spanish when interface is es-ES.",
          actual: "Video shown entirely in Catalan.",
          evidence: "/img/img-ryanair/BUG-008-soporte-ryanair-ES.png"
        },
        {
          id: "BUG-009",
          testCaseId: "TS-006 / TC-007",
          title: "Checkout without H1 or H2 — hierarchy starts at H3",
          severity: "High",
          description: "Checkout without any H1 or H2. Count: H1:0 · H2:0 · H3:4 · H4:5. Hierarchy starts at H3: 'Your selected flights', 'Your selected fare', 'Log in to myRyanair', 'Passengers'.",
          precondition: "Search executed. Flight selected. Checkout step 'Flights' loaded.",
          steps: [
            "Run search and select flight",
            "Access checkout",
            "Activate header analysis extension",
            "Review 'HEADERS' tab"
          ],
          expected: "At least 1 H1 on checkout page. Logical hierarchy.",
          actual: "Checkout without any H1 or H2.",
          evidence: "/img/img-ryanair/checkout-headers.png"
        },
        {
          id: "BUG-010",
          testCaseId: "TS-001 / TC-003",
          title: "'Search' button contrast requires formal verification",
          severity: "Medium",
          description: "'Search' button has RGB (217, 181, 46) — yellow #D9B52E. This color requires formal contrast ratio verification with overlaid text to confirm WCAG compliance.",
          precondition: "Chrome. Home ryanair.com/en in responsive view. DevTools open.",
          steps: [
            "Inspect 'Search' button with DevTools",
            "Open Color Picker in Styles panel",
            "Record RGB color values",
            "Verify ratio in WebAIM Contrast Checker"
          ],
          expected: "'Search' button meets minimum 4.5:1 ratio between text and background (WCAG 2.1 SC 1.4.3).",
          actual: "'Search' button has RGB (217, 181, 46) — yellow #D9B52E.",
          evidence: "/img/img-ryanair/color-ratio.png"
        },
        {
          id: "BUG-011",
          testCaseId: "TS-005 / TC-002",
          title: "Login modal does not respond to Escape key",
          severity: "High",
          description: "Pressing Escape with login modal open has no effect; modal remains open. User cannot close modal without mouse.",
          precondition: "Chrome. Home loaded. User not logged in.",
          steps: [
            "Go to Ryanair home",
            "Click 'Log in'",
            "Verify modal opens",
            "Press Escape key",
            "Observe if modal closes"
          ],
          expected: "Modal closes on Escape press. Focus returns to 'Log in' button (WCAG 2.1 SC 2.4.3).",
          actual: "Pressing Escape with login modal open, modal remains open.",
          evidence: ""
        },
        {
          id: "BUG-012",
          testCaseId: "TS-003 / TC-004",
          title: "Home tab order does not follow visual logic",
          severity: "High",
          description: "Tab order makes unpredictable jumps. Some interactive elements do not receive focus when navigating with Tab, and outline is not visible on all affected elements.",
          precondition: "Chrome without CSS modifying extensions. Home loaded in full window.",
          steps: [
            "Press Tab from URL bar",
            "Document order in which each element receives focus",
            "Compare with page visual order (left→right, top→bottom)",
            "Identify jumps or skipped elements"
          ],
          expected: "Focus cycles through all interactive elements in logical and predictable order: header → search engine → content → footer.",
          actual: "Tab order makes unpredictable jumps.",
          evidence: ""
        }
      ],
      uxImprovementsTitle: "UX IMPROVEMENTS",
      uxImprovements: [
        "Visual Hierarchy on Home: Reduce the number of competing elements to focus the user on the search engine.",
        "Progress Indicator: Add a clear step-by-step indicator in the checkout flow to reduce user anxiety.",
        "Specific Error Messages: Instead of 'Invalid data', specify which field is wrong and why.",
        "Redesign of Extras Flow: Avoid 'dark patterns' that hide the option to continue without adding services.",
        "Contrast Correction: Update the corporate color palette or text colors to meet accessibility standards."
      ]
    }
  },
  es: {
    home: "Inicio",
    about: "Sobre mi",
    projectsQA: "Proyectos QA",
    projectsUX: "Proyectos UX UI",
    skills: "Habilidades",
    contact: "Contáctame!",
    contactSectionLabel: "Contáctame",
    heroTitle: "Daiana Ciaramella",
    heroSub: "Functional Testing • Bug Reporting • UX-Oriented QA • API Testing (Postman)",
    aboutTitle: "Cerrando la brecha entre el diseño y la calidad del software",
    aboutP1: "Vengo del diseño UX/UI y el desarrollo Frontend, lo que me dio una perspectiva que pocos QA tienen: entiendo cómo se construye lo que después voy a romper. Esa mirada integral me permite detectar no solo bugs funcionales sino inconsistencias de experiencia que impactan directamente al usuario final.",
    aboutP2: "Con más de 3 años en entornos digitales, me especializo en testing funcional, diseño y ejecución de test cases, regression testing y gestión de defectos. Colaboro en equipos ágiles validando que el producto cumpla tanto los requerimientos técnicos como la experiencia esperada por el usuario.",
    projectsQATitle: "Portfolio QA",
    projectsUXTitle: "Diseño UX/UI",
    skillsTitle: "Habilidades Técnicas",
    contactTitle: "TRABAJEMOS JUNTOS.",
    formName: "Nombre Completo",
    formEmail: "Correo Electrónico",
    formMessage: "¿En qué puedo ayudarte?",
    formSubmit: "Enviar Mensaje",
    footer: "© 2026 DAIANA CIARAMELLA - QA TESTER | UX UI",
    visualProjectsTitle: "Proyectos UX UI",
    view: "Ver",
    common: {
      caseStudy: "CASO DE ESTUDIO",
      viewAnalysis: "Ver análisis",
      scroll: "Scroll",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      back: "Volver",
      tools: "Herramientas y Tecnologías",
      objective: "Objetivo",
      platform: "Plataforma",
      features: "Características",
      strategy: "Estrategia de Testing",
      scenarios: "Escenarios de Prueba",
      cases: "Casos de Prueba",
      bugs: "Reporte de Bugs",
      improvements: "Mejoras de UX",
      pass: "Pasa",
      fail: "Falla",
      severity: "Severidad",
      type: "Tipo",
      steps: "Pasos para reproducir",
      expected: "Resultado esperado",
      actual: "Resultado actual",
      evidence: "Evidencia",
      precondition: "Precondición",
      description: "Descripción",
      viewEvidence: "VER EVIDENCIA",
      high: "Grave",
      medium: "Medio",
      low: "Leve"
    },
    visualProjects: [
      {
        title: "Onus",
        desc: "Diseño de identidad visual y experiencia de usuario para Onus Solutions, incluyendo definición de marca, paleta de colores y diseño web enfocado en claridad de contenido y navegación.",
        img: "/img/onus-proyectouxui.png"
      },
      { title: "Grinplug", desc: "Diseño integral de una plataforma de carga eléctrica, definiendo flujos y arquitectura del producto.", img: "/img/grinplug-proyectouxui.png" },
      { title: "Uminti", desc: "Diseño de identidad visual y experiencia web para un servicio especializado, enfocado en claridad de comunicación y optimización de flujos de conversión.", img: "/img/uminti-proyectouxui.png" },
      { title: "HAY EQUIPO! – App", desc: "Investigación, definición de producto y diseño UX/UI de una app orientada a la organización de partidos de fútbol femenino y generación de comunidad. Research - flujos - wireframes", img: "/img/app-futfem.png" }
    ],
    qaProjects: [
      {
        title: "DAILY – App",
        description: "QA Testing · Financial Web App (PWA) — Testing funcional de una aplicación financiera multimoneda (ARS, USD, EUR), validando flujos críticos de uso diario, manejo de errores y consistencia de datos.",
        link: "/proyectos-qa/daily_app"
      },
      {
        title: "UX & Accesibilidad - Ryanair",
        description: "Accessibility & UX Testing · Web Audit — Evaluación de accesibilidad y usabilidad del sitio de Ryanair utilizando Axe DevTools, identificando barreras WCAG, problemas de navegación y mejoras en la experiencia del usuario.",
        link: "/ux-testing"
      },
      {
        title: "API Testing - Postman",
        description: "API Testing · E-commerce — Validación de una API REST de e-commerce utilizando Postman, analizando endpoints de productos y carritos, respuestas HTTP, estructura de datos y manejo de errores.",
        link: "/proyectos-qa/testing-api-postman"
      },
      {
        title: "E-commerce Testing",
        description: "Análisis y testing funcional del flujo de compra de un e-commerce, validando registro de usuario, carrito de compras, proceso de checkout y manejo de errores.",
        link: "/proyectos-qa/ecommerce-testing"
      }
    ],
    daily_app: {
      title: "DAILY – App",
      subtitle: "Aplicación de gestión financiera multimoneda diseñada para centralizar cuentas, registrar transacciones y visualizar balances en tiempo real.",
      description: "DAILY nació de una necesidad real: ninguna app del mercado ofrecía gestión financiera multimoneda adaptada a quienes operan simultáneamente con ARS, USD y EUR en distintos países. La app centraliza múltiples cuentas bancarias y billeteras virtuales, calcula totales consolidados por moneda en tiempo real, y permite vincular gastos a viajes con seguimiento de presupuesto. \n\nTesteé la app en condiciones de uso diario real, lo que me permitió detectar comportamientos que solo emergen con datos reales y flujos de uso genuinos.",
      objective: "Validar el correcto funcionamiento de los flujos principales de la aplicación, asegurando la consistencia de los balances financieros y una experiencia de usuario clara en dispositivos móviles.",
      platform: "PWA (Progressive Web App), publicada en Vercel, optimizada para Android e iOS.",
      featuresTitle: "ALCANCE DEL TESTING",
      featuresList: [
        "Autenticación (PIN / huella)",
        "CRUD de transacciones (gastos e ingresos)",
        "Gestión de cuentas y presupuestos",
        "Módulo de viajes y deudas",
        "Dashboard y gráficos",
        "Validaciones y manejo de errores",
        "Soporte multimoneda"
      ],
      testingStrategyTitle: "ESTRATEGIA DE TESTING",
      testingStrategyList: [
        { name: "Functional Testing", description: "Validación de flujos críticos: transacciones, balances, presupuestos y deudas." },
        { name: "Exploratory Testing", description: "Uso diario real para detectar comportamientos inesperados en flujos secundarios." },
        { name: "UI Testing", description: "Visualización correcta de componentes, formularios y feedback en mobile." },
        { name: "Edge Case Testing", description: "Escenarios límite: montos vacíos, cero, datos incompletos en formularios." }
      ],
      testScenariosTitle: "ESCENARIOS DE PRUEBA",
      testScenariosDesc: "A partir de las funcionalidades principales de la aplicación se definieron diferentes escenarios de prueba para validar los flujos críticos del sistema.",
      testScenariosTable: [
        { id: "TS-001", feature: "Autenticación", scenario: "Acceso mediante PIN o biometría", objective: "Validar autenticación correcta y manejo de intentos inválidos con feedback claro", priority: "Crítico" },
        { id: "TS-002", feature: "Cuentas", scenario: "Gestión de cuentas multimoneda", objective: "Verificar creación de cuentas y consistencia de datos entre monedas", priority: "Crítico" },
        { id: "TS-003", feature: "Transacciones", scenario: "Registro de transacciones", objective: "Validar impacto de ingresos y gastos en balances y vistas", priority: "Crítico" },
        { id: "TS-004", feature: "Multimoneda", scenario: "Totales por moneda", objective: "Verificar independencia de cálculos entre monedas", priority: "Crítico" },
        { id: "TS-005", feature: "Dashboard", scenario: "Representación visual de datos", objective: "Validar símbolos de moneda y consistencia visual", priority: "Grave" },
        { id: "TS-006", feature: "Viajes", scenario: "Gestión de viajes", objective: "Verificar asociación de gastos y actualización de progreso", priority: "Grave" },
        { id: "TS-007", feature: "Viajes", scenario: "Presupuesto de viaje", objective: "Validar comportamiento al superar límites y feedback UX", priority: "Crítico" },
        { id: "TS-008", feature: "Deudas", scenario: "Gestión de deudas", objective: "Validar registro y visualización correcta de deudas", priority: "Grave" },
        { id: "TS-009", feature: "Presupuestos", scenario: "Presupuesto mensual", objective: "Verificar cálculo de gasto acumulado y porcentaje", priority: "Grave" },
        { id: "TS-010", feature: "Validaciones", scenario: "Validaciones de inputs", objective: "Validar manejo de datos inválidos sin inconsistencias", priority: "Crítico" }
      ],
      testScenariosFooter: "",
      testCasesDesc: "Cada caso de prueba está vinculado a su escenario correspondiente. Los estados reflejan los resultados obtenidos durante la ejecución.",
      testCasesTable: [
        {
          id: "TC-001", scenarioId: "TS-003",
          feature: "Registrar un nuevo gasto asociado a una cuenta",
          scenario: "Usuario autenticado. Cuenta en ARS activa con saldo > $0. Al menos una categoría disponible.",
          result: "El gasto se guarda correctamente. El balance pasa de $2000 a $1500 y se refleja de forma consistente en dashboard y vista de transacciones.",
          status: "fail", bug: "BUG-002", tipo: "Funcional",
          details: {
            precondition: "Usuario autenticado. Cuenta en ARS activa con saldo > $0. Al menos una categoría disponible.",
            steps: [
              "Ir a Transacciones → Nueva transacción",
              "Seleccionar tipo: Gasto",
              "Seleccionar cuenta ARS",
              "Ingresar monto: $500",
              "Seleccionar categoría: Comida",
              "Guardar",
              "Verificar balance en la cuenta",
              "Verificar dashboard"
            ],
            testData: "Cuenta: ARS, saldo inicial: $2000 / Monto gasto: $500 / Categoría: Comida"
          }
        },
        {
          id: "TC-002", scenarioId: "TS-003",
          feature: "Registrar un ingreso y verificar impacto en balance",
          scenario: "Usuario autenticado. Cuenta en ARS activa.",
          result: "El ingreso se registra correctamente. El balance pasa de $1000 a $4000 y se refleja en todas las vistas.",
          status: "pass", tipo: "Funcional",
          details: {
            precondition: "Usuario autenticado. Cuenta en ARS activa.",
            steps: [
              "Ir a Transacciones → Nueva transacción",
              "Seleccionar tipo: Ingreso",
              "Seleccionar cuenta ARS",
              "Ingresar monto: $3000",
              "Guardar",
              "Verificar balance",
              "Verificar dashboard y transacciones"
            ],
            testData: "Cuenta: ARS, saldo inicial: $1000 / Monto ingreso: $3000"
          }
        },
        {
          id: "TC-003", scenarioId: "TS-002",
          feature: "Crear nueva cuenta en moneda EUR",
          scenario: "Usuario autenticado. No existe cuenta en EUR previamente.",
          result: "La cuenta se crea correctamente con símbolo € y no genera cambios en otras cuentas.",
          status: "pass", tipo: "Funcional / Integración",
          details: {
            precondition: "Usuario autenticado. No existe cuenta en EUR previamente.",
            steps: [
              "Ir a Cuentas → Nueva cuenta",
              "Ingresar nombre: \"Cuenta Europa\"",
              "Seleccionar moneda: EUR",
              "Guardar",
              "Verificar listado",
              "Verificar que no afecta otras cuentas"
            ],
            testData: "Nombre: Cuenta Europa / Moneda: EUR / Saldo inicial: €0"
          }
        },
        {
          id: "TC-004", scenarioId: "TS-004",
          feature: "Gasto en USD no afecta totales de EUR y ARS",
          scenario: "Usuario autenticado. Cuentas activas en USD, EUR y ARS con saldo.",
          result: "Solo USD se actualiza. EUR y ARS permanecen sin cambios. No hay inconsistencias.",
          status: "pass", tipo: "Integración / Multimoneda",
          details: {
            precondition: "Usuario autenticado. Cuentas activas en USD, EUR y ARS con saldo.",
            steps: [
              "Ir a Transacciones",
              "Seleccionar cuenta USD",
              "Registrar gasto $50",
              "Guardar",
              "Ir a Dashboard",
              "Verificar totales por moneda"
            ],
            testData: "USD: $200 → $150 / EUR: €150 / ARS: $5000"
          }
        },
        {
          id: "TC-005", scenarioId: "TS-005",
          feature: "Verificar representación del símbolo EUR en el sistema",
          scenario: "Usuario autenticado. Cuenta EUR activa.",
          result: "El sistema muestra correctamente el símbolo € en todos los componentes (dashboard, gráficos y vistas).",
          status: "fail", bug: "BUG-004", tipo: "UX / Visual",
          details: {
            precondition: "Usuario autenticado. Cuenta EUR activa.",
            steps: [
              "Ir a Dashboard",
              "Ver cuenta EUR",
              "Verificar símbolo en gráficos, lista y detalle"
            ],
            testData: "Cuenta EUR: €200"
          }
        },
        {
          id: "TC-006", scenarioId: "TS-006",
          feature: "Gasto asociado a viaje y actualización de progreso",
          scenario: "Usuario autenticado. Viaje activo con presupuesto y gasto previo.",
          result: "El gasto se asocia correctamente. El total pasa a €250 (50%) y se refleja en todos los módulos.",
          status: "fail", bug: "BUG-003", tipo: "Funcional / Integración",
          details: {
            precondition: "Usuario autenticado. Viaje activo con presupuesto y gasto previo.",
            steps: [
              "Ir a Viajes",
              "Seleccionar viaje",
              "Registrar gasto €50",
              "Guardar",
              "Verificar progreso",
              "Verificar cuenta y dashboard"
            ],
            testData: "Presupuesto: €500 / Gasto previo: €200"
          }
        },
        {
          id: "TC-007", scenarioId: "TS-007",
          feature: "Superar presupuesto de viaje y validar feedback",
          scenario: "Usuario autenticado. Viaje con presupuesto casi alcanzado.",
          result: "El sistema muestra alerta al superar el presupuesto. Se refleja correctamente ($1050) y se indica visualmente.",
          status: "fail", bug: "BUG-006", tipo: "Funcional / UX / Edge",
          details: {
            precondition: "Usuario autenticado. Viaje con presupuesto casi alcanzado.",
            steps: [
              "Ir a Viajes",
              "Agregar gasto $100",
              "Guardar",
              "Verificar notificación",
              "Verificar barra y valores"
            ],
            testData: "Presupuesto: $1000 / Gasto previo: $950"
          }
        },
        {
          id: "TC-008", scenarioId: "TS-008",
          feature: "Registrar deuda “Me deben”",
          scenario: "Usuario autenticado. Sin deudas previas.",
          result: "La deuda se registra correctamente en la vista \"Me deben\" y no aparece en \"Debo\".",
          status: "pass", tipo: "Funcional",
          details: {
            precondition: "Usuario autenticado. Sin deudas previas.",
            steps: [
              "Ir a Deudas",
              "Nueva deuda",
              "Seleccionar \"Me deben\"",
              "Ingresar datos",
              "Guardar",
              "Verificar vista"
            ],
            testData: "Nombre: Juan / Monto: $300"
          }
        },
        {
          id: "TC-009", scenarioId: "TS-009",
          feature: "Cálculo de porcentaje de presupuesto mensual",
          scenario: "Usuario autenticado. Presupuesto activo con gastos.",
          result: "El sistema calcula correctamente el porcentaje (90%) and muestra proximidad al límite.",
          status: "pass", tipo: "Funcional / Cálculo",
          details: {
            precondition: "Usuario autenticado. Presupuesto activo con gastos.",
            steps: [
              "Ir a Presupuestos",
              "Ver gasto actual",
              "Agregar gasto",
              "Verificar porcentaje"
            ],
            testData: "Presupuesto: $5000 / Gasto: $3500 → $4500"
          }
        },
        {
          id: "TC-010", scenarioId: "TS-010",
          feature: "Validación de campo monto vacío",
          scenario: "Usuario autenticado. Cuenta activa.",
          result: "El sistema bloquea la acción, muestra error y no guarda datos ni modifica balances.",
          status: "fail", bug: "BUG-005", tipo: "Validación / Negativo",
          details: {
            precondition: "Usuario autenticado. Cuenta activa.",
            steps: [
              "Ir a Transacciones",
              "Dejar monto vacío",
              "Intentar guardar"
            ],
            testData: "Monto vacío"
          }
        },
        {
          id: "TC-011", scenarioId: "TS-001",
          feature: "Validar autenticación con PIN incorrecto",
          scenario: "Usuario registrado con PIN configurado",
          result: "El sistema bloquea acceso y muestra mensaje claro de error sin permitir ingreso.",
          status: "fail", bug: "BUG-001", tipo: "Seguridad / Validación",
          details: {
            precondition: "Usuario registrado con PIN configurado",
            steps: [
              "Abrir app",
              "Ingresar PIN incorrecto",
              "Confirmar"
            ],
            testData: "PIN incorrecto"
          }
        }
      ],
      bugsTitle: "REPORTES DE BUGS",
      bugsDescription: "Se identificaron y documentaron los siguientes defectos críticos durante la ejecución de las pruebas.",
      bugs: [
        {
          id: "BUG-001",
          title: "Falta de feedback al ingresar PIN incorrecto",
          severity: "Medium",
          type: "Autenticación",
          description: "Precondición: Usuario con PIN configurado. [TS-001 / TC-011]",
          steps: ["Abrir la aplicación", "Ingresar un PIN incorrecto", "Confirmar acceso"],
          expected: "El sistema bloquea el acceso y muestra un mensaje claro indicando que el PIN es incorrecto",
          actual: "El acceso es bloqueado pero no se muestra ningún mensaje de error",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-002",
          title: "Desincronización temporal de datos en dashboard",
          severity: "Low",
          type: "Dashboard",
          description: "Precondición: Usuario autenticado con cuentas activas. [TS-003 / TC-001]",
          steps: ["Registrar un nuevo gasto", "Ir inmediatamente al dashboard", "Verificar valores mostrados"],
          expected: "El dashboard refleja inmediatamente el cambio en los balances",
          actual: "Algunos valores tardan en actualizarse hasta refrescar la vista",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-003",
          title: "No se pueden editar gastos desde la vista de viajes",
          severity: "High",
          type: "Viajes",
          description: "Precondición: Usuario con viaje activo y gastos registrados. [TS-006 / TC-006]",
          steps: ["Ir a Viajes", "Seleccionar un viaje", "Intentar editar un gasto registrado"],
          expected: "El usuario puede editar el gasto desde la vista de viajes",
          actual: "No es posible editar el gasto desde esa vista",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-004",
          title: "Símbolo de moneda incorrecto en dashboard (EUR)",
          severity: "Medium",
          type: "Visual / Dashboard",
          description: "Precondición: Usuario con cuenta en EUR. [TS-005 / TC-005]",
          steps: ["Ir al dashboard", "Visualizar cuenta en EUR", "Revisar símbolo mostrado"],
          expected: "El sistema muestra el símbolo \"€\" correctamente",
          actual: "El sistema muestra \"$\" en lugar de \"€\" en algunos componentes",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-005",
          title: "Se permite guardar transacción con monto vacío",
          severity: "High",
          type: "Validación",
          description: "Precondición: Usuario autenticado con cuenta activa. [TS-010 / TC-010]",
          steps: ["Ir a nueva transacción", "Dejar campo monto vacío", "Intentar guardar"],
          expected: "El sistema bloquea la acción y muestra mensaje de error",
          actual: "La transacción se guarda sin monto o genera comportamiento inconsistente",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-006",
          title: "Falta de alerta clara al superar presupuesto de viaje",
          severity: "Medium",
          type: "UX / Alertas",
          description: "Precondición: Viaje activo con presupuesto cercano al límite. [TS-007 / TC-007]",
          steps: ["Registrar gasto que supere el presupuesto", "Confirmar operación", "Verificar feedback del sistema"],
          expected: "El sistema muestra una alerta clara indicando que se superó el presupuesto",
          actual: "El sistema permite la operación pero no muestra un feedback claro o visible",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        }
      ],
      uxImprovements: [
        "Feedback y estado del sistema: Al completar una operación (registrar gasto, crear cuenta, saldar deuda), la app no confirma visualmente que la acción se realizó. Un mensaje breve o micro-animación reduciría la incertidumbre del usuario y prevendría registros duplicados por falta de confirmación.",
        "Perfiles de usuario: La app actualmente no diferencia usuarios. Incorporar un perfil básico permitiría personalizar preferencias (moneda por defecto, categorías frecuentes) y abriría la puerta a funcionalidades multiusuario en el futuro.",
        "Creación de cuentas personalizadas: Permitir al usuario crear cuentas o billeteras virtuales con nombre, moneda e ícono propios haría la app adaptable a distintos contextos financieros (cuenta nómina, ahorro, cripto, etc.).",
        "Transferencias entre cuentas: Hoy mover fondos entre cuentas requiere registrar un egreso en una y un ingreso en otra manualmente. Una funcionalidad de transferencia directa reduciría errores y simplificaría la gestión de múltiples cuentas.",
        "Filtrado inteligente por moneda: Al registrar una transacción, mostrar solo las cuentas que coinciden con la moneda seleccionada evitaría errores de asignación y haría el flujo de registro más rápido y menos propenso a equivocaciones."
      ]
    },
    api_testing: {
      title: "Testing de API con Postman",
      subtitle: "Validación de API REST de E-commerce",
      certification: {
        title: "Certificación Postman Student Expert",
        image: "/img/img-postman-api/Postman - Postman API Fundamentals Student Expert - 2026-02-21 (2).png"
      },
      description: "Este proyecto consiste en la validación de una API REST de e-commerce utilizando Postman. Las pruebas se enfocaron en analizar el comportamiento de distintos endpoints relacionados con productos y carritos de compra, verificando el correcto funcionamiento de las respuestas del servidor, la estructura de los datos y el manejo de errores.",
      objective: "Verificar el correcto funcionamiento de los endpoints de la API relacionados con productos y carritos de compra, validando códigos de respuesta HTTP, la estructura de los datos en formato JSON y el comportamiento del sistema ante escenarios positivos y negativos.",
      platform: "DummyJSON API mediante POSTMAN",
      endpoints: {
        title: "Endpoints Analizados",
        idHeader: "Método",
        description: "Se analizaron distintos endpoints de la API para asegurar el comportamiento esperado del sistema y la integridad de los datos dentro del flujo de e-commerce.",
        table: [
          { id: "GET", feature: "/products", scenario: "Obtener la lista de productos disponibles" },
          { id: "GET", feature: "/products/{id}", scenario: "Obtener la información de un producto específico por ID" },
          { id: "PUT", feature: "/products/{id}", scenario: "Actualizar la información de un producto existente" },
          { id: "POST", feature: "/carts/add", scenario: "Crear un carrito de compra con productos" },
          { id: "DELETE", feature: "/carts/{id}", scenario: "Eliminar un carrito de compra existente" }
        ]
      },
      testScenarios: {
        title: "Escenarios de Prueba",
        table: [
          { id: "TS-001", scenario: "Verificar que la API devuelve correctamente la lista de productos" },
          { id: "TS-002", scenario: "Verificar que la API devuelve la información de un producto específico por ID" },
          { id: "TS-003", scenario: "Validar que la API permite actualizar la información de un producto" },
          { id: "TS-004", scenario: "Verificar que se puede crear un carrito con productos" },
          { id: "TS-005", scenario: "Verificar que la API devuelve la lista de carritos existentes" },
          { id: "TS-006", scenario: "Validar la eliminación de un carrito existente" },
          { id: "TS-007", scenario: "Verificar el comportamiento de la API al eliminar un carrito inexistente" }
        ]
      },
      testCases: {
        title: "Casos de Prueba",
        intro: {
          p1: "Se definieron diferentes casos de prueba ejecutados mediante Postman, utilizando métodos HTTP comunes en APIs REST como GET, POST, PUT y DELETE.",
          p2: "Cada test case verifica aspectos clave como códigos de respuesta HTTP, estructura de datos JSON y tiempos de respuesta. Se adjunta en la tabla los detalles de las pruebas realizadas junto con la evidencia de su ejecución."
        },
        table: [
          {
            id: "TC-001",
            feature: "GET /products",
            scenario: "Obtener lista de productos",
            result: "Status code 200 OK - JSON de productos",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Abrir Postman",
                "Crear request GET",
                "Introducir la URL del endpoint",
                "Enviar la solicitud"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-001-get-products.png",
                response: "/img/img-postman-api/tc-001-get-products.png"
              }
            }
          },
          {
            id: "TC-002",
            feature: "GET /products/1",
            scenario: "Obtener producto por ID",
            result: "Status 200 OK - Respuesta JSON - El campo ID = 1",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Crear request GET",
                "Introducir endpoint /products/1",
                "Enviar request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-002-get-products-1.png",
                response: "/img/img-postman-api/tc-002-get-products-1.png"
              }
            }
          },
          {
            id: "TC-003",
            feature: "PUT /products/1",
            scenario: "Actualizar informacion de un producto",
            result: "Status 200 OK - La api devuelve el producto actualizado - El campo title tiene un nuevo valor",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Crear request PUT",
                "Introducir endpoint /products/1",
                "Ir a body -> raw -> JSON",
                "{\"title\": \"Update Product Name\"}",
                "Enviar request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-003-put-update1.png",
                response: "/img/img-postman-api/tc-003-put-update1.png"
              }
            }
          },
          {
            id: "TC-004",
            feature: "GET /products",
            scenario: "Validar que el endpoint responde dentro de un tiempo aceptable",
            result: "Status 200 OK - Tiempo de respuesta < 1000 ms",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Crear request GET",
                "Introducir endpoint /products",
                "Enviar request",
                "Observar tiempo de respuesta"
              ],
              evidence: {
                request: "/img/img-postman-api/TC-004-response-time-products.png",
                response: "/img/img-postman-api/TC-004-response-time-products.png"
              }
            }
          },
          {
            id: "TC-005",
            feature: "POST /carts/add",
            scenario: "Crear un nuevo carrito con productos",
            result: "Status 200 OK - JSON con información de carrito - Presencia de campo id del carrito",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Abrir Postman",
                "Crear request POST",
                "Introducir endpoint /carts/add",
                "Ir a body->raw-> JSON",
                "Introducir el siguiente JSON: {\"userId\": 1, \"products\": [{\"id\": 1, \"quantity\": 2}]}",
                "Enviar request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-005-post-create-cart.png",
                response: "/img/img-postman-api/tc-005-post-create-cart.png"
              }
            }
          },
          {
            id: "TC-006",
            feature: "DELETE /carts/1",
            scenario: "Eliminar carrito existente utilizando ID",
            result: "Status 200 OK - Respuesta JSON confirmación de eliminación",
            status: "pass",
            details: {
              precondition: "-",
              steps: [
                "Crear request DELETE",
                "Introducir endpoint /carts/1",
                "Enviar request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-006-delete-cart.png",
                response: "/img/img-postman-api/tc-006-delete-cart.png"
              }
            }
          },
          {
            id: "TC-007",
            feature: "DELETE /carts/9999",
            scenario: "Eliminar carrito inexistente (Negative Test)",
            result: "Api devuelve error o mensaje que ese producto no existe",
            status: "fail",
            details: {
              precondition: "-",
              steps: [
                "Crear request DELETE",
                "Introducir endpoint /carts/9999",
                "Enviar request"
              ],
              evidence: {
                request: "/img/img-postman-api/tc-007-delete-cart-negative.png",
                response: "/img/img-postman-api/tc-007-delete-cart-negative.png"
              }
            }
          }
        ]
      },
      automations: {
        title: "Automatizaciones Postman",
        description: "Se añadieron validaciones automáticas en Postman para verificar automáticamente el status code, la estructura de la respuesta y el tiempo de respuesta.",
        items: [
          {
            title: "Status code",
            code: "pm.test(\"Status code is 200\", function () {\n    pm.response.to.have.status(200);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-status-code.png"
          },
          {
            title: "Validación de productos",
            code: "pm.test(\"Products length is 5\", function () {\n    const response = pm.response.json();\n    pm.expect(response.products.length).to.eql(5);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-limit-parameter.png"
          },
          {
            title: "Tiempo de respuesta",
            code: "pm.test(\"Response time is less than 1000ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(1000);\n});",
            language: "JavaScript",
            evidence: "/img/img-postman-api/aut-time-response.png"
          }
        ]
      },
    },
    ecommerce_testing: {
      title: "E-commerce Testing",
      subtitle: "Pruebas manuales de una plataforma de e-commerce para validar interacciones clave de compra.",
      description: "Proyecto de pruebas manuales aplicado a una plataforma de e-commerce. Se diseñaron escenarios y casos de prueba para validar funcionalidades claves como login, navegación de productos, gestión del carrito y checkout. Durante el proceso de testing se identificaron defectos funcionales y posibles mejoras en la experiencia de usuario.",
      objective: "El objetivo principal de estas pruebas fue identificar problemas potenciales y asegurar que el flujo de compra funcione correctamente desde el inicio de sesión hasta la confirmación del pedido.",
      platformLabel: "ENTORNO",
      platform: "Dispositivo: Laptop HP\nSistema operativo: Windows 11 Home\nNavegador: Chrome\nWeb: https://www.saucedemo.com/\nTipo de pruebas: Manual Testing\nConectividad: Wi-Fi",
      features: [],
      testingStrategyTitle: "ESTRATEGIA DE TESTING",
      testingStrategyList: [
        { name: "Functional Testing", description: "Validación de las funcionalidades principales del ecommerce." },
        { name: "Exploratory Testing", description: "Exploración del sistema para detectar comportamientos inesperados." },
        { name: "UI Testing", description: "Verificación de la correcta visualización y funcionamiento de la interfaz." },
        { name: "Validation Testing", description: "Pruebas con datos inválidos o incompletos para validar los mensajes de error." }
      ],
      testScenariosTitle: "ESCENARIOS DE PRUEBA",
      testScenariosDesc: "Para garantizar la calidad de la plataforma de e-commerce, se definieron varios escenarios de prueba que cubren los flujos de usuario más críticos, desde el descubrimiento de productos hasta el proceso final de pago.",
      testScenariosIdHeader: "id escenario",
      testScenariosFeatureHeader: "Escenario",
      testScenariosScenarioHeader: "Casos de prueba",
      testScenariosTable: [
        { id: "TS-001", feature: "Login", scenario: "login válido / login inválido" },
        { id: "TS-002", feature: "Productos", scenario: "ver catálogo / ver detalle" },
        { id: "TS-003", feature: "Carrito", scenario: "agregar producto / eliminar producto" },
        { id: "TS-004", feature: "Carrito", scenario: "persistencia del carrito" },
        { id: "TS-005", feature: "Checkout", scenario: "checkout válido / checkout con errores" }
      ],
      testScenariosFooter: "",
      testCasesSummary: {
        title: "RESUMEN DE CASOS DE PRUEBA",
        headers: ["Escenario", "Test Case", "Funcionalidad", "Estado", "Bug Detectado"],
        table: [
          { scenario: "TS-001", testCase: "TC-001", functionality: "Login válido", status: "Paso", bug: "-" },
          { scenario: "TS-001", testCase: "TC-002", functionality: "Login inválido", status: "Paso", bug: "-" },
          { scenario: "TS-002", testCase: "TC-003", functionality: "Ver catálogo", status: "Fallo", bug: "BUG-002, BUG-004" },
          { scenario: "TS-002", testCase: "TC-004", functionality: "Ver detalle", status: "Paso", bug: "-" },
          { scenario: "TS-003", testCase: "TC-005", functionality: "Agregar producto", status: "Fallo", bug: "BUG-003" },
          { scenario: "TS-003", testCase: "TC-006", functionality: "Agregar múltiples", status: "Paso", bug: "-" },
          { scenario: "TS-003", testCase: "TC-007", functionality: "Eliminar producto", status: "Paso", bug: "-" },
          { scenario: "TS-004", testCase: "TC-008", functionality: "Carrito vacío", status: "Fallo", bug: "BUG-001" },
          { scenario: "TS-005", testCase: "TC-009", functionality: "Checkout válido", status: "Pass", bug: "-" },
          { scenario: "TS-005", testCase: "TC-010", functionality: "Checkout inválido", status: "Pass", bug: "-" }
        ]
      },
      testCasesDesc: "A partir de los escenarios de prueba definidos previamente se diseñaron los siguientes casos de prueba para validar el comportamiento de las funcionalidades principales de la app.",
      testCasesTable: [
        {
          id: "TC-001",
          feature: "Login",
          scenario: "Login con credenciales válidas",
          result: "El usuario accede correctamente al catálogo de productos",
          status: "pass",
          details: {
            precondition: "El usuario se encuentra en la página de login.\nuser: standard_user\npass: secret_sauce",
            steps: [
              "Ingresar el nombre de usuario válido",
              "Ingresar la contraseña válida",
              "Presionar el botón Login"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-001-login.png"
            }
          }
        },
        {
          id: "TC-002",
          feature: "Login",
          scenario: "Login con contraseña incorrecta",
          result: "El sistema muestra un mensaje de error indicando que las credenciales son incorrectas",
          status: "pass",
          details: {
            precondition: "El usuario se encuentra en la página de login.\nuser: standard_user\npass: user_12345",
            steps: [
              "Ingresar un nombre de usuario válido",
              "Ingresar una contraseña incorrecta",
              "Presionar el botón Login"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-002-pass-incorrecta.png"
            }
          }
        },
        {
          id: "TC-003",
          feature: "Productos",
          scenario: "Visualizar lista de productos",
          result: "El sistema muestra la lista de productos disponibles",
          status: "fail",
          details: {
            precondition: "El usuario ha iniciado sesión correctamente.",
            steps: [
              "Iniciar sesión en la aplicación",
              "Acceder a la página de productos"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-003-catalogo.png"
            }
          }
        },
        {
          id: "TC-004",
          feature: "Productos",
          scenario: "Visualizar detalle de producto",
          result: "El sistema muestra la información detallada del producto seleccionado",
          status: "pass",
          details: {
            precondition: "El usuario ha iniciado sesión.",
            steps: [
              "Acceder al catálogo de productos",
              "Seleccionar un producto de la lista"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-004-info-producto.png"
            }
          }
        },
        {
          id: "TC-005",
          feature: "Carrito",
          scenario: "Agregar producto al carrito",
          result: "El producto se agrega correctamente al carrito de compras",
          status: "fail",
          details: {
            precondition: "El usuario ha iniciado sesión.",
            steps: [
              "Acceder al catálogo de productos",
              "Seleccionar un producto",
              "Presionar el botón Add to cart"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-005-agregar-producto.png"
            }
          }
        },
        {
          id: "TC-006",
          feature: "Carrito",
          scenario: "Agregar múltiples productos al carrito",
          result: "El carrito muestra todos los productos agregados",
          status: "pass",
          details: {
            precondition: "El usuario ha iniciado sesión.",
            steps: [
              "Acceder al catálogo de productos",
              "Agregar un producto al carrito",
              "Agregar un segundo producto al carrito",
              "Acceder al carrito de compras"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-006-agregar-producto2.png"
            }
          }
        },
        {
          id: "TC-007",
          feature: "Carrito",
          scenario: "Eliminar producto del carrito",
          result: "El producto se elimina correctamente del carrito",
          status: "pass",
          details: {
            precondition: "El usuario tiene al menos un producto en el carrito.",
            steps: [
              "Acceder al carrito de compras",
              "Localizar el producto agregado",
              "Presionar el botón Remove"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-007-eliminar-producto.png"
            }
          }
        },
        {
          id: "TC-008",
          feature: "Carrito",
          scenario: "Verificar carrito vacío después de eliminar productos",
          result: "El carrito aparece vacío",
          status: "fail",
          details: {
            precondition: "El usuario tiene productos en el carrito.",
            steps: [
              "Acceder al carrito de compras",
              "Eliminar todos los productos",
              "Verificar el estado del carrito"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-008-carrito-vacio.png"
            }
          }
        },
        {
          id: "TC-009",
          feature: "Checkout",
          scenario: "Checkout con datos válidos",
          result: "El sistema muestra una confirmación de compra exitosa",
          status: "pass",
          details: {
            precondition: "El usuario tiene al menos un producto en el carrito.",
            steps: [
              "Acceder al carrito de compras",
              "Presionar el botón Checkout",
              "Ingresar nombre, apellido y código postal",
              "Presionar Continue",
              "Confirmar la compra"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-009-Checkout.mp4"
            }
          }
        },
        {
          id: "TC-010",
          feature: "Checkout",
          scenario: "Checkout con campos obligatorios vacíos",
          result: "El sistema muestra un mensaje de error indicando que los campos obligatorios deben completarse",
          status: "pass",
          details: {
            precondition: "El usuario tiene productos en el carrito.",
            steps: [
              "Acceder al carrito",
              "Presionar Checkout",
              "Dejar uno o más campos obligatorios vacíos",
              "Presionar Continue"
            ],
            evidence: {
              response: "/img/img-saucedemo/TC-010-Checkout-campo-vacio.mp4"
            }
          }
        }
      ],
      bugsTitle: "REPORTE DE BUGS",
      bugsDescription: "",
      bugsList: [
        {
          id: "BUG-001",
          testCaseId: "TC-008",
          title: "El carrito no muestra mensaje cuando queda vacío",
          severity: "Medium",
          type: "UI / Feedback",
          description: "Cuando el usuario elimina todos los productos del carrito de compras, la página queda vacía y no muestra ningún mensaje indicando que el carrito está vacío. Esto puede generar confusión en el usuario, ya que no hay feedback visual que indique el estado actual del carrito.",
          steps: [
            "Iniciar sesión en la aplicación",
            "Agregar uno o más productos al carrito",
            "Acceder al carrito de compras",
            "Eliminar todos los productos del carrito"
          ],
          expected: "El sistema debería mostrar un mensaje indicando que el carrito está vacío (Ejemplo: 'Your cart is empty').",
          actual: "El carrito queda vacío sin mostrar ningún mensaje o indicación visual del estado.",
          evidence: "/img/img-saucedemo/TC-008-carrito-vacio.png"
        },
        {
          id: "BUG-002",
          testCaseId: "TC-003",
          title: "Distorsión de imágenes de producto en vista móvil",
          severity: "Medium",
          type: "UI / Responsive",
          description: "En la versión móvil del sitio, las imágenes de los productos no mantienen su proporción original y aparecen visualmente distorsionadas. Esto provoca que las imágenes se vean aplastadas verticalmente, afectando la presentación del producto.",
          steps: [
            "Acceder al sitio en vista móvil o usar el modo responsive del navegador",
            "Iniciar sesión en la aplicación",
            "Navegar al catálogo de productos",
            "Observar las imágenes de los productos"
          ],
          expected: "Las imágenes deberían mantener su proporción original y adaptarse correctamente al contenedor sin deformarse.",
          actual: "Las imágenes aparecen aplastadas verticalmente, perdiendo su proporción original.",
          environment: "Dispositivo: Simulación móvil (Samsung Galaxy S20 Ultra)\nNavegador: Google Chrome\nTipo de prueba: Responsive testing",
          evidence: "/img/img-saucedemo/TC-003-catalogo.png"
        },
        {
          id: "BUG-003",
          testCaseId: "Exploratory testing / UI review",
          title: "Espacio vacío excesivo en la vista del carrito",
          severity: "Low",
          type: "UI / Layout",
          description: "En la vista del carrito de compras se observa un espacio vacío considerable entre la descripción del producto y los botones de acción. Esto genera una distribución visual poco equilibrada.",
          steps: [
            "Iniciar sesión en la aplicación",
            "Agregar uno o más productos al carrito",
            "Acceder a la página del carrito",
            "Observar la separación entre la descripción del producto y los botones de acción"
          ],
          expected: "La interfaz debería mantener una distribución equilibrada, con una separación adecuada entre los elementos.",
          actual: "Existe un espacio vacío excesivo entre la descripción del producto y los botones.",
          evidence: "/img/img-saucedemo/TC-008-carrito-vacio.png"
        },
        {
          id: "BUG-004",
          testCaseId: "TC-003",
          title: "Navegación inconsistente hacia el catálogo de productos",
          severity: "Medium",
          type: "Navegación / UX",
          description: "Después de acceder al carrito de compras, el usuario no puede volver fácilmente al catálogo completo de productos utilizando el enlace 'All Items' del menú lateral.",
          steps: [
            "Iniciar sesión en la aplicación",
            "Agregar productos al carrito",
            "Acceder al carrito de compras",
            "Abrir el menú lateral",
            "Seleccionar 'All Items'"
          ],
          expected: "El sistema debería redirigir al usuario nuevamente al catálogo completo de productos.",
          actual: "La navegación no devuelve correctamente al listado de productos.",
          evidence: "/img/img-saucedemo/TC-003-catalogo.png"
        }
      ],
      uxImprovements: [
        "Implementar una función de “Recordarme” en la página de inicio de sesión para facilitar el acceso a usuarios frecuentes.",
        "Agregar botón para mostrar/ocultar contraseña para ayudar a los usuarios a verificar su entrada.",
        "Agregar una barra de búsqueda en el catálogo de productos para permitir a los usuarios encontrar artículos específicos rápidamente.",
        "Permitir agregar múltiples unidades del mismo producto al carrito.",
        "Incluir reseñas y calificaciones de productos para proporcionar información adicional que ayude a los usuarios a tomar decisiones de compra.",
        "Implementar validación en tiempo real en el formulario de checkout.",
        "Agregar una nueva sección en el menú lateral llamada 'Mis pedidos' o 'Historial de compras'.",
        "Agregar la imagen del producto junto al nombre y la descripción dentro del carrito de compras."
      ]
    },
    ux_audit: {
      title: "UX & Accesibilidad",
      subtitle: "Análisis de usabilidad y accesibilidad sobre el sitio web de Ryanair.es",
      description: "Auditoría de UX y accesibilidad sobre el sitio web de Ryanair, evaluando tres páginas críticas del flujo de reserva: home, resultados de vuelos y proceso de checkout. El análisis combinó evaluación heurística basada en las 10 heurísticas de Nielsen con pruebas automatizadas de accesibilidad mediante Axe DevTools bajo el estándar WCAG 2.1 AA.",
      buttons: ["Axe DevTools", "Chrome DevTools", "WCAG 2.1 AA"],
      objective: "Identificar barreras de accesibilidad, problemas de usabilidad y oportunidades de mejora en el flujo principal de reserva de vuelos, con foco en el impacto real sobre el usuario.",
      platform: "Web Desktop y Mobile",
      statsTable: {
        title: "INCIDENCIAS DETECTADAS",
        headers: ["Página", "Total", "Críticos", "Graves", "Moderados"],
        rows: [
          ["Home", "34", "0", "9", "24"],
          ["Resultados de vuelos", "20", "0", "2", "18"],
          ["Checkout - Equipaje", "38", "12", "5", "21"],
          ["Total", "92", "12", "16", "63"]
        ]
      },
      testingStrategyTitle: "ESTRATEGIA DE TESTING",
      testingStrategyList: [
        { name: "Evaluación Heurística", description: "Evaluación de las 10 heurísticas de Nielsen sobre los flujos principales: búsqueda, selección de vuelo y checkout." },
        { name: "Accesibilidad", description: "Escaneo automatizado con Axe DevTools (WCAG 2.1 AA) en las tres páginas críticas del flujo de reserva." },
        { name: "Testing Exploratorio", description: "Navegación libre por el flujo completo de reserva para detectar comportamientos inesperados no cubiertos por los escaneos automáticos." },
        { name: "Testing Funcional", description: "Validación del flujo end-to-end: búsqueda → selección de vuelo → selección de equipaje, verificando consistencia entre pasos." }
      ],
      testScenariosTable: {
        title: "ESCENARIO DE PRUEBA",
        table: [
          { id: "TS-001", feature: "Accesibilidad", scenario: "Escaneo Axe DevTools en home", objective: "Detectar incidencias WCAG 2.1 AA en la página principal", precondition: "Chrome actualizado. Axe DevTools 4.11.1 instalado y activo.", priority: "Crítico" },
          { id: "TS-002", feature: "Accesibilidad", scenario: "Escaneo Axe DevTools en checkout", objective: "Detectar incidencias WCAG 2.1 AA en el flujo de pago (pasos 1 al 3)", precondition: "Chrome. Axe DevTools instalado. Búsqueda de vuelo realizada previamente.", priority: "Crítico" },
          { id: "TS-003", feature: "Keyboard", scenario: "Navegación con Tab en home", objective: "Verificar visibilidad del foco y orden lógico de tabulación en home", precondition: "Chrome. Sin extensiones que modifiquen estilos. Home cargada.", priority: "Crítico" },
          { id: "TS-004", feature: "Keyboard", scenario: "Navegación con Tab en resultados y checkout", objective: "Verificar que el foco es visible y funcional en todo el flujo de reserva", precondition: "Búsqueda ejecutada. Resultados visibles.", priority: "Crítico" },
          { id: "TS-005", feature: "Keyboard", scenario: "Comportamiento del modal de login con teclado", objective: "Verificar que el modal se cierra con Escape y el foco retorna al elemento disparador", precondition: "Chrome. Home cargada. Usuario sin sesión iniciada.", priority: "Crítico" },
          { id: "TS-006", feature: "Estructura", scenario: "Estructura semántica: headings y landmarks en home, resultados y checkout", objective: "Verificar jerarquía H1–H6 lógica sin duplicados, y presencia de landmark <main> en todas las páginas", precondition: "Chrome. DevTools abierto. Extensión de análisis de headers. Acceso a las 3 páginas.", priority: "Crítico" },
          { id: "TS-007", feature: "Localización", scenario: "Idioma del video de asistencia especial", objective: "Verificar que el video se muestra en el idioma de la interfaz", precondition: "Interfaz configurada en español (es-ES). Sección asistencia especial accesible.", priority: "Alto" },
          { id: "TS-008", feature: "Localización", scenario: "Idioma del menú de navegación", objective: "Verificar que todas las opciones del menú están traducidas al idioma de la interfaz", precondition: "Interfaz configurada en español (es-ES). Home cargada.", priority: "Alto" },
          { id: "TS-009", feature: "Usabilidad", scenario: "Flujo de selección de origen y destino", objective: "Verificar que el buscador guía al usuario claramente en la selección de destino", precondition: "Home cargada. Buscador de vuelos visible.", priority: "Alto" },
          { id: "TS-010", feature: "Usabilidad", scenario: "Consistencia de contenido en la home", objective: "Verificar que no existen secciones duplicadas ni nomenclatura inconsistente", precondition: "Home cargada completamente. Sin caché.", priority: "Medio" },
          { id: "TS-011", feature: "Funcional", scenario: "Carga y elementos principales de la home", objective: "Validar que logo, buscador y menú se cargan y son interactuables", precondition: "Chrome. Conexión activa. Sin sesión iniciada.", priority: "Crítico" },
          { id: "TS-012", feature: "Funcional", scenario: "Buscador de vuelos — selección de fechas", objective: "Validar que el calendario permite seleccionar fechas de ida y vuelta", precondition: "Home cargada. Buscador visible.", priority: "Crítico" },
          { id: "TS-013", feature: "Funcional", scenario: "Menú principal — despliegue y navegación", objective: "Validar que el menú 'Planear' se despliega y sus ítems son navegables", precondition: "Home cargada. Menú visible en header.", priority: "Alto" },
          { id: "TS-014", feature: "Funcional", scenario: "Resultados de búsqueda de vuelos", objective: "Validar que se muestran vuelos con precios y que los filtros responden", precondition: "Búsqueda origen/destino/fecha ejecutada desde home.", priority: "Crítico" }
        ]
      },
      testCasesTitle: "CASOS DE PRUEBA",
      testCases: [
        {
          id: "TC-001", scenarioId: "TS-001", feature: "Accesibilidad",
          scenario: "Ejecutar Axe DevTools en home bajo WCAG 2.1 AA",
          status: "fail", bug: "BUG-001",
          result: "0 incidencias críticas o graves bajo WCAG 2.1 AA.",
          details: {
            precondition: "Chrome actualizado. Axe DevTools 4.11.1 instalado. Home cargada sin caché.",
            steps: [
              "Abrir ryanair.com/es/es",
              "Esperar carga completa",
              "Abrir Axe DevTools → 'Visión general'",
              "Clic en 'Volver a ejecutar el escaneo'",
              "Revisar panel de resultados — filtrar por Grave y Moderado"
            ],
            testData: "Chrome 120+\nAxe DevTools 4.11.1\nWCAG 2.1 AA activado\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-002", scenarioId: "TS-005", feature: "Keyboard",
          scenario: "Abrir modal de login y cerrar con Escape",
          status: "fail", bug: "BUG-011",
          result: "El modal se cierra al presionar Escape. El foco retorna automáticamente al botón disparador (WCAG 2.1 SC 2.4.3).",
          details: {
            precondition: "Chrome. Home cargada. Sin sesión iniciada.",
            steps: [
              "Ir a home de Ryanair",
              "Clic en 'Iniciar sesión'",
              "Verificar que el modal se abre",
              "Presionar Escape",
              "Verificar cierre del modal",
              "Verificar que el foco retorna al botón 'Iniciar sesión'"
            ],
            testData: "Chrome\nSesión: no iniciada\nNavegación: solo teclado"
          }
        },
        {
          id: "TC-003", scenarioId: "TS-001", feature: "Accesibilidad",
          scenario: "Validar contraste de textos, botones y enlaces en home",
          status: "fail", bug: "BUG-002 / BUG-010",
          result: "Todos los textos cumplen ratio mínimo 4.5:1. Los enlaces se distinguen sin depender solo del color.",
          details: {
            precondition: "Chrome. Axe DevTools instalado. Home cargada.",
            steps: [
              "Ejecutar Axe DevTools en home",
              "Filtrar por 'color-contrast' y 'link-in-text-block'",
              "Identificar elementos marcados como fallo",
              "Verificar botón 'Buscar': inspeccionar color con DevTools Color Picker",
              "Verificar ratio con WebAIM Contrast Checker"
            ],
            testData: "Chrome\nAxe DevTools\nDevTools Color Picker\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-004", scenarioId: "TS-003", feature: "Keyboard",
          scenario: "Verificar orden de tabulación en home",
          status: "fail", bug: "BUG-012",
          result: "El foco sigue orden lógico y predecible. Outline visible en todos los elementos interactivos.",
          details: {
            precondition: "Chrome sin extensiones que modifiquen CSS. Home cargada.",
            steps: [
              "Presionar Tab desde la barra de URL",
              "Documentar el orden de foco elemento a elemento",
              "Verificar outline visible en cada paso",
              "Verificar orden lógico: header → buscador → contenido → footer"
            ],
            testData: "Chrome\nCSS: nativo sin modificar\nPágina: home completa"
          }
        },
        {
          id: "TC-005", scenarioId: "TS-008", feature: "Localización",
          scenario: "Verificar opciones del menú 'Planear' en español",
          status: "fail", bug: "BUG-004",
          result: "Todas las opciones del menú 'Planear' están en español. No se muestra texto en inglés.",
          details: {
            precondition: "Interfaz en es-ES. Home cargada.",
            steps: [
              "Abrir home en español",
              "Clic en 'Planear' en el header",
              "Revisar cada opción del submenú (sección EXPLORAR y EXTRAS DE VIAJE)",
              "Identificar cualquier texto en otro idioma"
            ],
            testData: "Idioma: es-ES\nChrome\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-006", scenarioId: "TS-009", feature: "Usabilidad",
          scenario: "Seleccionar destino en buscador y verificar jerarquía de opciones",
          status: "fail", bug: "BUG-005",
          result: "El selector guía claramente al usuario. Los países deshabilitados tienen una explicación visible.",
          details: {
            precondition: "Home cargada. Buscador visible. Origen: Barcelona-El Prat.",
            steps: [
              "Clic en campo 'Destino'",
              "Observar el selector desplegado",
              "Identificar países en gris (deshabilitados)",
              "Intentar clic en un país gris (ej: Chipre)",
              "Verificar si hay mensaje explicativo"
            ],
            testData: "Chrome\nOrigen: Barcelona-El Prat\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-007", scenarioId: "TS-006", feature: "Estructura",
          scenario: "Verificar jerarquía de headings y landmark en home, resultados y checkout",
          status: "fail", bug: "BUG-006 / BUG-007 / BUG-009",
          result: "1 H1 por página. Jerarquía lógica sin saltos. Elemento <main> presente en cada página.",
          details: {
            precondition: "Chrome. DevTools + extensión de análisis de headers. Acceso a las 3 páginas.",
            steps: [
              "Abrir home → activar extensión headers → anotar conteo H1-H6",
              "Ejecutar Axe → filtrar 'landmark' → verificar presencia de <main>",
              "Repetir en página de resultados",
              "Repetir en checkout paso 1"
            ],
            testData: "Chrome\nExtensión: SEO Meta in 1 Click\nAxe DevTools\nPáginas: home + resultados + checkout"
          }
        },
        {
          id: "TC-008", scenarioId: "TS-007", feature: "Localización",
          scenario: "Verificar idioma del video de asistencia especial",
          status: "fail", bug: "BUG-008",
          result: "El video se muestra en español. El texto superpuesto y subtítulos están en español.",
          details: {
            precondition: "Interfaz en es-ES. Sección asistencia especial accesible.",
            steps: [
              "Navegar a help.ryanair.com → Asistencia especial",
              "Localizar el video 'Reservar asistencia especial'",
              "Reproducir el video",
              "Observar idioma del texto superpuesto y subtítulos"
            ],
            testData: "Idioma: es-ES\nChrome\nURL: help.ryanair.com/hc/es-es/.../Asistencia-especial"
          }
        },
        {
          id: "TC-009", scenarioId: "TS-001", feature: "Accesibilidad",
          scenario: "Validar texto alternativo en imágenes y banners de home",
          status: "fail", bug: "BUG-003",
          result: "Imágenes informativas con alt descriptivo. Banners con información relevante expuesta como texto accesible.",
          details: {
            precondition: "Chrome. Axe DevTools instalado. Home cargada.",
            steps: [
              "Ejecutar Axe DevTools → filtrar por 'image-alt'",
              "Inspeccionar banner principal con DevTools",
              "Verificar atributo alt en imágenes de destinos",
              "Verificar banners: ¿el texto está en el DOM o solo en la imagen?"
            ],
            testData: "Chrome\nAxe DevTools\nDevTools Inspector\nURL: ryanair.com/es/es"
          }
        },
        {
          id: "TC-010", scenarioId: "TS-011", feature: "Funcional",
          scenario: "Verificar carga de la home",
          status: "pass", bug: "-",
          result: "Logo, buscador y menú visibles y funcionales sin errores bloqueantes.",
          details: {
            precondition: "Chrome. Conexión activa. Sin sesión.",
            steps: [
              "Abrir ryanair.com/es/es",
              "Esperar carga completa",
              "Verificar logo, buscador y menú visibles",
              "Verificar que el menú responde al clic"
            ],
            testData: "Chrome\nConexión: normal\nSesión: no iniciada"
          }
        },
        {
          id: "TC-011", scenarioId: "TS-012", feature: "Funcional",
          scenario: "Verificar selector de fechas del buscador",
          status: "pass", bug: "-",
          result: "Calendario funcional. Fechas de ida y vuelta seleccionables y visibles en campos.",
          details: {
            precondition: "Home cargada. Buscador visible.",
            steps: [
              "Clic en campo de fecha",
              "Verificar apertura del calendario",
              "Seleccionar fecha de ida",
              "Seleccionar fecha de vuelta",
              "Verificar que ambas fechas se muestran en los campos"
            ],
            testData: "Chrome\nFechas: futuras (>7 días)"
          }
        },
        {
          id: "TC-012", scenarioId: "TS-014", feature: "Funcional",
          scenario: "Verificar resultados de búsqueda de vuelos",
          status: "pass", bug: "-",
          result: "Vuelos disponibles con precios. Filtros funcionales.",
          details: {
            precondition: "Origen, destino y fechas seleccionados.",
            steps: [
              "Completar buscador: Madrid → Londres",
              "Clic en 'Buscar'",
              "Verificar carga de resultados",
              "Verificar vuelos con precios visibles",
              "Verificar que los filtros responden"
            ],
            testData: "Chrome\nRuta: MAD → LGW\nFecha: próximos 30 días"
          }
        },
        {
          id: "TC-013", scenarioId: "TS-013", feature: "Funcional",
          scenario: "Verificar despliegue del menú principal",
          status: "pass", bug: "-",
          result: "Menú 'Planear' se despliega. Ítems navegables y funcionales.",
          details: {
            precondition: "Home cargada. Menú visible en header.",
            steps: [
              "Clic en 'Planear'",
              "Verificar que el submenú se despliega",
              "Clic en un ítem",
              "Verificar navegación correcta"
            ],
            testData: "Chrome\nIdioma: es-ES"
          }
        }
      ],
      bugsTitle: "REPORTE DE BUGS",
      bugs: [
        {
          id: "BUG-001",
          testCaseId: "TS-001 / TC-001",
          title: "34 incidencias de accesibilidad detectadas en home",
          severity: "High",
          description: "Axe detecta 34 incidencias: 9 graves, 24 moderadas, 1 leve. Incluye: ARIA commands must have an accessible name (1), Links must be distinguishable without relying on color (1), Links must have discernible text (1), Interactive controls must not be nested (6), Headings should not be empty (1), Document should have one main landmark (1).",
          precondition: "Chrome. Axe DevTools 4.11.1 instalado. Home ryanair.com/es/es cargada.",
          steps: [
            "Abrir ryanair.com/es/es en Chrome",
            "Abrir Axe DevTools → Visión general",
            "Clic en 'Volver a ejecutar el escaneo'",
            "Revisar panel de resultados"
          ],
          expected: "0 incidencias automáticas bajo WCAG 2.1 AA.",
          actual: "Axe detecta 34 incidencias: 9 graves, 24 moderadas, 1 leve.",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-002",
          testCaseId: "TS-001 / TC-003",
          title: "Links no distinguibles sin depender del color",
          severity: "High",
          description: "Axe reporta 1 incidencia: al menos un enlace de la home solo se diferencia del texto circundante por el color, sin subrayado ni ningún otro indicador visual.",
          precondition: "Chrome. Axe DevTools instalado. Home cargada.",
          steps: [
            "Ejecutar Axe DevTools en home",
            "Expandir incidencia 'Links must be distinguishable without relying on color'",
            "Identificar el elemento afectado",
            "Verificar visualmente si el enlace tiene indicador distinto al color"
          ],
          expected: "Los enlaces se diferencian del texto normal mediante subrayado u otro indicador visual además del color (WCAG 2.1 SC 1.4.1).",
          actual: "Axe reporta 1 incidencia: al menos un enlace de la home solo se diferencia del texto circundante por el color.",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-003",
          testCaseId: "TS-001 / TC-009",
          title: "Banners con texto informativo embebido en imagen sin alternativa accesible",
          severity: "High",
          description: "El banner muestra texto promocional embebido en imagen: 'ESTANCIAS POR MENOS DE 99 € POR NOCHE', etiquetas laterales ('ALQUILER DE COCHES', 'RYANAIR ROOMS', 'AVISO IMPORTANTE', 'TRASLADOS PRIVADOS') sin texto alternativo equivalente accesible.",
          precondition: "Chrome. Home ryanair.com/es/es cargada completamente.",
          steps: [
            "Abrir ryanair.com/es/es",
            "Visualizar el banner principal rotativo",
            "Observar el texto visible dentro de las imágenes",
            "Inspeccionar con DevTools si ese texto existe en el del DOM"
          ],
          expected: "La información relevante del banner está disponible como texto en el DOM o en un atributo alt descriptivo.",
          actual: "El banner muestra texto promocional embebido en imagen sin texto alternativo equivalente accessible.",
          evidence: "/img/img-ryanair/BUG-003-home-banners.png"
        },
        {
          id: "BUG-004",
          testCaseId: "TS-008 / TC-005",
          title: "'Try Somewhere New' y 'Travel Agent Direct' en inglés en menú en español",
          severity: "Medium",
          description: "Los ítems 'Try Somewhere New' y 'Travel Agent Direct' aparecen en inglés dentro del submenú 'EXPLORAR', mientras que todos los demás ítems están en español.",
          precondition: "Interfaz configurada en es-ES. Home cargada.",
          steps: [
            "Abrir ryanair.com/es/es en español",
            "Clic en 'Planear' en el header",
            "Revisar submenú sección 'EXPLORAR'",
            "Localizar ítems en inglés"
          ],
          expected: "Todos los ítems del menú 'Planear' están traducidos al español.",
          actual: "Los ítems 'Try Somewhere New' y 'Travel Agent Direct' aparecen en inglés.",
          evidence: "/img/img-ryanair/BUG-004-home-menu-en.png"
        },
        {
          id: "BUG-005",
          testCaseId: "TS-009 / TC-006",
          title: "Países deshabilitados en selector de destino sin explicación visible",
          severity: "High",
          description: "10+ países aparecen en gris claro (Chipre, Finlandia, Bosnia & Herzegovina, Montenegro, Noruega, Países Bajos, Rumanía, Serbia, Suiza, Turquía) sin ningún mensaje ni indicación de por qué están deshabilitados.",
          precondition: "Home cargada. Origen: Barcelona-El Prat. Buscador de vuelos visible.",
          steps: [
            "Clic en campo 'Destino'",
            "Observar la lista de países",
            "Identificar países en gris claro",
            "Intentar clic en un país gris (ej: Chipre, Finlandia)",
            "Verificar si hay mensaje explicativo"
          ],
          expected: "Los países sin vuelos disponibles están claramente señalizados con un mensaje o tooltip que explica el motivo.",
          actual: "10+ países deshabilitados sin ningún mensaje ni indicación.",
          evidence: "/img/img-ryanair/BUG-005-home-seleccionar-destino.png"
        },
        {
          id: "BUG-006",
          testCaseId: "TS-006 / TC-007",
          title: "Documento sin landmark principal <main> definido",
          severity: "Medium",
          description: "Axe reporta 'Document should have one main landmark' (1 incidencia). El documento no define una región principal, impidiendo que usuarios de screen reader salten al contenido directo.",
          precondition: "Chrome. Axe DevTools instalado. Home cargada.",
          steps: [
            "Ejecutar Axe DevTools en home",
            "Localizar incidencia 'Document should have one main landmark'",
            "Inspeccionar HTML con DevTools: buscar <main> o role='main'"
          ],
          expected: "El documento tiene exactamente un elemento <main> que delimita el contenido principal.",
          actual: "Axe reporta 'Document should have one main landmark' (1 incidencia).",
          evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
        },
        {
          id: "BUG-007",
          testCaseId: "TS-006 / TC-007",
          title: "Home con 4 elementos H1 — jerarquía de headings incorrecta",
          severity: "High",
          description: "La home contiene 4 elementos H1 (último detectado: 'Regístrate y ahorra'). Conteo completo: H1:4 · H2:22 · H3:1 · H4:0 · H5:0 · H6:0.",
          precondition: "Chrome. Home ryanair.com/es/es cargada. Extensión SEO Meta in 1 Click activa.",
          steps: [
            "Abrir ryanair.com/es/es",
            "Activar extensión de análisis de headers",
            "Ir a pestaña 'HEADERS'",
            "Revisar conteo y lista de headings"
          ],
          expected: "Exactamente 1 H1 por página. Jerarquía lógica y continua (H1 → H2 → H3).",
          actual: "La home contiene 4 elementos H1.",
          evidence: "/img/img-ryanair/BUG-007-home-headers.png"
        },
        {
          id: "BUG-008",
          testCaseId: "TS-007 / TC-008",
          title: "Video de asistencia especial en catalán con interfaz en español",
          severity: "Medium",
          description: "El video se muestra íntegramente en catalán: título 'VIATGE ASSISTIT', texto '48 HORES ABANS DE LA SORTIDA' y subtítulos 'Pots pre-reservar-la al nostre web fins a quaranta-vuit hores abans del vol.'",
          precondition: "Interfaz en es-ES. URL: help.ryanair.com → Asistencia especial.",
          steps: [
            "Navegar a la sección Asistencia especial del Centro de ayuda",
            "Localizar el video 'Reservar asistencia especial'",
            "Reproducir el video",
            "Observar el idioma del texto superpuesto y subtítulos"
          ],
          expected: "El video se muestra en español al tener la interfaz configurada en es-ES.",
          actual: "El video se muestra íntegramente en catalán.",
          evidence: "/img/img-ryanair/BUG-008-soporte-ryanair-ES.png"
        },
        {
          id: "BUG-009",
          testCaseId: "TS-006 / TC-007",
          title: "Checkout sin H1 ni H2 — jerarquía comienza en H3",
          severity: "High",
          description: "Checkout sin ningún H1 ni H2. Conteo: H1:0 · H2:0 · H3:4 · H4:5. La jerarquía comienza en H3: 'Tus vuelos seleccionados', 'Tu tarifa seleccionada', 'Inicia sesión en myRyanair', 'Pasajeros'.",
          precondition: "Búsqueda ejecutada. Vuelo seleccionado. Checkout paso 'Vuelos' cargado.",
          steps: [
            "Ejecutar búsqueda y seleccionar vuelo",
            "Acceder al checkout",
            "Activar extensión de análisis de headers",
            "Revisar pestaña 'HEADERS'"
          ],
          expected: "Al menos 1 H1 en la página de checkout. Jerarquía lógica.",
          actual: "Checkout sin ningún H1 ni H2.",
          evidence: "/img/img-ryanair/checkout-headers.png"
        },
        {
          id: "BUG-010",
          testCaseId: "TS-001 / TC-003",
          title: "Contraste del botón 'Buscar' requiere verificación formal",
          severity: "Medium",
          description: "El botón 'Buscar' tiene color RGB (217, 181, 46) — amarillo #D9B52E. Este color requiere verificación formal del ratio de contraste con el texto superpuesto para confirmar cumplimiento WCAG.",
          precondition: "Chrome. Home ryanair.com/es en vista responsive. DevTools abierto.",
          steps: [
            "Inspeccionar botón 'Buscar' con DevTools",
            "Abrir Color Picker en panel Estilos",
            "Registrar valores RGB del color",
            "Verificar ratio en WebAIM Contrast Checker"
          ],
          expected: "El botón 'Buscar' cumple ratio mínimo de 4.5:1 entre texto y fondo (WCAG 2.1 SC 1.4.3).",
          actual: "El botón 'Buscar' tiene color RGB (217, 181, 46) — amarillo #D9B52E.",
          evidence: "/img/img-ryanair/color-ratio.png"
        },
        {
          id: "BUG-011",
          testCaseId: "TS-005 / TC-002",
          title: "Modal de login no responde a la tecla Escape",
          severity: "High",
          description: "Al presionar Escape con el modal de login abierto, el modal permanece abierto. La tecla Escape no tiene ningún efecto. El usuario no puede cerrar el modal sin usar el ratón.",
          precondition: "Chrome. Home cargada. Usuario sin sesión iniciada.",
          steps: [
            "1. Ir a home de Ryanair",
            "2. Clic en 'Iniciar sesión'",
            "3. Verificar que el modal se abre",
            "4. Presionar la tecla Escape",
            "5. Observar si el modal se cierra"
          ],
          expected: "El modal se cierra al presionar Escape. El foco retorna al botón 'Iniciar sesión' (WCAG 2.1 SC 2.4.3).",
          actual: "Al presionar Escape con el modal de login abierto, el modal permanece abierto.",
          evidence: ""
        },
        {
          id: "BUG-012",
          testCaseId: "TS-003 / TC-004",
          title: "Orden de tabulación en home no sigue lógica visual",
          severity: "High",
          description: "El orden de tabulación realiza saltos no predecibles. Algunos elementos interactivos no reciben foco al navegar con Tab, y el outline no es visible en todos los elementos afectados.",
          precondition: "Chrome sin extensiones que modifiquen CSS. Home cargada en ventana completa.",
          steps: [
            "Presionar Tab desde la barra de URL",
            "Documentar el orden en que cada elemento recibe el foco",
            "Comparar con el orden visual de la página (izq→der, arriba→abajo)",
            "Identificar saltos o elementos omitidos"
          ],
          expected: "El foco recorre todos los elementos interactivos en orden lógico y predecible: header → buscador → contenido → footer.",
          actual: "El orden de tabulación realiza saltos no predecibles.",
          evidence: ""
        }
      ],
      uxImprovementsTitle: "MEJORAS DE UX",
      uxImprovements: [
        "Jerarquía Visual en Home: Reducir la cantidad de elementos que compiten por la atención para centrar al usuario en el buscador.",
        "Indicador de Progreso: Añadir un indicador claro de pasos en el flujo de checkout para reducir la ansiedad del usuario.",
        "Mensajes de Error Específicos: En lugar de 'Datos inválidos', especificar qué campo está mal y por qué.",
        "Rediseño de Flujo de Extras: Evitar 'dark patterns' que ocultan la opción de continuar sin añadir servicios.",
        "Corrección de Contraste: Actualizar la paleta de colores corporativos o los colores de texto para cumplir con estándares de accesibilidad."
      ]
    }
  }
};
