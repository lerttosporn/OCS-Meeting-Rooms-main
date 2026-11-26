import postgres from 'postgres';

export default async () => {
  console.log('\n[E2E] Tearing down test database...');
  
  // We can keep the database around for manual inspection, 
  // or drop it here if we want a completely clean environment after tests.
  // For now, we'll keep it so you can inspect it if tests fail.
  console.log('[E2E] Test database OCS_meeting_test preserved for debugging.');
};
