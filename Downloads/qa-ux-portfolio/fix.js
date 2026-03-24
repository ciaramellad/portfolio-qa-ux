const fs = require('fs');
const files = ['src/pages/Home.tsx', 'src/App.tsx', 'src/components/QAProjectTemplate.tsx', 'src/shared.tsx'];

files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    content = content
      .replace(/: 'opacity-40'/g, ": 'opacity-70'")
      .replace(/: 'opacity-50'/g, ": 'opacity-70'")
      .replace(/: 'opacity-60'/g, ": 'opacity-80'")
      .replace(/: 'opacity-70'/g, ": 'opacity-90'")
      .replace(/: 'text-black\\/35'/g, ": 'text-black/70'")
      .replace(/: 'text-black\\/55'/g, ": 'text-black/80'")
      .replace(/: 'text-black\\/50'/g, ": 'text-black/70'")
      .replace(/text-\\[14px\\] opacity-50/g, "text-[14px] opacity-70")
      .replace(/text-[14px] opacity-60/g, "text-[14px] opacity-80")
      .replace(/font-light opacity-60/g, "font-light opacity-80")
      .replace(/font-light opacity-70/g, "font-light opacity-90")
      .replace(/opacity-60 leading-relaxed/g, "opacity-80 leading-relaxed")
      .replace(/opacity-70 leading-relaxed/g, "opacity-90 leading-relaxed")
      .replace(/opacity-80 leading-relaxed/g, "opacity-100 leading-relaxed");

    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  } catch(e) {
    console.log('Error ' + f + ': ' + e.message);
  }
});
