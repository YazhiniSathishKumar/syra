import bcrypt from 'bcrypt';
import Tester from '../models/Tester.model';
import sequelize from '../config/db';

const createTester = async () => {
  await sequelize.sync();

  const email = 'lead@cyberxpertz.org';
  const password = 'P&,3x.t5-Xl2.#67,cL@&';
  const fullName = 'CyberXpert Lead';

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = 'Tester';

  await Tester.create({
    fullName,
    email,
    hashedPassword,
    role
  });

  console.log('Tester created successfully.');
  process.exit(0);
};

createTester().catch(err => {
  console.error(err);
  process.exit(1);
});
