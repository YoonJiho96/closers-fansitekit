// scripts/generateImageData.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/정리');
const outputDir = path.join(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'images.json');

// 캐릭터 이름과 별명 매핑
const characterAliases = [
  { character: '세하', aliases: ['세하'] },
  { character: '슬비', aliases: ['슬비'] },
  { character: '유리', aliases: ['유리'] },
  { character: '제이', aliases: ['제이'] },
  { character: '미스틸테인', aliases: ['미스틸테인', '미스틸'] },
  { character: '리아', aliases: ['리아'] },
  { character: '나타', aliases: ['나타'] },
  { character: '레비아', aliases: ['레비아'] },
  { character: '하피', aliases: ['하피'] },
  { character: '티나', aliases: ['티나'] },
  { character: '바이올렛', aliases: ['바이올렛', '보라'] },
  { character: '볼프강', aliases: ['볼프강'] },
  { character: '루나', aliases: ['루나'] },
  { character: '소마', aliases: ['소마'] },
  { character: '파이', aliases: ['파이'] },
  { character: '세트', aliases: ['세트'] },
  { character: '김철수', aliases: ['김철수', '철수'] },
  { character: '미래', aliases: ['미래'] },
  { character: '은하', aliases: ['은하'] },
  { character: '루시', aliases: ['루시'] },
  { character: '애리', aliases: ['애리'] },
];

const imageData = [];

// outputDir이 존재하지 않으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(imagesDir).forEach((themeFolder) => {
  const themePath = path.join(imagesDir, themeFolder);
  if (fs.lstatSync(themePath).isDirectory()) {
    fs.readdirSync(themePath).forEach((file) => {
      const filePath = path.join(themePath, file);
      const ext = path.extname(file);
      if (['.jpg', '.png', '.jpeg', '.gif'].includes(ext.toLowerCase())) {
        // 캐릭터 이름 추출
        let character = '미지정';
        for (const aliasObj of characterAliases) {
          for (const alias of aliasObj.aliases) {
            if (file.includes(alias)) {
              character = aliasObj.character;
              break;
            }
          }
          if (character !== '미지정') {
            break;
          }
        }

        // 이미지 정보 추가
        imageData.push({
          id: imageData.length + 1,
          character,
          theme: themeFolder,
          imagePath: `images/정리/${themeFolder}/${file}`,
          thumbnailPath: `images/정리/${themeFolder}/${file}`, // 썸네일 경로 (필요 시 별도 처리)
        });
      }
    });
  }
});

// 현재 시간을 ISO 8601 형식으로 얻기
const timestamp = new Date().toISOString();

// JSON 파일로 저장
const outputData = {
  timestamp,
  images: imageData,
};

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf-8');

console.log('이미지 데이터 생성 완료!');
