// scripts/generateThumbnails.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../src/images/정리');

fs.readdirSync(imagesDir).forEach((themeFolder) => {
  const themePath = path.join(imagesDir, themeFolder);
  if (fs.lstatSync(themePath).isDirectory()) {
    const thumbnailDir = path.join(themePath, '썸네일');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    fs.readdirSync(themePath).forEach((file) => {
      const ext = path.extname(file);
      if (['.jpg', '.png', '.jpeg', '.gif'].includes(ext.toLowerCase())) {
        const filePath = path.join(themePath, file);
        const thumbnailPath = path.join(thumbnailDir, file);
        sharp(filePath)
          .resize({ width: 200 })
          .toFile(thumbnailPath)
          .then(() => {
            console.log(`썸네일 생성: ${thumbnailPath}`);
          })
          .catch((err) => {
            console.error(`썸네일 생성 실패: ${filePath}`, err);
          });
      }
    });
  }
});

console.log("HI");