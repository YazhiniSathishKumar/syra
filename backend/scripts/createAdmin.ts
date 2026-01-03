import bcrypt from 'bcrypt';
import Admin from '../models/Admin.model';
import sequelize from '../config/db';

(async () => {
  await sequelize.sync();

  const email = 'cyapp@bcbuzz.io';
  const password = '67,cL@&.P&3,xt5Xl2#';

  const hashedEmail = await bcrypt.hash(email, 10);
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne(); // only allow 1 admin
  if (!existing) {
    await Admin.create({ email, hashedEmail, hashedPassword });
    console.log('✅ Admin created successfully');
  } else {
    console.log('⚠️ Admin already exists');
  }

  process.exit();
})();
