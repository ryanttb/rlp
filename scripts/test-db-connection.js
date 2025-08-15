const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function testConnection(databaseName) {
  const client = new Client({
    host: '34.41.44.33',
    port: 5432,
    user: 'rlp_user',
    password: 'AR.Z/j5M060B',
    database: databaseName,
  });

  try {
    console.log(`Attempting to connect to database: ${databaseName}...`);
    await client.connect();
    console.log(`✅ Successfully connected to database: ${databaseName}!`);
    
    const result = await client.query('SELECT current_database(), current_user');
    console.log('Current database:', result.rows[0].current_database);
    console.log('Current user:', result.rows[0].current_user);
    
    await client.end();
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed for ${databaseName}:`);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return false;
  }
}

async function main() {
  console.log('Testing database connections...\n');
  
  // Try connecting to default postgres database first
  const postgresSuccess = await testConnection('postgres');
  
  if (postgresSuccess) {
    console.log('\n✅ Connection to postgres database successful!');
    console.log('Now trying rlp_database...\n');
    await testConnection('rlp_database');
  } else {
    console.log('\n❌ Cannot connect to postgres database. This suggests an authentication or proxy issue.');
  }
}

main();
