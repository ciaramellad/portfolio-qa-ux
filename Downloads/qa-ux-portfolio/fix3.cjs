const fs = require('fs');
const file = 'src/components/QAProjectTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

// The main container of stats tables and test cases tables
content = content.replace(/'border-black\/10 bg-black\/5'/g, "'border-transparent bg-[#121212] text-white'");

// Inner cell borders that should contrast against the new black background
content = content.replace(/'border-black\/10'/g, "'border-white/10'");
content = content.replace(/'border-black\/5'/g, "'border-white/5'");
content = content.replace(/'border-black\/6'/g, "'border-white/6'");

// Any remaining backgrounds that were black-toned for light mode which are now inside black boxes
content = content.replace(/'bg-black\/5'/g, "'bg-white/5'");
content = content.replace(/'bg-black\/10'/g, "'bg-white/10'");
content = content.replace(/'bg-black\/6'/g, "'bg-white/6'");

fs.writeFileSync(file, content);
console.log('Fixed QA tables borders and backgrounds');
