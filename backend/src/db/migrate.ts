import { dropAndRecreateTables } from './userSchema';
import { seedDatabase } from './seed';

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Drop and recreate tables
    await dropAndRecreateTables();
    
    // Seed the database with initial data
    await seedDatabase();
    
    console.log('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 