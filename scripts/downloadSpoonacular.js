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
  // Fruits
  { name: 'Red Apple', spoonName: 'apple.jpg', filename: 'red-apple.jpg' },
  { name: 'Banana', spoonName: 'bananas.jpg', filename: 'banana.jpg' },
  { name: 'Green Grapes', spoonName: 'green-grapes.jpg', filename: 'green-grapes.jpg' },
  { name: 'Watermelon', spoonName: 'watermelon.png', filename: 'watermelon.jpg' },
  { name: 'Strawberry', spoonName: 'strawberries.png', filename: 'strawberry.jpg' },
  { name: 'Orange', spoonName: 'orange.png', filename: 'orange.jpg' },
  { name: 'Blueberries', spoonName: 'blueberries.jpg', filename: 'blueberries.jpg' },
  { name: 'Pomegranate', spoonName: 'pomegranate.jpg', filename: 'pomegranate.jpg' },
  { name: 'Mango', spoonName: 'mango.jpg', filename: 'mango.jpg' },
  { name: 'Papaya', spoonName: 'papaya.png', filename: 'papaya.jpg' },
  { name: 'Pineapple', spoonName: 'pineapple.jpg', filename: 'pineapple.jpg' },
  { name: 'Kiwi', spoonName: 'kiwi.png', filename: 'kiwi.jpg' },
  { name: 'Avocado', spoonName: 'avocado.jpg', filename: 'avocado.jpg' },
  { name: 'Lemon', spoonName: 'lemon.png', filename: 'lemon.jpg' },
  { name: 'Dragon Fruit', spoonName: 'dragon-fruit.jpg', filename: 'dragon-fruit.jpg' },

  // Vegetables
  { name: 'Broccoli', spoonName: 'broccoli.jpg', filename: 'broccoli.jpg' },
  { name: 'Carrots', spoonName: 'carrots.jpg', filename: 'carrots.jpg' },
  { name: 'Bell Peppers', spoonName: 'red-bell-pepper.png', filename: 'bell-peppers.jpg' },
  { name: 'Baby Spinach', spoonName: 'spinach.jpg', filename: 'baby-spinach.jpg' },
  { name: 'Tomato', spoonName: 'tomato.png', filename: 'tomato.jpg' },
  { name: 'Onion', spoonName: 'brown-onion.png', filename: 'onion.jpg' },
  { name: 'Potato', spoonName: 'potatoes-yukon-gold.png', filename: 'potato.jpg' },
  { name: 'Cucumber', spoonName: 'cucumber.jpg', filename: 'cucumber.jpg' },
  { name: 'Lettuce', spoonName: 'iceberg-lettuce.jpg', filename: 'lettuce.jpg' },
  { name: 'Garlic', spoonName: 'garlic.png', filename: 'garlic.jpg' },

  // Dairy
  { name: 'Whole Milk', spoonName: 'milk.png', filename: 'whole-milk.jpg' },
  { name: 'Greek Yogurt', spoonName: 'plain-yogurt.jpg', filename: 'greek-yogurt.jpg' },
  { name: 'Butter', spoonName: 'butter-sliced.jpg', filename: 'butter.jpg' },
  { name: 'Cheese', spoonName: 'cheddar-cheese.png', filename: 'cheese.jpg' },
  { name: 'Paneer', spoonName: 'paneer.png', filename: 'paneer.jpg' },

  // Bakery
  { name: 'Whole Wheat Bread', spoonName: 'whole-wheat-bread.jpg', filename: 'whole-wheat-bread.jpg' },
  { name: 'Croissants', spoonName: 'croissants.jpg', filename: 'croissants.jpg' },
  { name: 'Bagels', spoonName: 'bagels.jpg', filename: 'bagels.jpg' },
  { name: 'Muffins', spoonName: 'muffin.png', filename: 'muffins.jpg' },
  { name: 'Cookies', spoonName: 'chocolate-chip-cookie.png', filename: 'cookies.jpg' },

  // Snacks
  { name: 'Granola Bars', spoonName: 'granola-bar.jpg', filename: 'granola-bars.jpg' },
  { name: 'Mixed Nuts', spoonName: 'mixed-nuts.png', filename: 'mixed-nuts.jpg' },
  { name: 'Potato Chips', spoonName: 'potato-chips.png', filename: 'potato-chips.jpg' },
  { name: 'Popcorn', spoonName: 'popcorn.png', filename: 'popcorn.jpg' },
  { name: 'Nachos', spoonName: 'tortilla-chips.jpg', filename: 'nachos.jpg' },

  // Grains
  { name: 'Basmati Rice', spoonName: 'rice-white-long-grain-or-basmatii-cooked.jpg', filename: 'basmati-rice.jpg' },
  { name: 'Pasta', spoonName: 'fusilli.jpg', filename: 'pasta.jpg' },
  { name: 'Rolled Oats', spoonName: 'rolled-oats.jpg', filename: 'rolled-oats.jpg' },
  { name: 'Quinoa', spoonName: 'quinoa.png', filename: 'quinoa.jpg' },
  { name: 'Corn Flakes', spoonName: 'cornflakes.jpg', filename: 'corn-flakes.jpg' },

  // Organic
  { name: 'Organic Honey', spoonName: 'honey.png', filename: 'organic-honey.jpg' },
  { name: 'Organic Chia Seeds', spoonName: 'chia-seeds.jpg', filename: 'organic-chia-seeds.jpg' },
  { name: 'Organic Coconut Oil', spoonName: 'coconut-oil.jpg', filename: 'organic-coconut-oil.jpg' },
  { name: 'Organic Peanut Butter', spoonName: 'peanut-butter.png', filename: 'organic-peanut-butter.jpg' },
  { name: 'Organic Green Tea', spoonName: 'green-tea.png', filename: 'organic-green-tea.jpg' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode} for ${url}`));
        return;
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
  console.log('Downloading Spoonacular product images...');
  let mappingContent = 'export const productImages = {\n';

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const filepath = path.join(ASSETS_DIR, 'products', prod.filename);
    const url = `https://img.spoonacular.com/ingredients_500x500/${prod.spoonName}`;
    try {
      if (!fs.existsSync(filepath)) {
        await downloadImage(url, filepath);
        console.log(`[${i+1}/${products.length}] Downloaded ${prod.name}`);
      } else {
        console.log(`[${i+1}/${products.length}] Skipped ${prod.name} (exists)`);
      }
    } catch (e) {
      console.error(`[${i+1}/${products.length}] Failed to download ${prod.name} from ${url}:`, e.message);
      // Fallback: copy a generated image or use a generic one
    }
    mappingContent += `  "${prod.name}": "/assets/products/${prod.filename}",\n`;
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
