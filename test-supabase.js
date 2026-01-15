/**
 * Test Supabase Connection
 * Run this script to verify Supabase is properly configured
 */

import { supabase, isSupabaseConfigured } from './src/lib/supabase.js';
import { supabaseServices } from './src/services/supabaseService.js';

console.log('='.repeat(50));
console.log('🧪 Testing Supabase Connection');
console.log('='.repeat(50));

// Test 1: Check if Supabase is configured
console.log('\n✅ Test 1: Configuration Check');
const configured = isSupabaseConfigured();
console.log('Supabase configured:', configured);

if (!configured) {
    console.error('❌ Supabase is NOT configured!');
    console.log('Please check your .env file');
    process.exit(1);
}

// Test 2: Test connection
console.log('\n✅ Test 2: Connection Test');
try {
    const { data, error } = await supabase.from('downtime').select('count');
    if (error) {
        console.error('❌ Connection error:', error.message);
    } else {
        console.log('✅ Successfully connected to Supabase!');
        console.log('Downtime table accessible');
    }
} catch (err) {
    console.error('❌ Connection failed:', err.message);
}

// Test 3: Test CRUD service
console.log('\n✅ Test 3: CRUD Service Test');
try {
    // Test getAll
    const items = await supabaseServices.downtime.getAll();
    console.log(`✅ Retrieved ${items.length} downtime records`);

    // Test create
    console.log('\n📝 Creating test record...');
    const testRecord = await supabaseServices.downtime.create({
        machine: 'Test Machine',
        type: 'Planned',
        reason: 'Connection Test',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration: 1,
        technician: 'Test Script',
        status: 'completed'
    });
    console.log('✅ Test record created:', testRecord.id);

    // Test update
    console.log('\n📝 Updating test record...');
    const updated = await supabaseServices.downtime.update(testRecord.id, {
        reason: 'Connection Test - Updated'
    });
    console.log('✅ Test record updated');

    // Test delete
    console.log('\n📝 Deleting test record...');
    await supabaseServices.downtime.remove(testRecord.id);
    console.log('✅ Test record deleted');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests passed! Supabase is working correctly!');
    console.log('='.repeat(50));

} catch (err) {
    console.error('\n❌ CRUD test failed:', err.message);
    console.error('Error details:', err);
}
