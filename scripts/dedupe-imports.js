#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const globby = require('globby');

(async () => {
  const files = await globby([
    'apps/**/**/*.{ts,tsx}',
    'packages/**/**/*.{ts,tsx}',
    '!**/node_modules/**',
  ]);

  const regex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@mahardika\/ui['"];?/g;

  let modified = 0;

  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    const imports = [...code.matchAll(regex)];
    if (imports.length <= 1) return;

    const identifiers = new Set();
    imports.forEach(m => {
      m[1]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(id => identifiers.add(id));
    });

    // Remove all old imports
    code = code.replace(regex, '');

    // Build consolidated import
    const consolidated = `import { ${[...identifiers].join(', ')} } from '@mahardika/ui';\n`;

    // Insert after possible pragma(s)
    const pragmaMatch = code.match(/^(?:['"]use (?:client|server)['"];?\s*)+/);
    const insertPos = pragmaMatch ? pragmaMatch[0].length : 0;
    code = code.slice(0, insertPos) + consolidated + code.slice(insertPos);

    fs.writeFileSync(file, code, 'utf8');
    modified++;
    console.log(`✅ De-duplicated imports in ${file}`);
  });

  console.log(`\nFinished import de-dup. Files modified: ${modified}`);
})();
