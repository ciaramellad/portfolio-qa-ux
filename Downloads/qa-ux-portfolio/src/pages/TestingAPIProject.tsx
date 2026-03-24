import React from 'react';
import { 
  Target, 
  ListChecks,
  Layout,
  Bug,
  Database,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import QAProjectTemplate from '../components/QAProjectTemplate';

import { translations } from '../shared';

const TestingAPIProject = ({ theme, lang = 'es', toggleLang, toggleTheme }: { theme: 'dark' | 'light', lang?: 'en' | 'es', toggleLang?: () => void, toggleTheme?: () => void }) => {
  const t = translations[lang].api_testing;

  return (
    <QAProjectTemplate 
      theme={theme}
      lang={lang}
      toggleLang={toggleLang}
      toggleTheme={toggleTheme}
      title={t.title}
      subtitle={t.subtitle}
      description={t.description}
      heroImage="/img/img-postman-api/tc-001-get-products.png"
      tools={["POSTMAN", "JSON", "HTTP METHODS", "API REST"]}
      objective={t.objective}
      platform={t.platform}
      features={[]}
      featureMockup="/img/img-postman-api/TC-004-response-time-products.png"
      testingTypes={[]}
      testScenarios={{
        ...t.endpoints,
        featureHeader: "Endpoint",
        scenarioHeader: "Descripción"
      }}
      testCases={t.testCases.table}
      testCasesIntro={t.testCases.intro}
      validations={t.automations}
      mockupType="laptop"
      certification={t.certification}
    />
  );
};

export default TestingAPIProject;

