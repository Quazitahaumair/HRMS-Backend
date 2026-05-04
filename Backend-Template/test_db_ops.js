const { Leave, User } = require('./models');

async function testDb() {
  try {
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please run seeders.');
      process.exit(0);
    }
    
    console.log('Using user:', user.email);
    
    const leave = await Leave.create({
      userId: user.id,
      leaveType: 'sick',
      startDate: new Date(),
      endDate: new Date(),
      reason: 'test'
    });
    
    console.log('Created leave:', leave.id);
    
    const allLeaves = await Leave.findAll();
    console.log('Total leaves in DB:', allLeaves.length);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testDb();
