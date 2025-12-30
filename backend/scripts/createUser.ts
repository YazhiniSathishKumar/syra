import bcrypt from 'bcrypt';
import User from '../models/User.model';
import sequelize from '../config/db';

const createUser = async () => {
  try {
    await sequelize.sync();

    const fullName = 'BCBDEV';
    const email = 'bcbdev1@gmail.com';
    const password = 'ASdfgbkiuyf#$56787654:">'; // replace this
    const role = 'client';

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: false
    });

    console.log('✅ User created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    process.exit(1);
  }
};

createUser();
