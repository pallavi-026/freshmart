const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, 'client', 'public', 'assets');
const DIRS = [
  path.join(ASSETS_DIR, 'products'),
  path.join(ASSETS_DIR, 'categories'),
  path.join(ASSETS_DIR, 'banners'),
  path.join(ASSETS_DIR, 'hero')
];

DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const products = [
  { name: 'Red Apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80', filename: 'red-apple.jpg' },
  { name: 'Banana', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80', filename: 'banana.jpg' },
  { name: 'Green Grapes', url: 'https://images.unsplash.com/photo-1596368708356-6e1ce3378e19?w=800&q=80', filename: 'green-grapes.jpg' },
  { name: 'Watermelon', url: 'https://images.unsplash.com/photo-1582281268143-085e347895e6?w=800&q=80', filename: 'watermelon.jpg' },
  { name: 'Strawberry', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', filename: 'strawberry.jpg' },
  { name: 'Orange', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80', filename: 'orange.jpg' },
  { name: 'Blueberries', url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80', filename: 'blueberries.jpg' },
  { name: 'Pomegranate', url: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=800&q=80', filename: 'pomegranate.jpg' },
  { name: 'Mango', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80', filename: 'mango.jpg' },
  { name: 'Papaya', url: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=800&q=80', filename: 'papaya.jpg' },
  { name: 'Pineapple', url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80', filename: 'pineapple.jpg' },
  { name: 'Kiwi', url: 'https://images.unsplash.com/photo-1585059895524-72359aa06102?w=800&q=80', filename: 'kiwi.jpg' },
  { name: 'Avocado', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80', filename: 'avocado.jpg' },
  { name: 'Lemon', url: 'https://images.unsplash.com/photo-1566842600175-97dca489844f?w=800&q=80', filename: 'lemon.jpg' },
  { name: 'Dragon Fruit', url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=800&q=80', filename: 'dragon-fruit.jpg' },
  
  { name: 'Broccoli', url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80', filename: 'broccoli.jpg' },
  { name: 'Carrots', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80', filename: 'carrots.jpg' },
  { name: 'Bell Peppers', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80', filename: 'bell-peppers.jpg' },
  { name: 'Baby Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80', filename: 'baby-spinach.jpg' },
  { name: 'Tomato', url: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=800&q=80', filename: 'tomato.jpg' },
  { name: 'Onion', url: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=800&q=80', filename: 'onion.jpg' },
  { name: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80', filename: 'potato.jpg' },
  { name: 'Cucumber', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', filename: 'cucumber.jpg' },
  { name: 'Lettuce', url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&q=80', filename: 'lettuce.jpg' },
  { name: 'Garlic', url: 'https://images.unsplash.com/photo-1540148426945-0441b6be1ce3?w=800&q=80', filename: 'garlic.jpg' },

  { name: 'Whole Milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80', filename: 'whole-milk.jpg' },
  { name: 'Greek Yogurt', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', filename: 'greek-yogurt.jpg' },
  { name: 'Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80', filename: 'butter.jpg' },
  { name: 'Cheese', url: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&q=80', filename: 'cheese.jpg' },
  { name: 'Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&q=80', filename: 'paneer.jpg' },

  { name: 'Whole Wheat Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', filename: 'whole-wheat-bread.jpg' },
  { name: 'Croissants', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&q=80', filename: 'croissants.jpg' },
  { name: 'Bagels', url: 'https://images.unsplash.com/photo-1585535065945-81a0b22b9656?w=800&q=80', filename: 'bagels.jpg' },
  { name: 'Muffins', url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80', filename: 'muffins.jpg' },
  { name: 'Cookies', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80', filename: 'cookies.jpg' },

  { name: 'Granola Bars', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', filename: 'granola-bars.jpg' },
  { name: 'Mixed Nuts', url: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800&q=80', filename: 'mixed-nuts.jpg' },
  { name: 'Potato Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80', filename: 'potato-chips.jpg' },
  { name: 'Popcorn', url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&q=80', filename: 'popcorn.jpg' },
  { name: 'Nachos', url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80', filename: 'nachos.jpg' },

  { name: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', filename: 'basmati-rice.jpg' },
  { name: 'Pasta', url: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&q=80', filename: 'pasta.jpg' },
  { name: 'Rolled Oats', url: 'https://images.unsplash.com/photo-1614961233913-a5113e3d5f76?w=800&q=80', filename: 'rolled-oats.jpg' },
  { name: 'Quinoa', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', filename: 'quinoa.jpg' },
  { name: 'Corn Flakes', url: 'https://images.unsplash.com/photo-1504310378051-fb18d40a2bb8?w=800&q=80', filename: 'corn-flakes.jpg' },

  { name: 'Organic Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80', filename: 'organic-honey.jpg' },
  { name: 'Organic Chia Seeds', url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&q=80', filename: 'organic-chia-seeds.jpg' },
  { name: 'Organic Coconut Oil', url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&q=80', filename: 'organic-coconut-oil.jpg' },
  { name: 'Organic Peanut Butter', url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80', filename: 'organic-peanut-butter.jpg' },
  { name: 'Organic Green Tea', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80', filename: 'organic-green-tea.jpg' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects if any
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const main = async () => {
  console.log('Starting image downloads...');
  let mappingContent = 'export const productImages = {\n';

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const filepath = path.join(ASSETS_DIR, 'products', prod.filename);
    try {
      if (!fs.existsSync(filepath)) {
        await downloadImage(prod.url, filepath);
        console.log(`[${i+1}/${products.length}] Downloaded ${prod.name}`);
      } else {
        console.log(`[${i+1}/${products.length}] Skipped ${prod.name} (already exists)`);
      }
      mappingContent += `  "${prod.name}": "/assets/products/${prod.filename}",\n`;
    } catch (e) {
      console.error(`Failed to download ${prod.name}:`, e.message);
    }
  }

  mappingContent += '};\n';
  
  const dataDir = path.join(__dirname, 'client', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'productImages.js'), mappingContent);
  console.log('Mapping file generated at src/data/productImages.js');
};

main();
