const fs = require('fs');
const path = require('path');

const bugsEs = [
  {
    id: "BUG-001",
    testCaseId: "TS-001 / TC-001",
    title: "Elementos interactivos no reciben foco con teclado",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nSO: Windows 11\nURL: https://www.ryanair.com/es/es\nSin extensiones activas\nNo usar ratón durante toda la prueba",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Esperar carga completa de la página",
      "Hacer clic en la barra de URL y presionar Tab para pasar al contenido",
      "Continuar presionando Tab repetidamente",
      "Intentar llegar al botón 'Iniciar sesión' del header",
      "Intentar llegar a los enlaces del menú principal (Vuelos, Planear, etc.)",
      "Intentar llegar a los campos del buscador de vuelos"
    ],
    expected: "Todos los elementos interactivos (botones, enlaces, inputs) deben ser alcanzables mediante Tab en orden lógico. Ningún elemento interactivo debe ser omitido.",
    actual: "Al navegar con Tab, el botón 'Iniciar sesión' del header y varios enlaces del menú principal son omitidos: el foco los salta sin detenerse. No es posible acceder a estos elementos sin usar el ratón.",
    evidence: "/img/img-ryanair/BUG-001-incidencias-home.png"
  },
  {
    id: "BUG-002",
    testCaseId: "TS-001 / TC-002",
    title: "Indicador de foco no visible al navegar con teclado",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nSin extensiones de accesibilidad activas\nNo usar ratón durante la prueba",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Presionar Tab desde la barra de URL para entrar al contenido",
      "Continuar presionando Tab elemento a elemento",
      "Observar si aparece un indicador visual (outline, borde, sombra) alrededor del elemento que tiene el foco",
      "Recorrer header, menú, buscador y sección de ofertas"
    ],
    expected: "Cada elemento que recibe el foco debe mostrar un indicador visual claro. El usuario debe saber en todo momento dónde está el foco",
    actual: "Al navegar con Tab, múltiples elementos (botones del header, tarjetas de destinos, enlaces del footer) no muestran ningún indicador visual de foco. El CSS suprime el outline con 'outline: none' o 'outline: 0' sin proporcionar un indicador alternativo.",
    evidence: "/img/img-ryanair/BUG-003-home-banners.png"
  },
  {
    id: "BUG-003",
    testCaseId: "TS-002 / TC-003",
    title: "Contraste insuficiente en textos y botones",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nHerramienta: Axe DevTools",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Abrir extensión Axe DevTools y ejecutar análisis",
      "Filtrar resultados por 'color-contrast'",
      "Identificar elementos marcados como fallo",
      "Verificar manualmente textos secundarios (subtítulos, labels de precios, texto sobre fondos de color azul corporativo de Ryanair)"
    ],
    expected: "Texto normal ratio mínimo 4.5:1 contra el fondo. Texto grande ratio mínimo 3:1. Componentes UI (bordes de inputs, iconos): ratio mínimo 3:1",
    actual: "Axe DevTools detecta fallos de contraste en: texto de precio en gris claro sobre fondo blanco (ratio ~2.8:1), texto de etiquetas sobre el azul corporativo de Ryanair (#073590) en algunos botones secundarios, y placeholders de los campos del buscador.",
    evidence: null
  },
  {
    id: "BUG-004",
    testCaseId: "TS-003 / TC-004",
    title: "Campos del buscador sin etiqueta accesible (label)",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nHerramientas: Axe DevTools + Chrome DevTools (Inspector)\nOpcional: lector de pantalla NVDA o VoiceOver para verificación",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Ejecutar Axe DevTools → filtrar por 'label'",
      "Inspeccionar con DevTools el campo 'Origen' del buscador",
      "Verificar si existe <label for='...'> asociado o aria-label en el input",
      "Repetir para campos 'Destino', 'Fecha de ida', 'Fecha de vuelta', 'Pasajeros'",
      "Activar NVDA y navegar con Tab hasta los campos del buscador",
      "Escuchar qué anuncia el lector de pantalla al llegar a cada campo"
    ],
    expected: "Cada campo del formulario debe tener una etiqueta accesible: <label> asociado por 'for/id', o atributo aria-label, o aria-labelledby. El lector de pantalla debe anunciar el propósito del campo al recibir el foco.",
    actual: "Los campos 'Origen' y 'Destino' del buscador no tienen <label> asociado ni aria-label. Axe DevTools los marca como 'Form elements must have labels'. Al navegar con NVDA, el lector de pantalla anuncia únicamente 'edit' o 'campo de texto' sin indicar el propósito del campo.",
    evidence: null
  },
  {
    id: "BUG-005",
    testCaseId: "TS-003 / TC-005",
    title: "Sin mensajes de error accesibles al enviar formulario incompleto",
    severity: "Medium",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nSin datos completados en el buscador de vuelos\nHerramienta: Axe DevTools para verificación post-error",
    steps: [
      "Abrir ryanair.com/es/es",
      "No completar ningún campo del buscador (Origen, Destino, Fecha)",
      "Hacer clic en el botón 'Buscar' (o presionar Enter)",
      "Observar si aparece algún mensaje de error",
      "Si aparece, verificar: ¿el mensaje identifica qué campo falló?",
      "Navegar con Tab hasta el mensaje de error: ¿recibe foco?",
      "Activar NVDA y repetir: ¿el lector anuncia el error automáticamente?"
    ],
    expected: "Al intentar buscar sin completar campos obligatorios, el sistema debe: 1. Mostrar un mensaje de error descriptivo junto a cada campo vacío. 2. Mover el foco al primer error o anunciarlo mediante aria-live. 3. El mensaje debe identificar el campo y cómo corregirlo.",
    actual: "Al intentar buscar sin completar los campos, no aparece ningún mensaje de error textual. El buscador simplemente no ejecuta la búsqueda sin indicar el motivo. El usuario no recibe ningún feedback sobre qué campo es obligatorio ni cómo corregir la situación.",
    evidence: null
  },
  {
    id: "BUG-006",
    testCaseId: "TS-001 / TC-006",
    title: "Orden de tabulación no sigue la lógica visual de la página",
    severity: "Medium",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nNo usar ratón — solo teclado\nVentana del navegador en tamaño completo (1920×1080 o similar)",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Presionar Tab desde la URL y entrar al contenido",
      "Continuar presionando Tab y anotar el orden en que los elementos reciben el foco (elemento 1, 2, 3...)",
      "Comparar el orden de foco con el orden visual de la página (izquierda→derecha, arriba→abajo)",
      "Identificar saltos: ej. si el foco va del header directamente al footer saltando el buscador",
      "Verificar si hay elementos con tabindex positivo (>0) que fuerzan un orden incorrecto"
    ],
    expected: "El orden de tabulación debe seguir la secuencia lógica y visual: header → navegación principal → buscador → contenido → footer. Debe ser predecible y no confundir al usuario.",
    actual: "El foco realiza saltos no predecibles: desde el logo pasa directamente a un enlace del footer antes de recorrer el menú principal. El buscador de vuelos (elemento central de la página) es alcanzado después de varios elementos de navegación secundaria. Se detectan atributos tabindex con valores positivos que fuerzan un orden incorrecto.",
    evidence: null
  },
  {
    id: "BUG-007",
    testCaseId: "TS-004 / TC-007",
    title: "Elementos interactivos sin rol ARIA accesible",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nHerramientas: Axe DevTools + Chrome DevTools Inspector\nOpcional: NVDA para verificación con lector de pantalla",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Ejecutar Axe DevTools → filtrar por 'aria' y 'role'",
      "Inspeccionar con DevTools el botón del menú hamburguesa (móvil)",
      "Verificar si tiene role='button' o es un <button> nativo con aria-label",
      "Inspeccionar las tarjetas de destinos (cards clickeables)",
      "Verificar si tienen role y aria-label definidos",
      "Con NVDA activo, navegar por Tab y escuchar qué anuncia el lector al llegar a cada elemento interactivo"
    ],
    expected: "Todos los elementos interactivos deben tener su rol correctamente definido (button, link, combobox, etc.) y un nombre accesible (aria-label o texto visible). Los lectores de pantalla deben anunciar: nombre + rol + estado del elemento.",
    actual: "Varios elementos interactivos son <div> o <span> con eventos onclick sin role ni aria-label definidos. Axe DevTools los reporta como 'Elements must have discernible text'. NVDA los anuncia como 'vacío' o no los anuncia en absoluto, dejando al usuario sin información sobre la acción disponible.",
    evidence: null
  },
  {
    id: "BUG-008",
    testCaseId: "TS-002 / TC-008",
    title: "Uso excesivo de texto en mayúsculas afecta legibilidad",
    severity: "Low",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nInspección visual de la página home\nHerramienta: DevTools Inspector para verificar CSS",
    steps: [
      "Abrir ryanair.com/es/es",
      "Desplazarse por toda la página home",
      "Identificar bloques de texto en mayúsculas sostenidas (ALL CAPS)",
      "Localizar en particular: etiquetas de categorías del menú, títulos de secciones promocionales, CTAs secundarios",
      "Abrir DevTools e inspeccionar si el efecto es CSS (text-transform: uppercase) o texto hardcodeado en mayúsculas",
      "Verificar si el atributo aria-label en esos elementos reproduce las mayúsculas o usa texto normal"
    ],
    expected: "El texto en mayúsculas debe usarse de forma puntual y no para bloques de texto extensos. Si se aplica via CSS (text-transform: uppercase), el texto subyacente en el HTML debe estar en minúsculas para que los lectores de pantalla lo procesen correctamente.",
    actual: "Múltiples secciones de la home (títulos de categorías del menú 'VUELOS', 'PLANEAR', CTAs promocionales) usan text-transform: uppercase en CSS para bloques completos de texto. Algunos elementos tienen el texto hardcodeado en mayúsculas en el HTML, lo que afecta la pronunciación de lectores de pantalla que las interpretan letra a letra.",
    evidence: null
  },
  {
    id: "BUG-009",
    testCaseId: "TS-005 / TC-009",
    title: "Imágenes decorativas e informativas sin texto alternativo",
    severity: "Medium",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es\nHerramientas: Axe DevTools + DevTools Inspector\nOpcional: NVDA para verificación auditiva",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Ejecutar Axe DevTools → filtrar por 'image-alt'",
      "Identificar imágenes marcadas como fallo",
      "Inspeccionar con DevTools las imágenes de destinos (ej: foto de Roma, foto de Londres)",
      "Verificar si tienen atributo alt con descripción o alt='' (para decorativas)",
      "Con NVDA activo, navegar por Tab hasta las imágenes en tarjetas de destinos y escuchar qué anuncia"
    ],
    expected: "Imágenes informativas (destinos, banners con información): deben tener alt descriptivo (ej: alt='Vista aérea de Roma, destino disponible'). Imágenes decorativas: deben tener alt='' para que el lector de pantalla las ignore.",
    actual: "Axe DevTools detecta imágenes de destinos sin atributo alt o con alt que contiene el nombre del archivo (ej: alt='img_rome_hero_v2.jpg'). Con NVDA, el lector anuncia la URL del archivo de imagen en lugar de una descripción útil. Se identifican al menos 6 imágenes afectadas en la sección de destinos populares.",
    evidence: null
  },
  {
    id: "BUG-010",
    testCaseId: "TS-004 / TC-010",
    title: "Jerarquía de headings incorrecta: múltiples H1 y saltos de nivel",
    severity: "High",
    precondition: "Navegador: Chrome (última versión)\nURL: https://www.ryanair.com/es/es (también verificar en resultados y checkout)\nHerramientas: DevTools Console + Axe DevTools\nOpcional: extensión 'HeadingsMap' para visualización",
    steps: [
      "Abrir ryanair.com/es/es en Chrome",
      "Abrir DevTools → Console",
      "Ejecutar: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.tagName + ': ' + h.textContent.trim().substring(0,60))",
      "Copiar y analizar la lista resultante",
      "Verificar: ¿hay más de 1 H1?",
      "Verificar: ¿hay saltos de nivel (H1 → H3 sin H2)?",
      "Repetir en página de resultados de búsqueda",
      "Repetir en checkout paso 1"
    ],
    expected: "Cada página debe tener exactamente 1 elemento H1 que describa el contenido principal. La jerarquía debe ser continua y lógica: H1 → H2 → H3, sin saltos de nivel. Los headings deben representar la estructura real del contenido, no usarse como estilos visuales.",
    actual: "La home de Ryanair contiene múltiples elementos H1 (se detectan al menos 3 en la misma página). Se encuentran saltos directos de H1 a H3 sin H2 intermedio en la sección de ofertas. Algunas secciones usan H4 directamente sin contexto de H2 o H3 previo. La estructura es idéntica en la página de resultados.",
    evidence: null
  }
];

const bugsEn = bugsEs.map(b => ({...b})); // Duplicate for EN since user didn't request translation here

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
      out += `,\n          evidence: "${b.evidence}"`;
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
console.log('Bugs replaced successfully, tags removed!');
