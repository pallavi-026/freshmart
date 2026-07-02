require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');

  // 1. Delete all @grocery.com fake accounts
  const deleted = await User.deleteMany({ email: /@grocery\.com$/ });
  console.log(`✅ Deleted ${deleted.deletedCount} fake @grocery.com accounts`);

  // 2. Make sayeedmd4730@gmail.com an admin
  const updated = await User.findOneAndUpdate(
    { email: 'sayeedmd4730@gmail.com' },
    { isAdmin: true },
    { new: true }
  );

  if (updated) {
    console.log(`✅ ${updated.email} is now an admin`);
  } else {
    console.log('❌ User sayeedmd4730@gmail.com not found in database');
    console.log('   (Log in with Google first, then run this script again)');
  }

  // 3. Show remaining users
  const users = await User.find({}).select('email isAdmin');
  console.log('\n📋 Remaining users in database:');
  users.forEach(u => console.log(`  - ${u.email} | admin: ${u.isAdmin}`));

  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
