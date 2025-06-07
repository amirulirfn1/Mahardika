#!/usr/bin/env node
/**
 * Security check script for Mahardika Platform
 * Verifies no secrets are accidentally committed
 * Uses Mahardika brand colors: navy #0D1B2A and gold #F4B400
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mahardika brand colors for console output
const colors = {
  navy: '\x1b[38;2;13;27;42m',
  gold: '\x1b[38;2;244;180;0m',
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m'
};

console.log(`${colors.navy}🔒 Mahardika Platform Security Check${colors.reset}`);
console.log(`${colors.gold}Scanning for potential security issues...${colors.reset}\n`);

let hasIssues = false;

// Function to log issues
function logIssue(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  hasIssues = true;
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.gray}   ${message}${colors.reset}`);
}

// 1. Check for .env files in git status
console.log(`${colors.navy}1. Checking for environment files in git status...${colors.reset}`);
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  const envFiles = gitStatus.split('\n').filter(line => 
    line.includes('.env') && !line.includes('.env.local.example')
  );
  
  if (envFiles.length > 0) {
    logIssue('Environment files found in git status:');
    envFiles.forEach(file => logInfo(file));
    logInfo('These files should be in .gitignore and not committed');
  } else {
    logSuccess('No environment files in git status');
  }
} catch (error) {
  logWarning('Not a git repository or git not available');
}

// 2. Check for secrets in staged files
console.log(`\n${colors.navy}2. Scanning staged files for potential secrets...${colors.reset}`);
try {
  const diff = execSync('git diff --cached', { encoding: 'utf8' });
  
  if (diff.trim() === '') {
    logInfo('No staged files to check');
  } else {
    const secretPatterns = [
      { pattern: /api[_-]?key[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi, name: 'API Keys' },
      { pattern: /secret[_-]?key[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi, name: 'Secret Keys' },
      { pattern: /password[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{8,}['"']?/gi, name: 'Passwords' },
      { pattern: /token[s]?\s*[:=]\s*['"']?[a-zA-Z0-9_-]{20,}['"']?/gi, name: 'Tokens' },
      { pattern: /sk-[a-zA-Z0-9]{48}/gi, name: 'OpenAI API Keys' },
      { pattern: /sk_[a-z]{4}_[a-zA-Z0-9]{99}/gi, name: 'Stripe Secret Keys' },
      { pattern: /ghp_[a-zA-Z0-9]{36}/gi, name: 'GitHub Personal Access Tokens' }
    ];
    
    let foundSecrets = false;
    secretPatterns.forEach(({ pattern, name }) => {
      const matches = diff.match(pattern);
      if (matches) {
        foundSecrets = true;
        logIssue(`${name} found in staged files:`);
        matches.forEach(match => logInfo(match.substring(0, 50) + '...'));
      }
    });
    
    if (foundSecrets) {
      logIssue('Please remove secrets before committing!');
    } else {
      logSuccess('No secrets found in staged files');
    }
  }
} catch (error) {
  logWarning('Could not check staged files');
}

// 3. Verify .env.local.example exists
console.log(`\n${colors.navy}3. Checking environment template...${colors.reset}`);
if (!fs.existsSync('.env.local.example')) {
  logIssue('.env.local.example template missing');
  logInfo('This file should contain example environment variables');
} else {
  logSuccess('.env.local.example template exists');
  
  // Check if template has Mahardika brand colors
  const template = fs.readFileSync('.env.local.example', 'utf8');
  if (template.includes('#0D1B2A') && template.includes('#F4B400')) {
    logSuccess('Template includes Mahardika brand colors');
  } else {
    logWarning('Template missing Mahardika brand colors');
  }
}

// 4. Verify .gitignore includes comprehensive protection
console.log(`\n${colors.navy}4. Checking .gitignore protection...${colors.reset}`);
if (!fs.existsSync('.gitignore')) {
  logIssue('.gitignore file missing');
} else {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  const requiredEntries = [
    { pattern: '.env*', description: 'Environment wildcard' },
    { pattern: 'secrets/', description: 'Secrets directory' },
    { pattern: '*.key', description: 'Key files' },
    { pattern: '*.pem', description: 'Certificate files' },
    { pattern: '.aws/', description: 'AWS credentials' },
    { pattern: 'terraform.tfvars', description: 'Terraform variables' }
  ];
  
  let missingEntries = 0;
  requiredEntries.forEach(({ pattern, description }) => {
    if (!gitignore.includes(pattern)) {
      if (missingEntries === 0) {
        logWarning('Missing .gitignore entries:');
      }
      logInfo(`${pattern} - ${description}`);
      missingEntries++;
    }
  });
  
  if (missingEntries === 0) {
    logSuccess('All required .gitignore entries present');
  } else {
    logWarning(`${missingEntries} .gitignore entries could be improved`);
  }
}

// 5. Check for hardcoded secrets in source files
console.log(`\n${colors.navy}5. Scanning source files for hardcoded secrets...${colors.reset}`);
try {
  const srcDirectories = ['packages/', 'apps/', 'src/'];
  const excludePatterns = ['node_modules', '.git', 'dist', 'build', '.next'];
  
  let foundHardcodedSecrets = false;
  
  srcDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const result = execSync(
        `find ${dir} -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -100`,
        { encoding: 'utf8' }
      ).split('\n').filter(f => f.trim());
      
      result.forEach(file => {
        if (file && !excludePatterns.some(pattern => file.includes(pattern))) {
          try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Look for potential hardcoded secrets (but exclude template/example values)
            const suspiciousPatterns = [
              /sk-[a-zA-Z0-9]{48}/g,  // OpenAI keys
              /sk_[a-z]{4}_[a-zA-Z0-9]{99}/g,  // Stripe keys
              /ghp_[a-zA-Z0-9]{36}/g,  // GitHub tokens
              /AKIA[0-9A-Z]{16}/g  // AWS access keys
            ];
            
            suspiciousPatterns.forEach(pattern => {
              const matches = content.match(pattern);
              if (matches) {
                matches.forEach(match => {
                  // Skip if it's clearly a placeholder or example
                  if (!match.includes('your_') && 
                      !match.includes('example') && 
                      !match.includes('placeholder')) {
                    foundHardcodedSecrets = true;
                    logIssue(`Potential hardcoded secret in ${file}:`);
                    logInfo(match.substring(0, 20) + '...');
                  }
                });
              }
            });
          } catch (e) {
            // Skip files that can't be read
          }
        }
      });
    }
  });
  
  if (!foundHardcodedSecrets) {
    logSuccess('No hardcoded secrets found in source files');
  }
} catch (error) {
  logWarning('Could not scan source files for hardcoded secrets');
}

// 6. Check environment variable usage patterns
console.log(`\n${colors.navy}6. Checking environment variable patterns...${colors.reset}`);
try {
  const result = execSync(
    `find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | head -50`,
    { encoding: 'utf8' }
  ).split('\n').filter(f => f.trim());
  
  let properEnvUsage = true;
  let envUsageCount = 0;
  
  result.forEach(file => {
    if (file) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Look for environment variable usage
        const envMatches = content.match(/process\.env\.[A-Z_]+/g);
        if (envMatches) {
          envUsageCount += envMatches.length;
          
          // Check for potentially unsafe patterns
          envMatches.forEach(match => {
            const varName = match.replace('process.env.', '');
            
            // Check if it's properly using NEXT_PUBLIC_ for client-side vars
            if (file.includes('/app/') && !varName.startsWith('NEXT_PUBLIC_') && 
                !varName.startsWith('NODE_ENV')) {
              logWarning(`Client-side environment variable may need NEXT_PUBLIC_ prefix: ${varName} in ${file}`);
              properEnvUsage = false;
            }
          });
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }
  });
  
  if (envUsageCount > 0) {
    logSuccess(`Found ${envUsageCount} environment variable usages`);
    if (properEnvUsage) {
      logSuccess('Environment variable patterns look correct');
    }
  } else {
    logInfo('No environment variable usage found');
  }
} catch (error) {
  logWarning('Could not check environment variable patterns');
}

// 7. Final security summary
console.log(`\n${colors.navy}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.navy}🛡️  Mahardika Security Summary${colors.reset}`);
console.log(`${colors.navy}═══════════════════════════════════════${colors.reset}`);

if (hasIssues) {
  console.log(`${colors.red}❌ Security issues found - please address before committing${colors.reset}`);
  console.log(`${colors.gray}   Review the issues above and fix them${colors.reset}`);
  console.log(`${colors.gray}   Ensure all secrets are in environment variables${colors.reset}`);
  console.log(`${colors.gray}   Verify .gitignore excludes all sensitive files${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}✅ Security check passed!${colors.reset}`);
  console.log(`${colors.navy}   All environment files and secrets properly protected${colors.reset}`);
  console.log(`${colors.gold}   Mahardika Platform security standards met${colors.reset}`);
}

console.log(`\n${colors.gray}Brand Colors: Navy #0D1B2A • Gold #F4B400${colors.reset}`);
console.log(`${colors.gray}Security check completed${colors.reset}`); 