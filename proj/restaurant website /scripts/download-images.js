import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  'burger.jpg': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'pizza.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'salad.jpg': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  'cake.jpg': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  'coffee.jpg': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'hero-image.jpg': 'https://images.unsplash.com/photo-1517248135467-4c60ed4d49e1?auto=format&fit=crop&w=1200&q=80',
  'category-starters.jpg': 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
  'category-mains.jpg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  'category-desserts.jpg': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  'category-drinks.jpg': 'https://images.unsplash.com/photo-1513558161293-caf765ed2fd?auto=format&fit=crop&w=800&q=80'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, '../public/menu', filename));
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(__dirname, '../public/menu', filename), () => {});
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  try {
    // Create directories if they don't exist
    if (!fs.existsSync(path.join(__dirname, '../public/menu'))) {
      fs.mkdirSync(path.join(__dirname, '../public/menu'), { recursive: true });
    }

    // Download all images
    for (const [filename, url] of Object.entries(images)) {
      try {
        await downloadImage(url, filename);
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error.message);
      }
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAllImages(); 