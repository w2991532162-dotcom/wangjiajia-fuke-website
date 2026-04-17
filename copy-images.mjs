import fs from 'fs';
import path from 'path';

const sourceDir = '/Users/bytedance/Documents/王佳佳工作文件夹/作品集+复刻静态网站/图片素材';
const targetDir = '/Users/bytedance/Documents/王佳佳工作文件夹/作品集+复刻静态网站/复刻网站/images';

const images = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png'];

images.forEach(img => {
  const src = path.join(sourceDir, img);
  const dest = path.join(targetDir, img);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied: ' + img);
  } else {
    console.log('Not found: ' + img);
  }
});

console.log('Done!');
