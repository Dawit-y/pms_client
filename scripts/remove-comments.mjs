import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, '../src/pages'); // adjust if needed

function removeCommentsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  const cleaned = content.replace(/^\s*\/\/(?!\s*eslint-disable).*$/gm, '');

  fs.writeFileSync(filePath, cleaned, 'utf8');
  console.log(`Cleaned: ${filePath}`);
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
      removeCommentsFromFile(fullPath);
    }
  });
}

traverseDirectory(PAGES_DIR);
console.log('Done removing comments (eslint-disable preserved).');
