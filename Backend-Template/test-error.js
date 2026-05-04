const { User } = require('./models');
const { loginUser } = require('./services/authService');

async function test() {
  try {
    const user = await User.findOne({ where: { email: 'hr@hrms.local' } });
    if (!user) console.log('User not found!');
    else console.log('User found:', user.id);

    const res = await loginUser({ email: 'hr@hrms.local', password: 'HR@123456' });
    console.log('Login result:', res.token ? 'Token OK' : 'Failed');
    process.exit(0);
  } catch(e) {
    console.error('CRASH:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}
test();
