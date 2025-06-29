#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' })
  .split('\n')
  .filter(f => f && f.match(/\.(ts|tsx)$/));

let removed = 0;
for (const rel of files) {
  const full = path.resolve(rel);
  let txt = fs.readFileSync(full, 'utf8');
  if (txt.includes('import { colors }') && !txt.match(/colors\./)) {
    const newTxt = txt.replace(/import \{ colors \} from "@mahardika\/ui";\n?/, '');
    if (newTxt !== txt) {
      fs.writeFileSync(full, newTxt, 'utf8');
      removed++;
      console.log(`🚮 Removed unused colors import in ${rel}`);
    }
  }
}
console.log(`Removal complete. ${removed} files cleaned.`); 