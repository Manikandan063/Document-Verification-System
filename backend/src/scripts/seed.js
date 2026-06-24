require('dotenv').config();
const { sequelize, connectDB } = require('../config/db');
const { initModels } = require('../models/initModels');
const User = require('../modules/auth/auth.model');
const { hashPassword } = require('../shared/utils/hash.util');

const seedUsers = async () => {
  try {
    await connectDB();
    await initModels();

    const users = [
      { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'Admin' },
      { name: 'HR Exec', email: 'hrexec@test.com', password: 'password123', role: 'HR Executive' },
      { name: 'HR Manager', email: 'hrmanager@test.com', password: 'password123', role: 'HR Manager' },
      { name: 'Ops Manager', email: 'opsmanager@test.com', password: 'password123', role: 'Operations Manager' },
      { name: 'Director User', email: 'director@test.com', password: 'password123', role: 'Director' }
    ];

    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      await User.findOrCreate({
        where: { email: user.email },
        defaults: {
          name: user.name,
          password: hashedPassword,
          role: user.role
        }
      });
    }

    console.log('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
