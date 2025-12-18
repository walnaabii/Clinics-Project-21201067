/**
 * Script to show database schema (tables and columns)
 * Run: node scripts/show-schema.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'clinichub.db');
const db = new Database(dbPath);

console.log('📊 ClinicHub Database Schema\n');
console.log('=' .repeat(60));

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

tables.forEach(table => {
  console.log(`\n📋 Table: ${table.name}`);
  console.log('-'.repeat(60));
  
  // Get table info
  const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
  
  columns.forEach(col => {
    let colInfo = `  • ${col.name}`;
    colInfo += ` (${col.type})`;
    
    if (col.notnull) colInfo += ' NOT NULL';
    if (col.pk) colInfo += ' PRIMARY KEY';
    if (col.dflt_value !== null) colInfo += ` DEFAULT ${col.dflt_value}`;
    
    console.log(colInfo);
  });
  
  // Get foreign keys
  const foreignKeys = db.prepare(`PRAGMA foreign_key_list(${table.name})`).all();
  if (foreignKeys.length > 0) {
    console.log('\n  Foreign Keys:');
    foreignKeys.forEach(fk => {
      console.log(`    → ${fk.from} REFERENCES ${fk.table}(${fk.to})`);
    });
  }
  
  // Get indexes
  const indexes = db.prepare(`SELECT name FROM sqlite_master WHERE type='index' AND tbl_name=? AND sql IS NOT NULL`).all(table.name);
  if (indexes.length > 0) {
    console.log('\n  Indexes:');
    indexes.forEach(idx => {
      console.log(`    ✓ ${idx.name}`);
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n✅ Total Tables: ${tables.length}`);

db.close();

