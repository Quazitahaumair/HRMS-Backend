const { User, Leave } = require('./models');

async function debugData() {
  try {
    const users = await User.findAll({ attributes: ['id', 'firstName', 'lastName', 'role'] });
    console.log('--- ALL USERS ---');
    users.forEach(u => console.log(`${u.firstName} ${u.lastName} | Role: "${u.role}" | ID: ${u.id}`));

    const leaves = await Leave.findAll({ include: [{ model: User, as: 'user' }] });
    console.log('\n--- ALL LEAVES ---');
    leaves.forEach(l => {
      const u = l.user || {};
      console.log(`Leave ID: ${l.id} | User: ${u.firstName} ${u.lastName} | UserRole: "${u.role}" | Status: ${l.status}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugData();
