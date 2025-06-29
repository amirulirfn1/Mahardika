#!/usr/bin/env node

/**
 * Mahardika Brand Auto-Fixer (cross-platform)
 * ------------------------------------------------
 * • Replaces raw brand hex values with colors helper
 * • Converts Bootstrap primary buttons to BrandButton
 * • Adds missing imports only when needed
 * • Operates only in application source (apps/web) – leaves UI library intact
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Root directories to scan
const ROOT_DIR = path.resolve(__dirname, '..');
const SCAN_DIR = path.join(ROOT_DIR, 'apps', 'web');

// File selectors
const EXT_REGEX = /\.(tsx|ts|jsx|js)$/;

// Replacement patterns
const NAVY_HEX = /#0[dD]1[bB]2[aA]/g;
const GOLD_HEX = /#f4b400/gi;

const BUTTON_BLOCK_REGEX = /<button([^>]*className="[^"]*\bbtn btn-primary\b[^"]*"[^>]*)>([\s\S]*?)<\/button>/g;

let totalChanged = 0;

/** Recursively walk directory */
function walk(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
    } else if (EXT_REGEX.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function ensureImport(content, _import, identifier) {
  if (!content.includes(identifier)) return content; // identifier not used
  const alreadyImported = new RegExp(`import .*${identifier}.* from`).test(content);
  if (alreadyImported) {
    // If identifier not part of existing import, extend it
    return content.replace(/import\s+\{([^}]*)\}\s+from\s+"@mahardika\/ui";/, (m, p1) => {
      if (p1.includes(identifier)) return m;
      return `import { ${p1.trim()}, ${identifier} } from "@mahardika/ui";`;
    });
  }

  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  const directiveMatch = firstLine.match(/^['\"]use (client|server)['\"];?$/);

  const importLine = `import { ${identifier} } from "@mahardika/ui";`;

  if (directiveMatch) {
    // keep directive at top, insert import after
    return [lines[0], importLine, ...lines.slice(1)].join('\n');
  }

  // otherwise prepend at top
  return importLine + '\n' + content;
}

function processFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  let updated = original;

  // Remove any faulty import inserted previously like "import { colors. } ..."
  updated = updated.replace(/import \{[^}]*colors\.[^}]*\} from \"@mahardika\/ui\";?\n?/g, '');

  // Replace hex colors
  updated = updated.replace(NAVY_HEX, 'colors.navy');
  updated = updated.replace(GOLD_HEX, 'colors.gold');

  // Replace bootstrap button blocks (open + close together)
  updated = updated.replace(BUTTON_BLOCK_REGEX, (_match, attrs, inner) => {
    return `<BrandButton variant="navy-primary"${attrs}>${inner}</BrandButton>`;
  });

  const baseName = path.basename(file);
  const isColorsFile = /colors\.ts$/.test(baseName);

  // Add imports if necessary (skip if file itself declares colors)
  if (!isColorsFile) {
    updated = ensureImport(updated, 'import { colors } from "@mahardika/ui";', 'colors');
  }

  // Skip adding BrandButton import inside its own definition file and when file already defines component
  if (!file.endsWith('BrandButton.tsx') && !updated.includes('function BrandButton') && !updated.includes('const BrandButton')) {
    updated = ensureImport(updated, 'import { BrandButton } from "@mahardika/ui";', 'BrandButton');
  }

  // Ensure directive is first line if present
  const lines = updated.split('\n');
  const dirIndex = lines.findIndex(l => /^['\"]use (client|server)['\"];?/.test(l.trim()));
  if (dirIndex > 0) {
    const directiveLine = lines.splice(dirIndex, 1)[0];
    lines.unshift(directiveLine);
    updated = lines.join('\n');
  }

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    totalChanged++;
    console.log(`✏️  Fixed ${path.relative(ROOT_DIR, file)}`);
  }
}

if (!fs.existsSync(SCAN_DIR)) {
  console.error(`Directory ${SCAN_DIR} not found – nothing to scan.`);
  process.exit(0);
}

const files = walk(SCAN_DIR);
files.forEach(processFile);

console.log(`\n✅ Auto-fix complete. ${totalChanged} files modified.`); 