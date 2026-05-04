const { User } = require('./models');

async function seedHR() {
  let retries = 5;
  while (retries > 0) {
    try {
      console.log('Attempting to seed HR user...');
      const user = await User.findOne({ where: { email: 'hr@hrms.local' } });
      if (!user) {
        await User.create({
          firstName: 'Master',
          lastName: 'HR',
          email: 'hr@hrms.local',
          password: 'HR@123456',
          role: 'hr',
          designation: 'HR Manager',
          department: 'Human Resources'
        });
        console.log('✅ Master HR User successfully created.');
      } else {
        console.log('✅ HR User already exists.');
      }
      break; 
    } catch (error) {
      if (error.name === 'SequelizeTimeoutError' || error.message.includes('SQLITE_BUSY')) {
        console.log('Database locked, retrying in 2 seconds...');
        retries--;
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('❌ Error seeding HR:', error.message);
        break;
      }
    }
  }
}

seedHR();
