import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成带有用户首字母的 SVG 头像
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#FF8C94', '#6BCB77', '#4D96FF', '#FF6B9D', '#C9B1FF'
];

const generateAvatarWithInitial = (initial, color) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}"/>
  <circle cx="100" cy="100" r="80" fill="white" opacity="0.9"/>
  <text x="100" y="125" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        text-anchor="middle" fill="${color}">${initial.toUpperCase()}</text>
</svg>`;
  return svg;
};

const generateDefaultAvatar = () => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#E0E0E0"/>
  <circle cx="100" cy="100" r="80" fill="#BDBDBD"/>
  <text x="100" y="125" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        text-anchor="middle" fill="white">?</text>
</svg>`;
  return svg;
};

const avatarsDir = __dirname;

// 生成默认头像
fs.writeFileSync(path.join(avatarsDir, 'default.svg'), generateDefaultAvatar());
console.log('Generated default.svg');

// 生成 A-Z 的字母头像
for (let i = 0; i < 26; i++) {
  const letter = String.fromCharCode(65 + i); // A-Z
  const color = colors[i % colors.length];
  const svg = generateAvatarWithInitial(letter, color);
  fs.writeFileSync(path.join(avatarsDir, `${letter}.svg`), svg);
  console.log(`Generated ${letter}.svg`);
}

// 生成 0-9 的数字头像
for (let i = 0; i < 10; i++) {
  const color = colors[i % colors.length];
  const svg = generateAvatarWithInitial(String(i), color);
  fs.writeFileSync(path.join(avatarsDir, `${i}.svg`), svg);
  console.log(`Generated ${i}.svg`);
}

console.log('All avatars generated successfully!');
