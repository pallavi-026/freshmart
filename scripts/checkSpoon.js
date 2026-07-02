const https = require('https');

const names = [
  'spinach.jpg', 'bagels.jpg', 'basmati-rice.jpg', 'rice-white-long-grain-or-basmatii-cooked.jpg',
  'bell-pepper.jpg', 'red-bell-pepper.png', 'butter.jpg', 'butter-sliced.jpg',
  'carrots.jpg', 'cheese.jpg', 'cheddar-cheese.png', 'cookies.jpg', 'chocolate-chip-cookie.png',
  'cornflakes.jpg', 'croissant.jpg', 'croissants.jpg', 'cucumber.jpg', 'garlic.jpg', 'garlic.png',
  'granola-bar.jpg', 'yogurt.jpg', 'plain-yogurt.jpg', 'lettuce.jpg', 'iceberg-lettuce.jpg',
  'mixed-nuts.png', 'mixed-nuts.jpg', 'muffin.jpg', 'muffin.png', 'nachos.jpg', 'tortilla-chips.jpg',
  'chia-seeds.jpg', 'coconut-oil.jpg', 'green-tea.jpg', 'green-tea.png', 'honey.jpg', 'honey.png',
  'peanut-butter.jpg', 'peanut-butter.png', 'paneer.jpg', 'paneer.png', 'pasta.jpg', 'fusilli.jpg',
  'potato-chips.jpg', 'potato-chips.png', 'quinoa.jpg', 'quinoa.png', 'rolled-oats.jpg',
  'tomato.jpg', 'tomato.png', 'milk.jpg', 'milk.png'
];

const check = (name) => {
  return new Promise((resolve) => {
    https.get(`https://img.spoonacular.com/ingredients_500x500/${name}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      resolve({ name, status: res.statusCode });
    }).on('error', () => resolve({ name, status: 500 }));
  });
};

Promise.all(names.map(check)).then(results => {
  const good = results.filter(r => r.status === 200).map(r => r.name);
  console.log('Good:', good.join(', '));
});
