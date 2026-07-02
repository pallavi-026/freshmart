const https = require('https');

const names = [
  'almonds.jpg', 'walnuts.jpg', 'cashews.jpg', 'mixed-nuts',
  'cereal-bar.jpg', 'protein-bar.jpg', 'energy-bar.jpg',
  'bran-muffin.jpg', 'blueberry-muffin.jpg',
  'tea-bags.jpg', 'matcha-powder.jpg'
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
