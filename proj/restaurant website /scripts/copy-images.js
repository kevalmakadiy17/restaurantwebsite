import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  'burger.jpg',
  'pizza.jpg',
  'salad.jpg',
  'cake.jpg',
  'coffee.jpg',
  'category-starters.jpg',
  'category-mains.jpg',
  'category-desserts.jpg',
  'category-drinks.jpg'
];

const copyImages = async () => {
  try {
    // Create static directory if it doesn't exist
    const staticDir = path.join(__dirname, '../public/static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Copy each image
    for (const image of images) {
      const sourcePath = path.join(__dirname, '../public/menu', image);
      const destPath = path.join(staticDir, image);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${image} to static directory`);
      } else {
        console.log(`Warning: ${image} not found in menu directory`);
      }
    }

    console.log('All images copied successfully!');
  } catch (error) {
    console.error('Error copying images:', error);
  }
};

copyImages(); 