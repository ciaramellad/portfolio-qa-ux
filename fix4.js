const fs = require('fs');
let content = fs.readFileSync('src/components/QAProjectTemplate.tsx', 'utf8');

// Replace table wrappers
content = content.replace(/'border-black\/10 bg-black\/5'/g, "'border-transparent bg-[#121212] text-white'");

// Replace inner table headers and rows borders + hover effects
content = content.replace(/'border-black'/g, "'border-white/10'");
content = content.replace(/'border-black hover:bg-black\/\\[0\\.01\\]'/g, "'border-white/5 hover:bg-white/[0.02]'");

fs.writeFileSync('src/components/QAProjectTemplate.tsx', content);
