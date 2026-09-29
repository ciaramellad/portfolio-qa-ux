// Datos reales del caso de estudio DAILY App, extraídos de portfolio-qa-ux.
// Evidencia real copiada localmente en img/daily/.
const DAILY = {
  es: {
    title: "DAILY – App",
    subtitle: "Aplicación de gestión financiera multimoneda diseñada para centralizar cuentas, registrar transacciones y visualizar balances en tiempo real.",
    description: "DAILY es una aplicación personal que desarrollé para resolver mi propia necesidad de gestión financiera multimoneda. La uso activamente para mi control de gastos, y apliqué sobre ella un proceso completo de testing manual — diseño de casos de prueba, testing funcional, exploratorio y de casos límite — para asegurar su calidad antes y durante el uso diario.",
    objective: "Validar el correcto funcionamiento de los flujos principales de la aplicación, asegurando la consistencia de los balances financieros y una experiencia de usuario clara en dispositivos móviles.",
    platform: "PWA (Progressive Web App), publicada en Vercel, optimizada para Android e iOS.",
    scope: [
      "Autenticación (PIN / huella)",
      "CRUD de transacciones (gastos e ingresos)",
      "Gestión de cuentas y presupuestos",
      "Módulo de viajes y deudas",
      "Dashboard y gráficos",
      "Validaciones y manejo de errores",
      "Soporte multimoneda"
    ],
    strategy: [
      { name: "Functional Testing", description: "Validación de flujos críticos: transacciones, balances, presupuestos y deudas." },
      { name: "Exploratory Testing", description: "Uso diario real para detectar comportamientos inesperados en flujos secundarios." },
      { name: "UI Testing", description: "Visualización correcta de componentes, formularios y feedback en mobile." },
      { name: "Edge Case Testing", description: "Escenarios límite: montos vacíos, cero, datos incompletos en formularios." }
    ],
    scenariosDesc: "A partir de las funcionalidades principales de la aplicación se definieron diferentes escenarios de prueba para validar los flujos críticos del sistema.",
    scenarios: [
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
    casesDesc: "Cada caso de prueba está vinculado a su escenario correspondiente. Los estados reflejan los resultados obtenidos durante la ejecución.",
    cases: [
      { id: "TC-001", feature: "Registrar un nuevo gasto asociado a una cuenta", result: "El gasto se guarda correctamente. El balance pasa de $2000 a $1500.", status: "fail", bug: "BUG-002" },
      { id: "TC-002", feature: "Registrar un ingreso y verificar impacto en balance", result: "El ingreso se registra correctamente. El balance pasa de $1000 a $4000.", status: "pass" },
      { id: "TC-003", feature: "Crear nueva cuenta en moneda EUR", result: "La cuenta se crea correctamente con símbolo € y no genera cambios en otras cuentas.", status: "pass" },
      { id: "TC-004", feature: "Gasto en USD no afecta totales de EUR y ARS", result: "Solo USD se actualiza. EUR y ARS permanecen sin cambios.", status: "pass" },
      { id: "TC-005", feature: "Verificar representación del símbolo EUR en el sistema", result: "El sistema muestra correctamente el símbolo € en todos los componentes.", status: "fail", bug: "BUG-004" },
      { id: "TC-006", feature: "Gasto asociado a viaje y actualización de progreso", result: "El gasto se asocia correctamente. El total pasa a €250 (50%).", status: "fail", bug: "BUG-003" },
      { id: "TC-007", feature: "Superar presupuesto de viaje y validar feedback", result: "El sistema muestra alerta al superar el presupuesto ($1050).", status: "fail", bug: "BUG-006" },
      { id: "TC-008", feature: "Registrar deuda “Me deben”", result: "La deuda se registra correctamente en la vista “Me deben”.", status: "pass" },
      { id: "TC-009", feature: "Cálculo de porcentaje de presupuesto mensual", result: "El sistema calcula correctamente el porcentaje (90%).", status: "pass" },
      { id: "TC-010", feature: "Validación de campo monto vacío", result: "El sistema bloquea la acción, muestra error y no guarda datos.", status: "fail", bug: "BUG-005" },
      { id: "TC-011", feature: "Validar autenticación con PIN incorrecto", result: "El sistema bloquea acceso y muestra mensaje claro de error.", status: "fail", bug: "BUG-001" }
    ],
    bugsDescription: "Se identificaron y documentaron los siguientes defectos críticos durante la ejecución de las pruebas.",
    bugs: [
      { id: "BUG-001", title: "Falta de feedback al ingresar PIN incorrecto", severity: "Medium", type: "Autenticación", description: "Precondición: Usuario con PIN configurado. [TS-001 / TC-011]", expected: "El sistema bloquea el acceso y muestra un mensaje claro indicando que el PIN es incorrecto.", actual: "El acceso es bloqueado pero no se muestra ningún mensaje de error.", evidence: "img/daily/BUG-001-PIN-incorrecto.mp4" },
      { id: "BUG-002", title: "Desincronización temporal de datos en dashboard", severity: "Low", type: "Dashboard", description: "Precondición: Usuario autenticado con cuentas activas. [TS-003 / TC-001]", expected: "El dashboard refleja inmediatamente el cambio en los balances.", actual: "Algunos valores tardan en actualizarse hasta refrescar la vista.", evidence: "img/daily/daily-mockup-funciones.jpeg" },
      { id: "BUG-003", title: "No se pueden editar gastos desde la vista de viajes", severity: "High", type: "Viajes", description: "Precondición: Usuario con viaje activo y gastos registrados. [TS-006 / TC-006]", expected: "El usuario puede editar el gasto desde la vista de viajes.", actual: "No es posible editar el gasto desde esa vista.", evidence: "img/daily/BUG-003 - Viajes-Editar gatsos.jpeg" },
      { id: "BUG-004", title: "Símbolo de moneda incorrecto en dashboard (EUR)", severity: "Medium", type: "Visual / Dashboard", description: "Precondición: Usuario con cuenta en EUR. [TS-005 / TC-005]", expected: "El sistema muestra el símbolo “€” correctamente.", actual: "El sistema muestra “$” en lugar de “€” en algunos componentes.", evidence: "img/daily/BUG-004-Error moneda.jpeg" },
      { id: "BUG-005", title: "Se permite guardar transacción con monto de 0", severity: "High", type: "Validación", description: "Precondición: Usuario autenticado con cuenta activa. [TS-010 / TC-010]", expected: "El sistema bloquea la acción y muestra mensaje de error.", actual: "La transacción se guarda con monto 0 generando un comportamiento inconsistente.", evidence: "img/daily/BUG-005-gasto-monto-0.jpeg" },
      { id: "BUG-006", title: "Falta de alerta clara al superar presupuesto de viaje", severity: "Medium", type: "UX / Alertas", description: "Precondición: Viaje activo con presupuesto cercano al límite. [TS-007 / TC-007]", expected: "El sistema muestra una alerta clara indicando que se superó el presupuesto.", actual: "El sistema permite la operación pero no muestra feedback claro o visible.", evidence: "img/daily/BUG-006-Viajes-presupuesto-alerta.jpeg" }
    ],
    uxImprovements: [
      "Feedback y estado del sistema: al completar una operación (registrar gasto, crear cuenta, saldar deuda), la app no confirma visualmente que la acción se realizó. Un mensaje breve o micro-animación reduciría la incertidumbre del usuario y prevendría registros duplicados.",
      "Perfiles de usuario: la app actualmente no diferencia usuarios. Incorporar un perfil básico permitiría personalizar preferencias (moneda por defecto, categorías frecuentes) y abriría la puerta a funcionalidades multiusuario.",
      "Creación de cuentas personalizadas: permitir crear cuentas o billeteras virtuales con nombre, moneda e ícono propios haría la app adaptable a distintos contextos financieros.",
      "Transferencias entre cuentas: hoy mover fondos entre cuentas requiere registrar un egreso en una y un ingreso en otra manualmente. Una transferencia directa reduciría errores.",
      "Filtrado inteligente por moneda: al registrar una transacción, mostrar solo las cuentas que coinciden con la moneda seleccionada evitaría errores de asignación.",
      "Autenticación mejorada: incorporar inicio de sesión con Google y autenticación biométrica simplificaría el onboarding y reforzaría la seguridad del acceso."
    ],
    labels: {
      description: "DESCRIPCIÓN", objective: "OBJETIVO", platform: "PLATAFORMA", scope: "ALCANCE DEL TESTING",
      strategy: "ESTRATEGIA DE TESTING", scenarios: "ESCENARIOS DE PRUEBA", cases: "CASOS DE PRUEBA", bugs: "BUGS DETECTADOS", ux: "MEJORAS DE UX",
      thId: "ID", thFeature: "Funcionalidad", thScenario: "Escenario", thObjective: "Objetivo", thPriority: "Prioridad", thResult: "Resultado", thStatus: "Estado",
      critical: "Crítico", pass: "Pasa", fail: "Falla", expected: "Esperado", actual: "Obtenido", evidence: "Ver evidencia", contact: "Contáctame"
    }
  },
  en: {
    title: "DAILY – App",
    subtitle: "Multi-currency financial management application designed to centralize accounts, record transactions, and visualize balances in real time.",
    description: "DAILY is a personal application I developed to solve my own need for multi-currency financial management. I actively use it to track my own expenses, and I applied a full manual testing process to it — test case design, functional, exploratory, and edge-case testing — to ensure its quality before and during daily use.",
    objective: "Validate the correct functioning of the application's main flows, ensuring financial balance consistency and a clear user experience on mobile devices.",
    platform: "PWA (Progressive Web App), published on Vercel, optimized for Android and iOS.",
    scope: [
      "Authentication (PIN / fingerprint)",
      "Transaction CRUD (expenses and income)",
      "Account and budget management",
      "Travel and debt module",
      "Dashboard and charts",
      "Validations and error handling",
      "Multi-currency support"
    ],
    strategy: [
      { name: "Functional Testing", description: "Validation of critical flows: transactions, balances, budgets, and debts." },
      { name: "Exploratory Testing", description: "Real daily use to detect unexpected behaviors in secondary flows." },
      { name: "UI Testing", description: "Correct visualization of components, forms, and feedback on mobile." },
      { name: "Edge Case Testing", description: "Limit scenarios: empty amounts, zero, incomplete data in forms." }
    ],
    scenariosDesc: "Based on the main functionalities of the application, different test scenarios were defined to validate the critical flows of the system.",
    scenarios: [
      { id: "TS-001", feature: "Authentication", scenario: "Access via PIN or biometrics", objective: "Validate correct authentication and handling of invalid attempts with clear feedback", priority: "Critical" },
      { id: "TS-002", feature: "Accounts", scenario: "Multi-currency account management", objective: "Verify account creation and data consistency between currencies", priority: "Critical" },
      { id: "TS-003", feature: "Transactions", scenario: "Transaction recording", objective: "Validate impact of income and expenses on balances and views", priority: "Critical" },
      { id: "TS-004", feature: "Multi-currency", scenario: "Totals by currency", objective: "Verify independence of calculations between currencies", priority: "Critical" },
      { id: "TS-005", feature: "Dashboard", scenario: "Visual data representation", objective: "Validate currency symbols and visual consistency", priority: "Serious" },
      { id: "TS-006", feature: "Travels", scenario: "Travel management", objective: "Verify expense association and progress update", priority: "Serious" },
      { id: "TS-007", feature: "Travels", scenario: "Trip budget", objective: "Validate behavior when exceeding limits and UX feedback", priority: "Critical" },
      { id: "TS-008", feature: "Debts", scenario: "Debt management", objective: "Validate correct recording and visualization of debts", priority: "Serious" },
      { id: "TS-009", feature: "Budgets", scenario: "Monthly budget", objective: "Verify calculation of accumulated spending and percentage", priority: "Serious" },
      { id: "TS-010", feature: "Validations", scenario: "Input validations", objective: "Validate handling of invalid data without inconsistencies", priority: "Critical" }
    ],
    casesDesc: "Each test case is linked to its corresponding scenario. The statuses reflect the results obtained during execution.",
    cases: [
      { id: "TC-001", feature: "Register a new expense associated with an account", result: "Expense saved correctly. Balance goes from $2000 to $1500.", status: "fail", bug: "BUG-002" },
      { id: "TC-002", feature: "Register an income and verify balance impact", result: "Income registered correctly. Balance goes from $1000 to $4000.", status: "pass" },
      { id: "TC-003", feature: "Create new account in EUR", result: "Account created correctly with € symbol and no impact on other accounts.", status: "pass" },
      { id: "TC-004", feature: "USD expense does not affect EUR and ARS totals", result: "Only USD total updates. EUR and ARS remain unchanged.", status: "pass" },
      { id: "TC-005", feature: "Verify EUR symbol representation in the system", result: "System correctly shows € symbol in all components.", status: "fail", bug: "BUG-004" },
      { id: "TC-006", feature: "Expense associated with trip and progress update", result: "Expense correctly linked. Total updates to €250 (50%).", status: "fail", bug: "BUG-003" },
      { id: "TC-007", feature: "Exceed trip budget and validate feedback", result: "System shows alert when exceeding budget ($1050).", status: "fail", bug: "BUG-006" },
      { id: "TC-008", feature: "Register “They Owe Me” debt", result: "Debt registered correctly in the “They Owe Me” view.", status: "pass" },
      { id: "TC-009", feature: "Monthly budget usage percentage calculation", result: "System correctly calculates percentage (90%).", status: "pass" },
      { id: "TC-010", feature: "Empty amount field validation", result: "System blocks action, shows error and does not save data.", status: "fail", bug: "BUG-005" },
      { id: "TC-011", feature: "Validate authentication with incorrect PIN", result: "System blocks access and shows clear error message.", status: "fail", bug: "BUG-001" }
    ],
    bugsDescription: "The following critical defects were identified and documented during the testing execution.",
    bugs: [
      { id: "BUG-001", title: "Missing feedback when entering incorrect PIN", severity: "Medium", type: "Authentication", description: "Precondition: User with configured PIN. [TS-001 / TC-011]", expected: "The system blocks access and shows a clear message indicating that the PIN is incorrect.", actual: "Access is blocked but no error message is displayed.", evidence: "img/daily/BUG-001-PIN-incorrecto.mp4" },
      { id: "BUG-002", title: "Temporal data desynchronization on dashboard", severity: "Low", type: "Dashboard", description: "Precondition: Authenticated user with active accounts. [TS-003 / TC-001]", expected: "The dashboard immediately reflects the change in balances.", actual: "Some values take time to update until the view is manually refreshed.", evidence: "img/daily/daily-mockup-funciones.jpeg" },
      { id: "BUG-003", title: "Expenses cannot be edited from trip view", severity: "High", type: "Travels", description: "Precondition: User with active trip and registered expenses. [TS-006 / TC-006]", expected: "The user can edit the expense from the trip view.", actual: "It is not possible to edit the expense from that view.", evidence: "img/daily/BUG-003 - Viajes-Editar gatsos.jpeg" },
      { id: "BUG-004", title: "Incorrect currency symbol on dashboard (EUR)", severity: "Medium", type: "Visual / Dashboard", description: "Precondition: User with EUR account. [TS-005 / TC-005]", expected: "The system displays the “€” symbol correctly.", actual: "The system displays “$” instead of “€” in some components.", evidence: "img/daily/BUG-004-Error moneda.jpeg" },
      { id: "BUG-005", title: "Saving transaction with empty amount is allowed", severity: "High", type: "Validation", description: "Precondition: Authenticated user with active account. [TS-010 / TC-010]", expected: "The system blocks the action and shows an error message.", actual: "The transaction is saved without an amount or generates inconsistent behavior.", evidence: "img/daily/BUG-005-gasto-monto-0.jpeg" },
      { id: "BUG-006", title: "Missing clear alert when exceeding trip budget", severity: "Medium", type: "UX / Alerts", description: "Precondition: Active trip with budget close to the limit. [TS-007 / TC-007]", expected: "The system shows a clear alert indicating that the budget has been exceeded.", actual: "The system allows the operation but does not show clear or visible feedback.", evidence: "img/daily/BUG-006-Viajes-presupuesto-alerta.jpeg" }
    ],
    uxImprovements: [
      "Feedback and system status: when completing an operation (registering an expense, creating an account, settling a debt), the app does not visually confirm that the action was performed. A brief message or micro-animation would reduce user uncertainty and prevent duplicate registrations.",
      "User profiles: the app currently does not differentiate between users. Incorporating a basic profile would allow personalizing preferences and open the door to multi-user functionalities in the future.",
      "Custom account creation: allowing the user to create accounts or virtual wallets with their own name, currency, and icon would make the app adaptable to different financial contexts.",
      "Transfers between accounts: today, moving funds between accounts requires manually registering an expense in one and an income in another. A direct transfer functionality would reduce errors.",
      "Smart filtering by currency: showing only the accounts that match the selected currency would avoid assignment errors and make the flow faster.",
      "Improved authentication: incorporating Google login and biometric authentication would simplify onboarding and reinforce access security."
    ],
    labels: {
      description: "DESCRIPTION", objective: "OBJECTIVE", platform: "PLATFORM", scope: "TESTING SCOPE",
      strategy: "TESTING STRATEGY", scenarios: "TEST SCENARIOS", cases: "TEST CASES", bugs: "BUG REPORTS", ux: "UX IMPROVEMENTS",
      thId: "ID", thFeature: "Feature", thScenario: "Scenario", thObjective: "Objective", thPriority: "Priority", thResult: "Result", thStatus: "Status",
      critical: "Critical", pass: "Pass", fail: "Fail", expected: "Expected", actual: "Actual", evidence: "View evidence", contact: "Contact me"
    }
  }
};
