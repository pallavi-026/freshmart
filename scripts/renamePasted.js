const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'public', 'assets', 'products');

// Map pasted filename to the target correct filename
const replacements = {
  'bagels copy.jpg': 'bagels.jpg',
  'basmatirice.jpg': 'basmati-rice.jpg',
  'bell-peppers copy.jpg': 'bell-peppers.jpg',
  'carrots copy.jpg': 'carrots.jpg',
  'cheese.webp': 'cheese.webp', // Need to update mapping
  'coconut oil.webp': 'organic-coconut-oil.webp', // Need to update mapping
  'cookies copy.jpg': 'cookies.jpg',
  'green-tea.jpg': 'organic-green-tea.jpg',
  'honey.jpg': 'organic-honey.jpg',
  'mixednuts.jpg': 'mixed-nuts.jpg',
  'muffin.jpg': 'muffins.jpg',
  'onions.jpg': 'onion.jpg',
  'pasta.webp': 'pasta.webp', // Need to update mapping
  'popcorn copy.jpg': 'popcorn.jpg',
  'potatochips.jpg': 'potato-chips.jpg',
  'quinona.jpg': 'quinoa.jpg',
  'rolled-oats copy.jpg': 'rolled-oats.jpg',
  'tomato copy.jpg': 'tomato.jpg',
  'white-bread.jpg': 'whole-wheat-bread.jpg',
  'whole_milk.jpg': 'whole-milk.jpg'
};

const toDelete = [
  'cheese.jpg',
  'organic-coconut-oil.jpg',
  'pasta.jpg',
  'oragne.jpg' // Typo user made
];

for (const [pasted, target] of Object.entries(replacements)) {
  const pastedPath = path.join(dir, pasted);
  const targetPath = path.join(dir, target);

  if (fs.existsSync(pastedPath)) {
    // If we are replacing an existing file with a different name, delete the old target first
    if (fs.existsSync(targetPath) && pasted !== target) {
      fs.unlinkSync(targetPath);
    }
    
    // Rename pasted to target
    fs.renameSync(pastedPath, targetPath);
    console.log(`Renamed ${pasted} to ${target}`);
  }
}

for (const file of toDelete) {
  const p = path.join(dir, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Deleted old file ${file}`);
  }
}

// Now update productImages.js
const dataFile = path.join(__dirname, 'client', 'src', 'data', 'productImages.js');
let dataContent = fs.readFileSync(dataFile, 'utf8');

// The ones that changed extensions
dataContent = dataContent.replace(/"Cheese": "\/assets\/products\/cheese.jpg"/g, '"Cheese": "/assets/products/cheese.webp"');
dataContent = dataContent.replace(/"Organic Coconut Oil": "\/assets\/products\/organic-coconut-oil.jpg"/g, '"Organic Coconut Oil": "/assets/products/organic-coconut-oil.webp"');
dataContent = dataContent.replace(/"Pasta": "\/assets\/products\/pasta.jpg"/g, '"Pasta": "/assets/products/pasta.webp"');

fs.writeFileSync(dataFile, dataContent);
console.log('Updated productImages.js');
