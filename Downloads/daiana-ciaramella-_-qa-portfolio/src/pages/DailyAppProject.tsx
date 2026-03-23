import React from 'react';
import { 
  Target, 
  ListChecks,
  Layout,
  Bug
} from 'lucide-react';
import QAProjectTemplate from '../components/QAProjectTemplate';
import { translations } from '../shared';

const DailyAppProject = ({ theme, lang = 'es', toggleLang, toggleTheme }: { theme: 'dark' | 'light', lang?: 'en' | 'es', toggleLang?: () => void, toggleTheme?: () => void }) => {
  const t = translations[lang].daily_app;

  return (
    <QAProjectTemplate 
      theme={theme}
      lang={lang}
      toggleLang={toggleLang}
      toggleTheme={toggleTheme}
      title={t.title}
      subtitle={t.subtitle}
      description={t.description}
      heroImage="/img/img-dailyapp/daily-edit-dash.jpg"
      tools={["GOOGLE STUDIO", "ANTIGRAVITY", "VERCEL", "GITHUB", "DISEÑO UX UI"]}
      objective={t.objective}
      platform={t.platform}
      features={t.featuresList}
      featuresTitle={t.featuresTitle}
      featureMockup="/img/img-dailyapp/daily-mockup-funciones.jpeg"
      testingStrategyTitle={t.testingStrategyTitle}
      testScenarios={{
        title: t.testScenariosTitle,
        description: t.testScenariosDesc,
        table: t.testScenariosTable,
        footer: t.testScenariosFooter
      }}
      testCasesDesc={t.testCasesDesc}
      testingTypes={[
        { name: t.testingStrategyList[0].name, description: t.testingStrategyList[0].description, icon: ListChecks },
        { name: t.testingStrategyList[1].name, description: t.testingStrategyList[1].description, icon: Target },
        { name: t.testingStrategyList[2].name, description: t.testingStrategyList[2].description, icon: Layout },
        { name: t.testingStrategyList[3].name, description: t.testingStrategyList[3].description, icon: Bug }
      ]}
      testCases={t.testCasesTable}
      mockupType="mobile"
      bugs={t.bugs}
      uxImprovements={t.uxImprovements}
    />
  );
};

export default DailyAppProject;
