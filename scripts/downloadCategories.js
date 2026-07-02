const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, 'client', 'public', 'assets', 'categories');

const categories = [
  { name: 'fruits', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
  { name: 'vegetables', url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80' },
  { name: 'dairy', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80' },
  { name: 'bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { name: 'beverages', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80' },
  { name: 'snacks', url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80' },
  { name: 'grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
  { name: 'meat', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' },
  { name: 'frozen', url: 'https://images.unsplash.com/photo-1556751221-72922765d777?w=400&q=80' },
  { name: 'organic', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
};

const main = async () => {
  console.log('Downloading category icons...');
  for (const cat of categories) {
    const filepath = path.join(ASSETS_DIR, `${cat.name}.jpg`);
    try {
      await downloadImage(cat.url, filepath);
      console.log(`Downloaded ${cat.name}`);
    } catch (e) {
      console.error(`Failed ${cat.name}:`, e.message);
    }
  }
};

main();
