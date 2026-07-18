import fs from 'fs';
import path from 'path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove any existing dynamic export at the top
      content = content.replace(/^export const dynamic = "force-dynamic";\n\n/, '');
      
      // Ensure "use client" is at the very top
      if (content.includes('"use client"') || content.includes("'use client'")) {
        // Remove existing use client directive
        content = content.replace(/^("use client"|'use client');\s*/, '');
        // Add it at the very top
        content = '"use client";\n\nexport const dynamic = "force-dynamic";\n\n' + content;
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Fixed:', fullPath);
    }
  }
}

walk('src/app');