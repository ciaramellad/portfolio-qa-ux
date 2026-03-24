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
    heroTitle: "Daiana Ciaramella",
    heroSub: "QA MANUAL TESTER | UX-ORIENTED",
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
        desc: "A personal finance app designed to practice functional testing, exploratory testing, and user flow validation in a real-world environment.",
        img: "/img/onus-proyectouxui.png"
      },
      { title: "Grinplug", desc: "Visual regression testing and performance optimization for a global retail platform.", img: "/img/grinplug-proyectouxui.png" },
      { title: "Uminti", desc: "End-to-end testing of real-time interactions and data visualization for an educational system.", img: "/img/uminti-proyectouxui.png" },
      { title: "Game On!", desc: "A community-driven app for women's football, facilitating match organization and player networking.", img: "/img/app-futfem.png" }
    ],
    qaProjects: [
      {
        title: "DAILY APP",
        description: "Personal multi-currency financial application that I developed to manage ARS, USD, and EUR simultaneously — a real problem with no solution on the market. Tested under real daily use conditions.",
        link: "/proyectos-qa/daily_app"
      },
      {
        title: "API Testing with Postman",
        description: "Validation of an e-commerce REST API using Postman, verifying endpoints for products and shopping carts, HTTP responses, and error handling.",
        link: "/proyectos-qa/testing-api-postman"
      },
      {
        title: "E-commerce Testing",
        description: "Analysis and functional testing of an e-commerce purchase flow, validating user registration, shopping cart, and checkout.",
        link: "/proyectos-qa/ecommerce-testing"
      },
      {
        title: "UX & Accessibility",
        description: "Accessibility and usability evaluation of the Ryanair website using Axe DevTools, identifying accessibility barriers, visual inconsistencies, and navigation problems that impact the user experience.",
        link: "/ux-testing"
      }
    ],
    daily_app: {
      title: "DAILY APP",
      subtitle: "Personal financial management application designed to track expenses and income across multiple bank accounts.",
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
        { id: "TS-001", feature: "Authentication", scenario: "Access to the application via PIN or fingerprint", objective: "Validate that the user can correctly access the application" },
        { id: "TS-002", feature: "Accounts", scenario: "Creation and management of multiple accounts", objective: "Verify that the system allows registering bank accounts and wallets in different currencies" },
        { id: "TS-003", feature: "Transactions", scenario: "Recording expenses and income in an account", objective: "Validate that each operation correctly updates the balance of the corresponding account" },
        { id: "TS-004", feature: "Multi-currency", scenario: "Updating totals by currency in dashboard", objective: "Verify that ARS, USD, and EUR totals are updated independently and correctly" },
        { id: "TS-005", feature: "Dashboard", scenario: "Visual consistency of data and currency symbols", objective: "Verify that charts show the correct symbol according to the currency of each account" },
        { id: "TS-006", feature: "Travels", scenario: "Recording expenses within an active trip", objective: "Verify that each expense is associated with the trip and updates the total and progress bar" },
        { id: "TS-007", feature: "Travels", scenario: "Exceeding a trip's budget", objective: "Verify system behavior when total spending exceeds the defined limit" },
        { id: "TS-008", feature: "Debts", scenario: "Recording in I Owe / They Owe Me views", objective: "Validate that each debt appears in the correct view with associated amount and note" },
        { id: "TS-009", feature: "Budgets", scenario: "Monthly budget creation with limit", objective: "Validate the calculation of accumulated spending and behavior when approaching the limit" },
        { id: "TS-010", feature: "Validations", scenario: "Recording transactions with incomplete data", objective: "Verify system behavior in the face of empty fields or invalid data" }
      ],
      testScenariosFooter: "",
      testCasesDesc: "Each test case is linked to its corresponding scenario. The statuses reflect the results obtained during execution.",
      testCasesTable: [
        {
          id: "TC-001",
          scenarioId: "TS-003",
          feature: "Transactions",
          scenario: "Register a new expense associated with an account",
          result: "The expense is saved and the balance is updated correctly",
          status: "pass",
          details: {
            precondition: "The user has at least one registered account.",
            steps: [
              "Open the application",
              "Select 'Add expense'",
              "Enter amount",
              "Select account",
              "Confirm operation"
            ]
          }
        },
        { id: "TC-002", scenarioId: "TS-003", feature: "Transactions", scenario: "Register an income in an existing account", result: "The income is reflected correctly in the balance", status: "pass" },
        { id: "TC-003", scenarioId: "TS-002", feature: "Accounts", scenario: "Create a new bank account in EUR currency", result: "The account is created and appears in the list with the correct symbol", status: "pass" },
        { id: "TC-004", scenarioId: "TS-004", feature: "Dashboard", scenario: "Register expense in USD and verify that EUR and ARS totals do not change", result: "Each total is updated only in its corresponding currency", status: "pass" },
        { id: "TC-005", scenarioId: "TS-005", feature: "Dashboard", scenario: "Verify currency symbol in EUR account chart", result: "The value must show \"€\" and not \"$\"", status: "fail", bug: "BUG-002" },
        { id: "TC-006", scenarioId: "TS-006", feature: "Travels", scenario: "Register expense within an active trip and verify account linking", result: "The expense is associated with the trip and the progress bar is updated", status: "pass" },
        { id: "TC-007", scenarioId: "TS-007", feature: "Travels", scenario: "Register expenses until exceeding the trip budget", result: "The system actively notifies that the limit was exceeded", status: "fail", bug: "BUG-001" },
        { id: "TC-008", scenarioId: "TS-008", feature: "Debts", scenario: "Register debt in \"They Owe Me\" with amount and note", result: "The debt appears in the correct view with all data visible", status: "pass" },
        { id: "TC-009", scenarioId: "TS-009", feature: "Budgets", scenario: "Create monthly budget and register expenses up to the limit", result: "The system correctly calculates the accumulated and reflects the percentage", status: "pass" },
        { id: "TC-010", scenarioId: "TS-010", feature: "Validations", scenario: "Register expense with empty amount field", result: "The system shows validation message indicating the field is required", status: "fail", bug: "BUG-005" }
      ],
      bugsTitle: "BUG REPORTS",
      bugsDescription: "The following critical defects were identified and documented during the testing execution.",
      bugs: [
        {
          id: "BUG-001",
          title: "Missing feedback when entering incorrect PIN",
          severity: "Medium",
          type: "Validation / Error handling",
          description: "When entering an incorrect PIN on the authentication screen, the application correctly blocks access but does not show any message indicating that the PIN is invalid.",
          steps: ["Open the application", "Enter an incorrect PIN", "Confirm access"],
          expected: 'The system should show a message indicating that the entered PIN is incorrect: "Incorrect PIN. Try again."',
          actual: "The application does not show any error message and simply requests to enter the PIN again.",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-002",
          title: "Temporal desynchronization in data visualization",
          severity: "Low",
          type: "UI / Synchronization",
          description: "After registering a new transaction, some interface components may take time to reflect the change immediately.",
          steps: ["Register a new expense", "Return immediately to the dashboard or travel section", "Observe charts or aggregate values"],
          expected: "All system components should update immediately after registering the transaction.",
          actual: "In some cases, the interface may take time to reflect changes until the view is refreshed manually.",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-003",
          title: "Cannot edit expenses from travel view",
          severity: "High",
          type: "Functional",
          description: "Expenses registered within a trip cannot be edited directly from the trips section. To modify an expense, it is necessary to navigate to the bank account from which the transaction was registered.",
          steps: ["Go to Trips section", "Select an existing trip", "Locate a registered expense", "Attempt to edit the expense"],
          expected: "The user should be able to edit the expense directly from the trips section.",
          actual: "Expenses cannot be edited from this view. To modify them, it is necessary to navigate to the corresponding bank account.",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-004",
          title: "Empty expense field without validation message",
          severity: "Medium",
          type: "Validation / Form validation",
          description: "When attempting to register an expense without entering an amount, the application prevents saving the transaction but does not show any message indicating that the field is required.",
          steps: ["Open the application", "Go to Register expense section", "Leave the amount field empty", "Attempt to save the expense"],
          expected: "The system should show a validation message indicating that the field is required.",
          actual: "The system does not allow registering the expense, but does not show any error message or indication to the user about the reason.",
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
          { id: "TS-001", feature: "Accessibility", scenario: "Keyboard navigation (Tab) through the main menu", objective: "Verify that all elements are reachable and have a visible focus indicator." },
          { id: "TS-002", feature: "Accessibility", scenario: "Screen reader (NVDA/VoiceOver) on flight results", objective: "Validate that flight information and prices are announced correctly." },
          { id: "TS-003", feature: "Accessibility", scenario: "Color contrast on critical buttons (CTA)", objective: "Ensure a minimum contrast ratio of 4.5:1 for readability." },
          { id: "TS-004", feature: "Usability", scenario: "Flight search from the home page", objective: "Evaluate the clarity of the date picker and destination selection." },
          { id: "TS-005", feature: "Usability", scenario: "Adding extra luggage in checkout", objective: "Identify friction points or dark patterns in the selection of additional services." },
          { id: "TS-006", feature: "Forms", scenario: "Passenger data entry with invalid characters", objective: "Verify that error messages are clear and help the user correct the data." },
          { id: "TS-007", feature: "Forms", scenario: "Payment process with an expired card", objective: "Validate the system's response and the clarity of the feedback provided." },
          { id: "TS-008", feature: "Navigation", scenario: "Returning to the previous step from checkout", objective: "Verify that the selected data is maintained and the navigation is consistent." }
        ]
      },
      testCasesTitle: "TEST CASES",
      testCases: [
        { id: "TC-001", scenarioId: "TS-001", feature: "Accessibility", scenario: "Run Axe DevTools on home under WCAG 2.1 AA", result: "0 critical or serious issues", status: "fail", bug: "BUG-001" },
        { id: "TC-002", scenarioId: "TS-003", feature: "Accessibility", scenario: "Run Axe DevTools on checkout under WCAG 2.1 AA", result: "0 critical issues", status: "fail", bug: "BUG-002" },
        { id: "TC-003", scenarioId: "TS-008", feature: "Forms", scenario: "Verify that all checkout fields have associated labels", result: "All fields have visible label or aria-label", status: "fail", bug: "BUG-003" },
        { id: "TC-004", scenarioId: "TS-005", feature: "Usability", scenario: "Select a country in the destination search engine", result: "The destination field updates with the selected country", status: "fail", bug: "BUG-004" },
        { id: "TC-005", scenarioId: "TS-006", feature: "Usability", scenario: "Navigate through the booking flow and observe progress indicator", result: "The system clearly shows the current step within the process", status: "fail", bug: "BUG-005" },
        { id: "TC-006", scenarioId: "TS-007", feature: "Usability", scenario: "Attempt to reject all additional options in checkout", result: "User can continue without selecting any extra", status: "pass" },
        { id: "TC-007", scenarioId: "TS-002", feature: "Accessibility", scenario: "Verify that all links have descriptive text in results", result: "No link depends only on color to be identified", status: "fail", bug: "BUG-001" },
        { id: "TC-008", scenarioId: "TS-004", feature: "Usability", scenario: "Complete flight search from home without friction", result: "User completes search in less than 3 interactions", status: "pass" }
      ],
      bugsTitle: "BUGS FOUND",
      bugs: [
        {
          id: "BUG-001",
          testCaseId: "TC-001",
          title: "34 accessibility incidents on home — 9 serious",
          severity: "High",
          type: "Accessibility / WCAG 2.1 AA",
          description: "Axe DevTools scan on home detected 34 automatic incidents, 9 serious. Includes nested interactive controls, content outside landmarks, and non-distinguishable links without color. Lighthouse reports 83/100 in accessibility.",
          steps: ["Access ryanair.com/es/es", "Open Axe DevTools", "Run WCAG 2.1 AA scan", "Observe incident summary"],
          impact: "Users with disabilities may not be able to correctly perceive or operate key elements of the page.",
          expected: "0 critical or serious incidents",
          actual: "34 incidents — 9 serious, 24 moderate, 1 minor",
          evidence: ["/img/img-ryanair/BUG-001-incidencias-home.png", "/img/img-ryanair/BUG-001-lighthouse-accesibilidad.png"]
        },
        {
          id: "BUG-002",
          testCaseId: "TC-002",
          title: "Login modal does not close with ESC key → requires ESC + Enter",
          severity: "High",
          type: "Keyboard / Interaction",
          description: "The 'Log in' modal does not respond to the standard ESC key behavior. It requires the ESC + Enter combination to close, violating WCAG 2.1 criterion 2.1.2.",
          steps: ["Click on 'Log in'", "Wait for the modal to open", "Press the ESC key", "Observe if the modal closes"],
          impact: "Users who depend on the keyboard to navigate cannot close the modal in a standard way, which generates a partial 'keyboard trap'.",
          expected: "The modal closes by pressing only ESC",
          actual: "The modal remains open. It only closes with ESC + Enter",
          evidence: "/img/img-ryanair/BUG-003-home-banners.png"
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
    about: "Sobre mí",
    projectsQA: "Proyectos QA",
    projectsUX: "Proyectos UX UI",
    skills: "Habilidades",
    contact: "Contáctame!",
    heroTitle: "Daiana Ciaramella",
    heroSub: "QA MANUAL TESTER | ORIENTADA A UX",
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
    visualProjectsTitle: "CASOS DE ESTUDIO UX UI",
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
        desc: "Caso de estudio y proyecto personal de testing manual sobre una aplicación web de gestión de finanzas personales.",
        img: "/img/onus-proyectouxui.png"
      },
      { title: "Grinplug", desc: "Pruebas de regresión visual y optimización de rendimiento para retail global.", img: "/img/grinplug-proyectouxui.png" },
      { title: "Uminti", desc: "Pruebas de extremo a extremo de interacciones en tiempo real y visualización de datos.", img: "/img/uminti-proyectouxui.png" },
      { title: "HAY EQUIPO! - app", desc: "Aplicación diseñada para mujeres apasionadas por el fútbol, que facilita la organización de partidos y fomenta la creación de comunidad entre jugadoras.", img: "/img/app-futfem.png" }
    ],
    qaProjects: [
      {
        title: "Daily - app",
        description: "Aplicación financiera personal multimoneda que desarrollé para gestionar ARS, USD y EUR en simultáneo — un problema real sin solución en el mercado. Testeada en condiciones de uso diario real.",
        link: "/proyectos-qa/daily_app"
      },
      {
        title: "Testing de API con Postman",
        description: "Validación de una API REST de e-commerce mediante Postman, verificando endpoints de productos y carritos, respuestas HTTP y manejo de errores.",
        link: "/proyectos-qa/testing-api-postman"
      },
      {
        title: "E-commerce Testing",
        description: "Análisis y testing funcional del flujo de compra de un e-commerce, validando registro de usuario, carrito de compras, proceso de checkout y manejo de errores.",
        link: "/proyectos-qa/ecommerce-testing"
      },
      {
        title: "UX & Accesibilidad",
        description: "Evaluación de accesibilidad y usabilidad del sitio web de Ryanair mediante Axe DevTools, identificando barreras de accesibilidad, inconsistencias visuales y problemas de navegación que impactan la experiencia del usuario.",
        link: "/ux-testing"
      }
    ],
    daily_app: {
      title: "Daily - app",
      subtitle: "Aplicación personal de gestión financiera diseñada para controlar gastos e ingresos en múltiples cuentas bancarias.",
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
        { id: "TS-001", feature: "Autenticación", scenario: "Acceso a la aplicación mediante PIN o huella", objective: "Validar que el usuario pueda acceder correctamente a la aplicación" },
        { id: "TS-002", feature: "Cuentas", scenario: "Creación y gestión de múltiples cuentas", objective: "Verificar que el sistema permita registrar cuentas bancarias y billeteras en distintas monedas" },
        { id: "TS-003", feature: "Transacciones", scenario: "Registro de gastos e ingresos en una cuenta", objective: "Validar que cada operación actualiza correctamente el balance de la cuenta correspondiente" },
        { id: "TS-004", feature: "Multimoneda", scenario: "Actualización de totales por moneda en dashboard", objective: "Verificar que los totales de ARS, USD y EUR se actualizan de forma independiente y correcta" },
        { id: "TS-005", feature: "Dashboard", scenario: "Consistencia visual de datos y símbolos de moneda", objective: "Verificar que los gráficos muestran el símbolo correcto según la moneda de cada cuenta" },
        { id: "TS-006", feature: "Viajes", scenario: "Registro de gastos dentro de un viaje activo", objective: "Verificar que cada gasto se asocia al viaje y actualiza el total y la barra de progreso" },
        { id: "TS-007", feature: "Viajes", scenario: "Superación del presupuesto de un viaje", objective: "Verificar el comportamiento del sistema cuando el gasto total supera el límite definido" },
        { id: "TS-008", feature: "Deudas", scenario: "Registro en vistas Debo / Me deben", objective: "Validar que cada deuda aparece en la vista correcta con monto y nota asociados" },
        { id: "TS-009", feature: "Presupuestos", scenario: "Creación de presupuesto mensual con límite", objective: "Validar el cálculo del gasto acumulado y el comportamiento al acercarse al límite" },
        { id: "TS-010", feature: "Validaciones", scenario: "Registro de transacciones con datos incompletos", objective: "Verificar el comportamiento del sistema ante campos vacíos o datos inválidos" }
      ],
      testScenariosFooter: "",
      testCasesDesc: "Cada caso de prueba está vinculado a su escenario correspondiente. Los estados reflejan los resultados obtenidos durante la ejecución.",
      testCasesTable: [
        {
          id: "TC-001",
          scenarioId: "TS-003",
          feature: "Transacciones",
          scenario: "Registrar un nuevo gasto asociado a una cuenta",
          result: "El gasto se guarda y el balance se actualiza correctamente",
          status: "pass",
          details: {
            precondition: "El usuario tiene al menos una cuenta registrada.",
            steps: [
              "Abrir la aplicación",
              "Seleccionar 'Agregar gasto'",
              "Introducir monto",
              "Seleccionar cuenta",
              "Confirmar operación"
            ]
          }
        },
        { id: "TC-002", scenarioId: "TS-003", feature: "Transacciones", scenario: "Registrar un ingreso en una cuenta existente", result: "El ingreso se refleja correctamente en el balance", status: "pass" },
        { id: "TC-003", scenarioId: "TS-002", feature: "Cuentas", scenario: "Crear una nueva cuenta bancaria en moneda EUR", result: "La cuenta se crea y aparece en la lista con el símbolo correcto", status: "pass" },
        { id: "TC-004", scenarioId: "TS-004", feature: "Dashboard", scenario: "Registrar gasto en USD y verificar que los totales EUR y ARS no cambian", result: "Cada total se actualiza solo en su moneda correspondiente", status: "pass" },
        { id: "TC-005", scenarioId: "TS-005", feature: "Dashboard", scenario: "Verificar símbolo de moneda en gráfico de cuenta EUR", result: "El valor debe mostrar \"€\" y no \"$\"", status: "fail", bug: "BUG-002" },
        { id: "TC-006", scenarioId: "TS-006", feature: "Viajes", scenario: "Registrar gasto dentro de un viaje activo y verificar vinculación a cuenta", result: "El gasto se asocia al viaje y la barra de progreso se actualiza", status: "pass" },
        { id: "TC-007", scenarioId: "TS-007", feature: "Viajes", scenario: "Registrar gastos hasta superar el presupuesto del viaje", result: "El sistema notifica activamente que se superó el límite", status: "fail", bug: "BUG-001" },
        { id: "TC-008", scenarioId: "TS-008", feature: "Deudas", scenario: "Registrar deuda en \"Me deben\" con monto y nota", result: "La deuda aparece en la vista correcta con todos los datos visibles", status: "pass" },
        { id: "TC-009", scenarioId: "TS-009", feature: "Presupuestos", scenario: "Crear presupuesto mensual y registrar gastos hasta el límite", result: "El sistema calcula correctamente el acumulado y refleja el porcentaje", status: "pass" },
        { id: "TC-010", scenarioId: "TS-010", feature: "Validaciones", scenario: "Registrar gasto con campo monto vacío", result: "El sistema muestra mensaje de validación indicando que el campo es obligatorio", status: "fail", bug: "BUG-005" }
      ],
      bugsTitle: "REPORTES DE BUGS",
      bugsDescription: "Se identificaron y documentaron los siguientes defectos críticos durante la ejecución de las pruebas.",
      bugs: [
        {
          id: "BUG-001",
          title: "Falta de feedback al ingresar PIN incorrecto",
          severity: "Medium",
          type: "Validación / Error handling",
          description: "Al ingresar un PIN incorrecto en la pantalla de autenticación, la aplicación bloquea el acceso correctamente pero no muestra ningún mensaje indicando que el PIN es inválido.",
          steps: ["Abrir la aplicación", "Ingresar un PIN incorrecto", "Confirmar el acceso"],
          expected: 'El sistema debería mostrar un mensaje indicando que el PIN ingresado es incorrecto: "PIN incorrecto. Inténtalo nuevamente."',
          actual: "La aplicación no muestra ningún mensaje de error y simplemente solicita ingresar nuevamente el PIN.",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-002",
          title: "Desincronización temporal en visualización de datos",
          severity: "Low",
          type: "UI / Sincronización",
          description: "Tras registrar una nueva transacción, algunos componentes de la interfaz pueden tardar en reflejar el cambio inmediatamente.",
          steps: ["Registrar un nuevo gasto", "Volver inmediatamente al dashboard o sección de viajes", "Observar gráficos o valores agregados"],
          expected: "Todos los componentes del sistema deberían actualizarse inmediatamente después de registrar la transacción.",
          actual: "En algunos casos la interfaz puede tardar en reflejar los cambios hasta refrescar la vista manualmente.",
          evidence: "/img/img-dailyapp/daily-mockup-funciones.jpeg"
        },
        {
          id: "BUG-003",
          title: "No se pueden editar gastos desde la vista de viaje",
          severity: "High",
          type: "Functional",
          description: "Los gastos registrados dentro de un viaje no pueden editarse directamente desde la sección de viajes. Para modificar un gasto es necesario navegar a la cuenta bancaria desde la que se registró la transacción.",
          steps: ["Ir a la sección Viajes", "Seleccionar un viaje existente", "Localizar un gasto registrado", "Intentar editar el gasto"],
          expected: "El usuario debería poder editar el gasto directamente desde la sección de viajes.",
          actual: "Los gastos no pueden editarse desde esta vista. Para modificarlos es necesario navegar a la cuenta bancaria correspondiente.",
          evidence: "/img/img-dailyapp/daily-edit-dash.jpg"
        },
        {
          id: "BUG-004",
          title: "Campo de gasto vacío sin mensaje de validación",
          severity: "Medium",
          type: "Validation / Form validation",
          description: "Al intentar registrar un gasto sin introducir un monto, la aplicación impide guardar la transacción pero no muestra ningún mensaje indicando que el campo es obligatorio.",
          steps: ["Abrir la aplicación", "Ir a la sección Registrar gasto", "Dejar el campo monto vacío", "Intentar guardar el gasto"],
          expected: "El sistema debería mostrar un mensaje de validación indicando que el campo es obligatorio.",
          actual: "El sistema no permite registrar el gasto, pero no muestra ningún mensaje de error ni indicación al usuario sobre el motivo.",
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
      testScenariosTitle: "ESCENARIO DE PRUEBA",
      testScenariosTable: {
        title: "ESCENARIO DE PRUEBA",
        table: [
          { id: "TS-001", feature: "Accesibilidad", scenario: "Escaneo Axe DevTools en home", objective: "Detectar incidencias WCAG 2.1 AA en la página principal" },
          { id: "TS-002", feature: "Accesibilidad", scenario: "Escaneo Axe DevTools en checkout", objective: "Detectar incidencias WCAG 2.1 AA en el flujo de pago" },
          { id: "TS-003", feature: "Keyboard", scenario: "Navegación con Tab en home", objective: "Verificar visibilidad del foco y orden lógico de tabulación" },
          { id: "TS-004", feature: "Keyboard", scenario: "Navegación con Tab en resultados y checkout", objective: "Verificar que el foco es visible y funcional en el flujo de reserva" },
          { id: "TS-005", feature: "Keyboard", scenario: "Comportamiento del modal de login con teclado", objective: "Verificar que el modal se cierra con una sola tecla (Escape)" },
          { id: "TS-006", feature: "Estructura", scenario: "Jerarquía de encabezados en las tres páginas", objective: "Verificar que la estructura H1-H6 es lógica y sin duplicados" },
          { id: "TS-007", feature: "Localización", scenario: "Idioma del video de asistencia especial", objective: "Verificar que el video se muestra en el idioma de la interfaz" },
          { id: "TS-008", feature: "Localización", scenario: "Idioma del menú de navegación", objective: "Verificar que todas las opciones del menú están traducidas" },
          { id: "TS-009", feature: "Usabilidad", scenario: "Flujo de selección de origen y destino", objective: "Verificar que el buscador guía al usuario claramente" },
          { id: "TS-010", feature: "Usabilidad", scenario: "Consistencia de contenido en la home", objective: "Verificar que no existen secciones duplicadas ni nomenclatura inconsistente" },
          { id: "TS-011", feature: "Funcional", scenario: "Carga y navegación general del sitio", objective: "Validar que los flujos principales funcionan correctamente con el mouse" }
        ]
      },
      testCasesTitle: "CASOS DE PRUEBA",
      testCases: [
        { id: "TC-001", scenarioId: "TS-001", feature: "Accesibilidad", scenario: "Ejecutar Axe DevTools en home bajo WCAG 2.1 AA", result: "0 incidencias críticas o graves", status: "fail", bug: "BUG-001" },
        { id: "TC-002", scenarioId: "TS-005", feature: "Keyboard", scenario: "Abrir modal de login y presionar Escape", result: "El modal se cierra con solo presionar Escape", status: "fail", bug: "BUG-002" },
        { id: "TC-003", scenarioId: "TS-010", feature: "Usabilidad", scenario: "Verificar contenido único y consistente en la home", result: "Cada categoría aparece una única vez con el mismo nombre", status: "fail", bug: "BUG-003" },
        { id: "TC-004", scenarioId: "TS-004", feature: "Keyboard", scenario: "Navegar con Tab en resultados y checkout", result: "El foco es visible y funcional en todo el flujo", status: "fail", bug: "BUG-006" },
        { id: "TC-005", scenarioId: "TS-008", feature: "Localización", scenario: "Verificar opciones del menú \"Planear\" en español", result: "Todas las opciones están traducidas al español", status: "fail", bug: "BUG-004" },
        { id: "TC-006", scenarioId: "TS-009", feature: "Usabilidad", scenario: "Seleccionar origen en buscador y verificar flujo", result: "El campo guía claramente país → aeropuerto", status: "fail", bug: "BUG-005" },
        { id: "TC-007", scenarioId: "TS-006", feature: "Estructura", scenario: "Verificar jerarquía de encabezados", result: "Un H1 por página, jerarquía lógica sin saltos", status: "fail", bug: "BUG-007" },
        { id: "TC-008", scenarioId: "TS-007", feature: "Localización", scenario: "Verificar idioma del video de asistencia especial", result: "El video se muestra en español", status: "fail", bug: "BUG-008" },
        { id: "TC-009", scenarioId: "TS-003", feature: "Keyboard", scenario: "Verificar orden de tabulación en home", result: "El foco sigue un orden lógico y visible", status: "fail", bug: "BUG-009" },
        { id: "TC-010", scenarioId: "TS-011", feature: "Funcional", scenario: "Verificar carga de la home", result: "Logo, buscador y menú visibles y funcionales", status: "pass" },
        { id: "TC-011", scenarioId: "TS-011", feature: "Funcional", scenario: "Verificar selector de fechas", result: "El calendario permite seleccionar fechas correctamente", status: "pass" },
        { id: "TC-012", scenarioId: "TS-011", feature: "Funcional", scenario: "Verificar resultados de búsqueda", result: "Se muestran vuelos con precios correctamente", status: "pass" },
        { id: "TC-013", scenarioId: "TS-011", feature: "Funcional", scenario: "Verificar menú principal", result: "El menú \"Planear\" se despliega correctamente", status: "pass" }
      ],
      bugsTitle: "BUGS ENCONTRADOS",
      bugs: [
        {
          id: "BUG-001",
          testCaseId: "TC-001",
          title: "34 incidencias de accesibilidad en la home — 9 graves",
          severity: "High",
          type: "Accesibilidad / WCAG 2.1 AA",
          description: "El escaneo con Axe DevTools en la home detectó 34 incidencias automáticas, 9 graves. Incluye controles interactivos anidados, contenido fuera de landmarks y links no distinguibles sin color. Lighthouse reporta 83/100 en accesibilidad.",
          steps: ["Acceder a ryanair.com/es/es", "Abrir Axe DevTools", "Ejecutar escaneo WCAG 2.1 AA", "Observar resumen de incidencias"],
          impact: "Usuarios con discapacidad pueden no poder percibir ni operar correctamente elementos clave de la página.",
          expected: "0 incidencias críticas o graves",
          actual: "34 incidencias — 9 graves, 24 moderadas, 1 leve",
          evidence: ["/img/img-ryanair/BUG-001-incidencias-home.png", "/img/img-ryanair/BUG-001-lighthouse-accesibilidad.png"]
        },
        {
          id: "BUG-002",
          testCaseId: "TC-002",
          title: "Modal de login no se cierra con tecla ESC → requiere ESC + Enter",
          severity: "High",
          type: "Keyboard / Interacción",
          description: "El modal de \"Iniciar sesión\" no responde al comportamiento estándar de la tecla ESC. Requiere la combinación ESC + Enter para cerrarse, incumpliendo WCAG 2.1 criterio 2.1.2.",
          steps: ["Hacer clic en \"Iniciar sesión\"", "Esperar que el modal se abra", "Presionar la tecla ESC", "Observar si el modal se cierra"],
          impact: "Usuarios que dependen del teclado para navegar no pueden cerrar el modal de forma estándar, lo que genera una \"trampa de teclado\" parcial.",
          expected: "El modal se cierra al presionar únicamente ESC",
          actual: "El modal permanece abierto. Solo se cierra con ESC + Enter",
          evidence: "/img/img-ryanair/BUG-003-home-banners.png"
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
