import React from 'react';
import { 
  Target, 
  ListChecks,
  Layout,
  Bug,
  ShieldCheck,
  Monitor
} from 'lucide-react';
import QAProjectTemplate from '../components/QAProjectTemplate';
import { translations } from '../shared';

const EcommerceTestingProject = ({ theme, lang = 'es', toggleLang, toggleTheme }: { theme: 'dark' | 'light', lang?: 'en' | 'es', toggleLang?: () => void, toggleTheme?: () => void }) => {
  const t = translations[lang].ecommerce_testing;

  const getIcon = (name: string) => {
    if (name.includes('Functional')) return ListChecks;
    if (name.includes('Exploratory')) return Target;
    if (name.includes('UI')) return Layout;
    if (name.includes('Validation')) return Bug;
    return Bug;
  };

  return (
    <QAProjectTemplate 
      theme={theme}
      lang={lang}
      toggleLang={toggleLang}
      toggleTheme={toggleTheme}
      title={t.title}
      subtitle={t.subtitle}
      description={t.description}
      heroImage="/img/img-saucedemo/sauce-home.png"
      heroBg="/img/img-saucedemo/sauce-home.png"
      tools={[]}
      objective={t.objective}
      platformLabel={t.platformLabel}
      platform={t.platform}
      features={t.features}
      featuresTitle={lang === 'es' ? "Funcionalidades Clave" : "Key Features"}
      featureMockup="/img/img-saucedemo/sauce-home.png"
      testingStrategyTitle={t.testingStrategyTitle}
      testScenarios={{
        title: t.testScenariosTitle,
        description: t.testScenariosDesc,
        table: t.testScenariosTable,
        idHeader: t.testScenariosIdHeader,
        featureHeader: t.testScenariosFeatureHeader,
        scenarioHeader: t.testScenariosScenarioHeader,
        footer: t.testScenariosFooter
      }}
      testCasesSummary={{
        title: t.testCasesSummary.title,
        headers: t.testCasesSummary.headers,
        table: t.testCasesSummary.table
      }}
      testCasesDesc={t.testCasesDesc}
      testingTypes={t.testingStrategyList.map((item: any) => ({
        name: item.name,
        description: item.description,
        icon: getIcon(item.name)
      }))}
      testCases={t.testCasesTable}
      bugsTitle={t.bugsTitle}
      bugsDescription={t.bugsDescription}
      bugs={t.bugsList}
      mockupType="laptop"
      uxImprovements={t.uxImprovements}
    />
  );
};

export default EcommerceTestingProject;
