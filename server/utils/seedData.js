const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  // Fruits
  { name: 'Red Apple', description: 'Fresh red apple', price: 1.49, category: 'Fruits', image: '/assets/products/red-apple.webp', stock: 150, unit: '1 kg' },
  { name: 'Banana', description: 'Fresh yellow banana', price: 1.29, category: 'Fruits', image: '/assets/products/banana.webp', stock: 200, unit: '1 kg' },
  { name: 'Green Grapes', description: 'Fresh green grapes', price: 3.99, category: 'Fruits', image: '/assets/products/green-grapes.webp', stock: 100, unit: '500g' },
  { name: 'Watermelon', description: 'Fresh whole watermelon', price: 5.99, category: 'Fruits', image: '/assets/products/watermelon.webp', stock: 50, unit: '1 piece' },
  { name: 'Strawberry', description: 'Fresh sweet strawberries', price: 4.49, category: 'Fruits', image: '/assets/products/strawberry.webp', stock: 80, unit: '250g' },
  { name: 'Orange', description: 'Juicy fresh oranges', price: 2.49, category: 'Fruits', image: '/assets/products/orange.webp', stock: 120, unit: '1 kg' },
  { name: 'Blueberries', description: 'Fresh blueberries', price: 4.99, category: 'Fruits', image: '/assets/products/blueberries.webp', stock: 90, unit: '125g' },
  { name: 'Pomegranate', description: 'Fresh pomegranate', price: 3.49, category: 'Fruits', image: '/assets/products/pomegranate.webp', stock: 60, unit: '1 piece' },
  { name: 'Mango', description: 'Fresh yellow mango', price: 2.99, category: 'Fruits', image: '/assets/products/mango.webp', stock: 100, unit: '1 kg' },
  { name: 'Papaya', description: 'Fresh papaya', price: 3.99, category: 'Fruits', image: '/assets/products/papaya.webp', stock: 40, unit: '1 piece' },
  { name: 'Pineapple', description: 'Fresh pineapple', price: 4.49, category: 'Fruits', image: '/assets/products/pineapple.webp', stock: 50, unit: '1 piece' },
  { name: 'Kiwi', description: 'Fresh green kiwi', price: 3.99, category: 'Fruits', image: '/assets/products/kiwi.webp', stock: 70, unit: '500g' },
  { name: 'Avocado', description: 'Fresh green avocado', price: 1.49, category: 'Fruits', image: '/assets/products/avocado.webp', stock: 100, unit: '1 piece' },
  { name: 'Lemon', description: 'Fresh yellow lemon', price: 0.99, category: 'Fruits', image: '/assets/products/lemon.webp', stock: 150, unit: '500g' },
  { name: 'Dragon Fruit', description: 'Fresh dragon fruit', price: 5.99, category: 'Fruits', image: '/assets/products/dragon-fruit.webp', stock: 40, unit: '1 piece' },

  // Vegetables
  { name: 'Broccoli', description: 'Fresh green broccoli', price: 2.99, category: 'Vegetables', image: '/assets/products/broccoli.webp', stock: 80, unit: '1 piece' },
  { name: 'Carrots', description: 'Fresh orange carrots', price: 1.99, category: 'Vegetables', image: '/assets/products/carrots.webp', stock: 120, unit: '1 kg' },
  { name: 'Bell Peppers', description: 'Fresh bell peppers', price: 3.49, category: 'Vegetables', image: '/assets/products/bell-peppers.webp', stock: 90, unit: '500g' },
  { name: 'Baby Spinach', description: 'Fresh baby spinach leaves', price: 2.49, category: 'Vegetables', image: '/assets/products/baby-spinach.webp', stock: 100, unit: '250g' },
  { name: 'Tomato', description: 'Fresh red tomatoes', price: 2.99, category: 'Vegetables', image: '/assets/products/tomato.webp', stock: 150, unit: '1 kg' },
  { name: 'Onion', description: 'Fresh onions', price: 1.49, category: 'Vegetables', image: '/assets/products/onion.webp', stock: 200, unit: '1 kg' },
  { name: 'Potato', description: 'Fresh potatoes', price: 1.99, category: 'Vegetables', image: '/assets/products/potato.webp', stock: 200, unit: '1 kg' },
  { name: 'Cucumber', description: 'Fresh green cucumber', price: 1.49, category: 'Vegetables', image: '/assets/products/cucumber.webp', stock: 120, unit: '500g' },
  { name: 'Lettuce', description: 'Fresh lettuce', price: 1.99, category: 'Vegetables', image: '/assets/products/lettuce.webp', stock: 80, unit: '1 piece' },
  { name: 'Garlic', description: 'Fresh garlic bulbs', price: 2.99, category: 'Vegetables', image: '/assets/products/garlic.webp', stock: 100, unit: '250g' },

  // Dairy
  { name: 'Whole Milk', description: 'Fresh whole milk', price: 3.49, category: 'Dairy', image: '/assets/products/whole-milk.webp', stock: 100, unit: '1 liter' },
  { name: 'Greek Yogurt', description: 'Thick greek yogurt', price: 4.49, category: 'Dairy', image: '/assets/products/greek-yogurt.webp', stock: 80, unit: '500g' },
  { name: 'Butter', description: 'Fresh unsalted butter', price: 4.99, category: 'Dairy', image: '/assets/products/butter.webp', stock: 90, unit: '250g' },
  { name: 'Cheese', description: 'Cheddar cheese block', price: 5.99, category: 'Dairy', image: '/assets/products/cheese.webp', stock: 70, unit: '200g' },
  { name: 'Paneer', description: 'Fresh cottage cheese', price: 6.49, category: 'Dairy', image: '/assets/products/paneer.webp', stock: 60, unit: '200g' },

  // Bakery
  { name: 'Whole Wheat Bread', description: 'Fresh whole wheat loaf', price: 3.99, category: 'Bakery', image: '/assets/products/whole-wheat-bread.webp', stock: 50, unit: '1 loaf' },
  { name: 'Croissants', description: 'Fresh butter croissants', price: 4.99, category: 'Bakery', image: '/assets/products/croissants.webp', stock: 40, unit: '4 pieces' },
  { name: 'Bagels', description: 'Fresh plain bagels', price: 3.49, category: 'Bakery', image: '/assets/products/bagels.webp', stock: 60, unit: '4 pieces' },
  { name: 'Muffins', description: 'Fresh blueberry muffins', price: 4.49, category: 'Bakery', image: '/assets/products/muffins.webp', stock: 50, unit: '4 pieces' },
  { name: 'Cookies', description: 'Chocolate chip cookies', price: 3.99, category: 'Bakery', image: '/assets/products/cookies.webp', stock: 80, unit: '250g' },

  // Snacks
  { name: 'Granola Bars', description: 'Healthy granola bars', price: 4.99, category: 'Snacks', image: '/assets/products/granola-bars.webp', stock: 100, unit: '6 pieces' },
  { name: 'Mixed Nuts', description: 'Premium mixed nuts', price: 8.99, category: 'Snacks', image: '/assets/products/mixed-nuts.webp', stock: 70, unit: '200g' },
  { name: 'Potato Chips', description: 'Classic potato chips', price: 2.99, category: 'Snacks', image: '/assets/products/potato-chips.webp', stock: 120, unit: '150g' },
  { name: 'Popcorn', description: 'Butter popcorn', price: 2.49, category: 'Snacks', image: '/assets/products/popcorn.webp', stock: 100, unit: '100g' },
  { name: 'Nachos', description: 'Crispy nachos chips', price: 3.49, category: 'Snacks', image: '/assets/products/nachos.webp', stock: 90, unit: '150g' },

  // Grains
  { name: 'Basmati Rice', description: 'Premium basmati rice', price: 9.99, category: 'Grains', image: '/assets/products/basmati-rice.webp', stock: 80, unit: '1 kg' },
  { name: 'Pasta', description: 'Italian fusilli pasta', price: 2.99, category: 'Grains', image: '/assets/products/pasta.webp', stock: 120, unit: '500g' },
  { name: 'Rolled Oats', description: 'Healthy rolled oats', price: 4.49, category: 'Grains', image: '/assets/products/rolled-oats.webp', stock: 90, unit: '500g' },
  { name: 'Quinoa', description: 'Organic white quinoa', price: 7.99, category: 'Grains', image: '/assets/products/quinoa.webp', stock: 60, unit: '500g' },
  { name: 'Corn Flakes', description: 'Crispy corn flakes', price: 3.99, category: 'Grains', image: '/assets/products/corn-flakes.webp', stock: 80, unit: '500g' },

  // Organic
  { name: 'Organic Honey', description: 'Pure raw organic honey', price: 8.99, category: 'Organic', image: '/assets/products/organic-honey.webp', stock: 50, unit: '250g' },
  { name: 'Organic Chia Seeds', description: 'Organic chia seeds', price: 5.99, category: 'Organic', image: '/assets/products/organic-chia-seeds.webp', stock: 70, unit: '250g' },
  { name: 'Organic Coconut Oil', description: 'Cold pressed coconut oil', price: 9.99, category: 'Organic', image: '/assets/products/organic-coconut-oil.webp', stock: 60, unit: '500ml' },
  { name: 'Organic Peanut Butter', description: 'Creamy organic peanut butter', price: 6.49, category: 'Organic', image: '/assets/products/organic-peanut-butter.webp', stock: 80, unit: '500g' },
  { name: 'Organic Green Tea', description: 'Premium organic green tea bags', price: 5.49, category: 'Organic', image: '/assets/products/organic-green-tea.webp', stock: 90, unit: '25 bags' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
