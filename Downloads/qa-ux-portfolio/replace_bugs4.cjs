const fs = require('fs');
const path = require('path');

const bugsEs = [
  {
    id: "BUG-001",
    testCaseId: "TS-005 / TC-009",
    title: "Imágenes sin texto alternativo",
    severity: "Medium",
    precondition: "Usuario en home de Ryanair",
    steps: ["Acceder a la home", "Inspeccionar imágenes del contenido", "Revisar atributos alt"],
    expected: "Todas las imágenes deben tener texto alternativo descriptivo",
    actual: "Varias imágenes no contienen atributo alt o no son descriptivas",
    evidence: ["/img/img-ryanair/BUG-001-incidencias-home.png", "/img/img-ryanair/BUG-001-lighthouse-accesibilidad.png"]
  },
  {
    id: "BUG-002",
    testCaseId: "TS-002 / TC-003",
    title: "Links no distinguibles sin depender del color",
    severity: "High",
    precondition: "Usuario en home",
    steps: ["Navegar por enlaces del sitio", "Observar estilos visuales", "Comparar con texto normal"],
    expected: "Los enlaces deben diferenciarse visualmente (subrayado u otro indicador)",
    actual: "Algunos enlaces solo se diferencian por color",
    evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
  },
  {
    id: "BUG-003",
    testCaseId: "TS-005 / TC-009",
    title: "Banners con contenido no accesible",
    severity: "Medium",
    precondition: "Usuario en home",
    steps: ["Visualizar banners principales", "Analizar contenido dentro de imágenes", "Evaluar accesibilidad"],
    expected: "La información del banner debe ser accesible por texto",
    actual: "Información relevante está embebida en imágenes sin alternativa accesible",
    evidence: "/img/img-ryanair/BUG-003-home-banners.png"
  },
  {
    id: "BUG-004",
    testCaseId: "TS-004 / TC-010",
    title: "Cambio de idioma inconsistente en navegación",
    severity: "Medium",
    precondition: "Usuario en home en español",
    steps: ["Abrir menú principal", "Navegar secciones", "Revisar idioma de los textos"],
    expected: "Todo el contenido debe mantenerse en el idioma seleccionado",
    actual: "Se detectan elementos en inglés dentro de la navegación",
    evidence: "/img/img-ryanair/BUG-004-home-menu-en.png"
  },
  {
    id: "BUG-005",
    testCaseId: "TS-001 / TC-001",
    title: "Selector de destino poco claro",
    severity: "High",
    precondition: "Usuario en buscador de vuelos",
    steps: ["Click en campo destino", "Abrir selector", "Revisar opciones"],
    expected: "El usuario debe entender claramente cómo seleccionar destino",
    actual: "El selector presenta múltiples opciones sin jerarquía clara",
    evidence: "/img/img-ryanair/BUG-005-home-seleccionar-destino.png"
  },
  {
    id: "BUG-006",
    testCaseId: "TS-004 / TC-010",
    title: "Falta de landmark principal",
    severity: "Medium",
    precondition: "Usuario en home",
    steps: ["Analizar estructura HTML", "Revisar landmarks", "Validar accesibilidad"],
    expected: "Debe existir un landmark principal (main)",
    actual: "El documento no define claramente una estructura principal",
    evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
  },
  {
    id: "BUG-007",
    testCaseId: "TS-004 / TC-010",
    title: "Jerarquía de headings incorrecta",
    severity: "High",
    precondition: "Usuario en home",
    steps: ["Inspeccionar headings", "Revisar orden H1-H6"],
    expected: "Debe existir una jerarquía lógica (H1 → H2 → H3)",
    actual: "Saltos de jerarquía y múltiples H1",
    evidence: "/img/img-ryanair/BUG-007-home-headers.png"
  },
  {
    id: "BUG-008",
    testCaseId: "TS-002 / TC-003",
    title: "Sección de soporte con estructura poco clara",
    severity: "Medium",
    precondition: "Usuario en sección de ayuda",
    steps: ["Acceder a asistencia especial", "Analizar contenido", "Evaluar navegación"],
    expected: "La información debe estar organizada de forma clara",
    actual: "La estructura no facilita la comprensión del contenido",
    evidence: "/img/img-ryanair/BUG-008-soporte-ryanair-ES.png"
  },
  {
    id: "BUG-009",
    testCaseId: "TS-004 / TC-010",
    title: "Pantalla de checkout sin jerarquía semántica",
    severity: "High",
    precondition: "Usuario en flujo de compra",
    steps: ["Acceder a checkout", "Inspeccionar headings"],
    expected: "La página debe tener estructura semántica clara",
    actual: "No hay H1 definido y uso incorrecto de headings",
    evidence: "/img/img-ryanair/checkout-headers.png"
  },
  {
    id: "BUG-010",
    testCaseId: "TS-002 / TC-003",
    title: "Contraste de color insuficiente",
    severity: "Medium",
    precondition: "Usuario en home",
    steps: ["Analizar colores de texto y fondo", "Medir contraste"],
    expected: "Debe cumplir estándares WCAG",
    actual: "Algunos elementos no cumplen contraste mínimo",
    evidence: "/img/img-ryanair/color-ratio.png"
  }
];

const bugsEn = bugsEs.map(b => ({...b}));

const file = path.join(__dirname, 'src', 'shared.tsx');
let content = fs.readFileSync(file, 'utf8');

function replaceBugs(str, langKey) {
  const titleEs = 'bugsTitle: "BUGS ENCONTRADOS",';
  const titleEn = 'bugsTitle: "BUGS FOUND",';
  let targetTitle = langKey === 'es' ? titleEs : titleEn;
  
  let p1 = str.indexOf(targetTitle);
  if (p1 === -1) return str;
  let p2 = str.indexOf('uxImprovementsTitle:', p1);
  if (p2 === -1) return str;
  
  const formattedBugs = (langKey === 'es' ? bugsEs : bugsEn).map(b => {
    let out = `        {
          id: "${b.id}",
          testCaseId: "${b.testCaseId}",
          title: "${b.title}",
          severity: "${b.severity}",
          precondition: ${JSON.stringify(b.precondition)},
          steps: ${JSON.stringify(b.steps)},
          expected: ${JSON.stringify(b.expected)},
          actual: ${JSON.stringify(b.actual)}`;
          
    if (b.evidence) {
      if (Array.isArray(b.evidence)) {
        out += `,\n          evidence: ${JSON.stringify(b.evidence)}`;
      } else {
        out += `,\n          evidence: "${b.evidence}"`;
      }
    }
    out += `\n        }`;
    return out;
  }).join(',\n');
  
  const replacement = `${targetTitle}\n      bugs: [\n${formattedBugs}\n      ],\n      `;
  
  return str.substring(0, p1) + replacement + str.substring(p2);
}

content = replaceBugs(content, 'es');
content = replaceBugs(content, 'en');

fs.writeFileSync(file, content);
console.log('New bugs successfully completely replaced!');
