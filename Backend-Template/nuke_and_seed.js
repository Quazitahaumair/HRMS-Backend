const { sequelize, User } = require('./models');

async function resetAndSeed() {
  console.log('🚮 Wiping database and recreating tables...');
  try {
    // Force sync deletes all data and recreates tables based on current models
    await sequelize.sync({ force: true });
    console.log('✅ Database wiped successfully.');

    // Seed the Master HR User
    console.log('🌱 Seeding Master HR User...');
    const hrUser = await User.create({
      firstName: 'Master',
      lastName: 'HR',
      email: 'hr@hrms.local',
      password: 'HR@123456',
      role: 'hr',
      designation: 'HR Manager',
      department: 'Human Resources',
      status: 'active'
    });

    console.log('✅ HR User Created:');
    console.log(`   Email: ${hrUser.email}`);
    console.log(`   Role: ${hrUser.role}`);
    console.log(`   Password: HR@123456`);

    console.log('\n🚀 ALL DONE! Your HRMS is now clean and ready for IT management.');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR during reset:', error.message);
    process.exit(1);
  }
}

resetAndSeed();
