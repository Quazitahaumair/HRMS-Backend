const { Leave, User } = require('./models');

async function nuke() {
  console.log('🚀 Starting Nuke: Deleting all Admin leaves...');
  try {
    // 1. Find all users who are NOT employees
    const usersToNuke = await User.findAll({ 
      where: { 
        role: ['admin', 'hr'] 
      } 
    });

    const userIds = usersToNuke.map(u => u.id);

    if (userIds.length > 0) {
      // 2. Delete all leaves belonging to those users
      const deletedCount = await Leave.destroy({ 
        where: { 
          userId: userIds 
        } 
      });
      console.log(`✅ SUCCESS: Permanently deleted ${deletedCount} admin/hr leave requests.`);
    } else {
      console.log('❓ No Admin/HR users found in the database.');
    }
    
    console.log('Done. Your database is now clean.');
    process.exit(0);
  } catch (err) {
    console.error('❌ FATAL ERROR during nuke:', err.message);
    process.exit(1);
  }
}

nuke();
