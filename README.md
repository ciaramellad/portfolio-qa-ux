# Daiana Ciaramella · Portfolio QA y UX/UI

Portfolio de QA manual con base en diseño UX/UI y desarrollo frontend. Cada proyecto se presenta como un caso de estudio: contexto, estrategia, casos de prueba trazables, defectos con evidencia y lo aprendido.

**Web:** [ciaramellad-portfolio-qa-ux.vercel.app](https://ciaramellad-portfolio-qa-ux.vercel.app/)

## Casos de estudio

| Proyecto | Tipo | Qué incluye |
|---|---|---|
| [Un Clú de Bordado](proyectos-qa/un-clu-de-bordado/) | App en producción para una clienta | Estrategia basada en riesgos, 303 casos diseñados, 140 pruebas unitarias (Vitest) y 102 E2E (Playwright) en verde, 9 hallazgos |
| [DAILY](proyectos-qa/daily_app/) | App propia (PWA de finanzas) | Escenarios priorizados, casos trazables, valores límite y 7 defectos con evidencia |
| [Ryanair.es](ux-testing/) | Auditoría independiente | Accesibilidad WCAG 2.1 AA y usabilidad: 92 incidencias, 14 casos, 12 defectos |
| [API Testing con Postman](proyectos-qa/testing-api-postman/) | Entorno de práctica | 7 casos REST con aserciones automáticas de estado, estructura y tiempo |

## Estructura

```
.
├── index.html                  Home
├── proyectos-qa/
│   ├── un-clu-de-bordado/      Caso de estudio
│   ├── daily_app/              Caso de estudio
│   └── testing-api-postman/    Caso de estudio
├── ux-testing/                 Caso de estudio (Ryanair.es)
├── assets/
│   ├── css/                    style.css (global) y case.css (casos de estudio)
│   ├── js/                     case.js (menú y transiciones de los casos)
│   ├── img/                    Una carpeta por proyecto, más cards/ y ux/
│   └── docs/                   CV en PDF
└── vercel.json                 Configuración de despliegue y redirecciones
```

## Tecnología

HTML, CSS y JavaScript sin frameworks ni paso de compilación. Tipografía Geist. Diseño responsive, contraste AA, foco visible y respeto a `prefers-reduced-motion`.

## Desarrollo local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Despliegue

Vercel publica automáticamente cada commit en `main`.

## Privacidad

Las capturas no muestran datos personales: los importes y nombres reales están ocultos y las capturas de navegador están recortadas.

## Contacto

[daiana.ciaramella@gmail.com](mailto:daiana.ciaramella@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ciaramellad/)
