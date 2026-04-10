const fs = require('fs');
const path = require('path');

// 生成简单的 SVG 头像
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
];

const generateAvatar = (index, color) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}"/>
  <circle cx="100" cy="80" r="40" fill="white" opacity="0.9"/>
  <ellipse cx="100" cy="180" rx="70" ry="60" fill="white" opacity="0.9"/>
  <text x="100" y="105" font-family="Arial, sans-serif" font-size="50" font-weight="bold" 
        text-anchor="middle" fill="${color}">${index + 1}</text>
</svg>`;
  return svg;
};

const avatarsDir = path.join(__dirname);

// 生成 10 个默认头像
for (let i = 0; i < 10; i++) {
  const svg = generateAvatar(i, colors[i]);
  fs.writeFileSync(path.join(avatarsDir, `${i + 1}.svg`), svg);
  console.log(`Generated avatar ${i + 1}.svg`);
}

// 生成默认头像
const defaultSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#E0E0E0"/>
  <circle cx="100" cy="80" r="35" fill="#BDBDBD"/>
  <ellipse cx="100" cy="190" rx="65" ry="55" fill="#BDBDBD"/>
</svg>`;

fs.writeFileSync(path.join(avatarsDir, 'default.svg'), defaultSvg);
console.log('Generated default.svg');

console.log('All avatars generated successfully!');
