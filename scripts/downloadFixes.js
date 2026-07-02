const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, 'client', 'public', 'assets', 'products');

const fixes = [
  { name: 'Baby Spinach', url: 'https://img.spoonacular.com/ingredients_500x500/spinach.jpg', filename: 'baby-spinach.jpg' },
  { name: 'Bagels', url: 'https://img.spoonacular.com/ingredients_500x500/bagels.jpg', filename: 'bagels.jpg' },
  { name: 'Basmati Rice', url: 'https://img.spoonacular.com/ingredients_500x500/rice-white-long-grain-or-basmatii-cooked.jpg', filename: 'basmati-rice.jpg' },
  { name: 'Bell Peppers', url: 'https://img.spoonacular.com/ingredients_500x500/red-bell-pepper.png', filename: 'bell-peppers.jpg' },
  { name: 'Butter', url: 'https://img.spoonacular.com/ingredients_500x500/butter-sliced.jpg', filename: 'butter.jpg' },
  { name: 'Carrots', url: 'https://img.spoonacular.com/ingredients_500x500/carrots.jpg', filename: 'carrots.jpg' },
  { name: 'Cheese', url: 'https://img.spoonacular.com/ingredients_500x500/cheddar-cheese.png', filename: 'cheese.jpg' },
  { name: 'Cookies', url: 'https://img.spoonacular.com/ingredients_500x500/chocolate-chip-cookie.png', filename: 'cookies.jpg' },
  { name: 'Corn Flakes', url: 'https://img.spoonacular.com/ingredients_500x500/cornflakes.jpg', filename: 'corn-flakes.jpg' },
  { name: 'Croissants', url: 'https://img.spoonacular.com/ingredients_500x500/croissants.jpg', filename: 'croissants.jpg' },
  { name: 'Cucumber', url: 'https://img.spoonacular.com/ingredients_500x500/cucumber.jpg', filename: 'cucumber.jpg' },
  { name: 'Garlic', url: 'https://img.spoonacular.com/ingredients_500x500/garlic.png', filename: 'garlic.jpg' },
  { name: 'Greek Yogurt', url: 'https://img.spoonacular.com/ingredients_500x500/plain-yogurt.jpg', filename: 'greek-yogurt.jpg' },
  { name: 'Lettuce', url: 'https://img.spoonacular.com/ingredients_500x500/iceberg-lettuce.jpg', filename: 'lettuce.jpg' },
  { name: 'Mixed Nuts', url: 'https://img.spoonacular.com/ingredients_500x500/almonds.jpg', filename: 'mixed-nuts.jpg' },
  { name: 'Nachos', url: 'https://img.spoonacular.com/ingredients_500x500/tortilla-chips.jpg', filename: 'nachos.jpg' },
  { name: 'Chia Seeds', url: 'https://img.spoonacular.com/ingredients_500x500/chia-seeds.jpg', filename: 'organic-chia-seeds.jpg' },
  { name: 'Coconut Oil', url: 'https://img.spoonacular.com/ingredients_500x500/coconut-oil.jpg', filename: 'organic-coconut-oil.jpg' },
  { name: 'Green Tea', url: 'https://img.spoonacular.com/ingredients_500x500/tea-bags.jpg', filename: 'organic-green-tea.jpg' },
  { name: 'Organic Honey', url: 'https://img.spoonacular.com/ingredients_500x500/honey.png', filename: 'organic-honey.jpg' },
  { name: 'Peanut Butter', url: 'https://img.spoonacular.com/ingredients_500x500/peanut-butter.png', filename: 'organic-peanut-butter.jpg' },
  { name: 'Paneer', url: 'https://img.spoonacular.com/ingredients_500x500/paneer.png', filename: 'paneer.jpg' },
  { name: 'Pasta', url: 'https://img.spoonacular.com/ingredients_500x500/fusilli.jpg', filename: 'pasta.jpg' },
  { name: 'Potato Chips', url: 'https://img.spoonacular.com/ingredients_500x500/potato-chips.png', filename: 'potato-chips.jpg' },
  { name: 'Quinoa', url: 'https://img.spoonacular.com/ingredients_500x500/quinoa.jpg', filename: 'quinoa.jpg' },
  { name: 'Rolled Oats', url: 'https://img.spoonacular.com/ingredients_500x500/rolled-oats.jpg', filename: 'rolled-oats.jpg' },
  { name: 'Tomato', url: 'https://img.spoonacular.com/ingredients_500x500/tomato.png', filename: 'tomato.jpg' },
  { name: 'Whole Milk', url: 'https://img.spoonacular.com/ingredients_500x500/milk.png', filename: 'whole-milk.jpg' },
  // Unsplash fallback for ones that errored or didn't exist in spoonacular
  { name: 'Granola Bars', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', filename: 'granola-bars.jpg' },
  { name: 'Muffins', url: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=800&q=80', filename: 'muffins.jpg' },
  { name: 'Popcorn', url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&q=80', filename: 'popcorn.jpg' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
  console.log('Downloading fixed images...');
  for (const fix of fixes) {
    const filepath = path.join(ASSETS_DIR, fix.filename);
    try {
      await downloadImage(fix.url, filepath);
      console.log(`Successfully downloaded ${fix.name}`);
    } catch (e) {
      console.error(`Failed to download ${fix.name}: ${e.message}`);
    }
  }
};

main();
