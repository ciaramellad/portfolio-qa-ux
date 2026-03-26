import React from 'react';
import { 
  Target, 
  ListChecks,
  Layout,
  Bug,
  Eye,
  MousePointer2,
  Smartphone,
  Accessibility
} from 'lucide-react';
import QAProjectTemplate from '../components/QAProjectTemplate';

import { translations } from '../shared';

const UXTestingProject = ({ theme, lang = 'es', toggleLang, toggleTheme }: { theme: 'dark' | 'light', lang?: 'en' | 'es', toggleLang?: () => void, toggleTheme?: () => void }) => {
  const t = translations[lang].ux_audit;

  return (
    <QAProjectTemplate 
      theme={theme}
      lang={lang}
      toggleLang={toggleLang}
      toggleTheme={toggleTheme}
      title={t.title}
      subtitle={t.subtitle}
      description={t.description}
      heroImage="/img/img-ryanair/ryanair-web-home.png"
      tools={t.buttons}
      objective={t.objective}
      platform={t.platform}
      featureMockup="/img/img-ryanair/Ryanair-mobile-home.png"
      mockupType="laptop"
      statsTable={t.statsTable}
      testingTypes={[
        { name: t.testingStrategyList[0].name, description: t.testingStrategyList[0].description, icon: Eye },
        { name: t.testingStrategyList[1].name, description: t.testingStrategyList[1].description, icon: Accessibility },
        { name: t.testingStrategyList[2].name, description: t.testingStrategyList[2].description, icon: MousePointer2 },
        { name: t.testingStrategyList[3].name, description: t.testingStrategyList[3].description, icon: ListChecks }
      ]}
      testingStrategyTitle={t.testingStrategyTitle}
      testScenariosTable={t.testScenariosTable}
      testCasesTitle={t.testCasesTitle}
      testCases={t.testCases}
      bugsTitle={t.bugsTitle}
      bugs={t.bugs}
      uxImprovementsTitle={t.uxImprovementsTitle}
      uxImprovements={t.uxImprovements}
    />
  );
};

export default UXTestingProject;
