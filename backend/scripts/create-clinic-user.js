/**
 * Script to create a clinic user account
 * Run: node scripts/create-clinic-user.js <clinic_id> <email> <password> <name>
 * 
 * Example:
 * node scripts/create-clinic-user.js 1 clinic@example.com password123 "Clinic Manager"
 */

const User = require('../models/User');
const Clinic = require('../models/Clinic');
const { db } = require('../config/database');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('Usage: node scripts/create-clinic-user.js <clinic_id> <email> <password> <name>');
  console.log('\nExample:');
  console.log('  node scripts/create-clinic-user.js 1 clinic@example.com password123 "Clinic Manager"');
  process.exit(1);
}

const [clinicId, email, password, name] = args;

function createClinicUser() {
  try {
    console.log('🌱 Creating clinic user account...\n');

    // Check if clinic exists
    const clinic = Clinic.findById(parseInt(clinicId));
    if (!clinic) {
      console.error(`❌ Error: Clinic with ID ${clinicId} not found.`);
      console.log('\nAvailable clinics:');
      const allClinics = Clinic.findAll({});
      allClinics.forEach(c => {
        console.log(`  ID: ${c.id} - ${c.name}`);
      });
      process.exit(1);
      return;
    }

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      console.error(`❌ Error: User with email ${email} already exists.`);
      process.exit(1);
      return;
    }

    // Create clinic user
    const user = User.create({
      name,
      email,
      password,
      role: 'clinic',
      clinic_id: parseInt(clinicId),
    });

    console.log('✅ Clinic user created successfully!\n');
    console.log('📋 User Details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Clinic ID: ${user.clinic_id}`);
    console.log(`   Clinic Name: ${clinic.name}`);
    console.log(`\n🔐 Login Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating clinic user:', error.message);
    if (error.message.includes('already exists')) {
      console.log('\n💡 User already exists. Use a different email.');
    }
    process.exit(1);
  }
}

createClinicUser();

